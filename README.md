# 🔑 ANAHTAR://KASA

[TR - Türkçe](#-anahtarkasa-tr) | [EN - English](#-anahtarkasa-en)

---

# 🔑 ANAHTAR://KASA (TR)

Kişisel, **şifreli** API anahtar kasası — tamamen kendi bilgisayarınızda çalışır, hiçbir buluta veri göndermez.
Kasa diskte master parolasıyla şifreli (`~/.apikasa/vault.enc`) olarak durur. Düz metin `.env` dosyası yalnızca siz açıkça dışa aktardığınızda üretilir.

> Tek kullanıcı, lokal felsefe. Postgres yok — sadece siz, makineniz, şifreli bir kasa ve bir CLI.

---

## ✨ Özellikler

- **🔐 Şifreli kasa** — master parola → scrypt → Fernet (AES). Disk hep şifreli, parola unutulursa kurtarma yok.
- **Anahtar kasası** — her servis için env değişkeni + key, gizli alan, tek tıkla kopyalama.
- **Katalog** — 22 kategori, 70+ API (Gemini, Groq, Supabase, scraping araçları…) tek tıkla ekleme.
- **Açık veri sekmesi** — çoğu key gerektirmeyen kaynaklar (TCMB, TÜİK, World Bank…).
- **Kendi uygulamanı ekle** — özel servisler için serbest kayıt.
- **⌨️ CLI yoldaşı** — `apikasa get GROQ_API_KEY`, `apikasa export > .env`.
- **İçe / dışa aktarma** — mevcut `.env` yükleme, talep üzerine üretme.

---

## 🏗️ Mimari

```
Tarayıcı (React/Vite :5173) ──fetch──▶ FastAPI (:8000) ──şifrele/çöz──▶ ~/.apikasa/vault.enc
                                                     CLI (apikasa) ──────────┘  (aynı şifreli kasayı okur)
```

Kasa şifreli olduğu için kalıcı düz metin `.env` tutulmaz. Diğer projeler ya CLI ile (`apikasa export`) ya da arayüzden açık dışa aktarımla `.env` alır.

---

## 🚀 Kurulum & Çalıştırma

**Gereksinimler:** Python 3.10+ · Node.js 18+

### Başlatma
Proje dizininde terminalden şu komutu çalıştırmanız yeterlidir:
```bash
./baslat.sh
```
*Not: `chmod +x baslat.sh` izin verme işlemi bir kez yapılmıştır, tekrar yapmanıza gerek yoktur.*

Tarayıcıdan **http://localhost:5173** adresine giderek arayüze erişebilirsiniz. İlk açılışta bir master parola belirlersiniz.

### Kapatma
Terminal ekranında **`Ctrl + C`** tuşlarına basarak hem backend'i hem de frontend'i tek seferde güvenli bir şekilde kapatabilirsiniz.

### ⚠️ Sorun Giderme (Port Çakışması)
Eğer *"Address already in use / Port is in use"* hatası alırsanız (örneğin 8000 veya 5173 portları başka bir uygulama tarafından işgal edilmişse), arka planda kalan süreçleri temizlemek için şu komutu çalıştırıp ardından tekrar `./baslat.sh` yapabilirsiniz:
```bash
kill -9 $(lsof -t -i:8000 -i:5173) 2>/dev/null
```

### Manuel Kurulum
```bash
# Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000

# Frontend (ayrı terminal)
cd frontend && npm install && npm run dev
```

---

## ⌨️ CLI yoldaşı (apikasa)

Backend kapalıyken bile şifreli kasayı doğrudan okur. Kurulum (bir kez):

```bash
cd backend
# venv'i kullanarak global bir kısayol yap:
echo '#!/usr/bin/env bash
exec "'"$PWD"'/.venv/bin/python" "'"$PWD"'/apikasa.py" "$@"' > ~/.local/bin/apikasa
chmod +x ~/.local/bin/apikasa
```

Kullanım:
```bash
apikasa list                       # anahtar adlarını listele (değer yok)
apikasa get GROQ_API_KEY           # tek key'in değerini yaz
apikasa export > .env              # bir projeye .env üret
eval "$(apikasa export --shell)"   # mevcut kabuğa export et
```

Parola sırası: `--password` > `$APIKASA_PASSWORD` > etkileşimli sorar. Otomasyon için:
```bash
APIKASA_PASSWORD='***' apikasa export > .env
```

---

## 🔌 Başka projede kullanma

```bash
# Terminalden
apikasa export > .env

# ya da arayüzde "⤓ ~/.apikasa/.env'e yaz" → sonra
cp ~/.apikasa/.env ./.env
```

```python
from dotenv import load_dotenv; import os
load_dotenv(); key = os.getenv("GEMINI_API_KEY")
```

---

## 🔒 Güvenlik

- Kasa `~/.apikasa/vault.enc` içinde **şifreli** (scrypt + Fernet/AES)
- Master parola hiçbir yere kaydedilmez; **unutulursa kurtarma yoktur**
- Backend yalnızca `127.0.0.1`'e bağlanır
- Düz metin `.env` yalnızca açık dışa aktarımda oluşur — kullandıktan sonra silebilirsin
- `.env`'i **her zaman** `.gitignore`'a ekle

---

## 📡 API uç noktaları

| Metot | Yol | İş |
|------|-----|-----|
| GET  | `/api/status` | kurulu mu / kilitli mi |
| POST | `/api/setup` | ilk master parolayı belirle |
| POST | `/api/unlock` | parolayla aç |
| POST | `/api/lock` | kilitle |
| GET  | `/api/vault` | kayıtlar (açıkken) |
| PUT  | `/api/vault` | kaydet (şifreli) |
| GET  | `/api/env` | ham .env metni |
| POST | `/api/export-env` | .env'i diske yaz |

---
---

# 🔑 ANAHTAR://KASA (EN)

A personal, **encrypted** API key vault — runs entirely on your local machine, sending no data to the cloud.
The vault remains encrypted on disk (`~/.apikasa/vault.enc`) using a master password. A plaintext `.env` file is only generated when you explicitly export it.

> Single-user, local-first philosophy. No Postgres — just you, your machine, an encrypted vault, and a CLI.

---

## ✨ Features

- **🔐 Encrypted vault** — master password → scrypt → Fernet (AES). Disk is always encrypted, no recovery if password is lost.
- **Key vault** — env variable + key for each service, masked value field, one-click copy.
- **Catalog** — 22 categories, 70+ APIs (Gemini, Groq, Supabase, scraping tools…) add with a single click.
- **Open Data Tab** — reference list for sources that mostly do not require keys (TCMB, TÜİK, World Bank…).
- **Add custom apps** — free registration for custom services.
- **⌨️ CLI Companion** — `apikasa get GROQ_API_KEY`, `apikasa export > .env`.
- **Import / Export** — load existing `.env` files, generate `.env` on demand.

---

## 🏗️ Architecture

```
Browser (React/Vite :5173) ──fetch──▶ FastAPI (:8000) ──encrypt/decrypt──▶ ~/.apikasa/vault.enc
                                                     CLI (apikasa) ──────────┘  (reads the same encrypted vault)
```

Since the vault is encrypted, a permanent plaintext `.env` is not kept. Other projects fetch their `.env` either via the CLI (`apikasa export`) or through manual export from the UI.

---

## 🚀 Setup & Execution

**Requirements:** Python 3.10+ · Node.js 18+

### Starting
Simply run the following command in the project directory:
```bash
./baslat.sh
```
*Note: `chmod +x baslat.sh` has already been run; you do not need to run it again.*

Open **http://localhost:5173** in your browser to access the interface. You will set a master password on first launch.

### Stopping
Press **`Ctrl + C`** in your terminal window to safely stop both the backend and frontend simultaneously.

### ⚠️ Troubleshooting (Port Conflict)
If you get an *"Address already in use / Port is in use"* error (e.g. ports 8000 or 5173 are occupied by another application), you can clean up stale background processes using this command and then run `./baslat.sh` again:
```bash
kill -9 $(lsof -t -i:8000 -i:5173) 2>/dev/null
```

### Manual Setup
```bash
# Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

---

## ⌨️ CLI Companion (apikasa)

Read the encrypted vault directly even when the backend is closed. Setup (once):

```bash
cd backend
# Create a global shortcut using the venv:
echo '#!/usr/bin/env bash
exec "'"$PWD"'/.venv/bin/python" "'"$PWD"'/apikasa.py" "$@"' > ~/.local/bin/apikasa
chmod +x ~/.local/bin/apikasa
```

Usage:
```bash
apikasa list                       # list key names (no values shown)
apikasa get GROQ_API_KEY           # output a single key's value
apikasa export > .env              # generate a .env file for a project
eval "$(apikasa export --shell)"   # export variables to current shell session
```

Password lookup order: `--password` > `$APIKASA_PASSWORD` > interactive prompt. For automation:
```bash
APIKASA_PASSWORD='***' apikasa export > .env
```

---

## 🔌 Using in other projects

```bash
# From terminal
apikasa export > .env

# or via the UI click "⤓ Write to ~/.apikasa/.env" → then
cp ~/.apikasa/.env ./.env
```

```python
from dotenv import load_dotenv; import os
load_dotenv(); key = os.getenv("GEMINI_API_KEY")
```

---

## 🔒 Security

- Vault is **encrypted** on disk: `~/.apikasa/vault.enc` (scrypt + Fernet/AES)
- Master password is never saved; **there is no recovery if forgotten**
- Backend binds only to `127.0.0.1`
- Plaintext `.env` only exists upon explicit export — you can delete it after use
- **Always** add `.env` to your `.gitignore`

---

## 📡 API Endpoints

| Method | Path | Action |
|--------|------|--------|
| GET    | `/api/status` | check setup status / lock status |
| POST   | `/api/setup` | configure initial master password |
| POST   | `/api/unlock` | unlock vault with password |
| POST   | `/api/lock` | lock vault |
| GET    | `/api/vault` | load entries (when unlocked) |
| PUT    | `/api/vault` | save entries (encrypted) |
| GET    | `/api/env` | raw .env text |
| POST   | `/api/export-env` | write .env to disk |

---

## 📝 License
MIT
