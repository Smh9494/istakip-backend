# 🚀 İstakip.elsatekstil.com.tr Kurulum Rehberi

## ✅ Deploy Dosyaları Hazır!

### 📂 Dosya Lokasyonları:
- **Backend:** `f:\İş takip yazılımı2-07\is-takip-mail-server\deploy-temp\backend\`
- **Frontend:** `f:\İş takip yazılımı2-07\is-takip-mail-server\deploy-temp\frontend\`

---

## 🎯 WordPress cPanel'de Kurulum:

### ⚠️ **Node.js Desteği Gerekli!**

**Eğer sunucunuzda Node.js desteği yoksa, aşağıdaki alternatif çözümlerden birini seçin:**

---

## 🔄 **Seçenek 1: Ücretsiz Node.js Hosting + Domain Yönlendirme**

### **A. Backend için Ücretsiz Hosting:**
- **Railway** (Ücretsiz) → Backend API
- **Render** (Ücretsiz) → Backend API  
- **Vercel** (Ücretsiz) → Sadece frontend
- **Netlify** (Ücretsiz) → Sadece frontend

### **B. Domain Ayarları:**
```
Ana Site: https://elsatekstil.com.tr (WordPress)
İş Takip: https://istakip.elsatekstil.com.tr → Railway/Render backend
```

### **C. Kurulum Adımları:**
```
1. Railway.app'e git
2. GitHub ile bağlan
3. Deploy butonuna tıkla
4. Domain ayarları: istakip.elsatekstil.com.tr CNAME railway-domain
```

---

## 🔄 **Seçenek 2: Hosting Değiştirme (Node.js Destekli)**

### **Önerilen Hosting Sağlayıcıları:**
| Sağlayıcı | Node.js | Fiyat/Ay | Önerilen |
|-----------|---------|----------|----------|
| **Hostinger** | ✅ | ~15₺ | ⭐⭐⭐⭐⭐ |
| **DigitalOcean** | ✅ | ~35₺ | ⭐⭐⭐⭐⭐ |
| **Vultr** | ✅ | ~30₺ | ⭐⭐⭐⭐ |
| **A2 Hosting** | ✅ | ~60₺ | ⭐⭐⭐ |

### **Migration Planı:**
```
1. Yeni hosting al (Node.js destekli)
2. WordPress'i migrate et
3. İş takip sistemini kur
4. DNS ayarlarını değiştir
```

---

## 🔄 **Seçenek 3: Hybrid Çözüm (Önerilen)**

### **Mevcut WordPress + Ücretsiz Backend:**
```
Frontend: Mevcut WordPress sunucuda static files
Backend: Railway/Render'da ücretsiz API
Database: Railway'de ücretsiz PostgreSQL
```

### **Avantajlar:**
- ✅ Mevcut WordPress hosting değişmez
- ✅ Ücretsiz backend hosting
- ✅ Hızlı kurulum (30 dakika)
- ✅ SSL otomatik

---

## 🔄 **Seçenek 4: WordPress Plugin Yaklaşımı**

### **Backend'i WordPress Plugin'e Dönüştürme:**
```
1. Node.js API'yi PHP'ye dönüştür
2. WordPress REST API kullan
3. JSON dosyaları wp-content/uploads/'a taşı
4. WordPress admin panelinden yönet
```

### **Dezavantajlar:**
- 🔄 Kod yeniden yazımı gerekli
- 🔄 2-3 hafta süre
- 🔄 WordPress bağımlılığı

---

## 🏆 **En İyi Sunucu Önerileri**

### **🆓 Ücretsiz Seçenekler (Başlangıç için):**

| Platform | RAM | Süre Limiti | Sleep Mode | Ömür Boyu | Önerilen |
|----------|-----|-------------|------------|-----------|----------|
| **Railway** | 1GB | 500 saat/ay | Yok | ✅ Ömür Boyu | ⭐⭐⭐⭐⭐ |
| **Cyclic** | 512MB | Sınırsız | Yok | ✅ Ömür Boyu | ⭐⭐⭐⭐ |
| **Render** | 512MB | 750 saat/ay | 15 dk sonra | ✅ Ömür Boyu | ⭐⭐⭐ |
| **Vercel** | 1GB | Serverless | Yok | ✅ Ömür Boyu | ⭐⭐ (API için) |

#### **🕐 Detaylı Süre Limitleri:**

**Railway (En İyi):**
- ✅ **Ömür boyu ücretsiz** (kredi kartı gerekmez)
- 🕐 **500 saat/ay** = Günde 16+ saat kullanım
- 📊 **1GB RAM + 1GB Disk**
- 🚫 **Sleep modu yok** (sürekli çalışır)
- ⚡ **Hız:** Çok hızlı

**Cyclic (Beta - Süresiz):**
- ✅ **Ömür boyu ücretsiz** (şu an beta)
- 🕐 **Sınırsız çalışma süresi**
- 📊 **512MB RAM**
- 🚫 **Sleep modu yok**
- ⚡ **Hız:** Orta

**Render:**
- ✅ **Ömür boyu ücretsiz**
- 🕐 **750 saat/ay** = Günde 25 saat
- 📊 **512MB RAM**
- 😴 **15 dakika sonra sleep** (ilk istek 30 sn gecikir)
- ⚡ **Hız:** Yavaş başlangıç

**Vercel (Serverless):**
- ✅ **Ömür boyu ücretsiz**
- 🕐 **Sınırsız** (serverless)
- 📊 **1GB RAM**
- 😴 **Cold start** (2-3 sn gecikme)
- ⚡ **Hız:** Orta

### **💰 Uygun Fiyatlı Seçenekler (Profesyonel kullanım):**

| Platform | Fiyat/Ay | RAM | Storage | Türkçe Destek |
|----------|----------|-----|---------|---------------|
| **Hostinger VPS** | 49₺ | 1GB | 20GB SSD | ✅ |
| **DigitalOcean** | 120₺ | 512MB | 10GB SSD | ❌ |
| **Contabo VPS** | 130₺ | 4GB | 200GB SSD | ❌ |
| **Vultr** | 100₺ | 512MB | 10GB SSD | ❌ |

### **🎯 Hangi Seçeneği Öneriyorum:**

#### **Başlangıç: Railway (Ücretsiz)**
```
✅ 5 dakikada kurulum
✅ Otomatik SSL
✅ Custom domain
✅ Hiç uğraşmadan çalışır
✅ 500 saat = günde 16 saat kullanım
```

#### **Profesyonel: Hostinger VPS (49₺/ay)**
```
✅ Türkçe destek chat
✅ cPanel dahil
✅ Kolay yönetim
✅ Yedekleme servisi
✅ 7/24 teknik destek
```

#### **Güçlü Sistem: Contabo VPS (130₺/ay)**
```
✅ 4GB RAM (çok güçlü)
✅ 200GB disk
✅ Çoklu proje kurabilir
✅ Docker desteği
❌ Teknik bilgi gerekir
```

---

## 🚀 **Railway Kurulum - Güncel Yöntem**

### **📋 Railway'de Upload Sorunu Çözümü:**

**Railway artık sadece Git repository'lerden deploy kabul ediyor. Upload özelliği kaldırıldı!**

---

## 🔄 **Alternatif Çözümler:**

### **Çözüm 1: GitHub Desktop ile (En Kolay)**

#### **1️⃣ GitHub Desktop İndir:**
- **https://desktop.github.com** → İndir ve yükle
- GitHub hesabın yoksa oluştur

#### **📋 GitHub Desktop ile Adım Adım:**

#### **⚠️ Sorun Giderme: "No local changes" Sorunu**

**Durum:** GitHub Desktop boş repository oluşturmuş, dosyalar eklenmemiş.

**Çözüm:**

**Yöntem 1: Mevcut Repository'i Düzelt**
```
1. GitHub Desktop'ta Current Repository: istakip-backend'e tıkla
2. "Show in Explorer" seç
3. Açılan klasörde ALL dosyaları sil (.git hariç)
4. Backend klasöründen TÜM dosyaları kopyala:
   📂 f:\İş takip yazılımı2-07\is-takip-mail-server\*
5. Repository klasörüne yapıştır
6. GitHub Desktop'a geri dön → Dosyalar gözükecek
```

**Yöntem 2: Yeniden Başla (Tavsiye)**
```
1. GitHub Desktop → Current Repository → Remove
2. File → Add Local Repository
3. Choose → f:\İş takip yazılımı2-07\is-takip-mail-server
4. "create a repository" → Initialize
5. Dosyalar otomatik gözükecek
```

#### **🌐 Alternatif: GitHub Web Üzerinden (Daha Kolay)**

**GitHub Desktop ile sorun yaşıyorsanız bu yöntemi deneyin:**

**1. GitHub Repository Oluştur:**
```
1. https://github.com → Giriş yap
2. Sağ üstte "+" → "New repository"
3. Repository name: istakip-backend
4. Description: İş Takip Sistemi Backend API
5. Public seç (Private DEĞIL)
6. "Add a README file" işaretini KALDIR
7. "Add .gitignore" → Node seç
8. "Create repository" tıkla
```

**2. ZIP Dosyasını Yükle:**
```
1. Repository sayfasında "uploading an existing file" linkine tıkla
2. f:\İş takip yazılımı2-07\is-takip-mail-server\istakip-backend.zip
   dosyasını sürükle-bırak (132MB)
3. Commit message: "Initial commit - İş Takip Backend"
4. "Commit changes" tıkla
5. GitHub otomatik olarak ZIP'i açacak
```

**3. Repository Hazır!**
```
✅ Repository URL: https://github.com/kullaniciadi/istakip-backend
✅ Dosyalar otomatik görünür
✅ Railway'de deploy için hazır
```

---

#### **📋 GitHub Desktop Yöntemi (İsteğe Bağlı)**

**Eğer GitHub Desktop ile devam etmek istiyorsanız:**

```
1. GitHub Desktop → Current Repository → Remove
2. File → Add Local Repository
3. Choose → f:\İş takip yazılımı2-07\is-takip-mail-server
4. "create a repository" → Initialize

**3. Repository Oluştur:**
- **Create Repository** butonuna tıkla
- Klasörde `.git` klasörü oluşacak

**4. Dosyaları Commit Et:**
- Sol tarafta tüm dosyalar gözükecek
- **Summary** kutusuna: `Initial commit - İş Takip Backend`
- **Commit to main** butonuna tıkla

**5. GitHub'a Yükle:**
- **Publish repository** butonuna tıkla
- **Keep this code private** işaretini KALDIR (Public olsun)
- **Publish Repository** tıkla

**7. Railway'de Deploy:**
```
1. https://railway.app → Sign in with GitHub
2. New Project → Deploy from GitHub repo
3. "istakip-backend" repository'sini seç
4. Deploy butonuna tıkla
5. Environment Variables ekle:
   - NODE_ENV=production
   - JWT_SECRET=elsa_tekstil_jwt_secret_2024_railway
   - PORT=$PORT
   - CORS_ORIGIN=https://istakip.elsatekstil.com.tr
6. Deploy işlemini bekle (5-10 dakika)
```

**8. Domain Al:**
- Deploy tamamlandığında Railway size bir domain verecek
- Örn: `istakip-backend-production-abc123.up.railway.app`
- Bu domain'i kopyalayın

---

### **Çözüm 2: Git Komut Satırı (Gelişmiş)**

#### **1️⃣ Git Kur:**
- **https://git-scm.com/download/win** → İndir ve yükle

#### **2️⃣ GitHub Repository Oluştur:**
- **https://github.com** → **New Repository**
- Repository adı: `istakip-backend`
- **Public** seç → **Create**

---

### **Çözüm 3: Render ile Hızlı Deploy (Tavsiye)**

#### **📦 Render - ZIP Upload Destekli:**

**1️⃣ Render'a Git:**
- **https://render.com** → **Get Started**
- GitHub ile giriş yap

**2️⃣ Web Service Oluştur:**
- **New** → **Web Service**
- **Deploy an existing image or build and deploy from a Git repository**
- **Public Git repository** seç

**3️⃣ GitHub Repo Linkini Al:**
- **https://github.com/new** → Repository oluştur
- Repository adı: `istakip-backend-render`
- **Upload files** → ZIP dosyasını sürükle-bırak
- **Commit changes**

**4️⃣ Render'da Deploy:**
- Repository URL'i yapıştır
- **Connect** → **Create Web Service**

#### **⚡ Hemen Kullanılabilir:**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** `NODE_ENV=production`

---

### **Çözüm 4: En Basit - Cyclic (1 Dakika)**

#### **🚀 Cyclic - En Kolay Upload:**

**1️⃣ Cyclic'e Git:**
- **https://app.cyclic.sh** → **Login with GitHub**

**2️⃣ Deploy:**
- **Link Your Own** → **From GitHub**
- **Upload ZIP** seçeneği var!

**3️⃣ ZIP Upload:**
- `istakip-backend.zip` dosyasını yükle
- Otomatik deploy başlar

#### **📍 ZIP Dosya Lokasyonu:**
```bash
# Terminal'de
cd "f:\İş takip yazılımı2-07\is-takip-mail-server"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/kullaniciadi/istakip-backend.git
git push -u origin main
```

#### **2️⃣ Railway'e Deploy:**
```
1. https://railway.app → Sign up with GitHub
2. New Project → Deploy from GitHub repo
3. istakip-backend repository seç
4. Deploy → Otomatik başlayacak
```

#### **3️⃣ Domain Ayarları:**
```
Railway Dashboard'da:
1. Settings → Custom Domain
2. istakip-api.elsatekstil.com.tr ekle
3. DNS ayarları: CNAME railway-domain'e yönlendir
```

#### **4️⃣ Frontend Static Hosting:**
```
Mevcut WordPress sunucuda:
1. /public_html/istakip/ klasörü oluştur
2. deploy-temp/frontend/ dosyalarını yükle
3. .env.production: REACT_APP_API_URL=https://istakip-api.elsatekstil.com.tr
```

### **📊 Maliyet Karşılaştırma:**
| Çözüm | Backend | Frontend | Toplam/Ay |
|-------|---------|----------|-----------|
| **Railway + Mevcut** | Ücretsiz | Mevcut | 0₺ |
| **Node.js Hosting** | 15-60₺ | Dahil | 15-60₺ |
| **Hosting Değiştir** | Dahil | Dahil | 50-100₺ |

### **🎯 Hangi Seçeneği Öneriyorum:**

#### **En Kolay: Railway + Mevcut Hosting**
```
✅ Maliyet: 0₺
✅ Kurulum: 30 dakika
✅ Bakım: Kolay
✅ Performans: Yüksek
```

---

## 🔧 **Railway Kurulum Detayları:**

### 1️⃣ **Subdomain Oluştur:**
- **cPanel** → **Subdomains**
- **Subdomain:** `istakip`
- **Domain:** `elsatekstil.com.tr`
- **Document Root:** `/public_html/istakip-app/`
- ✅ **Create**

### 2️⃣ **Dosya Yükleme (File Manager):**

#### **A. Backend Yükleme:**
```
1. /public_html/ klasörüne git
2. "istakip-backend" klasörü oluştur
3. Bilgisayarınızdan bu konuma git:
   📂 f:\İş takip yazılımı2-07\is-takip-mail-server\deploy-temp\backend\
4. İçindeki TÜM dosyaları seç (.env, server.js, data/, uploads/ vb.)
5. ZIP olarak sıkıştır (backend.zip)
6. cPanel File Manager'da /public_html/istakip-backend/ içine yükle
7. ZIP'i extract et (çıkart)
```

#### **B. Frontend Yükleme:**
```
1. "istakip-app" klasörü oluştur (zaten subdomain ile oluşacak)
2. Bilgisayarınızdan bu konuma git:
   📂 f:\İş takip yazılımı2-07\is-takip-mail-server\deploy-temp\frontend\
3. İçindeki TÜM dosyaları seç (index.html, static/, .htaccess vb.)
4. ZIP olarak sıkıştır (frontend.zip)
5. cPanel File Manager'da /public_html/istakip-app/ içine yükle
6. ZIP'i extract et (çıkart)
```

### 3️⃣ **Node.js App Oluştur:**
- **cPanel** → **Node.js**
- **Create Application:**
  - **Node.js Version:** 18.x veya üzeri
  - **Application Mode:** Production
  - **Application Root:** `istakip-backend`
  - **Application URL:** `istakip.elsatekstil.com.tr/api`
  - **Application Startup File:** `server.js`

### 4️⃣ **Dependencies Yükleme:**
```bash
# Node.js App terminal'de çalıştır:
npm install --production
```

### 5️⃣ **SSL Sertifikası:**
- **cPanel** → **SSL/TLS**
- **Let's Encrypt** → `istakip.elsatekstil.com.tr` için aktifleştir

---

## 🧪 Test Adımları:

### **Backend Test:**
```
https://istakip.elsatekstil.com.tr/api/health
```

### **Frontend Test:**
```
https://istakip.elsatekstil.com.tr
```

### **Login Test:**
- **Admin:** admin / admin123
- **AR-GE:** arge_user / arge123
- **Muhasebe:** muhasebe_user / muhasebe123

---

## 🔄 Gelişmeye Devam Etme:

### **Lokal Geliştirme:**
```bash
# Backend
cd "f:\İş takip yazılımı2-07\is-takip-mail-server"
npm start

# Frontend
cd "f:\İş takip yazılımı2-07\is-takip-frontend-tailwind-ready"
npm start
```

### **Production'a Güncelleme:**
```bash
# Hızlı güncelleme scripti
.\update-elsa.bat

# Manuel güncelleme:
# 1. npm run build (frontend)
# 2. Değişen dosyaları cPanel'e yükle
# 3. Node.js App'i restart et
```

---

## 🚨 Önemli Notlar:

### **Dosya İzinleri:**
- Backend: `755`
- JSON dosyalar: `644`
- Uploads: `755`

### **Backup:**
- `data/` klasörü → Günlük yedek
- `uploads/` klasörü → Günlük yedek
- Database JSON dosyaları → Kritik!

### **Güvenlik:**
- `.htaccess` dosyaları yüklendi ✅
- JSON dosyalara dış erişim engellendi ✅
- Environment variables korundu ✅

---

## 📞 Kurulum Desteği:

### **Sorun Giderme:**
1. **Node.js App çalışmıyor:** Terminal'de `npm install` çalıştır
2. **API çalışmıyor:** Port 3001 açık olduğundan emin ol
3. **Frontend yüklenmiyor:** .htaccess doğru yüklendi mi kontrol et
4. **SSL hatası:** Let's Encrypt SSL aktifleştir

### **Log Kontrol:**
```bash
# cPanel Terminal'de:
tail -f /home/kullanici/public_html/istakip-backend/error.log
```

---

## 🎉 Başarılı Kurulum!

✅ Site: https://istakip.elsatekstil.com.tr
✅ API: https://istakip.elsatekstil.com.tr/api
✅ Admin Panel: https://istakip.elsatekstil.com.tr (admin/admin123)

### 🌍 **Tamamen Serverda Çalışan Sistem:**

#### **✅ İnternet ile Erişim:**
- **Ofisten:** https://istakip.elsatekstil.com.tr
- **Evden:** https://istakip.elsatekstil.com.tr  
- **Mobilden:** https://istakip.elsatekstil.com.tr
- **Her yerden:** Sadece internet bağlantısı yeterli

#### **✅ Server Üzerinde:**
- **Frontend:** Static dosyalar (HTML/CSS/JS)
- **Backend:** Node.js API sürekli çalışır
- **Database:** JSON dosyaları server diskinde
- **Uploads:** Resimler server diskinde
- **Backup:** Otomatik sunucu yedekleri

#### **✅ Avantajlar:**
- **Çok kullanıcılı:** Aynı anda birden çok kişi
- **Merkezi veri:** Tüm veriler tek yerde
- **Otomatik yedek:** Hosting sağlayıcısı yedekler
- **SSL güvenliği:** HTTPS ile şifreli bağlantı
- **24/7 erişim:** Sürekli açık

#### **⚠️ Gereksinimler:**
- **İnternet bağlantısı:** Kullanım için gerekli
- **Modern tarayıcı:** Chrome, Firefox, Safari, Edge
- **JavaScript aktif:** Tarayıcıda açık olmalı

**Şirketinizde kullanıma hazır!** 🚀
