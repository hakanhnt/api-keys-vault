# 🔑 ANAHTAR://KASA

Kişisel, **şifreli** API anahtar kasası — tamamen kendi bilgisayarında çalışır, hiçbir buluta veri göndermez.
Kasa diskte master parolayla şifreli (`~/.apikasa/vault.enc`) durur. Düz metin `.env` yalnızca sen açıkça dışa aktardığında üretilir.

> Tek kullanıcı, lokal felsefe. Postgres yok — sadece sen, makinen, şifreli bir kasa ve bir CLI.

---

## ✨ Özellikler

- **🔐 Şifreli kasa** — master parola → scrypt → Fernet (AES). Disk hep şifreli, parola unutulursa kurtarma yok.
- **Anahtar kasası** — her servis için env değişkeni + key, gizli alan, tek tık kopyala
- **Katalog** — 22 kategori, 70+ API (Gemini, Groq, Supabase, scraping araçları…) tek tıkla ekle
- **Açık veri sekmesi** — çoğu key gerektirmeyen kaynaklar (TCMB, TÜİK, World Bank…)
- **Kendi uygulamanı ekle** — özel servisler için serbest kayıt
- **⌨️ CLI yoldaşı** — `apikasa get GROQ_API_KEY`, `apikasa export > .env`
- **İçe / dışa aktarma** — mevcut `.env` yükle, talep üzerine üret

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

### Tek komutla
```bash
chmod +x baslat.sh
./baslat.sh
```
Tarayıcı: **http://localhost:5173** → ilk açılışta master parola belirlersin.

### Manuel
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

## 📝 Lisans
MIT
