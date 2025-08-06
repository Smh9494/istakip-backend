# WordPress Sunucusunda Node.js Projesi Yayınlama

## 🔍 **Sunucu Özelliklerini Kontrol Edin:**

### ✅ **Gerekli Özellikler:**
- **Node.js** desteği (v16+ önerilen)
- **NPM** paket yöneticisi
- **File Manager** erişimi
- **Subdomain** veya **Alt klasör** oluşturma
- **Port** açabilme (3001 portu)
- **SSH** erişimi (ideal)

### 🏢 **Popüler WordPress Hosting Sağlayıcıları:**
- **Hostinger** ✅ (Node.js desteği var)
- **SiteGround** ✅ (Node.js desteği var)  
- **A2 Hosting** ✅ (Node.js desteği var)
- **DigitalOcean** ✅ (Tam kontrol)
- **Vultr** ✅ (VPS desteği)

## 🚀 **Yayınlama Seçenekleri:**

### **Seçenek 1: Alt Domain ile Yayınlama**
```
Ana site: https://sirketiniz.com (WordPress)
İş Takip: https://istakip.sirketiniz.com (Node.js App)
```

### **Seçenek 2: Alt Klasör ile Yayınlama**  
```
Ana site: https://sirketiniz.com (WordPress)
İş Takip: https://sirketiniz.com/istakip (Node.js App)
```

## 📁 **Dosya Yapısı (cPanel/File Manager):**
```
public_html/
├── index.php (WordPress)
├── wp-content/
├── istakip/ (Node.js Backend)
│   ├── server.js
│   ├── package.json
│   ├── data/
│   └── uploads/
└── istakip-frontend/ (React Build)
    ├── index.html
    ├── static/
    └── assets/
```

## ⚙️ **Kurulum Adımları:**

### **1. Backend Hazırlık:**
```bash
# Production build
cd is-takip-mail-server
npm install --production
```

### **2. Frontend Build:**
```bash
# React build oluştur
cd is-takip-frontend-tailwind-ready
npm run build
```

### **3. Dosya Yükleme:**
- **Backend** → `/public_html/istakip/`
- **Frontend Build** → `/public_html/istakip-app/`

### **4. Domain Ayarları:**
```
Subdomain: istakip.sirketiniz.com → /public_html/istakip-app/
API Proxy: istakip.sirketiniz.com/api → localhost:3001
```

## 🔧 **Gerekli Konfigürasyonlar:**

### **Backend (server.js):**
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### **Frontend (.env.production):**
```
REACT_APP_API_URL=https://istakip.sirketiniz.com/api
```

## 🛡️ **Güvenlik Ayarları:**

### **.htaccess (Frontend):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# HTTPS Yönlendirme
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### **PM2 ile Process Management:**
```bash
# PM2 kurulum
npm install -g pm2

# Uygulamayı başlat
pm2 start server.js --name "istakip-backend"
pm2 startup
pm2 save
```

## 📊 **Hosting Sağlayıcı Önerileri:**

| Sağlayıcı | Node.js | SSH | PM2 | Fiyat | Önerilen |
|-----------|---------|-----|-----|-------|----------|
| **Hostinger** | ✅ | ✅ | ✅ | ~$3/ay | ⭐⭐⭐⭐⭐ |
| **SiteGround** | ✅ | ❌ | ❌ | ~$15/ay | ⭐⭐⭐ |
| **A2 Hosting** | ✅ | ✅ | ✅ | ~$8/ay | ⭐⭐⭐⭐ |
| **DigitalOcean** | ✅ | ✅ | ✅ | ~$5/ay | ⭐⭐⭐⭐⭐ |

## 🔥 **Hızlı Başlangıç - Hostinger Örneği:**

### **1. Hostinger Panel:**
- **File Manager** → `/public_html/`
- **Node.js App** oluştur
- **Subdomain** ekle

### **2. Dosya Yükleme:**
```bash
# ZIP olarak hazırla
cd is-takip-mail-server
zip -r backend.zip . -x "node_modules/*"

cd ../is-takip-frontend-tailwind-ready
npm run build
zip -r frontend.zip build/*
```

### **3. Kurulum:**
- `backend.zip` → `/public_html/istakip/`
- `frontend.zip` → `/public_html/istakip-app/`
- Terminal'de: `npm install`

## 🚨 **Önemli Notlar:**

### **Sunucu Gereksinimleri:**
- **RAM:** Minimum 1GB (2GB önerilen)
- **CPU:** 1 Core yeterli
- **Disk:** 5GB+ boş alan
- **Bandwidth:** Unlimited önerilen

### **Backup Stratejisi:**
```bash
# Otomatik backup scripti
#!/bin/bash
tar -czf backup-$(date +%Y%m%d).tar.gz data/ uploads/
```

## 💡 **Alternatif Çözümler:**

### **1. Vercel + PlanetScale:**
- Frontend: Vercel (Ücretsiz)
- Backend: Railway/Render
- Database: PlanetScale

### **2. Netlify + Supabase:**
- Frontend: Netlify (Ücretsiz)
- Backend: Supabase Functions
- Database: Supabase

### **3. WordPress Plugin Yaklaşımı:**
- Backend'i WordPress plugin'e dönüştür
- Frontend'i WordPress tema entegrasyonu
- WordPress REST API kullan

## 🎯 **istakip.elsatekstil.com.tr için Özel Kurulum Rehberi:**

### **1. Domain Yapılandırması:**
```
Ana Site: https://elsatekstil.com.tr (WordPress)
İş Takip: https://istakip.elsatekstil.com.tr (Node.js App)
API: https://istakip.elsatekstil.com.tr/api (Backend)
```

### **2. cPanel/Hosting Panel Ayarları:**

#### **A. Subdomain Oluşturma:**
1. **cPanel** → **Subdomains**
2. **Subdomain:** `istakip`
3. **Domain:** `elsatekstil.com.tr`  
4. **Document Root:** `/public_html/istakip-app/`
5. **Create** tıklayın

#### **B. SSL Sertifikası:**
1. **cPanel** → **SSL/TLS**
2. **Let's Encrypt** ile `istakip.elsatekstil.com.tr` için SSL aktifleştir

### **3. Dosya Yapısı (cPanel File Manager):**
```
public_html/
├── (WordPress dosyaları)
├── istakip-backend/          # Node.js Backend
│   ├── server.js
│   ├── package.json
│   ├── data/
│   └── uploads/
└── istakip-app/              # React Frontend Build
    ├── index.html
    ├── static/
    └── assets/
```

### **4. Adım Adım Yükleme:**

#### **Adım 1: Backend Hazırlık**
```bash
# Lokal geliştirme bilgisayarınızda
cd "f:\İş takip yazılımı2-07\is-takip-mail-server"
npm install --production
```

#### **Adım 2: Frontend Build**
```bash
cd "f:\İş takip yazılımı2-07\is-takip-frontend-tailwind-ready"
npm run build
```

#### **Adım 3: Dosyaları ZIP'le**
```bash
# Backend için (node_modules hariç)
7z a -xr!node_modules backend.zip *

# Frontend build için
7z a frontend.zip build/*
```

#### **Adım 4: cPanel'e Yükleme**
1. **File Manager** aç
2. `/public_html/` klasörüne git
3. **istakip-backend** klasörü oluştur
4. `backend.zip`'i `/public_html/istakip-backend/` içine yükle ve çıkart
5. **istakip-app** klasörü oluştur  
6. `frontend.zip`'i `/public_html/istakip-app/` içine yükle ve çıkart

### **5. Konfigürasyon Dosyaları:**

#### **Backend .env dosyası** (`/public_html/istakip-backend/.env`):
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=elsa-tekstil-secret-2025
DOMAIN=istakip.elsatekstil.com.tr
```

#### **Frontend için .htaccess** (`/public_html/istakip-app/.htaccess`):
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# HTTPS Yönlendirme
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Proxy (Backend'e yönlendirme)
RewriteRule ^api/(.*) http://localhost:3001/api/$1 [P,L]
```

### **6. Node.js Kurulumu (Hosting Panelinde):**

#### **Hostinger/cPanel Node.js App:**
1. **Node.js Selector** → **Create Application**
2. **Node.js Version:** 18.x veya 20.x
3. **Application Root:** `/public_html/istakip-backend/`
4. **Application URL:** `istakip.elsatekstil.com.tr/api`
5. **Startup File:** `server.js`

#### **Terminal/SSH Komutları:**
```bash
cd /home/kullanici/public_html/istakip-backend/
npm install --production
pm2 start server.js --name "istakip-backend"
pm2 startup
pm2 save
```

### **7. Frontend API Konfigürasyonu:**

#### **Çevre değişkeni** (`.env.production`):
```env
REACT_APP_API_URL=https://istakip.elsatekstil.com.tr/api
```

#### **API config dosyası güncellemesi:**
```javascript
// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://istakip.elsatekstil.com.tr/api';
export default API_BASE_URL;
```

### **8. Veritabanı ve Dosya İzinleri:**
```bash
# Dosya izinleri
chmod 755 /public_html/istakip-backend/
chmod 644 /public_html/istakip-backend/data/*.json
chmod 755 /public_html/istakip-backend/uploads/
chmod 644 /public_html/istakip-app/*
```

### **9. Test ve Doğrulama:**

#### **Backend Test:**
```
https://istakip.elsatekstil.com.tr/api/health
```

#### **Frontend Test:**
```
https://istakip.elsatekstil.com.tr
```

#### **Login Test:**
- **Username:** admin
- **Password:** admin123

### **10. Geliştirmeye Devam Etme Workflow:**

#### **Lokal Geliştirme:**
```bash
# Backend
cd "f:\İş takip yazılımı2-07\is-takip-mail-server"
npm start

# Frontend  
cd "f:\İş takip yazılımı2-07\is-takip-frontend-tailwind-ready"
npm start
```

#### **Production'a Deploy:**
```bash
# 1. Frontend build
npm run build

# 2. Backend zip (güncellenen dosyalar)
7z a backend-update.zip server.js package.json src/ data/

# 3. cPanel File Manager'da güncelle
# 4. Node.js App'i restart et
```

### **11. Backup ve Güvenlik:**

#### **Otomatik Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf istakip-backup-$DATE.tar.gz /public_html/istakip-backend/data/ /public_html/istakip-backend/uploads/
```

#### **Güvenlik Ayarları:**
```apache
# .htaccess (istakip-backend için)
<Files "*.json">
    Order Allow,Deny
    Deny from all
</Files>

<Files "package.json">
    Order Allow,Deny  
    Deny from all
</Files>
```

### **12. İzleme ve Maintenance:**

#### **Log İzleme:**
```bash
# PM2 logs
pm2 logs istakip-backend

# Error logs
tail -f /public_html/istakip-backend/error.log
```

#### **Performance İzleme:**
```bash
# PM2 monitoring
pm2 monit
```

## 🚨 **Önemli Hatırlatmalar:**

1. **Domain DNS:** `istakip` subdomain'i hosting sağlayıcınızda otomatik oluşacak
2. **SSL:** Let's Encrypt ile ücretsiz SSL aktifleştirin
3. **Backup:** Günlük backup alın (`data/` ve `uploads/` klasörleri)
4. **Updates:** Geliştirmelerinizi önce lokal test edin
5. **Security:** JSON dosyalarına dış erişimi engelleyin

## 📞 **Destek:**

Kurulum sırasında sorun yaşarsanız:
1. **Hosting panel** ekran görüntüleri paylaşın
2. **Error logs** kontrol edin
3. **Node.js version** uyumluluğunu kontrol edin

Başlamaya hazır mısınız? Hangi adımdan yardım istiyorsunuz? 🚀
