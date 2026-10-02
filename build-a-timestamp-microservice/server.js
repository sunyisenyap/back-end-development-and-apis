import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line

// Route untuk /api/:date (ketika ada parameter tanggal)
app.get("/api/:date", (req, res) => {
  const dateString = req.params.date;
  let dateObject;

  // Cek apakah input berupa angka (Unix timestamp)
  if (/^\d+$/.test(dateString)) {
    dateObject = new Date(parseInt(dateString));
  } else {
    // Jika bukan angka, coba parse sebagai string tanggal biasa
    dateObject = new Date(dateString);
  }

  // Cek apakah tanggal valid
  if (isNaN(dateObject.getTime())) {
    res.json({ error: "Invalid Date" });
  } else {
    res.json({
      unix: dateObject.getTime(),
      utc: dateObject.toUTCString()
    });
  }
});

// Route untuk /api (ketika tidak ada parameter / kosong)
app.get("/api", (req, res) => {
  const dateObject = new Date();
  res.json({
    unix: dateObject.getTime(),
    utc: dateObject.toUTCString()
  });
});

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});