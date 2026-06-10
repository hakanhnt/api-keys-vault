# 🔑 ANAHTAR://KASA

[TR - Türkçe](#-anahtarkasa-tr) | [EN - English](#-anahtarkasa-en)

---

# 🔑 ANAHTAR://KASA (TR)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFDF00)](https://vitejs.dev)
[![Cryptography](https://img.shields.io/badge/Cryptography-AES--128--Fernet-success?style=for-the-badge)](https://cryptography.io)
[![Local First](https://img.shields.io/badge/Local--First-Offline--Ready-blueviolet?style=for-the-badge)](#)

Kişisel, **şifreli** API anahtar kasası — tamamen kendi bilgisayarınızda çalışır, hiçbir buluta veri göndermez. 
Kasa diskte master parolasıyla şifreli (`~/.apikasa/vault.enc`) olarak durur. Düz metin `.env` dosyası yalnızca siz açıkça dışa aktardığınızda üretilir.

> Tek kullanıcı, lokal felsefe. Postgres yok — sadece siz, makineniz, şifreli bir kasa ve bir CLI.

---

## 🔍 GitHub Arama Etiketleri
`api-vault` `api-keys` `secret-manager` `dotenv` `local-vault` `env-vault` `cryptography` `fastapi` `react` `vite` `developer-tools` `free-tier-apis` `acik-veri` `credential-manager`

---

## ✨ Özellikler

- **🔐 Şifreli kasa** — master parola → scrypt → Fernet (AES-128-CBC + HMAC). Disk hep şifreli, parola unutulursa kurtarma yok.
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

## 🔌 Desteklenen API & Servis Kataloğu

Uygulama içerisinde yerleşik olarak gelen, geliştiriciler için harika ücretsiz katmanlar (free tier) sunan ve doğrudan kasaya ekleyebileceğiniz tüm servisler ve adresleri aşağıdadır:

### 🤖 Yapay Zeka / LLM (AI & Inference)
- [Google Gemini](https://aistudio.google.com) - Günlük 1.500 istek ve 1M token bağlamı ile en cömert ücretsiz LLM API.
- [Groq](https://console.groq.com) - Llama 3.3 entegrasyonu ve günlük 14.400 istek hakkıyla dünyanın en hızlı LLM çıkarım (inference) motoru.
- [OpenRouter](https://openrouter.ai) - Tek API anahtarı ile 300+ yapay zeka modeli ve bazı ücretsiz (`:free`) alternatifler.
- [Mistral AI](https://console.mistral.ai) - AB uyumlu, güçlü Codestral kod modeli ve trial kredileri.
- [Cohere](https://cohere.com) - RAG ve Rerank için optimize edilmiş aylık 1.000 deneme isteği.
- [Cerebras](https://cloud.cerebras.ai) - Saniyede 1000+ token hızı sunan yüksek performanslı LLM motoru.
- [HuggingFace](https://huggingface.co) - Doğal Dil İşleme, ses ve görüntü için binlerce açık kaynaklı model API'si.

### 🎨 Görsel Üretim (Image & Media)
- [Pollinations.ai](https://pollinations.ai) - API anahtarı gerektirmeyen, doğrudan `<img>` etiketinde kullanılabilen sınırsız görsel üretimi (Flux).
- [Replicate](https://replicate.com) - Flux, SDXL, video ve binlerce yapay zeka modelini barındıran bulut yürütme platformu.
- [Cloudinary](https://cloudinary.com) - Görsel optimizasyonu ve anlık WebP/AVIF dönüştürme sunan görsel CDN'i.
- [remove.bg](https://remove.bg/api) - Tek API çağrısıyla görsellerden arka plan temizleme (Aylık 50 ücretsiz).
- [Unsplash](https://unsplash.com/developers) - Projeleriniz için yüksek kaliteli stok fotoğraf kütüphanesi API'si.

### 🎙️ Ses & Konuşma (Audio & Speech)
- [Groq Whisper](https://console.groq.com) - Whisper v3 modeli ile çok hızlı ve Türkçe destekli ses-metin dönüşümü.
- [ElevenLabs](https://elevenlabs.io) - Gerçekçi yapay zeka seslendirme (Aylık 10.000 karakter ücretsiz, Türkçe destekli).
- [Deepgram](https://deepgram.com) - Canlı konuşma-metin dönüşümü ve konuşmacı analitiği (200$ ücretsiz başlangıç kredisi).

### 🎬 Video Entegrasyonu
- [Mux](https://mux.com) - Profesyonel video yükleme, dönüştürme ve adaptif akış altyapısı.
- [Shotstack](https://shotstack.io) - JSON dosyaları ile programatik video kurgu ve render API'si.

### 🌐 Çeviri & Dil Araçları
- [DeepL](https://deepl.com/pro-api) - Sektörün en kaliteli çeviri motoru (Aylık 500.000 karakter ücretsiz, Türkçe dahil).
- [LibreTranslate](https://libretranslate.com) - Gizli veri işleme süreçleri için self-host edilebilen açık kaynak çeviri API'si.
- [LanguageTool](https://languagetool.org/http-api) - Türkçe destekli dilbilgisi ve yazım denetimi API'si.

### 📧 E-posta Gönderimi
- [Resend](https://resend.com) - Modern e-posta gönderim servisi, React e-posta şablon desteği (Aylık 3.000 e-posta ücretsiz).
- [Brevo](https://brevo.com) - Günlük 300 e-posta hakkı ve sınırsız kontak listesi.
- [Mailgun](https://mailgun.com) - E-posta adresi doğrulama ve gelen mailleri yönlendirme altyapısı.

### 💬 SMS & Bildirim
- [Ntfy.sh](https://ntfy.sh) - Basit HTTP POST istekleriyle çalışan, limitsiz ve self-host edilebilir anlık bildirim servisi.
- [OneSignal](https://onesignal.com) - Web ve mobil için anlık bildirim servisi (10.000 aboneye kadar ücretsiz).
- [Telegram Bot API](https://core.telegram.org/bots/api) - Botlar aracılığıyla sınırsız ve tamamen ücretsiz bildirim gönderme.
- [Twilio](https://twilio.com) - Küresel SMS, WhatsApp API'si ve tek kullanımlık şifre (OTP) altyapısı.

### 🔌 Sohbet & Realtime WebSockets
- [Pusher](https://pusher.com) - Yönetilen WebSocket altyapısı (Günlük 200.000 mesaj ücretsiz).
- [Ably](https://ably.com) - Pusher alternatifi, aylık 6 milyon mesaj ve geçmiş veri desteği.

### 🗺️ Harita & Coğrafya
- [Mapbox](https://mapbox.com) - Özelleştirilebilir haritalar ve harita tasarımları (Aylık 50.000 istek ücretsiz).
- [OpenRouteService](https://openrouteservice.org) - Rota planlama ve mesafe matrisi analizleri (Günlük 2.000 istek).
- [Nominatim (OSM)](https://nominatim.org) - OpenStreetMap tabanlı, key gerektirmeyen coğrafi kodlama (geocoding).

### 📍 IP & Coğrafi Veri
- [ipapi.co](https://ipapi.co) - IP adresi üzerinden konum, döviz kuru ve saat dilimi tespiti (Aylık 30.000 istek).
- [REST Countries](https://restcountries.com) - Ülkelerin bayrak, dil ve para birimi bilgilerini içeren key'siz API.

### 📊 Finans & Borsa
- [Yahoo Finance](https://pypi.org/project/yfinance) - Hisse senedi, kripto para ve tarihsel piyasa verileri (Sınırsız ve resmi olmayan kütüphane).
- [Alpha Vantage](https://alphavantage.co) - Borsa teknik indikatörleri (RSI, MACD vb.) ve günlük 25 istek.
- [Finnhub](https://finnhub.io) - Gerçek zamanlı borsa fiyatları ve piyasa haberleri (Dakikada 60 istek).
- [TCMB EVDS](https://evds2.tcmb.gov.tr) - Merkez Bankası resmi verileri: kur, enflasyon ve faiz istatistikleri.
- [Frankfurter](https://frankfurter.dev) - Avrupa Merkez Bankası döviz kurları veri seti (Sınırsız ve anahtarsız).

### 💳 Ödeme Altyapısı
- [iyzico](https://iyzico.com) - Türkiye'de kartla ödeme, taksitlendirme ve abonelik altyapısı.
- [Stripe](https://stripe.com) - Global projeler için lider ödeme ve finansal altyapı API'si.

### 🗄️ Veritabanı / Backend-as-a-Service (BaaS)
- [Supabase](https://supabase.com) - Postgres veritabanı, üyelik yönetimi (Auth), realtime ve storage desteği (50.000 aktif kullanıcı ücretsiz).
- [Neon](https://neon.tech) - Sunucusuz (serverless) Postgres ve Git benzeri veritabanı dallanma (branching) desteği.
- [Upstash](https://upstash.com) - Sunucusuz Redis, Kafka ve mesaj kuyruğu altyapısı (Rate limiting ve önbellek için ideal).
- [Turso](https://turso.tech) - SQLite tabanlı edge veritabanı (9 GB veri saklama ve 500 veritabanı desteği ile son derece cömert).
- [Firebase](https://firebase.google.com) - Google'ın mobil ve web için geliştirdiği NoSQL veritabanı, auth ve push bildirim servisi.

### 📐 Vektör Veritabanı / RAG
- [Pinecone](https://pinecone.io) - RAG uygulamalarında en çok tercih edilen bulut tabanlı vektör veritabanı.
- [Qdrant](https://qdrant.tech) - Hızlı, filtreli arama yapabilen açık kaynak vektör arama motoru (1 GB ücretsiz katman).

### 📦 Depolama & CDN
- [Cloudflare R2](https://developers.cloudflare.com/r2) - S3 uyumlu, veri çıkış (egress) ücreti **olmayan** nesne depolama (10 GB ücretsiz).
- [ImgBB](https://api.imgbb.com) - Basit görsel barındırma ve tek bir POST isteği ile görsel yükleme API'si.

### 🔑 Kimlik Doğrulama & Giriş (Auth)
- [Clerk](https://clerk.com) - Hazır giriş arayüzleri, iki adımlı doğrulama (MFA) ve sosyal girişler (10.000 MAU ücretsiz).
- [Supabase Auth](https://supabase.com/auth) - Magic link, OAuth ve Postgres RLS entegrasyonu.

### 📄 OCR & Doküman İşleme
- [Gemini Doküman Analizi](https://aistudio.google.com) - PDF dosyalarını okuyup yapılandırılmış JSON çıktısı üreten akıllı analiz.
- [OCR.space](https://ocr.space) - Görsel ve PDF dosyalarından metin tarama (Aylık 25.000 ücretsiz, Türkçe destekli).
- [PDF.co](https://pdf.co) - Programatik olarak PDF oluşturma, PDF formlarını doldurma ve HTML'den PDF'e dönüştürme.

### 📈 Analitik Araçları
- [PostHog](https://posthog.com) - Ürün analitiği, kullanıcı oturum kayıtları (Session replay) ve özellik bayrakları (Aylık 1M olay ücretsiz).
- [Plausible](https://plausible.io) - Gizlilik odaklı, çerezsiz ve hafif web analitiği.

### 🛡️ Güvenlik API'leri
- [Have I Been Pwned](https://haveibeenpwned.com/API) - Veri sızıntılarında şifre ve e-posta kontrolü sağlayan k-anonimlik tabanlı API.
- [AbuseIPDB](https://abuseipdb.com) - IP adreslerinin itibar skoru, spam ve bot engelleme kontrolleri (Günlük 1.000 istek).

### 🗓️ Üretkenlik & Otomasyon
- [Notion API](https://developers.notion.com) - Notion veritabanlarını kodla okuma ve yazma.
- [Airtable](https://airtable.com/developers) - Veritabanı ve e-tablo yeteneklerini birleştiren API.
- [GitHub API](https://docs.github.com/rest) - Depo yönetimi, sorunlar (issues) ve Actions tetikleme işlemleri (Saatlik 5.000 istek).

### 🕸️ Web Kazıma (Web Scraping)
- [Jina Reader](https://jina.ai/reader) - Herhangi bir web sitesinin içeriğini yapay zekaya uygun temiz Markdown formatına çeviren ücretsiz servis.
- [Firecrawl](https://firecrawl.dev) - LLM'ler için optimize edilmiş sayfa kazıma ve Markdown çıktısı (Aylık 500 ücretsiz kredi).
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - Yapay zeka projeleri için self-host edilebilen açık kaynak kazıma kütüphanesi.
- [ScraperAPI](https://scraperapi.com) - Proxy rotasyonu, JavaScript render etme ve anti-bot geçme desteği.
- [ScrapingBee](https://scrapingbee.com) - Headless tarayıcı kullanarak web kazıma (1.000 ücretsiz kredi).
- [Apify](https://apify.com) - Hazır web kazıma ve otomasyon araçları pazaryeri (Aylık 5$ ücretsiz kredi).
- [Browserless](https://browserless.io) - Puppeteer ve Playwright için yönetilen headless Chrome altyapısı.
- [Serper.dev](https://serper.dev) - Google arama sonuçlarını çekebileceğiniz hızlı API (2.500 ücretsiz kredi).
- [ScrapingDog](https://scrapingdog.com) - Proxy arkasından HTML ve JS render ederek veri kazıma API'si.

### 🛰️ Açık Veri Kaynakları (Key İstemeyen / Referans)
- [TÜİK Açık Veri Portalı](https://data.tuik.gov.tr) - Türkiye resmi nüfus, ekonomi ve işgücü istatistikleri.
- [Nager.Date](https://date.nager.at) - Dünya genelinde 100+ ülke için resmi tatil takvimi API'si.
- [USGS Deprem API](https://earthquake.usgs.gov/fdsnws/event/1) - Gerçek zamanlı küresel deprem verileri.
- [World Bank Data](https://datahelpdesk.worldbank.org) - Dünya Bankası küresel kalkınma göstergeleri.
- [CoinGecko API](https://coingecko.com/api) - Kripto para fiyatları ve piyasa verileri.
- [Wikipedia & Wikidata API](https://www.wikidata.org/w/api.php) - Vikipedi makaleleri ve yapılandırılmış bilgi tabanı sorguları.
- [Open Library](https://openlibrary.org/developers/api) - Kitap verileri, ISBN sorgulama ve kitap kapakları.
- [Open Food Facts](https://world.openfoodfacts.org/data) - Barkod üzerinden gıda ürünü içerik ve besin değerleri veritabanı.
- [Free Dictionary](https://dictionaryapi.dev) - İngilizce kelime tanımları, telaffuzlar ve eşanlamlılar.
- [Open-Meteo](https://open-meteo.com) - Anahtarsız ve sınırsız hava tahmini ve geçmiş hava verileri.
- [WorldTime API](https://worldtimeapi.org) - IP adresine veya konuma göre güncel saat ve yaz saati uygulaması verileri.
- [Sunrise-Sunset](https://sunrise-sunset.org/api) - Belirli enlem/boylam için gün doğumu ve gün batımı saatleri.
- [SpaceX API](https://github.com/r-spacex/SpaceX-API) - SpaceX fırlatmaları, roketler ve uzay araçları veritabanı.
- [PokéAPI](https://pokeapi.co) - Pokémon verileri (API ve JSON testleri için harika bir referans).
- [Quotable](https://github.com/lukePeavey/quotable) - Rastgele veya kategorize edilmiş ünlü alıntılar.
- [QR Server](https://goqr.me/api) - URL parametresiyle anında dinamik QR kod üreten API.

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

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFDF00)](https://vitejs.dev)
[![Cryptography](https://img.shields.io/badge/Cryptography-AES--128--Fernet-success?style=for-the-badge)](https://cryptography.io)
[![Local First](https://img.shields.io/badge/Local--First-Offline--Ready-blueviolet?style=for-the-badge)](#)

A personal, **encrypted** API key vault — runs entirely on your local machine, sending no data to the cloud.
The vault remains encrypted on disk (`~/.apikasa/vault.enc`) using a master password. A plaintext `.env` file is only generated when you explicitly export it.

> Single-user, local-first philosophy. No Postgres — just you, your machine, an encrypted vault, and a CLI.

---

## 🔍 GitHub Search Keywords
`api-vault` `api-keys` `secret-manager` `dotenv` `local-vault` `env-vault` `cryptography` `fastapi` `react` `vite` `developer-tools` `free-tier-apis` `open-data` `credential-manager`

---

## ✨ Features

- **🔐 Encrypted vault** — master password → scrypt → Fernet (AES-128-CBC + HMAC). Disk is always encrypted, no recovery if password is lost.
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

## 🔌 Supported APIs & Services Catalog

Below is the list of built-in APIs with generous developer free tiers that you can import directly into your vault:

### 🤖 Artificial Intelligence & LLMs
- [Google Gemini](https://aistudio.google.com) - 1,500 daily requests and 1M token context, the most generous free LLM API.
- [Groq](https://console.groq.com) - High-speed inference engine with Llama 3.3 support and 14,400 daily requests.
- [OpenRouter](https://openrouter.ai) - 300+ models with one API key, including some free models (`:free`).
- [Mistral AI](https://console.mistral.ai) - GDPR-compliant, powerful Codestral code model with trial credits.
- [Cohere](https://cohere.com) - RAG and Rerank optimized, 1,000 monthly trial requests.
- [Cerebras](https://cloud.cerebras.ai) - Ultra-fast LLM inference supporting 1000+ tokens/sec.
- [HuggingFace](https://huggingface.co) - Thousands of open-source models for NLP, speech, and vision.

### 🎨 Image & Visual Generation
- [Pollinations.ai](https://pollinations.ai) - Unlimited keyless image generation (Flux) to use directly in `<img>` tags.
- [Replicate](https://replicate.com) - Cloud execution for Flux, SDXL, video models, and more.
- [Cloudinary](https://cloudinary.com) - Image CDN and optimization, supports automatic WebP/AVIF generation.
- [remove.bg](https://remove.bg/api) - Remove image backgrounds programmatically (50 free credits/month).
- [Unsplash](https://unsplash.com/developers) - High-quality stock photography library API.

### 🎙️ Audio & Speech Synthesis
- [Groq Whisper](https://console.groq.com) - High-speed, multilingual speech-to-text conversion (Whisper v3).
- [ElevenLabs](https://elevenlabs.io) - Premium AI speech synthesis (10k characters/month free, multilingual support).
- [Deepgram](https://deepgram.com) - Real-time speech-to-text and transcription analytics ($200 free trial credit).

### 🎬 Video Processing
- Mux](https://mux.com) - Advanced video upload, transcode, and adaptive streaming hosting.
- [Shotstack](https://shotstack.io) - Programmatic video editing and rendering via JSON files.

### 🌐 Translation & Linguistics
- [DeepL](https://deepl.com/pro-api) - World-class translation quality (500k characters/month free).
- [LibreTranslate](https://libretranslate.com) - Self-hostable, open-source translation API for confidential data.
- [LanguageTool](https://languagetool.org/http-api) - Grammar and style checker API supporting multiple languages.

### 📧 E-mail Sending APIs
- [Resend](https://resend.com) - Developer-friendly email service supporting React templates (3,000 emails/month free).
- [Brevo](https://brevo.com) - 300 daily emails with unlimited contacts list.
- [Mailgun](https://mailgun.com) - Email validation and incoming email routing infrastructure.

### 💬 SMS & Notifications
- [Ntfy.sh](https://ntfy.sh) - Push notifications via simple HTTP POST, unlimited and self-hostable.
- [OneSignal](https://onesignal.com) - Multi-channel push notification service (free up to 10k subscribers).
- [Telegram Bot API](https://core.telegram.org/bots/api) - Senders notifications and alerts, completely free.
- [Twilio](https://twilio.com) - Global SMS, WhatsApp, and OTP/verification platform.

### 🔌 Real-time & WebSockets
- [Pusher](https://pusher.com) - Managed WebSocket channels (200,000 daily messages free).
- [Ably](https://ably.com) - Alternative to Pusher supporting 6M monthly messages and connection history.

### 🗺️ Maps & Geolocation
- [Mapbox](https://mapbox.com) - High-quality vector maps and search indexes (50,000 requests/month free).
- [OpenRouteService](https://openrouteservice.org) - Custom routing and matrix calculations (2,000 free requests/day).
- [Nominatim (OSM)](https://nominatim.org) - Geocoding API based on OpenStreetMap, keyless.

### 📍 IP & Demographics
- [ipapi.co](https://ipapi.co) - IP location, timezone, and currency lookup API (30,000 requests/month).
- [REST Countries](https://restcountries.com) - Detailed country metadata (flags, languages, currencies) without key.

### 📊 Finance & Stock Markets
- [Yahoo Finance](https://pypi.org/project/yfinance) - Stock market, crypto, and commodity prices (unlimited unofficial python lib).
- [Alpha Vantage](https://alphavantage.co) - Financial indicators (RSI, MACD) and market data (25 requests/day).
- [Finnhub](https://finnhub.io) - Real-time stock prices, news, and WebSocket streaming (60 requests/minute).
- [TCMB EVDS](https://evds2.tcmb.gov.tr) - Central Bank of the Republic of Turkey macro data: exchange rates, inflation, rates.
- [Frankfurter](https://frankfurter.dev) - Currency exchange rates from the European Central Bank (unlimited, keyless).

### 💳 Payment Processing
- [iyzico](https://iyzico.com) - Leading payment processor in Turkey: card checkout, instalments, subscriptions.
- [Stripe](https://stripe.com) - Global online payment processing infrastructure for developers.

### 🗄️ Database & BaaS (Backend-as-a-Service)
- [Supabase](https://supabase.com) - Open-source Firebase alternative: Postgres DB, Auth, Realtime, Storage (50k MAU free).
- [Neon](https://neon.tech) - Serverless Postgres database supporting instant database branching.
- [Upstash](https://upstash.com) - Serverless Redis and Kafka with a generous free tier (excellent for caching and rate limiting).
- [Turso](https://turso.tech) - LibSQL-based edge database offering 9 GB storage and 500 databases free.
- [Firebase](https://firebase.google.com) - Google's NoSQL backend platform, supports authentication and cloud messaging.

### 📐 Vector Databases & RAG
- [Pinecone](https://pinecone.io) - Popular vector database for AI and RAG search applications.
- [Qdrant](https://qdrant.tech) - Open-source, fast vector search engine with metadata filtering (1 GB free).

### 📦 Storage & CDNs
- [Cloudflare R2](https://developers.cloudflare.com/r2) - S3-compatible object storage with **zero** egress fees (10 GB free).
- [ImgBB](https://api.imgbb.com) - Single POST request image upload and hosting.

### 🔑 Authentication & Identity (Auth)
- [Clerk](https://clerk.com) - Complete sign-in UI, multi-factor authentication, and social login (10k MAU free).
- [Supabase Auth](https://supabase.com/auth) - Passwordless logins, magic links, and Postgres RLS integrations.

### 📄 OCR & Document Processing
- [Gemini Doc Analysis](https://aistudio.google.com) - Intelligent document extraction converting PDF files to structured JSON.
- [OCR.space](https://ocr.space) - Optical Character Recognition, parses text from images and PDFs (25,000 monthly queries).
- [PDF.co](https://pdf.co) - Programmatic PDF generation, form filling, and HTML-to-PDF converters.

### 📈 Product Analytics
- [PostHog](https://posthog.com) - Product analytics, user session replays, and feature flags (1M free events/month).
- [Plausible](https://plausible.io) - Lightweight, cookie-free, privacy-focused web analytics.

### 🛡️ Cybersecurity & Reputation
- [Have I Been Pwned](https://haveibeenpwned.com/API) - Verifies if credentials were compromised in data leaks.
- [AbuseIPDB](https://abuseipdb.com) - IP address abuse report index and threat scores (1,000 queries/day).

### 🗓️ Productivity & Integrations
- [Notion API](https://developers.notion.com) - Integrate, read, and write to Notion workspaces.
- [Airtable API](https://airtable.com/developers) - Low-code spreadsheet-database hybrid API.
- [GitHub API](https://docs.github.com/rest) - Repositories, issues, releases, and GitHub Actions triggers (5,000 requests/hour).

### 🕸️ Web Scraping & Crawling
- [Jina Reader](https://jina.ai/reader) - Convert URL contents to clean Markdown suitable for LLMs (unlimited, keyless).
- [Firecrawl](https://firecrawl.dev) - Crawls and converts web pages to LLM-ready clean Markdown format (500 free monthly credits).
- [Crawl4AI](https://github.com/unclecode/crawl4ai) - Self-hostable, open-source crawler library optimized for LLMs.
- [ScraperAPI](https://scraperapi.com) - Proxy rotation, JavaScript rendering, and anti-bot bypass.
- [ScrapingBee](https://scrapingbee.com) - Headless browser scraping and automatic rotating proxies (1,000 free requests).
- [Apify](https://apify.com) - Automation actor platform for web scraping and crawlers ($5 free monthly credits).
- [Browserless](https://browserless.io) - Managed headless Chrome service for Puppeteer and Playwright scripts.
- [Serper.dev](https://serper.dev) - High-speed Google search scraping API (2,500 free search queries).
- [ScrapingDog](https://scrapingdog.com) - Renders HTML and JS pages through proxies.

### 🛰️ Open Data Sources (Keyless / Reference)
- [TÜİK Open Data](https://data.tuik.gov.tr) - Official Turkish statistical portal.
- [Nager.Date](https://date.nager.at) - Global public holidays API for 100+ countries.
- [USGS Earthquake API](https://earthquake.usgs.gov/fdsnws/event/1) - Real-time global seismic activities.
- [World Bank Data](https://datahelpdesk.worldbank.org) - Hundreds of development indicators and datasets.
- [CoinGecko API](https://coingecko.com/api) - Cryptocurrency price and market cap index.
- [Wikipedia & Wikidata API](https://www.wikidata.org/w/api.php) - Articles summaries and SPARQL database queries.
- [Open Library](https://openlibrary.org/developers/api) - Comprehensive books metadata, covers, and author indexing.
- [Open Food Facts](https://world.openfoodfacts.org/data) - Open database containing barcodes, ingredients, and nutrition facts.
- [Free Dictionary](https://dictionaryapi.dev) - Definitions, phonetics, and synonyms.
- [Open-Meteo](https://open-meteo.com) - High-resolution weather forecast and historical climate data without key.
- [WorldTime API](https://worldtimeapi.org) - Current timezone offsets, DST status, and dates.
- [Sunrise-Sunset](https://sunrise-sunset.org/api) - Retrieve sunset/sunrise timing for physical coordinates.
- [SpaceX API](https://github.com/r-spacex/SpaceX-API) - Rocket launches, space missions, and historical details.
- [PokéAPI](https://pokeapi.co) - Pokémon stats, types, and items (excellent for API mockups).
- [Quotable](https://github.com/lukePeavey/quotable) - Random or themed famous quotes.
- [QR Server](https://goqr.me/api) - Generates customizable QR codes on demand.

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
