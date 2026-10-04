import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from './middleware/authenticate.js';
import { authorizeModification } from './middleware/authorize.js';
import { 
  getUserByUsername, 
  getWatchlist, 
  addMovieToWatchlist, 
  updateMovieInWatchlist, 
  removeMovieFromWatchlist 
} from './utils/db.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- Route Autentikasi ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // 1. Cek jika username atau password tidak ada
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // 2. Cek apakah user ada
  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 3. Cek apakah password cocok
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 4. Buat dan kirim token JWT
  const token = jwt.sign(
    { id: user.id, role: user.role, username: user.username }, 
    process.env.JWT_SECRET
  );

  res.status(200).json({ token });
});

// --- Route Watchlist ---
// GET: Mengambil watchlist (middleware authenticate saja, semua user yang login bisa melihat)
app.get('/api/watchlist/:userId', authenticate, async (req, res) => {
  const watchlist = await getWatchlist(req.params.userId);
  res.status(200).json(watchlist);
});

// POST: Menambah film (butuh authorizeModification)
app.post('/api/watchlist/:userId/movies', authenticate, authorizeModification, async (req, res) => {
  const movie = await addMovieToWatchlist(req.params.userId, req.body);
  res.status(201).json(movie);
});

// PUT: Mengupdate film (butuh authorizeModification)
app.put('/api/watchlist/:userId/movies/:movieId', authenticate, authorizeModification, async (req, res) => {
  const movie = await updateMovieInWatchlist(req.params.userId, req.params.movieId, req.body);
  res.status(200).json(movie);
});

// DELETE: Menghapus film (butuh authorizeModification)
app.delete('/api/watchlist/:userId/movies/:movieId', authenticate, authorizeModification, async (req, res) => {
  await removeMovieFromWatchlist(req.params.userId, req.params.movieId);
  res.status(200).json({ message: "Movie removed successfully" });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});