import express from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import watchlistRoutes from "./routes/watchlist.js";
import { findByUsername } from "./utils/db.js";

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET belum di-set di .env");
const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

// Route Autentikasi (Login)
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // 1. Cek jika username atau password tidak ada
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // 2. Cek apakah user ada
  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 3. Cek apakah password cocok dengan hash yang tersimpan
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 4. Buat dan kirim token JWT
  // PASTIKAN id adalah Number (parseInt)
  const token = jwt.sign(
    { 
      id: parseInt(user.id, 10),  // Pastikan ini Number
      role: user.role, 
      username: user.username 
    }, 
    JWT_SECRET
  );

  res.status(200).json({ token });
});

// Mount route watchlist
app.use("/api/watchlist", watchlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});