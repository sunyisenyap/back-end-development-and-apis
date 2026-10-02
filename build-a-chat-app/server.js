import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

// Setup __dirname untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

// 1. Buat HTTP server yang membaca ./public/index.html
const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading index.html');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// 2. Buat WebSocketServer dan hubungkan ke HTTP server
const wss = new WebSocketServer({ server });

// Fungsi helper untuk broadcast pesan ke semua client yang terhubung
const broadcast = (message) => {
  const messageString = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = WebSocket.OPEN
      client.send(messageString);
    }
  });
};

// 3. Register listener 'connection'
wss.on('connection', (socket, req) => {
  // 4. Parse username dari query string URL
  const username = new URL(req.url, "http://localhost").searchParams.get("username") || "Anonymous";
  
  // Simpan username di objek socket agar bisa digunakan saat event 'close'
  socket.username = username;

  // 5. Broadcast pesan sistem saat user bergabung
  broadcast({ type: "system", text: `${username} joined` });

  // 6. Register listener 'message'
  socket.on('message', (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      broadcast({
        type: 'chat',
        username: parsedData.username,
        text: parsedData.text
      });
    } catch (e) {
      console.error("Invalid JSON received");
    }
  });

  // 7. Register listener 'close'
  socket.on('close', () => {
    // Perbaikan typo di sini: menggunakan tanda kutip yang konsisten
    broadcast({ type: 'system', text: `${socket.username} left` });
  });
});

// 8. Mulai server
server.listen(PORT, () => {
  console.log(`Chat server running at http://localhost:${PORT}`);
});