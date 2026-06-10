# 🔑 ANAHTAR://KASA

Kişisel **API anahtar kasası** — tamamen kendi bilgisayarında çalışır, hiçbir buluta veri göndermez.
Kayıtlar `~/.apikasa/.env` dosyasına yazılır; başka projelerin doğrudan kullanabileceği gerçek bir `.env` üretir.

> Tek kullanıcı, lokal, sıfır bağımlılık felsefesi. Postgres/auth yok — sadece sen, makinen ve bir `.env`.

---

## ✨ Özellikler

- **Anahtar kasası** — her servis için env değişkeni + key, gizli alanda saklanır, tek tıkla kopyalanır
- **Katalog** — ~50 popüler API'yi (Gemini, Groq, Supabase, Stripe…) tek tıkla kasaya ekle
- **Açık veri sekmesi** — çoğu key gerektirmeyen kaynaklar (TCMB, TÜİK, World Bank, Wikipedia…)
- **Kendi uygulamanı ekle** — özel servisler için serbest kayıt
- **`.env` otomatik yazım** — her değişiklikte `~/.apikasa/.env` diske güncellenir
- **İçe / dışa aktarma** — mevcut bir `.env`'i yükle, ya da indir
- **Güvenli varsayılanlar** — dosyalar `0600`, backend yalnız `127.0.0.1`

---

## 🏗️ Mimari

```
Tarayıcı (React/Vite :5173)
        │  fetch (HTTP)
        ▼
FastAPI backend (:8000)
        │  oku / yaz
        ▼
~/.apikasa/
  ├── vault.json   ← uygulamanın kaynağı (ad, kategori, env, key)
  └── .env         ← her kayıtta otomatik üretilir — diğer projeler bunu kullanır
```

Tarayıcı diske doğrudan yazamadığı için araya küçük bir FastAPI katmanı girer.

---

## 🚀 Kurulum

**Gereksinimler:** Python 3.10+ · Node.js 18+

### Tek komutla (macOS / Linux)
```bash
chmod +x baslat.sh
./baslat.sh
```
İlk çalıştırma bağımlılıkları kurar. Ardından: **http://localhost:5173**

### Manuel
```bash
# 1) Backend
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000

# 2) Frontend (ayrı terminal)
cd frontend
npm install
npm run dev
```

Arayüz: http://localhost:5173 · API dokümanı: http://localhost:8000/docs

---

## 🔌 Başka projede key kullanma

`~/.apikasa/.env` her zaman günceldir. Yeni projende:

```bash
cp ~/.apikasa/.env ./.env          # kopyala
# veya otomatik senkron için symlink:
ln -s ~/.apikasa/.env ./.env
```

```python
from dotenv import load_dotenv; import os
load_dotenv()
key = os.getenv("GEMINI_API_KEY")
```

---

## 📡 API uç noktaları

| Metot | Yol            | İş                          |
|-------|----------------|-----------------------------|
| GET   | `/api/vault`   | Tüm kayıtlar + .env yolu    |
| PUT   | `/api/vault`   | Kaydı diske yaz             |
| GET   | `/api/env`     | Ham .env metni              |
| GET   | `/api/health`  | Sağlık kontrolü             |

---

## 🔒 Güvenlik

- `.env` ve `vault.json` → `0600` (sadece sahibi okur)
- Backend yalnızca `127.0.0.1`'e bağlanır, dışarıya kapalı
- `.env` **her zaman** `.gitignore`'da (bu repoda da öyle)
- Bu uçtan uca şifreli bir kasa **değildir**; production sırları için bir secret manager kullan

---

## 📁 Yapı

```
api-kasa/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/{App.jsx, main.jsx}
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── baslat.sh
├── .gitignore
└── README.md
```

---

## 📝 Lisans

MIT — dilediğin gibi kullan.
