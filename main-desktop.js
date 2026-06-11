const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const net = require("net");
const http = require("http");

let mainWindow;
let backendProcess;
let backendPort;

// Boş bir port bul
function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => {
        resolve(port);
      });
    });
  });
}

// Backend'in hazır olup olmadığını kontrol et
function checkHealth(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    req.on("error", () => {
      resolve(false);
    });
    req.end();
  });
}

// Backend'in ayağa kalkmasını bekle
async function waitForBackend(port, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const healthy = await checkHealth(port);
    if (healthy) return true;
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

// Backend sürecini başlat
function startBackend(port) {
  const isPackaged = app.isPackaged;
  let cmd, args;

  if (isPackaged) {
    // Paketlemiş uygulama: ikili dosya Resources klasöründedir
    cmd = path.join(process.resourcesPath, "apikasa-backend");
    args = ["--port", port.toString()];
  } else {
    // Geliştirme modu: Yerel sanal ortamdaki python'ı kullan
    const pythonExecutable = process.platform === "win32" ? "python.exe" : "python3";
    cmd = path.join(__dirname, "backend", ".venv", "bin", pythonExecutable);
    args = [path.join(__dirname, "backend", "main.py"), "--port", port.toString()];
  }

  console.log(`[Electron] Backend başlatılıyor: ${cmd} ${args.join(" ")}`);

  backendProcess = spawn(cmd, args, {
    cwd: isPackaged ? process.resourcesPath : __dirname,
    env: { ...process.env, PYTHONUNBUFFERED: "1" }
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`[Backend STDOUT] ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`[Backend STDERR] ${data}`);
  });

  backendProcess.on("close", (code) => {
    console.log(`[Backend] Süreç kapandı. Çıkış kodu: ${code}`);
    backendProcess = null;
    if (code !== 0 && code !== null) {
      app.quit();
    }
  });
}

async function createWindow() {
  try {
    backendPort = await getFreePort();
  } catch (err) {
    console.error("[Electron] Boş port bulunamadı, varsayılan 8000 kullanılacak.", err);
    backendPort = 8000;
  }

  startBackend(backendPort);

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    title: "ANAHTAR://KASA",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Backend'in hazır olmasını bekle ve arayüzü yükle
  const ready = await waitForBackend(backendPort);
  if (ready) {
    mainWindow.loadURL(`http://127.0.0.1:${backendPort}`);
  } else {
    console.error("[Electron] Backend zaman aşımı süresinde yanıt vermedi.");
    mainWindow.loadURL(`http://127.0.0.1:${backendPort}`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  cleanupBackend();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("will-quit", () => {
  cleanupBackend();
});

function cleanupBackend() {
  if (backendProcess) {
    console.log("[Electron] Backend süreci sonlandırılıyor...");
    backendProcess.kill("SIGINT");
    backendProcess = null;
  }
}
