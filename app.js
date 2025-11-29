const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/buku", (req, res) => {
  db.query("SELECT * FROM buku", (err, result) => {
    if (err) {
      console.error("DB error (GET /buku):", err);
      return res
        .status(500)
        .json({ error: "Gagal mengambil data buku", detail: err.message });
    }
    res.json(result);
  });
});

app.get("/buku/:id", (req, res) => {
  const id_buku = req.params.id;
  db.query("SELECT * FROM buku WHERE id_buku=?", [id_buku], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Server error", detail: err.message });
    if (result.length === 0)
      return res
        .status(404)
        .json({ error: "Buku tidak ditemukan", id: id_buku });
    res.json(result[0]);
  });
});

app.post("/buku", (req, res) => {
  const { judul, penulis, penerbit, tahun_terbit, stok } = req.body;

  if (!judul || !penulis || tahun_terbit == null || stok == null) {
    return res.status(400).json({ error: "harus di isi ya" });
  }

  if (isNaN(tahun_terbit) || isNaN(stok)) {
    return res
      .status(400)
      .json({ error: "tahun terbit dan stok harus berupa angka" });
  }

  db.query(
    "INSERT INTO buku (judul, penulis, penerbit, tahun terbit, stok) VALUES (?, ?, ?, ?, ?)",
    [judul, penulis, penerbit, tahun_terbit, stok],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal menyimpan buku", detail: err.message });
      res.json({ message: "Buku ditambahkan!", id: result.insertId });
    }
  );
});

app.put("/buku/:id", (req, res) => {
  const id_buku = req.params.id;
  const { judul, penulis, penerbit, tahun_terbit, stok } = req.body;

  if (!judul || !penulis || tahun_terbit == null || stok == null) {
    return res.status(400).json({ error: "harus di isi ya" });
  }

  if (isNaN(tahun_terbit) || isNaN(stok)) {
    return res
      .status(400)
      .json({ error: "tahun terbit dan stok harus berupa angka" });
  }

  db.query(
    "UPDATE buku SET judul=?, penulis=?, penerbit=?, tahun_terbit=?, stok=? WHERE id_buku=?",
    [judul, penulis, penerbit, tahun_terbit, stok, id_buku],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal update buku", detail: err.message });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ error: "Buku tidak ditemukan", id: id_buku });
      res.json({ message: `Buku ID ${id_buku} berhasil diupdate` });
    }
  );
});

app.delete("/buku/:id", (req, res) => {
  const id_buku = req.params.id;
  db.query("DELETE FROM buku WHERE id_buku=?", [id_buku], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Gagal menghapus buku", detail: err.message });
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ error: "Buku tidak ditemukan", id: id_buku });
    res.json({ message: `Buku ID ${id_buku} berhasil dihapus` });
  });
});

app.use((req, res) => {
  res
    .status(404)
    .json({ error: "Route tidak ditemukan", path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error("error:", err);
  res.status(500).json({ error: "server error", detail: err.message });
});

app.listen(3000, () =>
  console.log("Server berjalan di port http://localhost:3000")
);
