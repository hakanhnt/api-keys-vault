"""
ANAHTAR://KASA — Lokal FastAPI backend (şifreli sürüm)

Kasa ~/.apikasa/vault.enc içinde ŞİFRELİ durur. Açmak için master parola gerekir.
Düz metin .env yalnızca açıkça "dışa aktar" denince yazılır.

Çalıştırma:
  uvicorn main:app --host 127.0.0.1 --port 8000
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

import kasa_core as core

app = FastAPI(title="ANAHTAR://KASA")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tek kullanıcı, lokal: anahtarı bellekte tutarız (oturum boyunca)
_session: dict = {"key": None}


# ---- Modeller ----
class Entry(BaseModel):
    id: str
    name: str
    env: str
    val: str = ""
    cat: str = "Özel"


class Vault(BaseModel):
    entries: list[Entry]


class PasswordIn(BaseModel):
    password: str


class ExportIn(BaseModel):
    path: str | None = None


def _require_key() -> bytes:
    if _session["key"] is None:
        raise HTTPException(status_code=423, detail="Kasa kilitli")
    return _session["key"]


# ---- Durum / parola ----
@app.get("/api/status")
def status():
    return {
        "initialized": core.is_initialized(),
        "locked": _session["key"] is None,
        "env_path": str(core.ENV_FILE),
    }


@app.post("/api/setup")
def setup(body: PasswordIn):
    if core.is_initialized():
        raise HTTPException(status_code=400, detail="Kasa zaten kurulu")
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Parola en az 6 karakter olmalı")
    initial = core.migrate_plaintext()  # eski şifresiz veriyi taşı
    _session["key"] = core.setup(body.password, initial)
    return {"ok": True, "migrated": len(initial)}


@app.post("/api/unlock")
def unlock(body: PasswordIn):
    key = core.unlock(body.password)
    if key is None:
        raise HTTPException(status_code=401, detail="Yanlış parola")
    _session["key"] = key
    return {"ok": True}


@app.post("/api/lock")
def lock():
    _session["key"] = None
    return {"ok": True}


# ---- Kasa ----
@app.get("/api/vault")
def get_vault():
    key = _require_key()
    return {"entries": core.load_entries(key), "env_path": str(core.ENV_FILE)}


@app.put("/api/vault")
def put_vault(vault: Vault):
    key = _require_key()
    entries = [e.model_dump() for e in vault.entries]
    core.save_entries(entries, key)
    return {"ok": True, "count": len(entries)}


@app.get("/api/env", response_class=PlainTextResponse)
def get_env():
    key = _require_key()
    return core.build_env(core.load_entries(key))


@app.post("/api/export-env")
def export_env(body: ExportIn):
    """Düz metin .env'i diske açıkça yaz (varsayılan ~/.apikasa/.env)."""
    key = _require_key()
    entries = core.load_entries(key)
    path = core.write_env(entries, body.path or core.ENV_FILE)
    return {"ok": True, "path": str(path)}


@app.get("/api/health")
def health():
    return {"ok": True, "vault_dir": str(core.VAULT_DIR)}
