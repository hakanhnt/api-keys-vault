"""
ANAHTAR://KASA — Lokal FastAPI backend
Kayıtları ~/.apikasa/ altında tutar:
  • vault.json  → uygulamanın kaynağı (ad, kategori, env değişkeni, key)
  • .env        → her kayıtta otomatik üretilen, diğer projelerin kullanacağı gerçek dosya

Çalıştırma:
  uvicorn main:app --host 127.0.0.1 --port 8000
"""
import os
import json
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

# ---- Kasa konumu (sabit merkezi yol) -----------------------------------
VAULT_DIR = Path.home() / ".apikasa"
VAULT_JSON = VAULT_DIR / "vault.json"
ENV_FILE = VAULT_DIR / ".env"
VAULT_DIR.mkdir(mode=0o700, exist_ok=True)


# ---- Modeller ----------------------------------------------------------
class Entry(BaseModel):
    id: str
    name: str
    env: str
    val: str = ""
    cat: str = "Özel"


class Vault(BaseModel):
    entries: list[Entry]


# ---- Uygulama ----------------------------------------------------------
app = FastAPI(title="ANAHTAR://KASA")

# Sadece lokal Vite arayüzüne izin ver
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Yardımcılar -------------------------------------------------------
def _secure(path: Path) -> None:
    """Dosyayı sadece sahibinin okuyabileceği şekilde işaretle (0600)."""
    try:
        os.chmod(path, 0o600)
    except OSError:
        pass  # Windows'ta sessizce geç


def load_entries() -> list[dict]:
    if VAULT_JSON.exists():
        try:
            return json.loads(VAULT_JSON.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
    return []


def build_env(entries: list[dict]) -> str:
    """Kayıtlardan kategorilere ayrılmış bir .env metni üret."""
    lines = [f"# ANAHTAR://KASA — {datetime.now():%Y-%m-%d %H:%M}", ""]
    by_cat: dict[str, list[dict]] = {}
    for e in entries:
        by_cat.setdefault(e.get("cat", "Özel"), []).append(e)
    for cat in sorted(by_cat):
        lines.append(f"# ── {cat} ──")
        for e in by_cat[cat]:
            env, val = e["env"], e.get("val", "")
            lines.append(f"{env}={val}" if val else f"# {env}=")
        lines.append("")
    return "\n".join(lines)


def save_all(entries: list[dict]) -> None:
    VAULT_JSON.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    ENV_FILE.write_text(build_env(entries), encoding="utf-8")
    _secure(VAULT_JSON)
    _secure(ENV_FILE)


# ---- Uç noktalar -------------------------------------------------------
@app.get("/api/vault")
def get_vault():
    """Tüm kayıtları ve .env dosyasının diskteki yolunu döndür."""
    return {"entries": load_entries(), "env_path": str(ENV_FILE)}


@app.put("/api/vault")
def put_vault(vault: Vault):
    """Tüm kaydı diske yaz (vault.json + .env)."""
    entries = [e.model_dump() for e in vault.entries]
    save_all(entries)
    return {"ok": True, "count": len(entries), "env_path": str(ENV_FILE)}


@app.get("/api/env", response_class=PlainTextResponse)
def get_env():
    """Ham .env içeriğini düz metin olarak döndür."""
    return build_env(load_entries())


@app.get("/api/health")
def health():
    return {"ok": True, "vault_dir": str(VAULT_DIR)}
