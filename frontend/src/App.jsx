import { useState, useEffect, useRef } from "react";

const AMBER = "#f5b942";
const mono = "'JetBrains Mono','SF Mono',ui-monospace,monospace";
const sans = "'Inter',system-ui,sans-serif";
// Lokal FastAPI backend adresi
const API_BASE = "http://localhost:8000";

// Hızlı ekleme için kompakt katalog (ad + docs)
// Katalog — [ad, docs, kısa açıklama, ücretsiz katman cömertliği 1-5]
const CATALOG = [
  { c: "AI / LLM", hue: "#a78bfa", items: [
    ["Google Gemini", "https://aistudio.google.com", "1.500 istek/gün, 1M token bağlam — en cömert ücretsiz LLM", 5],
    ["Groq", "https://console.groq.com", "Llama 3.3: 14.400 istek/gün, dünyanın en hızlı inference'ı", 5],
    ["OpenRouter", "https://openrouter.ai", "Tek API ile 300+ model, bazıları :free ücretsiz", 4],
    ["Mistral AI", "https://console.mistral.ai", "AB/GDPR dostu, Codestral kod modeli güçlü", 3],
    ["Cohere", "https://cohere.com", "RAG + Rerank için optimize, 1.000 istek/ay trial", 3],
    ["Cerebras", "https://cloud.cerebras.ai", "Groq rakibi, saniyede 1000+ token", 4],
    ["HuggingFace", "https://huggingface.co", "Binlerce özel model: NLP, görüntü, ses", 3],
  ] },
  { c: "Görsel Üretim", hue: "#f472b6", items: [
    ["Pollinations.ai", "https://pollinations.ai", "Sınırsız, key yok, img src olarak çalışır (Flux)", 5],
    ["Replicate", "https://replicate.com", "Flux, SDXL, upscale, video — binlerce hazır model", 3],
    ["Cloudinary", "https://cloudinary.com", "Görsel CDN + anlık dönüşüm, otomatik WebP/AVIF", 4],
    ["remove.bg", "https://remove.bg/api", "Tek çağrıyla arka plan kaldırma, 50/ay", 2],
    ["Unsplash", "https://unsplash.com/developers", "Ücretsiz yüksek kaliteli stok fotoğraf", 4],
  ] },
  { c: "Ses & Konuşma", hue: "#fb7185", items: [
    ["Groq Whisper", "https://console.groq.com", "Whisper v3, çok hızlı, Türkçe transkripsiyon", 4],
    ["ElevenLabs", "https://elevenlabs.io", "Sektör lideri TTS, 10.000 karakter/ay, TR sesli", 3],
    ["Deepgram", "https://deepgram.com", "Canlı STT + konuşmacı ayrımı, $200 kredi", 4],
  ] },
  { c: "Video", hue: "#fca5a5", items: [
    ["Mux", "https://mux.com", "Video yükleme, transcode, adaptif streaming + analitik", 3],
    ["Shotstack", "https://shotstack.io", "JSON ile programatik video kurgu/render", 3],
  ] },
  { c: "Çeviri & Dil", hue: "#2dd4bf", items: [
    ["DeepL", "https://deepl.com/pro-api", "En kaliteli çeviri, 500.000 karakter/ay, TR", 4],
    ["LibreTranslate", "https://libretranslate.com", "Açık kaynak, self-host, gizli veri için", 5],
    ["LanguageTool", "https://languagetool.org/http-api", "Dilbilgisi/yazım denetimi, TR destekli", 4],
  ] },
  { c: "E-posta", hue: "#34d399", items: [
    ["Resend", "https://resend.com", "Modern email API, React şablon, 3.000/ay", 4],
    ["Brevo", "https://brevo.com", "300/gün + sınırsız kontak, TR'de yaygın", 4],
    ["Mailgun", "https://mailgun.com", "Email doğrulama + gelen mail yönlendirme", 3],
  ] },
  { c: "SMS & Bildirim", hue: "#f87171", items: [
    ["Ntfy.sh", "https://ntfy.sh", "Sınırsız push, self-host, basit HTTP POST", 5],
    ["OneSignal", "https://onesignal.com", "Çok kanallı push: web + mobil, 10K abone", 4],
    ["Telegram Bot", "https://core.telegram.org/bots/api", "Bot ile sınırsız bildirim, bedava", 5],
    ["Twilio", "https://twilio.com", "SMS, WhatsApp, OTP — TR'ye gönderir, ~$15 kredi", 2],
  ] },
  { c: "Sohbet & Realtime", hue: "#22d3ee", items: [
    ["Pusher", "https://pusher.com", "Yönetilen WebSocket, 200K mesaj/gün", 3],
    ["Ably", "https://ably.com", "Pusher rakibi, 6M mesaj/ay + mesaj geçmişi", 4],
  ] },
  { c: "Harita & Konum", hue: "#60a5fa", items: [
    ["Mapbox", "https://mapbox.com", "Yüksek kalite harita, dark tema, 50K/ay", 4],
    ["OpenRouteService", "https://openrouteservice.org", "Rota + mesafe matrisi, lojistik için, 2.000/gün", 4],
    ["Nominatim (OSM)", "https://nominatim.org", "Açık kaynak geocoding, key yok", 4],
  ] },
  { c: "IP & Coğrafya", hue: "#38bdf8", items: [
    ["ipapi.co", "https://ipapi.co", "IP→konum/para birimi/saat dilimi, 30K/ay", 4],
    ["REST Countries", "https://restcountries.com", "Tüm ülke verisi: bayrak, para, dil — key yok", 5],
  ] },
  { c: "Finans & Borsa", hue: "#fbbf24", items: [
    ["Yahoo Finance", "https://pypi.org/project/yfinance", "Hisse/tarihsel/kripto, sınırsız (unofficial)", 5],
    ["Alpha Vantage", "https://alphavantage.co", "RSI/MACD hazır indikatörler, 25 istek/gün", 2],
    ["Finnhub", "https://finnhub.io", "Canlı fiyat + haber + WebSocket, 60/dk", 4],
    ["TCMB EVDS", "https://evds2.tcmb.gov.tr", "Merkez Bankası resmi: kur, faiz, enflasyon (TR)", 5],
    ["Frankfurter", "https://frankfurter.dev", "ECB döviz kuru, sınırsız, key yok", 5],
  ] },
  { c: "Ödeme", hue: "#a3e635", items: [
    ["iyzico", "https://iyzico.com", "Türkiye'nin yaygın altyapısı: kart, taksit, abonelik", 4],
    ["Stripe", "https://stripe.com", "Global ödeme, en iyi geliştirici deneyimi", 4],
  ] },
  { c: "Veritabanı / Backend", hue: "#c084fc", items: [
    ["Supabase", "https://supabase.com", "Postgres + auth + realtime + storage, 50K MAU", 4],
    ["Neon", "https://neon.tech", "Serverless Postgres, Git-tarzı branching", 4],
    ["Upstash", "https://upstash.com", "Serverless Redis: cache, rate limit, queue", 4],
    ["Turso", "https://turso.tech", "Edge SQLite, aşırı cömert: 9GB, 500 DB", 5],
    ["Firebase", "https://firebase.google.com", "NoSQL + auth + push, mobil için güçlü", 4],
  ] },
  { c: "Vektör / RAG", hue: "#818cf8", items: [
    ["Pinecone", "https://pinecone.io", "En yaygın yönetilen vektör DB, RAG standardı", 3],
    ["Qdrant", "https://qdrant.tech", "Açık kaynak, self-host, filtreli arama, 1GB", 4],
  ] },
  { c: "Depolama & CDN", hue: "#fdba74", items: [
    ["Cloudflare R2", "https://developers.cloudflare.com/r2", "S3 uyumlu, çıkış (egress) ücreti YOK, 10GB", 4],
    ["ImgBB", "https://api.imgbb.com", "Basit görsel barındırma, tek POST", 4],
  ] },
  { c: "Kimlik & Giriş", hue: "#4ade80", items: [
    ["Clerk", "https://clerk.com", "Hazır giriş UI, MFA, sosyal login, 10K MAU", 4],
    ["Supabase Auth", "https://supabase.com/auth", "Magic link, OAuth, RLS — Supabase ile gelir", 4],
  ] },
  { c: "Doküman & OCR", hue: "#fb923c", items: [
    ["Gemini Doküman", "https://aistudio.google.com", "PDF→yapılandırılmış JSON, klasik OCR'dan akıllı", 5],
    ["OCR.space", "https://ocr.space", "Görsel/PDF→metin, TR dahil, 25.000/ay", 4],
    ["PDF.co", "https://pdf.co", "PDF üret/doldur/birleştir, HTML→PDF", 3],
  ] },
  { c: "Analitik", hue: "#f0abfc", items: [
    ["PostHog", "https://posthog.com", "Ürün analitiği + funnel + flag + replay, 1M olay/ay", 4],
    ["Plausible", "https://plausible.io", "Hafif, cookie'siz, gizlilik dostu web analitiği", 3],
  ] },
  { c: "Güvenlik", hue: "#fca5a5", items: [
    ["Have I Been Pwned", "https://haveibeenpwned.com/API", "Şifre sızıntı kontrolü, k-anonymity", 4],
    ["AbuseIPDB", "https://abuseipdb.com", "IP itibar skoru, spam/bot engelleme, 1.000/gün", 3],
  ] },
  { c: "Üretkenlik & Otomasyon", hue: "#94a3b8", items: [
    ["Notion API", "https://developers.notion.com", "Notion DB'yi oku/yaz, hafif backend gibi", 5],
    ["Airtable", "https://airtable.com/developers", "Tablo+DB karışımı, hafif CRM/içerik", 3],
    ["GitHub API", "https://docs.github.com/rest", "Repo, issue, Actions tetikleme, 5.000/saat", 5],
  ] },
  { c: "Web Scraping", hue: "#5eead4", items: [
    ["Jina Reader", "https://jina.ai/reader", "r.jina.ai/<url> → temiz markdown, key yok, bedava", 5],
    ["Firecrawl", "https://firecrawl.dev", "LLM-hazır crawl + scrape, markdown çıktı, 500 kredi/ay", 3],
    ["Crawl4AI", "https://github.com/unclecode/crawl4ai", "Açık kaynak, self-host, LLM için temiz çıktı", 5],
    ["ScraperAPI", "https://scraperapi.com", "Proxy rotation + JS render + anti-bot, 1.000/ay trial", 2],
    ["ScrapingBee", "https://scrapingbee.com", "Headless render + proxy, 1.000 kredi deneme", 2],
    ["Apify", "https://apify.com", "Hazır 'actor' marketplace, $5 ücretsiz kredi/ay", 3],
    ["Browserless", "https://browserless.io", "Yönetilen headless Chrome, Puppeteer/Playwright", 2],
    ["Serper.dev", "https://serper.dev", "Google arama sonuçları API'si, 2.500 ücretsiz kredi", 3],
    ["ScrapingDog", "https://scrapingdog.com", "Proxy + render, ucuz, 1.000 istek deneme", 2],
  ] },
  { c: "Açık Veri", hue: "#7dd3fc", items: [
    ["NASA", "https://api.nasa.gov", "Astronomi fotoğrafı, Mars, asteroit (DEMO_KEY)", 5],
    ["NewsAPI", "https://newsapi.org", "Haber akışı, TR kaynaklar, 100 istek/gün", 3],
  ] },
];

// Açık veri kaynakları — çoğu key gerektirmez, referans listesi
const OD_HUE = "#7dd3fc";
const OPENDATA = [
  { g: "🇹🇷 Türkiye", items: [
    { n: "TCMB EVDS", k: true, u: "https://evds2.tcmb.gov.tr", d: "Merkez Bankası: kur, faiz, enflasyon, tüm makro veri" },
    { n: "TÜİK Açık Veri", k: false, u: "https://data.tuik.gov.tr", d: "Resmi istatistik: nüfus, ekonomi, işgücü" },
    { n: "Nager.Date", k: false, u: "https://date.nager.at", d: "Türkiye resmi tatil takvimi (100+ ülke)" },
    { n: "USGS Deprem", k: false, u: "https://earthquake.usgs.gov/fdsnws/event/1", d: "Türkiye bölgesine filtrelenebilir gerçek zamanlı deprem" },
  ] },
  { g: "📊 İstatistik & Finans", items: [
    { n: "World Bank", k: false, u: "https://datahelpdesk.worldbank.org", d: "GSYİH, nüfus, binlerce kalkınma göstergesi" },
    { n: "CoinGecko", k: false, u: "https://coingecko.com/api", d: "Kripto fiyatları, TRY cinsinden de alınır" },
    { n: "Frankfurter", k: false, u: "https://frankfurter.dev", d: "ECB döviz kuru, sınırsız, key yok" },
  ] },
  { g: "📚 Bilgi & Referans", items: [
    { n: "Wikipedia / Wikidata", k: false, u: "https://www.wikidata.org/w/api.php", d: "Makale özeti + yapılandırılmış bilgi (SPARQL)" },
    { n: "Open Library", k: false, u: "https://openlibrary.org/developers/api", d: "Kitap metadata: ISBN, yazar, kapak" },
    { n: "Open Food Facts", k: false, u: "https://world.openfoodfacts.org/data", d: "Barkoddan ürün, besin değeri, içerik" },
    { n: "Free Dictionary", k: false, u: "https://dictionaryapi.dev", d: "Kelime tanımı, telaffuz, eşanlam" },
  ] },
  { g: "🌍 Zaman & Çevre", items: [
    { n: "Open-Meteo", k: false, u: "https://open-meteo.com", d: "Hava tahmini, geçmiş veri, hava kalitesi" },
    { n: "WorldTime API", k: false, u: "https://worldtimeapi.org", d: "Saat dilimine göre güncel saat, DST" },
    { n: "Sunrise-Sunset", k: false, u: "https://sunrise-sunset.org/api", d: "Gün doğumu/batımı, altın saat" },
  ] },
  { g: "🛰️ Uzay & Demo", items: [
    { n: "NASA API", k: true, u: "https://api.nasa.gov", d: "Astronomi fotoğrafı, Mars, asteroit (DEMO_KEY ile de çalışır)" },
    { n: "SpaceX API", k: false, u: "https://github.com/r-spacex/SpaceX-API", d: "Fırlatmalar, roketler, görseller" },
    { n: "PokéAPI", k: false, u: "https://pokeapi.co", d: "İlişkili veri yapısı — öğrenme/demo için ideal" },
    { n: "Quotable", k: false, u: "https://github.com/lukePeavey/quotable", d: "Rastgele/filtreli ünlü sözler" },
    { n: "QR Server", k: false, u: "https://goqr.me/api", d: "URL ile QR üretimi, img src olarak" },
  ] },
];

const hueFor = (catName) => CATALOG.find((c) => c.c === catName)?.hue || AMBER;

function toEnvVar(name) {
  return (
    name.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "") + "_API_KEY"
  );
}

export default function APIVault() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [persists, setPersists] = useState(true);
  const [envPath, setEnvPath] = useState("");
  const [view, setView] = useState("vault"); // vault | catalog | io
  const [q, setQ] = useState("");
  const [reveal, setReveal] = useState({});
  const [copied, setCopied] = useState(null);
  const [flash, setFlash] = useState(null);
  // custom form
  const [cName, setCName] = useState("");
  const [cEnv, setCEnv] = useState("");
  const [cVal, setCVal] = useState("");
  const [cCat, setCCat] = useState("Özel");
  // import
  const [importText, setImportText] = useState("");
  const fileRef = useRef(null);
  // auth / kilit
  const [phase, setPhase] = useState("loading"); // loading | down | setup | locked | ready
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [authErr, setAuthErr] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  // ---- durum kontrolü (kilit/parola)
  const checkStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/status`);
      if (!res.ok) throw new Error();
      const s = await res.json();
      setEnvPath(s.env_path || "");
      if (!s.initialized) setPhase("setup");
      else if (s.locked) setPhase("locked");
      else { await loadVault(); setPhase("ready"); }
    } catch {
      setPhase("down"); // backend kapalı
    }
  };

  const loadVault = async () => {
    const res = await fetch(`${API_BASE}/api/vault`);
    if (res.status === 423) { setPhase("locked"); return; }
    const data = await res.json();
    setEntries(data.entries || []);
    setEnvPath(data.env_path || "");
    setLoaded(true);
    setPersists(true);
  };

  useEffect(() => { checkStatus(); }, []);

  const doSetup = async () => {
    setAuthErr("");
    if (pw.length < 6) return setAuthErr("Parola en az 6 karakter olmalı");
    if (pw !== pw2) return setAuthErr("Parolalar eşleşmiyor");
    setAuthBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/setup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "kurulum başarısız");
      setPw(""); setPw2("");
      await loadVault(); setPhase("ready");
    } catch (e) { setAuthErr(String(e.message || e)); }
    finally { setAuthBusy(false); }
  };

  const doUnlock = async () => {
    setAuthErr(""); setAuthBusy(true);
    try {
      const res = await fetch(`${API_BASE}/api/unlock`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.status === 401) throw new Error("Yanlış parola");
      if (!res.ok) throw new Error("açılamadı");
      setPw("");
      await loadVault(); setPhase("ready");
    } catch (e) { setAuthErr(String(e.message || e)); }
    finally { setAuthBusy(false); }
  };

  const doLock = async () => {
    try { await fetch(`${API_BASE}/api/lock`, { method: "POST" }); } catch {}
    setEntries([]); setLoaded(false); setPhase("locked");
  };

  const persist = async (next) => {
    setEntries(next);
    try {
      const res = await fetch(`${API_BASE}/api/vault`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: next }),
      });
      if (res.status === 423) { setPhase("locked"); return; }
      if (!res.ok) throw new Error();
      setPersists(true);
    } catch {
      setPersists(false);
    }
  };

  const notify = (m) => { setFlash(m); setTimeout(() => setFlash(null), 1800); };

  const addEntry = (name, cat, env, val = "") => {
    if (entries.some((e) => e.env === env)) { notify(`${env} zaten kasada`); setView("vault"); return; }
    const next = [...entries, { id: crypto.randomUUID(), name, cat, env, val }];
    persist(next);
    notify(`${name} eklendi`);
    setView("vault");
  };

  const update = (id, patch) => persist(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id) => persist(entries.filter((e) => e.id !== id));

  const copy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1300);
  };

  const buildEnv = () => {
    const lines = ["# Free API Keys — " + new Date().toLocaleString("tr-TR"), ""];
    const byCat = {};
    entries.forEach((e) => { (byCat[e.cat] ||= []).push(e); });
    Object.keys(byCat).sort().forEach((cat) => {
      lines.push(`# ── ${cat} ──`);
      byCat[cat].forEach((e) => lines.push(e.val ? `${e.env}=${e.val}` : `# ${e.env}=`));
      lines.push("");
    });
    return lines.join("\n");
  };

  const downloadEnv = () => {
    const blob = new Blob([buildEnv()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = ".env"; a.click();
    URL.revokeObjectURL(url);
    notify(".env indirildi");
  };

  const exportToDisk = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/export-env`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.status === 423) { setPhase("locked"); return; }
      const data = await res.json();
      notify(`diske yazıldı: ${data.path}`);
    } catch { notify("yazılamadı — backend kapalı olabilir"); }
  };

  const parseImport = (text) => {
    const lines = text.split(/\r?\n/);
    let added = 0, updated = 0;
    let next = [...entries];
    for (let raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 1) continue;
      const env = line.slice(0, eq).trim().replace(/^export\s+/, "");
      let val = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!val) continue;
      const ex = next.find((e) => e.env === env);
      if (ex) { ex.val = val; updated++; }
      else { next.push({ id: crypto.randomUUID(), name: env.replace(/_API_KEY$/, "").replace(/_/g, " "), cat: "İçe aktarılan", env, val }); added++; }
    }
    persist(next);
    notify(`${added} eklendi · ${updated} güncellendi`);
    setImportText("");
    setView("vault");
  };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => parseImport(String(rd.result));
    rd.readAsText(f);
  };

  const filled = entries.filter((e) => e.val).length;
  const grid = "linear-gradient(#ffffff05 1px,transparent 1px),linear-gradient(90deg,#ffffff05 1px,transparent 1px)";

  const catalogFiltered = CATALOG.map((c) => ({
    ...c,
    items: c.items.filter(([n, , d]) => !q || n.toLowerCase().includes(q.toLowerCase()) || (d || "").toLowerCase().includes(q.toLowerCase()) || c.c.toLowerCase().includes(q.toLowerCase())),
  })).filter((c) => c.items.length);

  const vaultFiltered = entries.filter((e) => !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.env.toLowerCase().includes(q.toLowerCase()) || e.cat.toLowerCase().includes(q.toLowerCase()));

  const tabBtn = (id, label) => (
    <button onClick={() => { setView(id); }}
      style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${view === id ? AMBER : "#1e2738"}`, cursor: "pointer", fontFamily: mono, fontSize: 12.5, fontWeight: 600, background: view === id ? AMBER + "18" : "#0c1018", color: view === id ? AMBER : "#64748b" }}>
      {label}
    </button>
  );

  // ---- Kilit / parola ekranları --------------------------------------
  const authShell = (children) => (
    <div style={{ fontFamily: sans, background: "#070a12", minHeight: "100vh", color: "#cbd5e1", backgroundImage: grid, backgroundSize: "44px 44px", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 380, border: `1px solid ${AMBER}33`, borderRadius: 14, background: "#0c1018ee", padding: "28px 26px", boxShadow: `0 0 50px ${AMBER}10` }}>
        <h1 style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: "#f8fafc", margin: "0 0 4px", letterSpacing: -0.5 }}>
          ANAHTAR<span style={{ color: AMBER }}>://</span>KASA
        </h1>
        {children}
      </div>
    </div>
  );

  const pwInput = (val, set, ph, onEnter) => (
    <input type="password" value={val} onChange={(e) => set(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter()} placeholder={ph} autoFocus={ph.includes("Master")}
      style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", background: "#060911", border: "1px solid #1e2738", borderRadius: 9, color: "#e2e8f0", fontFamily: mono, fontSize: 14, outline: "none", marginBottom: 10 }} />
  );

  if (phase === "loading") return authShell(<p style={{ fontFamily: mono, fontSize: 13, color: "#64748b", marginTop: 14 }}>// bağlanılıyor...</p>);

  if (phase === "down") return authShell(
    <div>
      <p style={{ fontFamily: mono, fontSize: 13, color: "#ef4444", margin: "14px 0 6px" }}>// backend kapalı</p>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 16px" }}>FastAPI çalışmıyor. Terminalde <code style={{ color: "#a5f3fc", fontFamily: mono }}>./baslat.sh</code> ile başlat, sonra tekrar dene.</p>
      <button onClick={() => { setPhase("loading"); checkStatus(); }} style={{ padding: "10px 16px", borderRadius: 9, border: `1px solid ${AMBER}55`, background: AMBER + "18", color: AMBER, fontFamily: mono, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>↻ tekrar dene</button>
    </div>
  );

  if (phase === "setup") return authShell(
    <div>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "10px 0 18px" }}>İlk kurulum — kasanı şifrelemek için bir <b style={{ color: "#e2e8f0" }}>master parola</b> belirle. Bu parola unutulursa kasa açılamaz, kurtarma yoktur.</p>
      {pwInput(pw, setPw, "Master parola (min 6)", doSetup)}
      {pwInput(pw2, setPw2, "Parolayı tekrarla", doSetup)}
      {authErr && <p style={{ fontFamily: mono, fontSize: 12, color: "#ef4444", margin: "2px 0 10px" }}>{authErr}</p>}
      <button onClick={doSetup} disabled={authBusy} style={{ width: "100%", padding: "11px", borderRadius: 9, border: "none", background: AMBER, color: "#0d0f16", fontFamily: mono, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>{authBusy ? "kuruluyor..." : "🔐 kasayı oluştur"}</button>
    </div>
  );

  if (phase === "locked") return authShell(
    <div>
      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, margin: "10px 0 18px" }}>Kasa kilitli. Açmak için master parolanı gir.</p>
      {pwInput(pw, setPw, "Master parola", doUnlock)}
      {authErr && <p style={{ fontFamily: mono, fontSize: 12, color: "#ef4444", margin: "2px 0 10px" }}>{authErr}</p>}
      <button onClick={doUnlock} disabled={authBusy} style={{ width: "100%", padding: "11px", borderRadius: 9, border: "none", background: AMBER, color: "#0d0f16", fontFamily: mono, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>{authBusy ? "açılıyor..." : "🔓 kilidi aç"}</button>
    </div>
  );

  return (
    <div style={{ fontFamily: sans, background: "#070a12", minHeight: "100vh", color: "#cbd5e1", backgroundImage: grid, backgroundSize: "44px 44px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "26px 16px 60px" }}>

        {/* Header */}
        <div style={{ border: `1px solid ${AMBER}33`, borderRadius: 12, background: "#0c1018ee", padding: "18px 22px", marginBottom: 18, boxShadow: `0 0 40px ${AMBER}0a` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ width: 9, height: 9, borderRadius: 99, background: "#ef4444" }} />
            <span style={{ width: 9, height: 9, borderRadius: 99, background: AMBER }} />
            <span style={{ width: 9, height: 9, borderRadius: 99, background: "#22c55e" }} />
            <span style={{ fontFamily: mono, fontSize: 11, color: "#475569", marginLeft: 6, letterSpacing: 1 }}>~/api-vault</span>
            <div style={{ flex: 1 }} />
            <button onClick={doLock} title="Kasayı kilitle"
              style={{ padding: "5px 11px", borderRadius: 7, border: "1px solid #1e2738", background: "#0c1018", color: "#94a3b8", fontFamily: mono, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              🔒 kilitle
            </button>
          </div>
          <h1 style={{ fontFamily: mono, fontSize: 25, fontWeight: 700, color: "#f8fafc", margin: 0, letterSpacing: -0.5 }}>
            ANAHTAR<span style={{ color: AMBER }}>://</span>KASA
          </h1>
          <p style={{ fontFamily: mono, fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.7 }}>
            <span style={{ color: AMBER }}>{entries.length}</span> kayıt · <span style={{ color: "#22c55e" }}>{filled}</span> dolu key ·
            {persists
              ? <span style={{ color: "#22c55e" }}> 🔐 şifreli · vault.enc</span>
              : <span style={{ color: "#ef4444" }}> backend kapalı — değişiklikler kaydedilmiyor</span>}
          </p>
        </div>

        {/* Tabs + actions */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          {tabBtn("vault", "▮ Kasam")}
          {tabBtn("catalog", "+ Katalogdan ekle")}
          {tabBtn("opendata", "🛰 Açık veri")}
          {tabBtn("io", "⇅ .env içe/dışa")}
          <div style={{ flex: 1 }} />
          <button onClick={downloadEnv} disabled={!entries.length}
            style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${entries.length ? "#22c55e" : "#1e2738"}`, cursor: entries.length ? "pointer" : "default", fontFamily: mono, fontSize: 12.5, fontWeight: 600, background: entries.length ? "#052e16" : "#0c1018", color: entries.length ? "#4ade80" : "#334155" }}>
            ↓ .env indir
          </button>
        </div>

        {/* Search */}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="grep > ad, env değişkeni, kategori..."
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", background: "#0c1018", border: "1px solid #1e2738", borderRadius: 9, color: "#e2e8f0", fontSize: 13, fontFamily: mono, outline: "none", marginBottom: 18 }} />

        {flash && <div style={{ fontFamily: mono, fontSize: 12, color: AMBER, marginBottom: 12 }}>» {flash}</div>}

        {/* ---------- VAULT ---------- */}
        {view === "vault" && (
          <>
            {!loaded && <div style={{ fontFamily: mono, color: "#475569", fontSize: 13 }}>// yükleniyor...</div>}
            {loaded && !vaultFiltered.length && (
              <div style={{ textAlign: "center", padding: 36, fontFamily: mono, fontSize: 13, color: "#475569", border: "1px dashed #1e2738", borderRadius: 11 }}>
                {entries.length ? "// eşleşme yok" : "// kasa boş — 'Katalogdan ekle' ya da aşağıdan özel uygulama ekle"}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {vaultFiltered.map((e) => {
                const hue = hueFor(e.cat);
                const shown = reveal[e.id];
                return (
                  <div key={e.id} style={{ position: "relative", background: "#0b0f18", borderRadius: 10, border: "1px solid #16202f", padding: "13px 16px 13px 18px" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: hue, opacity: 0.6 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 9, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: 14.5, color: "#f1f5f9" }}>{e.name}</span>
                        <span style={{ fontFamily: mono, fontSize: 10, color: hue, border: `1px solid ${hue}44`, padding: "1px 6px", borderRadius: 4 }}>{e.cat}</span>
                        {!e.val && <span style={{ fontFamily: mono, fontSize: 10, color: "#f59e0b" }}>● key boş</span>}
                      </div>
                      <button onClick={() => remove(e.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontFamily: mono, fontSize: 12 }}>sil ✕</button>
                    </div>
                    {/* env var name */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <input value={e.env} onChange={(ev) => update(e.id, { env: ev.target.value })}
                        style={{ flex: 1, background: "#060911", border: "1px solid #16202f", borderRadius: 6, color: "#a5f3fc", fontFamily: mono, fontSize: 12, padding: "7px 10px", outline: "none" }} />
                      <button onClick={() => copy(e.env, e.id + "env")} style={{ background: "#121a28", border: "1px solid #1e2738", color: copied === e.id + "env" ? "#4ade80" : "#64748b", fontFamily: mono, fontSize: 10.5, padding: "6px 9px", borderRadius: 5, cursor: "pointer", whiteSpace: "nowrap" }}>{copied === e.id + "env" ? "✓" : "ad"}</button>
                    </div>
                    {/* value */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input value={e.val} type={shown ? "text" : "password"} placeholder="API key yapıştır..."
                        onChange={(ev) => update(e.id, { val: ev.target.value })}
                        style={{ flex: 1, background: "#060911", border: "1px solid #16202f", borderRadius: 6, color: "#e2e8f0", fontFamily: mono, fontSize: 12, padding: "7px 10px", outline: "none" }} />
                      <button onClick={() => setReveal((r) => ({ ...r, [e.id]: !r[e.id] }))} style={{ background: "#121a28", border: "1px solid #1e2738", color: "#64748b", fontFamily: mono, fontSize: 10.5, padding: "6px 9px", borderRadius: 5, cursor: "pointer" }}>{shown ? "gizle" : "göster"}</button>
                      <button onClick={() => copy(e.val, e.id + "val")} disabled={!e.val} style={{ background: "#121a28", border: "1px solid #1e2738", color: copied === e.id + "val" ? "#4ade80" : e.val ? "#64748b" : "#334155", fontFamily: mono, fontSize: 10.5, padding: "6px 9px", borderRadius: 5, cursor: e.val ? "pointer" : "default" }}>{copied === e.id + "val" ? "✓" : "key"}</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* custom add */}
            <div style={{ marginTop: 18, border: "1px solid #16202f", borderRadius: 11, background: "#0b0f18", padding: "16px 18px" }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: AMBER, marginBottom: 12, letterSpacing: 0.5 }}>// kendi uygulamanı ekle</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <input value={cName} onChange={(e) => { setCName(e.target.value); if (!cEnv || cEnv === toEnvVar(cName)) setCEnv(toEnvVar(e.target.value)); }} placeholder="Uygulama / servis adı"
                  style={{ flex: "1 1 180px", background: "#060911", border: "1px solid #16202f", borderRadius: 6, color: "#e2e8f0", fontFamily: sans, fontSize: 13, padding: "8px 11px", outline: "none" }} />
                <input value={cCat} onChange={(e) => setCCat(e.target.value)} placeholder="Kategori"
                  style={{ flex: "0 1 130px", background: "#060911", border: "1px solid #16202f", borderRadius: 6, color: "#e2e8f0", fontFamily: sans, fontSize: 13, padding: "8px 11px", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <input value={cEnv} onChange={(e) => setCEnv(e.target.value)} placeholder="ENV_DEGISKENI"
                  style={{ flex: "1 1 180px", background: "#060911", border: "1px solid #16202f", borderRadius: 6, color: "#a5f3fc", fontFamily: mono, fontSize: 12, padding: "8px 11px", outline: "none" }} />
                <input value={cVal} onChange={(e) => setCVal(e.target.value)} placeholder="key (opsiyonel)"
                  style={{ flex: "1 1 180px", background: "#060911", border: "1px solid #16202f", borderRadius: 6, color: "#e2e8f0", fontFamily: mono, fontSize: 12, padding: "8px 11px", outline: "none" }} />
              </div>
              <button onClick={() => { if (!cName.trim()) return notify("ad gerekli"); addEntry(cName.trim(), cCat.trim() || "Özel", (cEnv.trim() || toEnvVar(cName)), cVal.trim()); setCName(""); setCEnv(""); setCVal(""); setCCat("Özel"); }}
                style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${AMBER}55`, background: AMBER + "18", color: AMBER, fontFamily: mono, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ kasaya ekle</button>
            </div>
          </>
        )}

        {/* ---------- CATALOG ---------- */}
        {view === "catalog" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ fontFamily: mono, fontSize: 11.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              // bir servise tıkla → kasana düşsün → key'ini orada gir. <span style={{ color: "#22c55e" }}>▮▮▮▮▮</span> = ücretsiz katman cömertliği
            </p>
            {catalogFiltered.map((c) => (
              <div key={c.c}>
                <div style={{ fontFamily: mono, fontSize: 11.5, color: c.hue, marginBottom: 9, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: c.hue }} /> {c.c}
                  <span style={{ color: c.hue + "88", fontSize: 10 }}>{c.items.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {c.items.map(([n, url, d, gen]) => {
                    const inVault = entries.some((e) => e.env === toEnvVar(n));
                    return (
                      <div key={n} style={{ position: "relative", background: "#0b0f18", borderRadius: 10, border: "1px solid #16202f", padding: "11px 14px 11px 16px" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.hue, opacity: 0.5 }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4, flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>{n}</span>
                              <span style={{ display: "inline-flex", gap: 2 }} title={`Cömertlik: ${gen}/5`}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <span key={i} style={{ width: 5, height: 11, borderRadius: 1, background: i <= gen ? c.hue : "#222b3a" }} />
                                ))}
                              </span>
                            </div>
                            <div style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>{d}</div>
                          </div>
                          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                            <button onClick={() => addEntry(n, c.c, toEnvVar(n))} disabled={inVault}
                              style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${inVault ? "#1a2334" : c.hue + "55"}`, background: inVault ? "#0c1018" : c.hue + "16", color: inVault ? "#334155" : c.hue, fontFamily: mono, fontSize: 11, fontWeight: 600, cursor: inVault ? "default" : "pointer", whiteSpace: "nowrap" }}>
                              {inVault ? "✓ kasada" : "+ kasaya"}
                            </button>
                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 10px", borderRadius: 7, background: "#121a28", color: "#64748b", fontFamily: mono, fontSize: 11, textDecoration: "none", border: "1px solid #1e2738", whiteSpace: "nowrap" }}>docs →</a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------- OPEN DATA ---------- */}
        {view === "opendata" && (
          <>
            <p style={{ fontFamily: mono, fontSize: 12, color: "#64748b", margin: "0 0 16px", lineHeight: 1.7 }}>
              // çoğu <span style={{ color: "#4ade80" }}>API key gerektirmez</span> — direkt çağır. Key isteyenlerde <span style={{ color: AMBER }}>↳ kasaya ekle</span> butonu var.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {OPENDATA.map((grp) => {
                const items = grp.items.filter((it) => !q || it.n.toLowerCase().includes(q.toLowerCase()) || it.d.toLowerCase().includes(q.toLowerCase()));
                if (!items.length) return null;
                return (
                  <div key={grp.g}>
                    <div style={{ fontFamily: mono, fontSize: 11.5, color: OD_HUE, marginBottom: 9, letterSpacing: 0.5 }}>{grp.g}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {items.map((it) => {
                        const inVault = entries.some((e) => e.env === toEnvVar(it.n));
                        return (
                          <div key={it.n} style={{ position: "relative", background: "#0b0f18", borderRadius: 10, border: "1px solid #16202f", padding: "12px 16px 12px 18px" }}>
                            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: OD_HUE, opacity: 0.5 }} />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                                  <span style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>{it.n}</span>
                                  {it.k
                                    ? <span style={{ fontFamily: mono, fontSize: 9.5, color: AMBER, border: `1px solid ${AMBER}44`, padding: "1px 6px", borderRadius: 4 }}>KEY GEREKLİ</span>
                                    : <span style={{ fontFamily: mono, fontSize: 9.5, color: "#4ade80", background: "#052e16", border: "1px solid #14532d", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>KEY YOK</span>}
                                </div>
                                <div style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.5 }}>{it.d}</div>
                              </div>
                              <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                                {it.k && (
                                  <button onClick={() => addEntry(it.n, "Açık Veri", toEnvVar(it.n))} disabled={inVault}
                                    style={{ padding: "6px 11px", borderRadius: 7, border: `1px solid ${inVault ? "#1a2334" : AMBER + "55"}`, background: inVault ? "#0c1018" : AMBER + "18", color: inVault ? "#334155" : AMBER, fontFamily: mono, fontSize: 11, fontWeight: 600, cursor: inVault ? "default" : "pointer", whiteSpace: "nowrap" }}>
                                    {inVault ? "✓ kasada" : "↳ kasaya"}
                                  </button>
                                )}
                                <a href={it.u} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 11px", borderRadius: 7, background: OD_HUE + "14", color: OD_HUE, fontFamily: mono, fontSize: 11, textDecoration: "none", border: `1px solid ${OD_HUE}33`, fontWeight: 600, whiteSpace: "nowrap" }}>docs →</a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ---------- IMPORT/EXPORT ---------- */}
        {view === "io" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ border: "1px solid #16202f", borderRadius: 11, background: "#0b0f18", padding: "16px 18px" }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: "#22c55e", marginBottom: 10, letterSpacing: 0.5 }}>// dışa aktar — düz metin .env üret</div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.6 }}>
                Kasa şifreli durur; <code style={{ color: "#a5f3fc", fontFamily: mono }}>.env</code> yalnızca burada <b style={{ color: "#e2e8f0" }}>açıkça</b> ürettiğinde diske yazılır. İndir ya da <code style={{ color: "#a5f3fc", fontFamily: mono }}>~/.apikasa/.env</code>'e yaz, projene koy, <code style={{ color: "#a5f3fc", fontFamily: mono }}>.gitignore</code>'a ekle. Terminalden istersen: <code style={{ color: "#a5f3fc", fontFamily: mono }}>apikasa export &gt; .env</code>
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={downloadEnv} disabled={!entries.length} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #22c55e55", background: "#052e16", color: "#4ade80", fontFamily: mono, fontSize: 12.5, fontWeight: 600, cursor: entries.length ? "pointer" : "default" }}>↓ .env indir</button>
                <button onClick={exportToDisk} disabled={!entries.length} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${AMBER}55`, background: AMBER + "18", color: AMBER, fontFamily: mono, fontSize: 12.5, fontWeight: 600, cursor: entries.length ? "pointer" : "default" }}>⤓ ~/.apikasa/.env'e yaz</button>
                <button onClick={() => copy(buildEnv(), "envall")} disabled={!entries.length} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #1e2738", background: "#121a28", color: copied === "envall" ? "#4ade80" : "#94a3b8", fontFamily: mono, fontSize: 12.5, fontWeight: 600, cursor: entries.length ? "pointer" : "default" }}>{copied === "envall" ? "✓ kopyalandı" : "⧉ panoya kopyala"}</button>
              </div>
              {entries.length > 0 && (
                <pre style={{ marginTop: 12, background: "#060911", borderRadius: 7, padding: "12px 14px", fontSize: 11.5, color: "#7dd3fc", overflowX: "auto", border: "1px solid #16202f", fontFamily: mono, maxHeight: 180, lineHeight: 1.55 }}>{buildEnv()}</pre>
              )}
            </div>

            <div style={{ border: "1px solid #16202f", borderRadius: 11, background: "#0b0f18", padding: "16px 18px" }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: AMBER, marginBottom: 10, letterSpacing: 0.5 }}>// içe aktar — mevcut .env yükle</div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.6 }}>
                Var olan bir <code style={{ color: "#a5f3fc", fontFamily: mono }}>.env</code> içeriğini yapıştır ya da dosya seç. <code style={{ color: "#a5f3fc", fontFamily: mono }}>KEY=value</code> satırları okunur, aynı isimli key güncellenir.
              </p>
              <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder={"GEMINI_API_KEY=...\nGROQ_API_KEY=..."} rows={5}
                style={{ width: "100%", boxSizing: "border-box", background: "#060911", border: "1px solid #16202f", borderRadius: 7, color: "#e2e8f0", fontFamily: mono, fontSize: 12, padding: "10px 12px", outline: "none", resize: "vertical" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <button onClick={() => importText.trim() && parseImport(importText)} disabled={!importText.trim()} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${AMBER}55`, background: AMBER + "18", color: AMBER, fontFamily: mono, fontSize: 12.5, fontWeight: 600, cursor: importText.trim() ? "pointer" : "default" }}>↑ metinden içe aktar</button>
                <button onClick={() => fileRef.current?.click()} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #1e2738", background: "#121a28", color: "#94a3b8", fontFamily: mono, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>📁 .env dosyası seç</button>
                <input ref={fileRef} type="file" accept=".env,.txt,text/plain" onChange={onFile} style={{ display: "none" }} />
              </div>
            </div>
          </div>
        )}

        {/* security footer */}
        <div style={{ marginTop: 22, border: "1px solid #16202f", borderRadius: 10, background: "#0b0f18", padding: "13px 17px" }}>
          <p style={{ margin: 0, fontFamily: mono, fontSize: 11, color: "#64748b", lineHeight: 1.9 }}>
            <span style={{ color: AMBER }}>[şifreli]</span> kasa <span style={{ color: "#a5f3fc" }}>~/.apikasa/vault.enc</span>'de master parolayla şifreli durur, hiçbir buluta gitmez ·{" "}
            <span style={{ color: AMBER }}>[parola]</span> master parola unutulursa kurtarma yoktur — güvenli bir yerde sakla ·{" "}
            <span style={{ color: AMBER }}>[git]</span> indirdiğin <span style={{ color: "#a5f3fc" }}>.env</span>'i her zaman <span style={{ color: "#a5f3fc" }}>.gitignore</span>'a ekle
          </p>
        </div>
      </div>
    </div>
  );
}
