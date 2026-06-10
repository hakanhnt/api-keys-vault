import { useState, useEffect, useRef } from "react";

const AMBER = "#f5b942";
const mono = "'JetBrains Mono','SF Mono',ui-monospace,monospace";
const sans = "'Inter',system-ui,sans-serif";
// Lokal FastAPI backend adresi
const API_BASE = "http://localhost:8000";

// Hızlı ekleme için kompakt katalog (ad + docs)
const CATALOG = [
  { c: "AI / LLM", hue: "#a78bfa", items: [["Google Gemini", "https://aistudio.google.com"], ["Groq", "https://console.groq.com"], ["OpenRouter", "https://openrouter.ai"], ["Mistral AI", "https://console.mistral.ai"], ["Cohere", "https://cohere.com"], ["Cerebras", "https://cloud.cerebras.ai"], ["HuggingFace", "https://huggingface.co"]] },
  { c: "Görsel / Video", hue: "#f472b6", items: [["Replicate", "https://replicate.com"], ["Cloudinary", "https://cloudinary.com"], ["remove.bg", "https://remove.bg/api"], ["Unsplash", "https://unsplash.com/developers"], ["Mux", "https://mux.com"], ["Shotstack", "https://shotstack.io"]] },
  { c: "Ses", hue: "#fb7185", items: [["ElevenLabs", "https://elevenlabs.io"], ["Deepgram", "https://deepgram.com"]] },
  { c: "Çeviri", hue: "#2dd4bf", items: [["DeepL", "https://deepl.com/pro-api"]] },
  { c: "E-posta", hue: "#34d399", items: [["Resend", "https://resend.com"], ["Brevo", "https://brevo.com"], ["Mailgun", "https://mailgun.com"]] },
  { c: "SMS / Bildirim", hue: "#f87171", items: [["OneSignal", "https://onesignal.com"], ["Twilio", "https://twilio.com"], ["Telegram Bot", "https://core.telegram.org/bots/api"]] },
  { c: "Realtime", hue: "#22d3ee", items: [["Pusher", "https://pusher.com"], ["Ably", "https://ably.com"]] },
  { c: "Harita / IP", hue: "#60a5fa", items: [["Mapbox", "https://mapbox.com"], ["OpenRouteService", "https://openrouteservice.org"]] },
  { c: "Finans", hue: "#fbbf24", items: [["Alpha Vantage", "https://alphavantage.co"], ["Finnhub", "https://finnhub.io"], ["TCMB EVDS", "https://evds2.tcmb.gov.tr"]] },
  { c: "Ödeme", hue: "#a3e635", items: [["iyzico", "https://iyzico.com"], ["Stripe", "https://stripe.com"]] },
  { c: "Veritabanı", hue: "#c084fc", items: [["Supabase", "https://supabase.com"], ["Neon", "https://neon.tech"], ["Upstash", "https://upstash.com"], ["Turso", "https://turso.tech"]] },
  { c: "Vektör / RAG", hue: "#818cf8", items: [["Pinecone", "https://pinecone.io"], ["Qdrant", "https://qdrant.tech"]] },
  { c: "Depolama", hue: "#fdba74", items: [["Cloudflare R2", "https://developers.cloudflare.com/r2"], ["ImgBB", "https://api.imgbb.com"]] },
  { c: "Auth", hue: "#4ade80", items: [["Clerk", "https://clerk.com"]] },
  { c: "Doküman / OCR", hue: "#fb923c", items: [["OCR.space", "https://ocr.space"], ["PDF.co", "https://pdf.co"]] },
  { c: "Analitik", hue: "#f0abfc", items: [["PostHog", "https://posthog.com"]] },
  { c: "Güvenlik", hue: "#fca5a5", items: [["AbuseIPDB", "https://abuseipdb.com"]] },
  { c: "Üretkenlik", hue: "#94a3b8", items: [["Notion", "https://developers.notion.com"], ["Airtable", "https://airtable.com/developers"], ["GitHub", "https://docs.github.com/rest"]] },
  { c: "Açık Veri", hue: "#7dd3fc", items: [["NASA", "https://api.nasa.gov"], ["NewsAPI", "https://newsapi.org"]] },
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

  // ---- load
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/vault`);
        if (!res.ok) throw new Error("backend yanıt vermedi");
        const data = await res.json();
        setEntries(data.entries || []);
        setEnvPath(data.env_path || "");
        setPersists(true);
      } catch {
        setPersists(false); // backend kapalı — sadece bu oturum
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = async (next) => {
    setEntries(next);
    try {
      const res = await fetch(`${API_BASE}/api/vault`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: next }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.env_path) setEnvPath(data.env_path);
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
    items: c.items.filter(([n]) => !q || n.toLowerCase().includes(q.toLowerCase()) || c.c.toLowerCase().includes(q.toLowerCase())),
  })).filter((c) => c.items.length);

  const vaultFiltered = entries.filter((e) => !q || e.name.toLowerCase().includes(q.toLowerCase()) || e.env.toLowerCase().includes(q.toLowerCase()) || e.cat.toLowerCase().includes(q.toLowerCase()));

  const tabBtn = (id, label) => (
    <button onClick={() => { setView(id); }}
      style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${view === id ? AMBER : "#1e2738"}`, cursor: "pointer", fontFamily: mono, fontSize: 12.5, fontWeight: 600, background: view === id ? AMBER + "18" : "#0c1018", color: view === id ? AMBER : "#64748b" }}>
      {label}
    </button>
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
          </div>
          <h1 style={{ fontFamily: mono, fontSize: 25, fontWeight: 700, color: "#f8fafc", margin: 0, letterSpacing: -0.5 }}>
            ANAHTAR<span style={{ color: AMBER }}>://</span>KASA
          </h1>
          <p style={{ fontFamily: mono, fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.7 }}>
            <span style={{ color: AMBER }}>{entries.length}</span> kayıt · <span style={{ color: "#22c55e" }}>{filled}</span> dolu key ·
            {persists
              ? <span style={{ color: "#22c55e" }}> backend bağlı · .env diske yazılıyor</span>
              : <span style={{ color: "#ef4444" }}> backend kapalı — değişiklikler kaydedilmiyor</span>}
            {envPath && <><br /><span style={{ color: "#475569" }}>{envPath}</span></>}
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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {catalogFiltered.map((c) => (
              <div key={c.c}>
                <div style={{ fontFamily: mono, fontSize: 11, color: c.hue, marginBottom: 8, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: c.hue }} /> {c.c}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {c.items.map(([n, url]) => {
                    const inVault = entries.some((e) => e.env === toEnvVar(n));
                    return (
                      <button key={n} onClick={() => addEntry(n, c.c, toEnvVar(n))} disabled={inVault}
                        style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${inVault ? "#1a2334" : c.hue + "44"}`, background: inVault ? "#0c1018" : c.hue + "12", color: inVault ? "#334155" : "#e2e8f0", fontFamily: sans, fontSize: 12.5, cursor: inVault ? "default" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        {inVault ? "✓ " : "+ "}{n}
                      </button>
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
              <div style={{ fontFamily: mono, fontSize: 11, color: "#22c55e", marginBottom: 10, letterSpacing: 0.5 }}>// dışa aktar — yeni projeye taşı</div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.6 }}>
                Dolu key'leri gerçek bir <code style={{ color: "#a5f3fc", fontFamily: mono }}>.env</code> dosyası olarak indir, yeni projenin köküne koy, <code style={{ color: "#a5f3fc", fontFamily: mono }}>.gitignore</code>'a ekle. Boş key'ler yorum satırı olarak iner.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={downloadEnv} disabled={!entries.length} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid #22c55e55", background: "#052e16", color: "#4ade80", fontFamily: mono, fontSize: 12.5, fontWeight: 600, cursor: entries.length ? "pointer" : "default" }}>↓ .env indir</button>
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
            <span style={{ color: AMBER }}>[depo]</span> key'ler lokal makinende <span style={{ color: "#a5f3fc" }}>~/.apikasa/.env</span> dosyasına yazılır, hiçbir buluta gitmez ·{" "}
            <span style={{ color: AMBER }}>[bilinç]</span> bu uçtan uca şifreli bir kasa değildir, gerçek production sırları için bir secret manager kullan ·{" "}
            <span style={{ color: AMBER }}>[git]</span> indirdiğin <span style={{ color: "#a5f3fc" }}>.env</span>'i her zaman <span style={{ color: "#a5f3fc" }}>.gitignore</span>'a ekle
          </p>
        </div>
      </div>
    </div>
  );
}
