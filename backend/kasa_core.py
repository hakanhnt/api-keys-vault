"""
kasa_core.py — ANAHTAR://KASA ortak çekirdeği
Hem FastAPI backend (main.py) hem de CLI (apikasa.py) bunu kullanır.

Şifreleme: master parola → scrypt KDF → Fernet (AES-128-CBC + HMAC).
Kasa diskte SADECE şifreli durur: ~/.apikasa/vault.enc
Düz metin .env yalnızca açıkça "dışa aktar" denince yazılır.
"""
import os
import json
import base64
from pathlib import Path
from datetime import datetime

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt

VAULT_DIR = Path.home() / ".apikasa"
VAULT_ENC = VAULT_DIR / "vault.enc"      # şifreli kasa (kaynak)
SALT_FILE = VAULT_DIR / "salt"           # KDF tuzu
ENV_FILE = VAULT_DIR / ".env"            # yalnızca dışa aktarımda yazılır
OLD_JSON = VAULT_DIR / "vault.json"      # eski (şifresiz) sürümden göç için

VAULT_DIR.mkdir(mode=0o700, exist_ok=True)


def _secure(path: Path) -> None:
    try:
        os.chmod(path, 0o600)
    except OSError:
        pass


def is_initialized() -> bool:
    return VAULT_ENC.exists() and SALT_FILE.exists()


def _derive(password: str, salt: bytes) -> bytes:
    """Paroladan Fernet anahtarı türet (scrypt)."""
    kdf = Scrypt(salt=salt, length=32, n=2 ** 14, r=8, p=1)
    return base64.urlsafe_b64encode(kdf.derive(password.encode("utf-8")))


# ---- Kasa oku / yaz ----------------------------------------------------
def load_entries(key: bytes) -> list[dict]:
    """Şifreli kasayı çöz. Yanlış parolada InvalidToken fırlatır."""
    if not VAULT_ENC.exists():
        return []
    raw = Fernet(key).decrypt(VAULT_ENC.read_bytes())
    return json.loads(raw.decode("utf-8"))


def save_entries(entries: list[dict], key: bytes) -> None:
    token = Fernet(key).encrypt(
        json.dumps(entries, ensure_ascii=False).encode("utf-8")
    )
    VAULT_ENC.write_bytes(token)
    _secure(VAULT_ENC)


# ---- Parola / oturum ---------------------------------------------------
def setup(password: str, initial: list[dict] | None = None) -> bytes:
    """İlk kurulum: tuz üret, boş (ya da göç edilmiş) kasayı şifrele."""
    salt = os.urandom(16)
    SALT_FILE.write_bytes(salt)
    _secure(SALT_FILE)
    key = _derive(password, salt)
    save_entries(initial or [], key)
    return key


def unlock(password: str) -> bytes | None:
    """Parola doğruysa anahtarı döndür, yanlışsa None."""
    if not is_initialized():
        return None
    salt = SALT_FILE.read_bytes()
    key = _derive(password, salt)
    try:
        load_entries(key)  # doğrulama
        return key
    except InvalidToken:
        return None


def migrate_plaintext() -> list[dict]:
    """Eski şifresiz vault.json varsa içeriğini al (kuruluma taşımak için)."""
    if OLD_JSON.exists():
        try:
            return json.loads(OLD_JSON.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
    return []


# ---- .env üretimi ------------------------------------------------------
def build_env(entries: list[dict]) -> str:
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


def write_env(entries: list[dict], path: Path | str = ENV_FILE) -> Path:
    p = Path(path)
    p.write_text(build_env(entries), encoding="utf-8")
    _secure(p)
    return p
