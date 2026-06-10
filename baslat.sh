#!/usr/bin/env bash
# ANAHTAR://KASA — tek komutla başlat (macOS / Linux)
# İlk çalıştırmada bağımlılıkları kurar, sonra backend + frontend'i ayağa kaldırır.
set -e
cd "$(dirname "$0")"

echo "▮ ANAHTAR://KASA başlatılıyor..."

# ---- Backend (FastAPI) ----
cd backend
if [ ! -d ".venv" ]; then
  echo "» Python sanal ortamı kuruluyor..."
  python3 -m venv .venv
  ./.venv/bin/pip install -q -r requirements.txt
fi
echo "» Backend → http://localhost:8000"
./.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ..

# ---- Frontend (Vite) ----
cd frontend
if [ ! -d "node_modules" ]; then
  echo "» Frontend bağımlılıkları kuruluyor..."
  npm install --silent
fi
echo "» Arayüz → http://localhost:5173"
npm run dev &
FRONTEND_PID=$!
cd ..

# Ctrl+C ile ikisini de durdur
trap "echo; echo '⏹  durduruluyor...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
echo ""
echo "✓ Hazır. Tarayıcıda aç: http://localhost:5173"
echo "  (durdurmak için Ctrl+C)"
wait
