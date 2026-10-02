function isPrime(num) {
  // Bilangan prima harus lebih dari 1
  if (num <= 1) {
    return false;
  }
  
  // Cek apakah ada pembagi selain 1 dan dirinya sendiri
  // Kita cukup mengecek sampai akar kuadrat dari num untuk efisiensi
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false; // Jika habis dibagi, berarti bukan prima
    }
  }
  
  return true; // Jika tidak ada yang habis dibagi, berarti prima
}

// Ekspor fungsi isPrime sebagai named export menggunakan module.exports
module.exports = {
  isPrime
};