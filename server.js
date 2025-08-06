const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");

// 🌍 Environment variables
require('dotenv').config();

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "gizli-anahtar-2024";

// 🌐 Domain configuration
const DOMAIN = process.env.DOMAIN || 'localhost:3001';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const BASE_URL = IS_PRODUCTION ? `https://${DOMAIN}` : `http://localhost:3001`;

// 📁 Uploads klasörünü oluştur
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 🖼️ Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
  }
});

// 🔧 Middleware'ler önce gelmeli!
const corsOptions = {
  origin: IS_PRODUCTION 
    ? ['https://istakip.elsatekstil.com.tr', 'https://elsatekstil.com.tr']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" })); // veya app.use(express.json());

// 🖼️ Static files serving for images
app.use('/uploads', express.static(uploadsDir));

// 📤 Resim upload endpoint'i
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resim dosyası bulunamadı!' });
    }

    const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname
    });
  } catch (error) {
    console.error('Resim upload hatası:', error);
    res.status(500).json({ error: 'Resim yüklenirken hata oluştu!' });
  }
});

// 🖼️ Resim dosyasını getirme endpoint'i
app.get('/api/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'Resim bulunamadı!' });
  }
});

// 🏥 Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'İş Takip Backend API çalışıyor! 🚀'
  });
});

// ✉️ Mail ayarları (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "smhtrn2016@gmail.com",
    pass: "NVUMKFLYPFVBKEGB", // Gmail uygulama şifresi
  },
  tls: {
    rejectUnauthorized: false, // Sertifika hatalarını yoksay
  },
});

// 📬 Mail gönderme endpoint'i
app.post("/send-email", async (req, res) => {
  const { to, subject, html } = req.body;

  console.log("💬 Gelen body:", req.body); // ✅ burada olması güvenli

  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Eksik parametre: to / subject / html" });
  }

  try {
    await transporter.sendMail({
      from: '"İş Takip Sistemi" <smhtrn2016@gmail.com>',
      to,
      subject,
      html,
    });

    console.log("📨 Mail gönderildi:", to);
    res.status(200).json({ message: "Mail gönderildi" });
  } catch (error) {
    console.error("📛 Mail gönderme hatası:", error.message);
    res.status(500).json({ error: "Mail gönderilemedi" });
  }
});

// 📁 JSON dosyaları
const dataKlasoru = path.join(__dirname, "data");
const siparisDosyaYolu = path.join(dataKlasoru, "siparisler.json");
const gorevDosyaYolu = path.join(dataKlasoru, "gorevler.json");
const numuneDosyaYolu = path.join(dataKlasoru, "numuneler.json"); 
const stokDosyaYolu = path.join(dataKlasoru, "stoklar.json");
const stokTurleriDosyaYolu = path.join(dataKlasoru, "stokTurleri.json");
const musteriDosyaYolu = path.join(dataKlasoru, "musteriler.json");
const tedarikciDosyaYolu = path.join(dataKlasoru, "tedarikciler.json");
const satinalmasiparislerDosyaYolu = path.join(dataKlasoru, "satinalma-siparisleri.json");
const onayKurallariDosyaYolu = path.join(dataKlasoru, "onay-kurallari.json");
const bekleyenOnaylarDosyaYolu = path.join(dataKlasoru, "bekleyen-onaylar.json");
const onayGecmisiDosyaYolu = path.join(dataKlasoru, "onay-gecmisi.json");
const sozlesmelerDosyaYolu = path.join(dataKlasoru, "sozlesmeler.json");
const fiyatListeleriDosyaYolu = path.join(dataKlasoru, "fiyat-listeleri.json");
const tedarikciPerformansDosyaYolu = path.join(dataKlasoru, "tedarikci-performans.json");
const numuneUcretleriDosyaYolu = path.join(dataKlasoru, "numune-ucretleri.json");
if (!fs.existsSync(musteriDosyaYolu)) fs.writeFileSync(musteriDosyaYolu, "[]");
if (!fs.existsSync(tedarikciDosyaYolu)) fs.writeFileSync(tedarikciDosyaYolu, "[]");
if (!fs.existsSync(satinalmasiparislerDosyaYolu)) fs.writeFileSync(satinalmasiparislerDosyaYolu, "[]");
if (!fs.existsSync(onayKurallariDosyaYolu)) fs.writeFileSync(onayKurallariDosyaYolu, "[]");
if (!fs.existsSync(bekleyenOnaylarDosyaYolu)) fs.writeFileSync(bekleyenOnaylarDosyaYolu, "[]");
if (!fs.existsSync(onayGecmisiDosyaYolu)) fs.writeFileSync(onayGecmisiDosyaYolu, "[]");
if (!fs.existsSync(sozlesmelerDosyaYolu)) fs.writeFileSync(sozlesmelerDosyaYolu, "[]");
if (!fs.existsSync(fiyatListeleriDosyaYolu)) fs.writeFileSync(fiyatListeleriDosyaYolu, "[]");
if (!fs.existsSync(tedarikciPerformansDosyaYolu)) fs.writeFileSync(tedarikciPerformansDosyaYolu, "[]");
if (!fs.existsSync(numuneUcretleriDosyaYolu)) fs.writeFileSync(numuneUcretleriDosyaYolu, "[]");

// 📁 Klasör ve dosya yoksa oluştur
if (!fs.existsSync(dataKlasoru)) fs.mkdirSync(dataKlasoru);
if (!fs.existsSync(siparisDosyaYolu)) fs.writeFileSync(siparisDosyaYolu, "[]");
if (!fs.existsSync(gorevDosyaYolu)) fs.writeFileSync(gorevDosyaYolu, "[]");
if (!fs.existsSync(numuneDosyaYolu)) fs.writeFileSync(numuneDosyaYolu, "[]");
if (!fs.existsSync(stokDosyaYolu)) fs.writeFileSync(stokDosyaYolu, "[]");
if (!fs.existsSync(stokTurleriDosyaYolu)) fs.writeFileSync(stokTurleriDosyaYolu, '["İplik","Kumaş","Aksesuar"]');
if (!fs.existsSync(musteriDosyaYolu)) fs.writeFileSync(musteriDosyaYolu, "[]"); // 📁 Müşteri dosyası yoksa oluştur

// ✅ SIPARİŞ API
app.post("/api/siparis", (req, res) => {
  const siparis = req.body;
  console.log("📥 Yeni sipariş alındı:", siparis);

  fs.readFile(siparisDosyaYolu, "utf8", (err, data) => {
    const siparisler = !err && data ? JSON.parse(data) : [];
    siparisler.push(siparis);

    fs.writeFile(siparisDosyaYolu, JSON.stringify(siparisler, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Kayıt hatası" });
      res.status(200).json({ message: "Sipariş kaydedildi", data: siparis });
    });
  });
});

app.get("/api/siparisler", (req, res) => {
  fs.readFile(siparisDosyaYolu, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Veri okunamadı" });
    res.json(JSON.parse(data || "[]"));
  });
});

app.delete("/api/siparis/:index", (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile(siparisDosyaYolu, "utf8", (err, data) => {
    let siparisler = JSON.parse(data || "[]");
    if (index < 0 || index >= siparisler.length)
      return res.status(404).json({ error: "Geçersiz index" });

    siparisler.splice(index, 1);
    fs.writeFile(siparisDosyaYolu, JSON.stringify(siparisler, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Silme hatası" });
      res.json({ message: "Sipariş silindi" });
    });
  });
});

app.put("/api/siparis/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const yeniVeri = req.body;
  fs.readFile(siparisDosyaYolu, "utf8", (err, data) => {
    let siparisler = JSON.parse(data || "[]");
    if (index < 0 || index >= siparisler.length)
      return res.status(404).json({ error: "Geçersiz index" });

    siparisler[index] = yeniVeri;
    fs.writeFile(siparisDosyaYolu, JSON.stringify(siparisler, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Güncelleme hatası" });
      res.json({ message: "Sipariş güncellendi" });
    });
  });
});

// 📁 Numuneleri listele
app.get("/api/numuneler", (req, res) => {
  fs.readFile(numuneDosyaYolu, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Numune verisi okunamadı" });
    res.json(JSON.parse(data || "[]"));
  });
});

// 🗑 Numune sil
app.delete("/api/numune/:index", (req, res) => {
  const index = parseInt(req.params.index);

  fs.readFile(numuneDosyaYolu, "utf8", (err, data) => {
    let kayitlar = JSON.parse(data || "[]");
    if (index < 0 || index >= kayitlar.length)
      return res.status(404).json({ error: "Geçersiz index" });

    kayitlar.splice(index, 1);

    fs.writeFile(numuneDosyaYolu, JSON.stringify(kayitlar, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Silme hatası" });
      res.json({ message: "Silindi" });
    });
  });
});

// ✅ GÖREV API
app.get("/api/gorevler", (req, res) => {
  fs.readFile(gorevDosyaYolu, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Görevler okunamadı" });
    res.json(JSON.parse(data || "[]"));
  });
});

app.post("/api/gorev", (req, res) => {
  const yeniGorev = req.body;
  fs.readFile(gorevDosyaYolu, "utf8", (err, data) => {
    const gorevler = !err && data ? JSON.parse(data) : [];
    gorevler.push(yeniGorev);

    fs.writeFile(gorevDosyaYolu, JSON.stringify(gorevler, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Görev kaydedilemedi" });
      res.status(200).json({ message: "Görev kaydedildi" });
    });
  });
});

app.delete("/api/gorev/:index", (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile(gorevDosyaYolu, "utf8", (err, data) => {
    let gorevler = JSON.parse(data || "[]");
    if (index < 0 || index >= gorevler.length)
      return res.status(404).json({ error: "Geçersiz index" });

    gorevler.splice(index, 1);
    fs.writeFile(gorevDosyaYolu, JSON.stringify(gorevler, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Silme hatası" });
      res.json({ message: "Görev silindi" });
    });
  });
});

// 📤 Numune POST
app.post("/api/numune", (req, res) => {
  const yeni = req.body;
  const mevcut = JSON.parse(fs.readFileSync(numuneDosyaYolu, "utf8") || "[]");
  mevcut.push(yeni);
  fs.writeFileSync(numuneDosyaYolu, JSON.stringify(mevcut, null, 2));
  res.status(200).json({ message: "Kayıt başarılı" });
});

// 📥 Numune GET
app.get("/api/numuneler", (req, res) => {
  const veriler = JSON.parse(fs.readFileSync(numuneDosyaYolu, "utf8") || "[]");
  res.json(veriler);
});

// 🗑 Numune DELETE
app.delete("/api/numune/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const veriler = JSON.parse(fs.readFileSync(numuneDosyaYolu, "utf8") || "[]");
  veriler.splice(index, 1);
  fs.writeFileSync(numuneDosyaYolu, JSON.stringify(veriler, null, 2));
  res.json({ message: "Silindi" });
});

// 🔄 Numune güncelle
app.put("/api/numune/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const yeniVeri = req.body;
  const veriler = JSON.parse(fs.readFileSync(numuneDosyaYolu, "utf8") || "[]");

  if (index < 0 || index >= veriler.length)
    return res.status(404).json({ error: "Geçersiz index" });

  veriler[index] = yeniVeri;

  fs.writeFileSync(numuneDosyaYolu, JSON.stringify(veriler, null, 2));
  res.json({ message: "Güncelleme başarılı" });
});

// Stokları listele
app.get("/api/stoklar", (req, res) => {
  fs.readFile(stokDosyaYolu, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Stok verisi okunamadı" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Stok ekle
app.post("/api/stok", (req, res) => {
  const yeniStok = req.body;
  fs.readFile(stokDosyaYolu, "utf8", (err, data) => {
    const stoklar = !err && data ? JSON.parse(data) : [];
    stoklar.push(yeniStok);
    fs.writeFile(stokDosyaYolu, JSON.stringify(stoklar, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Kayıt hatası" });
      res.status(200).json({ message: "Stok kaydedildi", data: yeniStok });
    });
  });
});

// Stok sil
app.delete("/api/stok/:index", (req, res) => {
  const index = parseInt(req.params.index);
  fs.readFile(stokDosyaYolu, "utf8", (err, data) => {
    let stoklar = JSON.parse(data || "[]");
    if (index < 0 || index >= stoklar.length)
      return res.status(404).json({ error: "Geçersiz index" });
    stoklar.splice(index, 1);
    fs.writeFile(stokDosyaYolu, JSON.stringify(stoklar, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Silme hatası" });
      res.json({ message: "Stok silindi" });
    });
  });
});

// Stok güncelle
app.put("/api/stok/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const yeniVeri = req.body;
  fs.readFile(stokDosyaYolu, "utf8", (err, data) => {
    let stoklar = JSON.parse(data || "[]");
    if (index < 0 || index >= stoklar.length)
      return res.status(404).json({ error: "Geçersiz index" });
    stoklar[index] = yeniVeri;
    fs.writeFile(stokDosyaYolu, JSON.stringify(stoklar, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Güncelleme hatası" });
      res.json({ message: "Stok güncellendi" });
    });
  });
});

// Stok türlerini getir
app.get("/api/stok-turleri", (req, res) => {
  fs.readFile(stokTurleriDosyaYolu, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Stok türleri okunamadı" });
    res.json(JSON.parse(data || "[]"));
  });
});

// Yeni stok türü ekle
app.post("/api/stok-turleri", (req, res) => {
  const { yeniTur } = req.body;
  fs.readFile(stokTurleriDosyaYolu, "utf8", (err, data) => {
    let turler = !err && data ? JSON.parse(data) : [];
    if (yeniTur && !turler.includes(yeniTur)) {
      turler.push(yeniTur);
      fs.writeFile(stokTurleriDosyaYolu, JSON.stringify(turler, null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Kayıt hatası" });
        res.status(200).json({ message: "Tür eklendi", turler });
      });
    } else {
      res.status(400).json({ error: "Tür zaten var veya eksik" });
    }
  });
});

// ✅ MÜŞTERİ API - Bu bölümün tam olarak eklendiğinden emin olun
app.get("/api/musteriler", (req, res) => {
  try {
    const data = fs.readFileSync(musteriDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Müşteriler okuma hatası:", err);
    res.status(500).json({ error: "Müşteriler okunamadı" });
  }
});

app.post("/api/musteri", (req, res) => {
  try {
    const yeniMusteri = {
      ...req.body,
      id: Date.now().toString(),
      kayitTarihi: new Date().toLocaleString(),
      paraBirimi: req.body.paraBirimi || "€" // ✅ Para birimi varsayılan değer
    };

    const data = fs.readFileSync(musteriDosyaYolu, "utf8");
    const musteriler = JSON.parse(data || "[]");
    musteriler.push(yeniMusteri);

    fs.writeFileSync(musteriDosyaYolu, JSON.stringify(musteriler, null, 2));
    res.status(200).json({ message: "Müşteri kaydedildi", data: yeniMusteri });
  } catch (err) {
    console.error("❌ Müşteri kaydetme hatası:", err);
    res.status(500).json({ error: "Müşteri kaydedilemedi" });
  }
});

// Müşteri güncelle
app.put("/api/musteri/:id", (req, res) => {
  try {
    const { id } = req.params;
    const guncellenmisMusteri = req.body;

    const data = fs.readFileSync(musteriDosyaYolu, "utf8");
    let musteriler = JSON.parse(data || "[]");

    const index = musteriler.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Müşteri bulunamadı" });
    }

    musteriler[index] = { ...musteriler[index], ...guncellenmisMusteri };
    fs.writeFileSync(musteriDosyaYolu, JSON.stringify(musteriler, null, 2));

    res.json({ message: "Müşteri güncellendi", data: musteriler[index] });
  } catch (err) {
    console.error("❌ Müşteri güncelleme hatası:", err);
    res.status(500).json({ error: "Müşteri güncellenemedi" });
  }
});

// Müşteri sil
app.delete("/api/musteri/:id", (req, res) => {
  try {
    const { id } = req.params;

    const data = fs.readFileSync(musteriDosyaYolu, "utf8");
    let musteriler = JSON.parse(data || "[]");

    const index = musteriler.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Müşteri bulunamadı" });
    }

    musteriler.splice(index, 1);
    fs.writeFileSync(musteriDosyaYolu, JSON.stringify(musteriler, null, 2));

    res.json({ message: "Müşteri silindi" });
  } catch (err) {
    console.error("❌ Müşteri silme hatası:", err);
    res.status(500).json({ error: "Müşteri silinemedi" });
  }
});

// ✅ TEDARİKÇİ API
app.get("/api/tedarikciler", (req, res) => {
  
  try {
    const data = fs.readFileSync(tedarikciDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Tedarikçiler okuma hatası:", err);
    res.status(500).json({ error: "Tedarikçiler okunamadı" });
  }
});

app.post("/api/tedarikci", (req, res) => {
  try {
    const yeniTedarikci = {
      ...req.body,
      id: Date.now().toString(),
      kayitTarihi: new Date().toLocaleString()
    };

    const data = fs.readFileSync(tedarikciDosyaYolu, "utf8");
    const tedarikciler = JSON.parse(data || "[]");
    tedarikciler.push(yeniTedarikci);

    fs.writeFileSync(tedarikciDosyaYolu, JSON.stringify(tedarikciler, null, 2));
    res.status(200).json({ message: "Tedarikçi kaydedildi", data: yeniTedarikci });
  } catch (err) {
    console.error("❌ Tedarikçi kaydetme hatası:", err);
    res.status(500).json({ error: "Tedarikçi kaydedilemedi" });
  }
});

app.put("/api/tedarikci/:id", (req, res) => {
  try {
    const { id } = req.params;
    const guncellenmisTedarikci = req.body;

    const data = fs.readFileSync(tedarikciDosyaYolu, "utf8");
    let tedarikciler = JSON.parse(data || "[]");

    const index = tedarikciler.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Tedarikçi bulunamadı" });
    }

    tedarikciler[index] = { ...tedarikciler[index], ...guncellenmisTedarikci };
    fs.writeFileSync(tedarikciDosyaYolu, JSON.stringify(tedarikciler, null, 2));

    res.json({ message: "Tedarikçi güncellendi", data: tedarikciler[index] });
  } catch (err) {
    console.error("❌ Tedarikçi güncelleme hatası:", err);
    res.status(500).json({ error: "Tedarikçi güncellenemedi" });
  }
});

app.delete("/api/tedarikci/:id", (req, res) => {
  try {
    const { id } = req.params;

    const data = fs.readFileSync(tedarikciDosyaYolu, "utf8");
    let tedarikciler = JSON.parse(data || "[]");

    const index = tedarikciler.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Tedarikçi bulunamadı" });
    }

    tedarikciler.splice(index, 1);
    fs.writeFileSync(tedarikciDosyaYolu, JSON.stringify(tedarikciler, null, 2));

    res.json({ message: "Tedarikçi silindi" });
  } catch (err) {
    console.error("❌ Tedarikçi silme hatası:", err);
    res.status(500).json({ error: "Tedarikçi silinemedi" });
  }
});

// ✅ SATIN ALMA SİPARİŞLERİ API
app.get("/api/satinalma-siparisleri", (req, res) => {
  try {
    const data = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Satın alma siparişleri okuma hatası:", err);
    res.status(500).json({ error: "Satın alma siparişleri okunamadı" });
  }
});

app.post("/api/satinalma-siparis", (req, res) => {
  try {
    const yeniSiparis = {
      ...req.body,
      id: Date.now().toString(),
      olusturmaTarihi: new Date().toLocaleString()
    };

    const data = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    const siparisler = JSON.parse(data || "[]");
    siparisler.push(yeniSiparis);

    fs.writeFileSync(satinalmasiparislerDosyaYolu, JSON.stringify(siparisler, null, 2));
    res.status(200).json({ message: "Satın alma siparişi kaydedildi", data: yeniSiparis });
  } catch (err) {
    console.error("❌ Satın alma siparişi kaydetme hatası:", err);
    res.status(500).json({ error: "Satın alma siparişi kaydedilemedi" });
  }
});

app.delete("/api/satinalma-siparis/:id", (req, res) => {
  try {
    const siparisId = req.params.id;
    const data = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    let siparisler = JSON.parse(data || "[]");

    const index = siparisler.findIndex(s => s.id === siparisId);
    if (index === -1) {
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    siparisler.splice(index, 1);
    fs.writeFileSync(satinalmasiparislerDosyaYolu, JSON.stringify(siparisler, null, 2));

    res.json({ message: "Satın alma siparişi silindi" });
  } catch (err) {
    console.error("❌ Satın alma siparişi silme hatası:", err);
    res.status(500).json({ error: "Satın alma siparişi silinemedi" });
  }
});

// Durum güncelleme endpoint'i
app.patch("/api/satinalma-siparis/:id/durum", (req, res) => {
  try {
    const siparisId = req.params.id;
    const { durum } = req.body;
    
    const data = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    let siparisler = JSON.parse(data || "[]");

    const index = siparisler.findIndex(s => s.id === siparisId);
    if (index === -1) {
      return res.status(404).json({ error: "Sipariş bulunamadı" });
    }

    siparisler[index].durum = durum;
    siparisler[index].guncellemeTarihi = new Date().toLocaleString();
    
    fs.writeFileSync(satinalmasiparislerDosyaYolu, JSON.stringify(siparisler, null, 2));

    res.json({ message: "Sipariş durumu güncellendi", data: siparisler[index] });
  } catch (err) {
    console.error("❌ Sipariş durumu güncelleme hatası:", err);
    res.status(500).json({ error: "Sipariş durumu güncellenemedi" });
  }
});

// ✅ Current user info endpoint
app.get("/api/me", (req, res) => {
  try {
    // Authorization header'dan token al
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Token bulunamadı" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Kullanıcı bilgilerini users.json'dan al
    const usersData = fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8');
    const users = JSON.parse(usersData);
    
    const user = users.find(u => u.username === decoded.username);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    // Güvenli kullanıcı bilgilerini döndür (şifre hariç)
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error("❌ /api/me hatası:", error);
    res.status(401).json({ error: "Geçersiz token" });
  }
});

// ✅ Numune görüntüleme route'u ekle (eğer yoksa)
app.get("/api/numune/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = fs.readFileSync(numuneDosyaYolu, "utf8");
    const numuneler = JSON.parse(data || "[]");
    
    if (id < 0 || id >= numuneler.length) {
      return res.status(404).json({ error: "Numune bulunamadı" });
    }
    
    res.json(numuneler[id]);
  } catch (err) {
    console.error("❌ Numune okuma hatası:", err);
    res.status(500).json({ error: "Numune okunamadı" });
  }
});

// API endpoint'leri

// ✅ ONAY YÖNETİMİ API (mevcut API'ların altına ekleyin)

// Onay kuralları API
app.get("/api/onay-kurallari", (req, res) => {
  try {
    const data = fs.readFileSync(onayKurallariDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Onay kuralları okuma hatası:", err);
    res.status(500).json({ error: "Onay kuralları okunamadı" });
  }
});

app.post("/api/onay-kurallari", (req, res) => {
  try {
    const yeniKural = {
      ...req.body,
      id: Date.now().toString(),
      olusturmaTarihi: new Date().toLocaleString()
    };

    const data = fs.readFileSync(onayKurallariDosyaYolu, "utf8");
    const kurallar = JSON.parse(data || "[]");
    kurallar.push(yeniKural);

    fs.writeFileSync(onayKurallariDosyaYolu, JSON.stringify(kurallar, null, 2));
    res.status(200).json({ message: "Onay kuralı kaydedildi", data: yeniKural });
  } catch (err) {
    console.error("❌ Onay kuralı kaydetme hatası:", err);
    res.status(500).json({ error: "Onay kuralı kaydedilemedi" });
  }
});

// Bekleyen onaylar API
app.get("/api/bekleyen-onaylar", (req, res) => {
  try {
    const data = fs.readFileSync(bekleyenOnaylarDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Bekleyen onaylar okuma hatası:", err);
    res.status(500).json({ error: "Bekleyen onaylar okunamadı" });
  }
});

app.post("/api/onay-talep", (req, res) => {
  try {
    const yeniTalep = {
      ...req.body,
      id: Date.now().toString(),
      durum: 'beklemede',
      talepTarihi: new Date().toLocaleString()
    };

    const data = fs.readFileSync(bekleyenOnaylarDosyaYolu, "utf8");
    const talepler = JSON.parse(data || "[]");
    talepler.push(yeniTalep);

    fs.writeFileSync(bekleyenOnaylarDosyaYolu, JSON.stringify(talepler, null, 2));
    res.status(200).json({ message: "Onay talebi oluşturuldu", data: yeniTalep });
  } catch (err) {
    console.error("❌ Onay talebi oluşturma hatası:", err);
    res.status(500).json({ error: "Onay talebi oluşturulamadı" });
  }
});

// Onay verme API
app.post("/api/onay-verme", (req, res) => {
  try {
    const { onayId, karar, gerekce, onaylayanKisi, onayTarihi } = req.body;
    
    // Bekleyen onaylardan talebi bul ve sil
    const bekleyenData = fs.readFileSync(bekleyenOnaylarDosyaYolu, "utf8");
    let bekleyenTalepler = JSON.parse(bekleyenData || "[]");
    
    const talepIndex = bekleyenTalepler.findIndex(t => t.id === onayId);
    if (talepIndex === -1) {
      return res.status(404).json({ error: "Onay talebi bulunamadı" });
    }
    
    const talep = bekleyenTalepler[talepIndex];
    bekleyenTalepler.splice(talepIndex, 1);
    
    // Onay geçmişine ekle
    const gecmisData = fs.readFileSync(onayGecmisiDosyaYolu, "utf8");
    const gecmis = JSON.parse(gecmisData || "[]");
    
    const onayKaydi = {
      ...talep,
      durum: karar,
      gerekce,
      onaylayanKisi,
      onayTarihi
    };
    
    gecmis.push(onayKaydi);
    
    // Dosyaları güncelle
    fs.writeFileSync(bekleyenOnaylarDosyaYolu, JSON.stringify(bekleyenTalepler, null, 2));
    fs.writeFileSync(onayGecmisiDosyaYolu, JSON.stringify(gecmis, null, 2));

    res.json({ message: "Onay işlemi tamamlandı", data: onayKaydi });
  } catch (err) {
    console.error("❌ Onay verme hatası:", err);
    res.status(500).json({ error: "Onay verilemedi" });
  }
});

// Onay geçmişi API
app.get("/api/onay-gecmisi", (req, res) => {
  try {
    const data = fs.readFileSync(onayGecmisiDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Onay geçmişi okuma hatası:", err);
    res.status(500).json({ error: "Onay geçmişi okunamadı" });
  }
});

// Otomatik onay kontrolü fonksiyonu
app.post("/api/onay-kontrolu", (req, res) => {
  try {
    const { kategori, tutar, talep } = req.body;
    
    // Onay kurallarını oku
    const kurallarData = fs.readFileSync(onayKurallariDosyaYolu, "utf8");
    const kurallar = JSON.parse(kurallarData || "[]");
    
    // Uygun kuralı bul
    const uygunKural = kurallar.find(kural => 
      kural.aktif && 
      kural.kategori === kategori && 
      tutar >= parseFloat(kural.minTutar) && 
      tutar <= parseFloat(kural.maxTutar)
    );
    
    if (uygunKural) {
      // Onay gerekli
      res.json({ 
        onayGerekli: true, 
        onaylayanRol: uygunKural.onaylayanRol,
        zorunluGerekceli: uygunKural.zorunluGerekceli,
        kural: uygunKural
      });
    } else {
      // Otomatik onay
      res.json({ 
        onayGerekli: false, 
        otomatikOnay: true 
      });
    }
  } catch (err) {
    console.error("❌ Onay kontrolü hatası:", err);
    res.status(500).json({ error: "Onay kontrolü yapılamadı" });
  }
});

// ✅ RAPORLAMA VE ANALİTİK API'LERİ

// Dashboard için genel istatistikler
app.get("/api/raporlar/dashboard", (req, res) => {
  try {
    const siparislerData = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    const siparisler = JSON.parse(siparislerData || "[]");
    
    const tedarikcilerData = fs.readFileSync(tedarikciDosyaYolu, "utf8");
    const tedarikciler = JSON.parse(tedarikcilerData || "[]");

    const bekleyenOnaylarData = fs.readFileSync(bekleyenOnaylarDosyaYolu, "utf8");
    const bekleyenOnaylar = JSON.parse(bekleyenOnaylarData || "[]");

    // Genel istatistikler
    const toplamSiparis = siparisler.length;
    const toplamTutar = siparisler.reduce((toplam, siparis) => toplam + parseFloat(siparis.toplamTutar || 0), 0);
    const aktifTedarikciler = tedarikciler.filter(t => t.durum === 'aktif').length;
    const bekleyenOnaylarSayisi = bekleyenOnaylar.length;

    // Durum bazlı sipariş dağılımı
    const durumDagilimi = {};
    siparisler.forEach(siparis => {
      const durum = siparis.durum || 'belirsiz';
      durumDagilimi[durum] = (durumDagilimi[durum] || 0) + 1;
    });

    // Aylık harcama trendi (son 6 ay)
    const aylikTrend = {};
    const bugun = new Date();
    for (let i = 5; i >= 0; i--) {
      const tarih = new Date(bugun.getFullYear(), bugun.getMonth() - i, 1);
      const ay = tarih.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
      aylikTrend[ay] = 0;
    }

    siparisler.forEach(siparis => {
      if (siparis.olusturmaTarihi) {
        const siparisAy = new Date(siparis.olusturmaTarihi).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
        if (aylikTrend.hasOwnProperty(siparisAy)) {
          aylikTrend[siparisAy] += parseFloat(siparis.toplamTutar || 0);
        }
      }
    });

    // Tedarikçi bazlı harcama
    const tedarikciHarcama = {};
    siparisler.forEach(siparis => {
      const tedarikci = siparis.tedarikci || 'Bilinmeyen';
      tedarikciHarcama[tedarikci] = (tedarikciHarcama[tedarikci] || 0) + parseFloat(siparis.toplamTutar || 0);
    });

    res.json({
      genel: {
        toplamSiparis,
        toplamTutar: toplamTutar.toFixed(2),
        aktifTedarikciler,
        bekleyenOnaylarSayisi
      },
      durumDagilimi,
      aylikTrend,
      tedarikciHarcama: Object.entries(tedarikciHarcama)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    });
  } catch (err) {
    console.error("❌ Dashboard raporu hatası:", err);
    res.status(500).json({ error: "Dashboard raporu oluşturulamadı" });
  }
});

// Tedarikçi performans raporu
app.get("/api/raporlar/tedarikci-performans", (req, res) => {
  try {
    const siparislerData = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    const siparisler = JSON.parse(siparislerData || "[]");
    
    const tedarikcilerData = fs.readFileSync(tedarikciDosyaYolu, "utf8");
    const tedarikciler = JSON.parse(tedarikcilerData || "[]");

    const performansRaporu = tedarikciler.map(tedarikci => {
      const tedarikciSiparisleri = siparisler.filter(s => s.tedarikci === tedarikci.firmaAdi);
      
      const toplamSiparis = tedarikciSiparisleri.length;
      const toplamTutar = tedarikciSiparisleri.reduce((toplam, s) => toplam + parseFloat(s.toplamTutar || 0), 0);
      const tamamlananSiparisler = tedarikciSiparisleri.filter(s => s.durum === 'tamamlandi').length;
      const iptaliSiparisler = tedarikciSiparisleri.filter(s => s.durum === 'iptal').length;
      
      const basariOrani = toplamSiparis > 0 ? ((tamamlananSiparisler / toplamSiparis) * 100) : 0;
      const ortalamaSiparisTutari = toplamSiparis > 0 ? (toplamTutar / toplamSiparis) : 0;

      // Son sipariş tarihi
      const sonSiparis = tedarikciSiparisleri
        .sort((a, b) => new Date(b.olusturmaTarihi) - new Date(a.olusturmaTarihi))[0];

      return {
        tedarikciId: tedarikci.id,
        firmaAdi: tedarikci.firmaAdi,
        kategori: tedarikci.kategori,
        toplamSiparis,
        toplamTutar: toplamTutar.toFixed(2),
        tamamlananSiparisler,
        iptaliSiparisler,
        basariOrani: basariOrani.toFixed(1),
        ortalamaSiparisTutari: ortalamaSiparisTutari.toFixed(2),
        sonSiparisTarihi: sonSiparis ? sonSiparis.olusturmaTarihi : null,
        performansPuani: basariOrani * 0.6 + (toplamSiparis * 2) + (toplamTutar / 1000)
      };
    });

    // Performans puanına göre sırala
    performansRaporu.sort((a, b) => b.performansPuani - a.performansPuani);

    res.json(performansRaporu);
  } catch (err) {
    console.error("❌ Tedarikçi performans raporu hatası:", err);
    res.status(500).json({ error: "Tedarikçi performans raporu oluşturulamadı" });
  }
});

// Kategori bazlı harcama analizi
app.get("/api/raporlar/kategori-analizi", (req, res) => {
  try {
    const siparislerData = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    const siparisler = JSON.parse(siparislerData || "[]");

    const kategoriAnalizi = {};
    
    siparisler.forEach(siparis => {
      if (siparis.urunler && Array.isArray(siparis.urunler)) {
        siparis.urunler.forEach(urun => {
          const kategori = urun.kategori || 'Diğer';
          const tutar = parseFloat(urun.toplamFiyat || 0);
          
          if (!kategoriAnalizi[kategori]) {
            kategoriAnalizi[kategori] = {
              toplamTutar: 0,
              siparisAdedi: 0,
              urunAdedi: 0,
              ortalamaBirimFiyat: 0
            };
          }
          
          kategoriAnalizi[kategori].toplamTutar += tutar;
          kategoriAnalizi[kategori].urunAdedi += parseInt(urun.miktar || 0);
          kategoriAnalizi[kategori].siparisAdedi += 1;
        });
      }
    });

    // Ortalama birim fiyatları hesapla
    Object.keys(kategoriAnalizi).forEach(kategori => {
      const data = kategoriAnalizi[kategori];
      data.ortalamaBirimFiyat = data.urunAdedi > 0 ? (data.toplamTutar / data.urunAdedi) : 0;
      data.toplamTutar = parseFloat(data.toplamTutar.toFixed(2));
      data.ortalamaBirimFiyat = parseFloat(data.ortalamaBirimFiyat.toFixed(2));
    });

    res.json(kategoriAnalizi);
  } catch (err) {
    console.error("❌ Kategori analizi hatası:", err);
    res.status(500).json({ error: "Kategori analizi oluşturulamadı" });
  }
});

// Dönemsel maliyet trendi
app.get("/api/raporlar/maliyet-trendi", (req, res) => {
  try {
    const { baslangic, bitis } = req.query;
    const siparislerData = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    const siparisler = JSON.parse(siparislerData || "[]");

    let filtrelenmissiparisler = siparisler;
    
    // Tarih filtreleme
    if (baslangic && bitis) {
      const baslangicTarih = new Date(baslangic);
      const bitisTarih = new Date(bitis);
      
      filtrelenmissiparisler = siparisler.filter(siparis => {
        const siparisTarih = new Date(siparis.olusturmaTarihi);
        return siparisTarih >= baslangicTarih && siparisTarih <= bitisTarih;
      });
    }

    // Günlük, haftalık, aylık trendler
    const gunlukTrend = {};
    const haftalikTrend = {};
    const aylikTrend = {};

    filtrelenmissiparisler.forEach(siparis => {
      if (siparis.olusturmaTarihi) {
        const tarih = new Date(siparis.olusturmaTarihi);
        const gun = tarih.toLocaleDateString('tr-TR');
        const hafta = `${tarih.getFullYear()}-W${Math.ceil(tarih.getDate() / 7)}`;
        const ay = tarih.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
        const tutar = parseFloat(siparis.toplamTutar || 0);

        gunlukTrend[gun] = (gunlukTrend[gun] || 0) + tutar;
        haftalikTrend[hafta] = (haftalikTrend[hafta] || 0) + tutar;
        aylikTrend[ay] = (aylikTrend[ay] || 0) + tutar;
      }
    });

    res.json({
      gunlukTrend,
      haftalikTrend,
      aylikTrend,
      toplamTutar: filtrelenmissiparisler.reduce((t, s) => t + parseFloat(s.toplamTutar || 0), 0),
      siparisAdedi: filtrelenmissiparisler.length
    });
  } catch (err) {
    console.error("❌ Maliyet trendi hatası:", err);
    res.status(500).json({ error: "Maliyet trendi oluşturulamadı" });
  }
});

// ✅ STOK ENTEGRASYONU API'LERİ

// Stok durumu kontrol API
app.post("/api/stok/durum-kontrol", (req, res) => {
  try {
    const { urunler } = req.body; // [{ urunAdi: "...", istenenMiktar: 10 }]
    const stokData = fs.readFileSync(stokDosyaYolu, "utf8");
    const stoklar = JSON.parse(stokData || "[]");

    const stokDurumu = urunler.map(urun => {
      const mevcutStok = stoklar.find(s => s.urunAdi === urun.urunAdi);
      const mevcutMiktar = mevcutStok ? parseInt(mevcutStok.miktar || 0) : 0;
      const istenenMiktar = parseInt(urun.istenenMiktar || 0);
      
      return {
        urunAdi: urun.urunAdi,
        mevcutMiktar,
        istenenMiktar,
        yeterli: mevcutMiktar >= istenenMiktar,
        eksikMiktar: mevcutMiktar < istenenMiktar ? istenenMiktar - mevcutMiktar : 0,
        stokId: mevcutStok ? mevcutStok.id : null
      };
    });

    const tumUrunlerYeterli = stokDurumu.every(s => s.yeterli);

    res.json({
      tumUrunlerYeterli,
      stokDurumu,
      toplamEksikUrun: stokDurumu.filter(s => !s.yeterli).length
    });
  } catch (err) {
    console.error("❌ Stok durum kontrolü hatası:", err);
    res.status(500).json({ error: "Stok durum kontrolü yapılamadı" });
  }
});

// Satın alma siparişi onaylandığında stok güncelleme
app.post("/api/stok/siparis-guncelle", (req, res) => {
  try {
    const { siparisId, urunler, islem } = req.body; // islem: "ekle" veya "cikar"
    
    const stokData = fs.readFileSync(stokDosyaYolu, "utf8");
    let stoklar = JSON.parse(stokData || "[]");

    const guncellenenUrunler = [];
    const hatalar = [];

    urunler.forEach(urun => {
      const mevcutStokIndex = stoklar.findIndex(s => s.urunAdi === urun.urunAdi);
      const miktar = parseInt(urun.miktar || 0);

      if (mevcutStokIndex !== -1) {
        // Mevcut stok var - güncelle
        const mevcutMiktar = parseInt(stoklar[mevcutStokIndex].miktar || 0);
        
        if (islem === "ekle") {
          stoklar[mevcutStokIndex].miktar = (mevcutMiktar + miktar).toString();
          stoklar[mevcutStokIndex].sonGuncelleme = new Date().toLocaleString();
          stoklar[mevcutStokIndex].sonIslem = `Satın alma siparişi: +${miktar}`;
        } else if (islem === "cikar") {
          if (mevcutMiktar >= miktar) {
            stoklar[mevcutStokIndex].miktar = (mevcutMiktar - miktar).toString();
            stoklar[mevcutStokIndex].sonGuncelleme = new Date().toLocaleString();
            stoklar[mevcutStokIndex].sonIslem = `Satın alma siparişi: -${miktar}`;
          } else {
            hatalar.push(`${urun.urunAdi}: Yetersiz stok (Mevcut: ${mevcutMiktar}, İstenilen: ${miktar})`);
          }
        }
        
        guncellenenUrunler.push({
          urunAdi: urun.urunAdi,
          eskiMiktar: mevcutMiktar,
          yeniMiktar: stoklar[mevcutStokIndex].miktar,
          islem
        });
      } else if (islem === "ekle") {
        // Yeni stok oluştur
        const yeniStok = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          urunAdi: urun.urunAdi,
          kategori: urun.kategori || 'Diğer',
          miktar: miktar.toString(),
          birim: urun.birim || 'adet',
          minStokMiktari: '10',
          konum: 'Depo',
          tarih: new Date().toLocaleString(),
          sonGuncelleme: new Date().toLocaleString(),
          sonIslem: `Satın alma siparişi: +${miktar}`,
          notlar: `Satın alma siparişi ${siparisId} ile oluşturuldu`
        };
        
        stoklar.push(yeniStok);
        guncellenenUrunler.push({
          urunAdi: urun.urunAdi,
          eskiMiktar: 0,
          yeniMiktar: miktar,
          islem: "yeni_stok"
        });
      }
    });

    // Stok dosyasını güncelle
    fs.writeFileSync(stokDosyaYolu, JSON.stringify(stoklar, null, 2));

    res.json({
      basarili: hatalar.length === 0,
      guncellenenUrunler,
      hatalar,
      mesaj: hatalar.length === 0 ? "Stok başarıyla güncellendi" : "Bazı ürünlerde hata oluştu"
    });
  } catch (err) {
    console.error("❌ Stok güncelleme hatası:", err);
    res.status(500).json({ error: "Stok güncellenemedi" });
  }
});

// Minimum stok uyarıları
app.get("/api/stok/minimum-uyarilar", (req, res) => {
  try {
    const stokData = fs.readFileSync(stokDosyaYolu, "utf8");
    const stoklar = JSON.parse(stokData || "[]");

    const uyarilar = stoklar.filter(stok => {
      const mevcutMiktar = parseInt(stok.miktar || 0);
      const minMiktar = parseInt(stok.minStokMiktari || 0);
      return mevcutMiktar <= minMiktar;
    }).map(stok => ({
      id: stok.id,
      urunAdi: stok.urunAdi,
      kategori: stok.kategori,
      mevcutMiktar: stok.miktar,
      minMiktar: stok.minStokMiktari,
      eksikMiktar: parseInt(stok.minStokMiktari || 0) - parseInt(stok.miktar || 0),
      konum: stok.konum,
      oncelik: parseInt(stok.miktar || 0) === 0 ? 'kritik' : 'uyari'
    }));

    // Öncelik sırasına göre sırala (kritik önce)
    uyarilar.sort((a, b) => {
      if (a.oncelik === 'kritik' && b.oncelik !== 'kritik') return -1;
      if (a.oncelik !== 'kritik' && b.oncelik === 'kritik') return 1;
      return b.eksikMiktar - a.eksikMiktar;
    });

    res.json({
      toplamUyari: uyarilar.length,
      kritikUyarilar: uyarilar.filter(u => u.oncelik === 'kritik').length,
      uyarilar
    });
  } catch (err) {
    console.error("❌ Minimum stok uyarıları hatası:", err);
    res.status(500).json({ error: "Minimum stok uyarıları alınamadı" });
  }
});

// Stok hareketleri raporu
app.get("/api/stok/hareketler", (req, res) => {
  try {
    const { baslangic, bitis, urunAdi } = req.query;
    
    // Satın alma siparişlerinden stok hareketlerini al
    const siparislerData = fs.readFileSync(satinalmasiparislerDosyaYolu, "utf8");
    const siparisler = JSON.parse(siparislerData || "[]");
    
    const stokData = fs.readFileSync(stokDosyaYolu, "utf8");
    const stoklar = JSON.parse(stokData || "[]");

    let hareketler = [];

    // Satın alma siparişlerinden hareketleri çıkar
    siparisler.forEach(siparis => {
      if (siparis.urunler && Array.isArray(siparis.urunler)) {
        siparis.urunler.forEach(urun => {
          const hareket = {
            tarih: siparis.olusturmaTarihi,
            urunAdi: urun.urunAdi,
            kategori: urun.kategori,
            miktar: parseInt(urun.miktar || 0),
            islemTipi: 'giris',
            kaynak: 'Satın Alma Siparişi',
            referans: `SAS-${siparis.id}`,
            tedarikci: siparis.tedarikci,
            birimFiyat: parseFloat(urun.birimFiyat || 0),
            toplamFiyat: parseFloat(urun.toplamFiyat || 0)
          };
          
          // Filtreler
          let ekle = true;
          if (baslangic && new Date(hareket.tarih) < new Date(baslangic)) ekle = false;
          if (bitis && new Date(hareket.tarih) > new Date(bitis)) ekle = false;
          if (urunAdi && !hareket.urunAdi.toLowerCase().includes(urunAdi.toLowerCase())) ekle = false;
          
          if (ekle) hareketler.push(hareket);
        });
      }
    });

    // Tarihe göre sırala (en yeni önce)
    hareketler.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

    // Özet istatistikler
    const toplamGiris = hareketler.filter(h => h.islemTipi === 'giris').reduce((t, h) => t + h.miktar, 0);
    const toplamCikis = hareketler.filter(h => h.islemTipi === 'cikis').reduce((t, h) => t + h.miktar, 0);
    const toplamMaliyet = hareketler.reduce((t, h) => t + h.toplamFiyat, 0);

    res.json({
      hareketler,
      ozet: {
        toplamHareket: hareketler.length,
        toplamGiris,
        toplamCikis,
        netHareket: toplamGiris - toplamCikis,
        toplamMaliyet: toplamMaliyet.toFixed(2)
      }
    });
  } catch (err) {
    console.error("❌ Stok hareketleri raporu hatası:", err);
    res.status(500).json({ error: "Stok hareketleri raporu oluşturulamadı" });
  }
});

// ✅ SÖZLEŞME YÖNETİMİ API'LERİ

// Sözleşme listesi
app.get("/api/sozlesmeler", (req, res) => {
  try {
    const data = fs.readFileSync(sozlesmelerDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Sözleşmeler okuma hatası:", err);
    res.status(500).json({ error: "Sözleşmeler okunamadı" });
  }
});

// Yeni sözleşme oluşturma
app.post("/api/sozlesme", (req, res) => {
  try {
    const yeniSozlesme = {
      ...req.body,
      id: Date.now().toString(),
      olusturmaTarihi: new Date().toLocaleString(),
      guncellemeTarihi: new Date().toLocaleString(),
      olusturanKullanici: req.body.olusturanKullanici || 'sistem',
      guncelleyenKullanici: req.body.olusturanKullanici || 'sistem',
      durum: 'taslak',
      gecmis: [{
        tarih: new Date().toLocaleString(),
        kullanici: req.body.olusturanKullanici || 'sistem',
        islem: 'Sözleşme oluşturuldu',
        aciklama: 'Yeni sözleşme oluşturuldu'
      }]
    };

    const data = fs.readFileSync(sozlesmelerDosyaYolu, "utf8");
    const sozlesmeler = JSON.parse(data || "[]");
    sozlesmeler.push(yeniSozlesme);

    fs.writeFileSync(sozlesmelerDosyaYolu, JSON.stringify(sozlesmeler, null, 2));
    res.status(200).json({ message: "Sözleşme oluşturuldu", data: yeniSozlesme });
  } catch (err) {
    console.error("❌ Sözleşme oluşturma hatası:", err);
    res.status(500).json({ error: "Sözleşme oluşturulamadı" });
  }
});

// Sözleşme güncelleme
app.put("/api/sozlesme/:id", (req, res) => {
  try {
    const { id } = req.params;
    const guncellenmisData = req.body;

    const data = fs.readFileSync(sozlesmelerDosyaYolu, "utf8");
    let sozlesmeler = JSON.parse(data || "[]");

    const index = sozlesmeler.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Sözleşme bulunamadı" });
    }

    const eskiSozlesme = sozlesmeler[index];
    
    // Geçmiş kaydı oluştur
    const yeniGecmisKaydi = {
      tarih: new Date().toLocaleString(),
      kullanici: guncellenmisData.guncelleyenKullanici || 'sistem',
      islem: 'Sözleşme güncellendi',
      aciklama: guncellenmisData.guncellemNotu || 'Sözleşme bilgileri güncellendi'
    };

    sozlesmeler[index] = {
      ...eskiSozlesme,
      ...guncellenmisData,
      guncellemeTarihi: new Date().toLocaleString(),
      guncelleyenKullanici: guncellenmisData.guncelleyenKullanici || 'sistem',
      gecmis: [...(eskiSozlesme.gecmis || []), yeniGecmisKaydi]
    };

    fs.writeFileSync(sozlesmelerDosyaYolu, JSON.stringify(sozlesmeler, null, 2));
    res.json({ message: "Sözleşme güncellendi", data: sozlesmeler[index] });
  } catch (err) {
    console.error("❌ Sözleşme güncelleme hatası:", err);
    res.status(500).json({ error: "Sözleşme güncellenemedi" });
  }
});

// Tek sözleşme görüntüleme
app.get("/api/sozlesme/:id", (req, res) => {
  try {
    const { id } = req.params;

    const data = fs.readFileSync(sozlesmelerDosyaYolu, "utf8");
    const sozlesmeler = JSON.parse(data || "[]");

    const sozlesme = sozlesmeler.find(s => s.id === id);
    if (!sozlesme) {
      return res.status(404).json({ error: "Sözleşme bulunamadı" });
    }

    res.json(sozlesme);
  } catch (err) {
    console.error("❌ Sözleşme okuma hatası:", err);
    res.status(500).json({ error: "Sözleşme okunamadı" });
  }
});

// Sözleşme silme
app.delete("/api/sozlesme/:id", (req, res) => {
  try {
    const { id } = req.params;

    const data = fs.readFileSync(sozlesmelerDosyaYolu, "utf8");
    let sozlesmeler = JSON.parse(data || "[]");

    const index = sozlesmeler.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Sözleşme bulunamadı" });
    }

    sozlesmeler.splice(index, 1);
    fs.writeFileSync(sozlesmelerDosyaYolu, JSON.stringify(sozlesmeler, null, 2));

    res.json({ message: "Sözleşme silindi" });
  } catch (err) {
    console.error("❌ Sözleşme silme hatası:", err);
    res.status(500).json({ error: "Sözleşme silinemedi" });
  }
});

// Sözleşme durumu güncelleme
app.patch("/api/sozlesme/:id/durum", (req, res) => {
  try {
    const { id } = req.params;
    const { durum, not, guncelleyenKullanici } = req.body;

    const data = fs.readFileSync(sozlesmelerDosyaYolu, "utf8");
    let sozlesmeler = JSON.parse(data || "[]");

    const index = sozlesmeler.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Sözleşme bulunamadı" });
    }

    const eskiSozlesme = sozlesmeler[index];
    
    sozlesmeler[index].durum = durum;
    sozlesmeler[index].guncellemeTarihi = new Date().toLocaleString();
    sozlesmeler[index].guncelleyenKullanici = guncelleyenKullanici || 'sistem';
    
    if (durum === 'aktif') {
      sozlesmeler[index].aktivasyonTarihi = new Date().toLocaleString();
    }
    
    // Geçmiş kaydı oluştur
    const yeniGecmisKaydi = {
      tarih: new Date().toLocaleString(),
      kullanici: guncelleyenKullanici || 'sistem',
      islem: `Durum güncellendi: ${durum}`,
      aciklama: not || `Sözleşme durumu ${durum} olarak güncellendi`
    };

    // Gecmis alanını kullan, notlar alanını dönüştür
    if (!sozlesmeler[index].gecmis) {
      sozlesmeler[index].gecmis = [];
      // Eski notlar varsa gecmise dönüştür
      if (eskiSozlesme.notlar && Array.isArray(eskiSozlesme.notlar)) {
        sozlesmeler[index].gecmis = eskiSozlesme.notlar.map(not => ({
          tarih: not.tarih,
          kullanici: 'sistem',
          islem: not.islem || 'Durum güncellendi',
          aciklama: not.not || 'Durum güncellendi'
        }));
      }
    }
    
    sozlesmeler[index].gecmis.push(yeniGecmisKaydi);
    
    // Eski notlar alanını kaldır
    delete sozlesmeler[index].notlar;

    fs.writeFileSync(sozlesmelerDosyaYolu, JSON.stringify(sozlesmeler, null, 2));
    res.json({ message: "Sözleşme durumu güncellendi", data: sozlesmeler[index] });
  } catch (err) {
    console.error("❌ Sözleşme durum güncelleme hatası:", err);
    res.status(500).json({ error: "Sözleşme durumu güncellenemedi" });
  }
});

// ✅ FİYAT LİSTESİ YÖNETİMİ API'LERİ

// Fiyat listesi
app.get("/api/fiyat-listeleri", (req, res) => {
  try {
    const data = fs.readFileSync(fiyatListeleriDosyaYolu, "utf8");
    res.json(JSON.parse(data || "[]"));
  } catch (err) {
    console.error("❌ Fiyat listeleri okuma hatası:", err);
    res.status(500).json({ error: "Fiyat listeleri okunamadı" });
  }
});

// Yeni fiyat listesi oluşturma
app.post("/api/fiyat-listesi", (req, res) => {
  try {
    const yeniFiyatListesi = {
      ...req.body,
      id: Date.now().toString(),
      olusturmaTarihi: new Date().toLocaleString(),
      durum: 'aktif',
      guncellemeTarihi: new Date().toLocaleString()
    };

    const data = fs.readFileSync(fiyatListeleriDosyaYolu, "utf8");
    const fiyatListeleri = JSON.parse(data || "[]");
    fiyatListeleri.push(yeniFiyatListesi);

    fs.writeFileSync(fiyatListeleriDosyaYolu, JSON.stringify(fiyatListeleri, null, 2));
    res.status(200).json({ message: "Fiyat listesi oluşturuldu", data: yeniFiyatListesi });
  } catch (err) {
    console.error("❌ Fiyat listesi oluşturma hatası:", err);
    res.status(500).json({ error: "Fiyat listesi oluşturulamadı" });
  }
});

// Tedarikçi fiyat listesi sorgulama
app.get("/api/fiyat-listesi/tedarikci/:tedarikciId", (req, res) => {
  try {
    const { tedarikciId } = req.params;
    const data = fs.readFileSync(fiyatListeleriDosyaYolu, "utf8");
    const fiyatListeleri = JSON.parse(data || "[]");

    const tedarikciListeleri = fiyatListeleri.filter(
      liste => liste.tedarikciId === tedarikciId && liste.durum === 'aktif'
    );

    res.json(tedarikciListeleri);
  } catch (err) {
    console.error("❌ Tedarikçi fiyat listesi okuma hatası:", err);
    res.status(500).json({ error: "Fiyat listesi okunamadı" });
  }
});

// Sözleşme süre kontrolleri
app.get("/api/sozlesmeler/suresi-dolan", (req, res) => {
  try {
    const data = fs.readFileSync(sozlesmelerDosyaYolu, "utf8");
    const sozlesmeler = JSON.parse(data || "[]");
    
    const bugun = new Date();
    const bitisBirAy = new Date();
    bitisBirAy.setMonth(bitisBirAy.getMonth() + 1);

    const suresiBitenler = sozlesmeler.filter(sozlesme => {
      if (sozlesme.durum !== 'aktif' || !sozlesme.bitisTarihi) return false;
      
      const bitisTarihi = new Date(sozlesme.bitisTarihi);
      return bitisTarihi <= bitisBirAy;
    }).map(sozlesme => {
      const bitisTarihi = new Date(sozlesme.bitisTarihi);
      const kalanGun = Math.ceil((bitisTarihi - bugun) / (1000 * 60 * 60 * 24));
      
      return {
        ...sozlesme,
        kalanGun,
        durum: kalanGun <= 0 ? 'suresi_dolmus' : kalanGun <= 7 ? 'kritik' : 'uyari'
      };
    });

    // Öncelik sırasına göre sırala
    suresiBitenler.sort((a, b) => a.kalanGun - b.kalanGun);

    res.json({
      toplam: suresiBitenler.length,
      kritik: suresiBitenler.filter(s => s.durum === 'kritik' || s.durum === 'suresi_dolmus').length,
      sozlesmeler: suresiBitenler
    });
  } catch (err) {
    console.error("❌ Sözleşme süre kontrolü hatası:", err);
    res.status(500).json({ error: "Sözleşme süre kontrolü yapılamadı" });
  }
});

// 📊 ========== TEDARİKÇİ PERFORMANS API'LARİ ==========

// 📋 Tüm tedarikçi performanslarını getir
app.get("/api/tedarikci-performans", (req, res) => {
  try {
    const performanslar = JSON.parse(fs.readFileSync(tedarikciPerformansDosyaYolu, "utf8"));
    res.json(performanslar);
  } catch (err) {
    console.error("❌ Tedarikçi performansları getirme hatası:", err);
    res.status(500).json({ error: "Tedarikçi performansları getirilemedi" });
  }
});

// 📋 Belirli tedarikçi performansını getir
app.get("/api/tedarikci-performans/:id", (req, res) => {
  try {
    const performanslar = JSON.parse(fs.readFileSync(tedarikciPerformansDosyaYolu, "utf8"));
    const performans = performanslar.find(p => p.id === req.params.id || p.tedarikcıId === req.params.id);
    
    if (!performans) {
      return res.status(404).json({ error: "Tedarikçi performansı bulunamadı" });
    }
    
    res.json(performans);
  } catch (err) {
    console.error("❌ Tedarikçi performansı getirme hatası:", err);
    res.status(500).json({ error: "Tedarikçi performansı getirilemedi" });
  }
});

// ➕ Yeni tedarikçi performansı ekle
app.post("/api/tedarikci-performans", (req, res) => {
  try {
    const performanslar = JSON.parse(fs.readFileSync(tedarikciPerformansDosyaYolu, "utf8"));
    
    // Yeni performans ID'si oluştur
    const yeniId = "perf" + String(Date.now()).slice(-6);
    
    const yeniPerformans = {
      id: yeniId,
      ...req.body,
      sonDegerlendirme: new Date().toISOString().split('T')[0]
    };
    
    performanslar.push(yeniPerformans);
    fs.writeFileSync(tedarikciPerformansDosyaYolu, JSON.stringify(performanslar, null, 2));
    
    console.log("✅ Yeni tedarikçi performansı eklendi:", yeniId);
    res.status(201).json(yeniPerformans);
  } catch (err) {
    console.error("❌ Tedarikçi performansı ekleme hatası:", err);
    res.status(500).json({ error: "Tedarikçi performansı eklenemedi" });
  }
});

// ✏️ Tedarikçi performansını güncelle
app.put("/api/tedarikci-performans/:id", (req, res) => {
  try {
    const performanslar = JSON.parse(fs.readFileSync(tedarikciPerformansDosyaYolu, "utf8"));
    const index = performanslar.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Tedarikçi performansı bulunamadı" });
    }
    
    performanslar[index] = {
      ...performanslar[index],
      ...req.body,
      sonDegerlendirme: new Date().toISOString().split('T')[0]
    };
    
    fs.writeFileSync(tedarikciPerformansDosyaYolu, JSON.stringify(performanslar, null, 2));
    
    console.log("✅ Tedarikçi performansı güncellendi:", req.params.id);
    res.json(performanslar[index]);
  } catch (err) {
    console.error("❌ Tedarikçi performansı güncelleme hatası:", err);
    res.status(500).json({ error: "Tedarikçi performansı güncellenemedi" });
  }
});

// 🗑️ Tedarikçi performansını sil
app.delete("/api/tedarikci-performans/:id", (req, res) => {
  try {
    const performanslar = JSON.parse(fs.readFileSync(tedarikciPerformansDosyaYolu, "utf8"));
    const yeniPerformanslar = performanslar.filter(p => p.id !== req.params.id);
    
    if (performanslar.length === yeniPerformanslar.length) {
      return res.status(404).json({ error: "Tedarikçi performansı bulunamadı" });
    }
    
    fs.writeFileSync(tedarikciPerformansDosyaYolu, JSON.stringify(yeniPerformanslar, null, 2));
    
    console.log("✅ Tedarikçi performansı silindi:", req.params.id);
    res.json({ message: "Tedarikçi performansı başarıyla silindi" });
  } catch (err) {
    console.error("❌ Tedarikçi performansı silme hatası:", err);
    res.status(500).json({ error: "Tedarikçi performansı silinemedi" });
  }
});

// 📊 Performans analizi ve raporlama
app.get("/api/tedarikci-performans-analiz", (req, res) => {
  try {
    const performanslar = JSON.parse(fs.readFileSync(tedarikciPerformansDosyaYolu, "utf8"));
    
    if (performanslar.length === 0) {
      return res.json({
        toplam: 0,
        ortalamaPuan: 0,
        kategoriler: { "A+": 0, "A": 0, "B": 0, "C": 0, "D": 0 },
        performansOrtalamalari: {}
      });
    }
    
    // Kategori dağılımı
    const kategoriler = performanslar.reduce((acc, p) => {
      acc[p.kategori] = (acc[p.kategori] || 0) + 1;
      return acc;
    }, {});
    
    // Genel ortalama puan
    const ortalamaPuan = performanslar.reduce((sum, p) => sum + p.genelPuan, 0) / performanslar.length;
    
    // Performans metriklerinin ortalaması
    const performansOrtalamalari = {
      teslimatPerformansi: performanslar.reduce((sum, p) => sum + p.performansMetrikleri.teslimatPerformansi.zamanindaTeslimat, 0) / performanslar.length,
      kalitePerformansi: performanslar.reduce((sum, p) => sum + p.performansMetrikleri.kalitePerformansi.kalitePuani, 0) / performanslar.length,
      fiyatPerformansi: performanslar.reduce((sum, p) => sum + p.performansMetrikleri.fiyatPerformansi.fiyatKarsilastirmaPuani, 0) / performanslar.length,
      iletisimPerformansi: performanslar.reduce((sum, p) => sum + p.performansMetrikleri.iletisimPerformansi.iletisimKalitesi, 0) / performanslar.length
    };
    
    res.json({
      toplam: performanslar.length,
      ortalamaPuan: Math.round(ortalamaPuan * 10) / 10,
      kategoriler,
      performansOrtalamalari: Object.fromEntries(
        Object.entries(performansOrtalamalari).map(([key, value]) => [key, Math.round(value * 10) / 10])
      ),
      enIyiTedarikci: performanslar.reduce((max, p) => p.genelPuan > max.genelPuan ? p : max),
      iyilestirmeGereken: performanslar.filter(p => p.genelPuan < 70)
    });
  } catch (err) {
    console.error("❌ Tedarikçi performans analizi hatası:", err);
    res.status(500).json({ error: "Performans analizi yapılamadı" });
  }
});

// � ========== NUMUNE ÜCRETLERİ API ==========
// Numune ücretlerini listele
app.get("/api/numune-ucretleri", (req, res) => {
  try {
    const veriler = JSON.parse(fs.readFileSync(numuneUcretleriDosyaYolu, "utf8") || "[]");
    console.log("📋 Numune ücretleri listelendi:", veriler.length, "kayıt");
    res.json(veriler);
  } catch (err) {
    console.error("❌ Numune ücretleri okuma hatası:", err);
    res.status(500).json({ error: "Ücret verileri okunamadı" });
  }
});

// Numune ücreti ekle
app.post("/api/numune-ucretleri", (req, res) => {
  console.log("📥 POST /api/numune-ucretleri çağrıldı");
  console.log("📦 Request Body:", req.body);
  
  try {
    const yeniUcret = {
      id: Date.now().toString(),
      ...req.body,
      olusturmaTarihi: new Date().toLocaleString('tr-TR'),
      guncellemeTarihi: new Date().toLocaleString('tr-TR')
    };
    
    console.log("💰 Oluşturulan ücret objesi:", yeniUcret);
    
    const veriler = JSON.parse(fs.readFileSync(numuneUcretleriDosyaYolu, "utf8") || "[]");
    console.log("📁 Mevcut ücret kayıtları sayısı:", veriler.length);
    
    veriler.push(yeniUcret);
    fs.writeFileSync(numuneUcretleriDosyaYolu, JSON.stringify(veriler, null, 2));
    
    console.log("✅ Yeni numune ücreti eklendi:", yeniUcret.musteri, "-", yeniUcret.ucretMiktari, yeniUcret.paraBirimi);
    console.log("📁 Toplam ücret kayıtları sayısı:", veriler.length);
    
    res.json(yeniUcret);
  } catch (err) {
    console.error("❌ Numune ücreti kaydetme hatası:", err);
    res.status(500).json({ error: "Ücret kaydedilemedi" });
  }
});

// Numune ücreti güncelle
app.put("/api/numune-ucretleri/:id", (req, res) => {
  try {
    const { id } = req.params;
    const veriler = JSON.parse(fs.readFileSync(numuneUcretleriDosyaYolu, "utf8") || "[]");
    const index = veriler.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Ücret kaydı bulunamadı" });
    }
    
    veriler[index] = {
      ...veriler[index],
      ...req.body,
      guncellemeTarihi: new Date().toLocaleString('tr-TR')
    };
    
    fs.writeFileSync(numuneUcretleriDosyaYolu, JSON.stringify(veriler, null, 2));
    
    console.log("💰 Numune ücreti güncellendi:", veriler[index].musteri, "-", veriler[index].odemeDurumu);
    res.json(veriler[index]);
  } catch (err) {
    console.error("❌ Numune ücreti güncelleme hatası:", err);
    res.status(500).json({ error: "Ücret güncellenemedi" });
  }
});

// Numune ücreti sil
app.delete("/api/numune-ucretleri/:id", (req, res) => {
  try {
    const { id } = req.params;
    const veriler = JSON.parse(fs.readFileSync(numuneUcretleriDosyaYolu, "utf8") || "[]");
    const index = veriler.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: "Ücret kaydı bulunamadı" });
    }
    
    const silinenUcret = veriler.splice(index, 1)[0];
    fs.writeFileSync(numuneUcretleriDosyaYolu, JSON.stringify(veriler, null, 2));
    
    console.log("🗑️ Numune ücreti silindi:", silinenUcret.musteri, "-", silinenUcret.ucretMiktari, silinenUcret.paraBirimi);
    res.json({ message: "Ücret kaydı silindi", silinen: silinenUcret });
  } catch (err) {
    console.error("❌ Numune ücreti silme hatası:", err);
    res.status(500).json({ error: "Ücret silinemedi" });
  }
});

// Numune ücret istatistikleri
app.get("/api/numune-ucretleri/istatistikler", (req, res) => {
  try {
    const veriler = JSON.parse(fs.readFileSync(numuneUcretleriDosyaYolu, "utf8") || "[]");
    
    const toplamKayit = veriler.length;
    const bekleyenOdemeler = veriler.filter(u => u.odemeDurumu === 'Bekliyor');
    const odenenler = veriler.filter(u => u.odemeDurumu === 'Ödendi');
    const iptalEdilenler = veriler.filter(u => u.odemeDurumu === 'İptal');
    
    const bekleyenTutar = bekleyenOdemeler.reduce((toplam, u) => toplam + (u.ucretMiktari || 0), 0);
    const tahsilEdilenTutar = odenenler.reduce((toplam, u) => toplam + (u.ucretMiktari || 0), 0);
    const toplamTutar = veriler.reduce((toplam, u) => toplam + (u.ucretMiktari || 0), 0);
    
    const paraBirimleri = {};
    veriler.forEach(u => {
      if (!paraBirimleri[u.paraBirimi]) {
        paraBirimleri[u.paraBirimi] = {
          toplam: 0,
          bekleyen: 0,
          tahsil: 0
        };
      }
      paraBirimleri[u.paraBirimi].toplam += u.ucretMiktari || 0;
      if (u.odemeDurumu === 'Bekliyor') {
        paraBirimleri[u.paraBirimi].bekleyen += u.ucretMiktari || 0;
      } else if (u.odemeDurumu === 'Ödendi') {
        paraBirimleri[u.paraBirimi].tahsil += u.ucretMiktari || 0;
      }
    });
    
    const aylikIstatistikler = {};
    veriler.forEach(u => {
      const tarih = new Date(u.olusturmaTarihi);
      const ay = `${tarih.getFullYear()}-${(tarih.getMonth() + 1).toString().padStart(2, '0')}`;
      if (!aylikIstatistikler[ay]) {
        aylikIstatistikler[ay] = {
          toplam: 0,
          adet: 0,
          bekleyen: 0,
          odenen: 0
        };
      }
      aylikIstatistikler[ay].adet++;
      aylikIstatistikler[ay].toplam += u.ucretMiktari || 0;
      if (u.odemeDurumu === 'Bekliyor') aylikIstatistikler[ay].bekleyen += u.ucretMiktari || 0;
      if (u.odemeDurumu === 'Ödendi') aylikIstatistikler[ay].odenen += u.ucretMiktari || 0;
    });
    
    res.json({
      toplamKayit,
      bekleyenOdemeler: bekleyenOdemeler.length,
      odenenler: odenenler.length,
      iptalEdilenler: iptalEdilenler.length,
      tutarlar: {
        bekleyenTutar: Math.round(bekleyenTutar * 100) / 100,
        tahsilEdilenTutar: Math.round(tahsilEdilenTutar * 100) / 100,
        toplamTutar: Math.round(toplamTutar * 100) / 100
      },
      paraBirimleri,
      aylikIstatistikler,
      tahsilatOrani: toplamTutar > 0 ? Math.round((tahsilEdilenTutar / toplamTutar) * 100) : 0
    });
  } catch (err) {
    console.error("❌ Numune ücret istatistikleri hatası:", err);
    res.status(500).json({ error: "İstatistikler hesaplanamadı" });
  }
});

// ✅ ========== ENHANCED WORKFLOW SYSTEM API'LERİ ==========

// 📢 Bildirim Sistemi API'leri
const bildirimlerDosyaYolu = path.join(dataKlasoru, "bildirimler.json");
if (!fs.existsSync(bildirimlerDosyaYolu)) fs.writeFileSync(bildirimlerDosyaYolu, "[]");

// Bildirimleri getir
app.get("/api/notifications", (req, res) => {
  try {
    const data = fs.readFileSync(bildirimlerDosyaYolu, "utf8");
    const bildirimler = JSON.parse(data || "[]");
    res.json(bildirimler);
  } catch (err) {
    console.error("❌ Bildirimler okuma hatası:", err);
    res.status(500).json({ error: "Bildirimler okunamadı" });
  }
});

// Kullanıcıya göre bildirimleri getir
app.get("/api/notifications/:kullanici", (req, res) => {
  try {
    const { kullanici } = req.params;
    const data = fs.readFileSync(bildirimlerDosyaYolu, "utf8");
    const bildirimler = JSON.parse(data || "[]");
    
    // Kullanıcıya göre filtrele veya herkese ait olanları dahil et
    const filtrelenmisler = bildirimler.filter(bildirim => 
      !bildirim.kullanici || bildirim.kullanici === kullanici || bildirim.kullanici === 'all'
    );
    
    res.json(filtrelenmisler);
  } catch (err) {
    console.error("❌ Kullanıcı bildirimleri okuma hatası:", err);
    res.status(500).json({ error: "Kullanıcı bildirimleri okunamadı" });
  }
});

// Yeni bildirim oluştur
app.post("/api/notifications", (req, res) => {
  try {
    const yeniBildirim = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      read: false
    };

    const data = fs.readFileSync(bildirimlerDosyaYolu, "utf8");
    const bildirimler = JSON.parse(data || "[]");
    bildirimler.unshift(yeniBildirim);
    
    if (bildirimler.length > 1000) {
      bildirimler.splice(1000);
    }

    fs.writeFileSync(bildirimlerDosyaYolu, JSON.stringify(bildirimler, null, 2));
    res.status(201).json(yeniBildirim);
  } catch (err) {
    console.error("❌ Bildirim oluşturma hatası:", err);
    res.status(500).json({ error: "Bildirim oluşturulamadı" });
  }
});

// Bildirimi okundu olarak işaretle
app.patch("/api/notifications/:id/read", (req, res) => {
  try {
    const { id } = req.params;
    const data = fs.readFileSync(bildirimlerDosyaYolu, "utf8");
    let bildirimler = JSON.parse(data || "[]");

    const index = bildirimler.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Bildirim bulunamadı" });
    }

    bildirimler[index].read = true;
    bildirimler[index].readAt = new Date().toISOString();

    fs.writeFileSync(bildirimlerDosyaYolu, JSON.stringify(bildirimler, null, 2));
    res.json(bildirimler[index]);
  } catch (err) {
    console.error("❌ Bildirim güncelleme hatası:", err);
    res.status(500).json({ error: "Bildirim güncellenemedi" });
  }
});

// Tüm bildirimleri okundu olarak işaretle
app.patch("/api/notifications/mark-all-read", (req, res) => {
  try {
    const data = fs.readFileSync(bildirimlerDosyaYolu, "utf8");
    let bildirimler = JSON.parse(data || "[]");

    const okunmamislar = bildirimler.filter(b => !b.read);
    bildirimler = bildirimler.map(b => ({
      ...b,
      read: true,
      readAt: b.read ? b.readAt : new Date().toISOString()
    }));

    fs.writeFileSync(bildirimlerDosyaYolu, JSON.stringify(bildirimler, null, 2));
    res.json({ 
      message: "Tüm bildirimler okundu olarak işaretlendi", 
      count: okunmamislar.length 
    });
  } catch (err) {
    console.error("❌ Toplu bildirim güncelleme hatası:", err);
    res.status(500).json({ error: "Bildirimler güncellenemedi" });
  }
});

// 🔧 Dashboard verileri API'leri
app.get("/api/dashboard-data", (req, res) => {
  try {
    const siparisData = fs.readFileSync(siparisDosyaYolu, "utf8");
    const gorevData = fs.readFileSync(gorevDosyaYolu, "utf8");
    const numuneData = fs.readFileSync(numuneDosyaYolu, "utf8");
    const bildirimData = fs.readFileSync(bildirimlerDosyaYolu, "utf8");

    const siparisler = JSON.parse(siparisData || "[]");
    const gorevler = JSON.parse(gorevData || "[]");
    const numuneler = JSON.parse(numuneData || "[]");
    const bildirimler = JSON.parse(bildirimData || "[]");

    const dashboardData = {
      totalOrders: siparisler.length,
      totalTasks: gorevler.length,
      totalSamples: numuneler.length,
      unreadNotifications: bildirimler.filter(b => !b.read).length,
      recentActivity: [
        ...siparisler.slice(-5).map(s => ({
          type: 'order',
          title: `Yeni Sipariş: ${s.musteri}`,
          time: s.tarih
        })),
        ...gorevler.slice(-5).map(g => ({
          type: 'task',
          title: `Görev: ${g.baslik}`,
          time: g.tarih
        })),
        ...numuneler.slice(-5).map(n => ({
          type: 'sample',
          title: `Numune: ${n.musteri}`,
          time: n.tarih
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10)
    };

    res.json(dashboardData);
  } catch (err) {
    console.error("❌ Dashboard veri hatası:", err);
    res.status(500).json({ error: "Dashboard verileri yüklenemedi" });
  }
});

//  ========== WORKFLOW ENGINE API ==========
// 🔄 ========== WORKFLOW ENGINE API ENDPOINTS ==========
const workflowsDosyaYolu = path.join(dataKlasoru, "workflows.json");
const activeWorkflowsDosyaYolu = path.join(dataKlasoru, "active-workflows.json");

// Dosya yoksa oluştur
if (!fs.existsSync(workflowsDosyaYolu)) fs.writeFileSync(workflowsDosyaYolu, "[]");
if (!fs.existsSync(activeWorkflowsDosyaYolu)) fs.writeFileSync(activeWorkflowsDosyaYolu, "[]");

// Workflow'ları getir
app.get("/api/workflows", (req, res) => {
  try {
    const data = fs.readFileSync(workflowsDosyaYolu, "utf8");
    const workflows = JSON.parse(data || "[]");
    res.json(workflows);
  } catch (err) {
    console.error("❌ Workflows okuma hatası:", err);
    res.status(500).json({ error: "Workflows okunamadı" });
  }
});

// Yeni workflow oluştur
app.post("/api/workflows", (req, res) => {
  try {
    const yeniWorkflow = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const data = fs.readFileSync(workflowsDosyaYolu, "utf8");
    const workflows = JSON.parse(data || "[]");
    workflows.push(yeniWorkflow);

    fs.writeFileSync(workflowsDosyaYolu, JSON.stringify(workflows, null, 2));
    res.status(200).json({ message: "Workflow oluşturuldu", data: yeniWorkflow });
  } catch (err) {
    console.error("❌ Workflow oluşturma hatası:", err);
    res.status(500).json({ error: "Workflow oluşturulamadı" });
  }
});

// Aktif workflow'ları getir
app.get("/api/active-workflows", (req, res) => {
  try {
    const data = fs.readFileSync(activeWorkflowsDosyaYolu, "utf8");
    const activeWorkflows = JSON.parse(data || "[]");
    res.json(activeWorkflows);
  } catch (err) {
    console.error("❌ Active workflows okuma hatası:", err);
    res.status(500).json({ error: "Active workflows okunamadı" });
  }
});

// Workflow başlat
app.post("/api/workflows/:id/start", (req, res) => {
  try {
    const { id } = req.params;
    const { triggerData } = req.body;

    const workflowData = fs.readFileSync(workflowsDosyaYolu, "utf8");
    const workflows = JSON.parse(workflowData || "[]");
    const workflow = workflows.find(w => w.id === id);

    if (!workflow) {
      return res.status(404).json({ error: "Workflow bulunamadı" });
    }

    const aktifWorkflow = {
      id: Date.now().toString(),
      workflowId: id,
      name: workflow.name,
      currentStep: 0,
      status: 'running',
      startedAt: new Date().toISOString(),
      triggerData,
      steps: workflow.steps.map(step => ({
        ...step,
        status: 'pending',
        assignedAt: null,
        completedAt: null
      }))
    };

    // İlk adımı aktif yap
    if (aktifWorkflow.steps.length > 0) {
      aktifWorkflow.steps[0].status = 'active';
      aktifWorkflow.steps[0].assignedAt = new Date().toISOString();
    }

    const activeData = fs.readFileSync(activeWorkflowsDosyaYolu, "utf8");
    const activeWorkflows = JSON.parse(activeData || "[]");
    activeWorkflows.push(aktifWorkflow);

    fs.writeFileSync(activeWorkflowsDosyaYolu, JSON.stringify(activeWorkflows, null, 2));
    res.status(200).json({ message: "Workflow başlatıldı", data: aktifWorkflow });
  } catch (err) {
    console.error("❌ Workflow başlatma hatası:", err);
    res.status(500).json({ error: "Workflow başlatılamadı" });
  }
});

// Workflow adımını tamamla
app.patch("/api/active-workflows/:id/complete-step", (req, res) => {
  try {
    const { id } = req.params;
    const { stepId, result, comments } = req.body;

    const data = fs.readFileSync(activeWorkflowsDosyaYolu, "utf8");
    let activeWorkflows = JSON.parse(data || "[]");
    
    const workflowIndex = activeWorkflows.findIndex(w => w.id === id);
    if (workflowIndex === -1) {
      return res.status(404).json({ error: "Active workflow bulunamadı" });
    }

    const workflow = activeWorkflows[workflowIndex];
    const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
    
    if (stepIndex === -1) {
      return res.status(404).json({ error: "Adım bulunamadı" });
    }

    // Mevcut adımı tamamla
    workflow.steps[stepIndex] = {
      ...workflow.steps[stepIndex],
      status: 'completed',
      completedAt: new Date().toISOString(),
      result,
      comments
    };

    // Sonraki adımı aktif yap
    if (stepIndex + 1 < workflow.steps.length) {
      workflow.steps[stepIndex + 1].status = 'active';
      workflow.steps[stepIndex + 1].assignedAt = new Date().toISOString();
      workflow.currentStep = stepIndex + 1;
    } else {
      // Workflow tamamlandı
      workflow.status = 'completed';
      workflow.completedAt = new Date().toISOString();
    }

    activeWorkflows[workflowIndex] = workflow;
    fs.writeFileSync(activeWorkflowsDosyaYolu, JSON.stringify(activeWorkflows, null, 2));
    
    res.json({ message: "Adım tamamlandı", data: workflow });
  } catch (err) {
    console.error("❌ Workflow adım tamamlama hatası:", err);
    res.status(500).json({ error: "Workflow adımı tamamlanamadı" });
  }
});

// Workflow sil
app.delete("/api/workflows/:id", (req, res) => {
  try {
    const { id } = req.params;
    
    const data = fs.readFileSync(workflowsDosyaYolu, "utf8");
    let workflows = JSON.parse(data || "[]");
    
    const index = workflows.findIndex(w => w.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Workflow bulunamadı" });
    }

    workflows.splice(index, 1);
    fs.writeFileSync(workflowsDosyaYolu, JSON.stringify(workflows, null, 2));
    
    res.json({ message: "Workflow silindi" });
  } catch (err) {
    console.error("❌ Workflow silme hatası:", err);
    res.status(500).json({ error: "Workflow silinemedi" });
  }
});

// 👥 ========== USER MANAGEMENT API ==========
const usersDosyaYolu = path.join(dataKlasoru, "users.json");
const userGroupsDosyaYolu = path.join(dataKlasoru, "user-groups.json");
const permissionsDosyaYolu = path.join(dataKlasoru, "permissions.json");

// Dosya yoksa oluştur
if (!fs.existsSync(usersDosyaYolu)) fs.writeFileSync(usersDosyaYolu, "[]");
if (!fs.existsSync(userGroupsDosyaYolu)) fs.writeFileSync(userGroupsDosyaYolu, "[]");
if (!fs.existsSync(permissionsDosyaYolu)) fs.writeFileSync(permissionsDosyaYolu, "{}");

// Kullanıcı yetkilerini getir
function getUserPermissions(userGroups) {
  try {
    const permissionsData = fs.readFileSync(permissionsDosyaYolu, "utf8");
    const permissions = JSON.parse(permissionsData || "{}");
    
    const userPermissions = {
      pages: {},
      features: {}
    };

    // Sayfa yetkilerini kontrol et
    Object.keys(permissions.pages || {}).forEach(pageKey => {
      const page = permissions.pages[pageKey];
      const pagePermissions = [];
      
      userGroups.forEach(group => {
        if (page.permissions[group]) {
          pagePermissions.push(...page.permissions[group]);
        }
      });
      
      userPermissions.pages[pageKey] = [...new Set(pagePermissions)];
    });

    // Özellik yetkilerini kontrol et
    Object.keys(permissions.features || {}).forEach(featureKey => {
      const feature = permissions.features[featureKey];
      const featurePermissions = [];
      
      userGroups.forEach(group => {
        if (feature.permissions[group]) {
          featurePermissions.push(...feature.permissions[group]);
        }
      });
      
      userPermissions.features[featureKey] = [...new Set(featurePermissions)];
    });

    console.log('🔍 getUserPermissions result:', {
      userGroups,
      pagesCount: Object.keys(userPermissions.pages).length,
      featuresCount: Object.keys(userPermissions.features).length,
      samplePages: Object.keys(userPermissions.pages).slice(0, 3)
    });

    return userPermissions;
  } catch (err) {
    console.error("❌ Yetki hesaplama hatası:", err);
    return { pages: {}, features: {} };
  }
}

// 🔐 Kullanıcı doğrulama
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;
    
    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    const users = JSON.parse(data || "[]");
    
    const user = users.find(u => u.username === username && u.password === password && u.status === 'active');
    
    if (!user) {
      return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    // Son giriş zamanını güncelle
    user.lastLogin = new Date().toISOString();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = user;
    fs.writeFileSync(usersDosyaYolu, JSON.stringify(users, null, 2));

    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      message: "Giriş başarılı", 
      user: userWithoutPassword,
      permissions: getUserPermissions(user.groups)
    });
  } catch (err) {
    console.error("❌ Login hatası:", err);
    res.status(500).json({ error: "Giriş yapılamadı" });
  }
});

// 👥 Kullanıcıları getir
app.get("/api/users", (req, res) => {
  try {
    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    const users = JSON.parse(data || "[]").map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (err) {
    console.error("❌ Kullanıcılar okuma hatası:", err);
    res.status(500).json({ error: "Kullanıcılar okunamadı" });
  }
});

// 👤 Yeni kullanıcı oluştur
app.post("/api/users", (req, res) => {
  try {
    const yeniKullanici = {
      id: `user_${Date.now()}`,
      ...req.body,
      status: req.body.status || 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    const users = JSON.parse(data || "[]");
    
    // Username kontrolü
    const existingUser = users.find(u => u.username === yeniKullanici.username);
    if (existingUser) {
      return res.status(400).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
    }

    users.push(yeniKullanici);
    fs.writeFileSync(usersDosyaYolu, JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = yeniKullanici;
    res.status(200).json({ message: "Kullanıcı oluşturuldu", user: userWithoutPassword });
  } catch (err) {
    console.error("❌ Kullanıcı oluşturma hatası:", err);
    res.status(500).json({ error: "Kullanıcı oluşturulamadı" });
  }
});

// 👥 Kullanıcı gruplarını getir
app.get("/api/user-groups", (req, res) => {
  try {
    const data = fs.readFileSync(userGroupsDosyaYolu, "utf8");
    const groups = JSON.parse(data || "[]");
    res.json(groups);
  } catch (err) {
    console.error("❌ Kullanıcı grupları okuma hatası:", err);
    res.status(500).json({ error: "Kullanıcı grupları okunamadı" });
  }
});

// 🔐 Yetki matrisini getir
app.get("/api/permissions", (req, res) => {
  try {
    const data = fs.readFileSync(permissionsDosyaYolu, "utf8");
    const permissions = JSON.parse(data || "{}");
    res.json(permissions);
  } catch (err) {
    console.error("❌ Yetkiler okuma hatası:", err);
    res.status(500).json({ error: "Yetkiler okunamadı" });
  }
});

// 📊 Sözleşme süre kontrolü endpoint'i
app.get("/api/sozlesme-sure-kontrol", (req, res) => {
  try {
    // Mock sözleşme verileri
    const sozlesmeler = [
      {
        id: 1,
        ad: "Tedarikçi A Sözleşmesi",
        bitisTarihi: "2025-12-31",
        durum: "aktif",
        kalanGun: 149
      },
      {
        id: 2,
        ad: "Tedarikçi B Sözleşmesi",
        bitisTarihi: "2025-09-15",
        durum: "yaklaşan",
        kalanGun: 42
      },
      {
        id: 3,
        ad: "Tedarikçi C Sözleşmesi",
        bitisTarihi: "2025-08-20",
        durum: "kritik",
        kalanGun: 16
      }
    ];

    res.json({
      success: true,
      data: sozlesmeler,
      summary: {
        toplam: sozlesmeler.length,
        aktif: sozlesmeler.filter(s => s.durum === 'aktif').length,
        yaklaşan: sozlesmeler.filter(s => s.durum === 'yaklaşan').length,
        kritik: sozlesmeler.filter(s => s.durum === 'kritik').length
      }
    });
  } catch (err) {
    console.error("❌ Sözleşme kontrolü hatası:", err);
    res.status(500).json({ error: "Sözleşme verileri okunamadı" });
  }
});

// 👤 Kullanıcı güncelleme endpoint'i
app.put("/api/users/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;
    
    console.log("🔄 Kullanıcı güncelleniyor:", userId, updatedData);
    
    // Kullanıcıları oku
    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    let users = JSON.parse(data || "[]");
    
    // Kullanıcıyı bul ve güncelle
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    
    // Kullanıcıyı güncelle (mevcut verileri koru)
    users[userIndex] = {
      ...users[userIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    // Dosyaya kaydet
    fs.writeFileSync(usersDosyaYolu, JSON.stringify(users, null, 2));
    
    console.log("✅ Kullanıcı başarıyla güncellendi:", users[userIndex]);
    res.json({ 
      success: true, 
      message: "Kullanıcı başarıyla güncellendi",
      user: users[userIndex]
    });
  } catch (err) {
    console.error("❌ Kullanıcı güncelleme hatası:", err);
    res.status(500).json({ error: "Kullanıcı güncellenemedi" });
  }
});

// 🔐 Permissions güncelleme endpoint'i
app.put("/api/permissions", (req, res) => {
  try {
    const updatedPermissions = req.body;
    
    console.log("🔄 Yetkiler güncelleniyor:", JSON.stringify(updatedPermissions, null, 2));
    
    // Yetkileri dosyaya kaydet
    fs.writeFileSync(permissionsDosyaYolu, JSON.stringify(updatedPermissions, null, 2));
    
    // Cache busting için random bir token ekle
    const cacheBuster = Date.now();
    
    console.log("✅ Yetkiler başarıyla güncellendi");
    res.json({ 
      success: true, 
      message: "Yetkiler başarıyla güncellendi",
      cacheBuster: cacheBuster,
      requiresRefresh: true // Frontend'e refresh gerekliliğini bildir
    });
  } catch (err) {
    console.error("❌ Yetki güncelleme hatası:", err);
    res.status(500).json({ error: "Yetkiler güncellenemedi" });
  }
});

// 🚀 Server başlatma
const PORT = process.env.PORT || 3001;
const HOST = IS_PRODUCTION ? '0.0.0.0' : 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`
🚀 ===== ELSA TEKSTİL İŞ TAKİP SİSTEMİ =====
📡 Server çalışıyor: ${BASE_URL}
🌍 Environment: ${IS_PRODUCTION ? 'Production' : 'Development'}
🏠 Host: ${HOST}:${PORT}
🔒 JWT Secret: ${JWT_SECRET.substring(0, 10)}...
📂 Uploads: ${uploadsDir}
⏰ Başlangıç: ${new Date().toLocaleString('tr-TR')}
==========================================
  `);
});
