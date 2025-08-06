#!/bin/bash

echo "🚀 Elsa Tekstil İş Takip - Production Deploy"
echo "=========================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}📦 1. Frontend Build oluşturuluyor...${NC}"
cd "f:/İş takip yazılımı2-07/is-takip-frontend-tailwind-ready"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build hatası!${NC}"
    exit 1
fi

echo -e "\n${BLUE}📦 2. Backend production dependencies kontrol ediliyor...${NC}"
cd "f:/İş takip yazılımı2-07/is-takip-mail-server"
npm install --production --silent

echo -e "\n${BLUE}📁 3. Deploy dosyaları hazırlanıyor...${NC}"

# Deploy klasörünü temizle ve oluştur
rm -rf deploy-temp
mkdir -p deploy-temp/{backend,frontend}

echo -e "    ${YELLOW}- Backend dosyaları kopyalanıyor...${NC}"
cp server.js deploy-temp/backend/
cp package.json deploy-temp/backend/
cp mailSender.js deploy-temp/backend/
cp user-management-apis.js deploy-temp/backend/
cp workflow-apis.js deploy-temp/backend/
cp railway.json deploy-temp/backend/
cp README.md deploy-temp/backend/
cp -r data deploy-temp/backend/
cp -r uploads deploy-temp/backend/

echo -e "    ${YELLOW}- Frontend build kopyalanıyor...${NC}"
cd "f:/İş takip yazılımı2-07/is-takip-frontend-tailwind-ready"
cp -r build/* "f:/İş takip yazılımı2-07/is-takip-mail-server/deploy-temp/frontend/"

cd "f:/İş takip yazılımı2-07/is-takip-mail-server"

echo -e "\n${BLUE}📋 4. .htaccess dosyaları oluşturuluyor...${NC}"

# Frontend .htaccess
cat > deploy-temp/frontend/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# HTTPS Yönlendirme
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Proxy
RewriteRule ^api/(.*) http://localhost:3001/api/$1 [P,L]
EOF

# Backend .htaccess (güvenlik)
cat > deploy-temp/backend/.htaccess << 'EOF'
<Files "*.json">
    Order Allow,Deny
    Deny from all
</Files>

<Files "package.json">
    Order Allow,Deny
    Deny from all
</Files>
EOF

echo -e "\n${BLUE}🌍 5. Production environment dosyası...${NC}"
cat > deploy-temp/backend/.env << 'EOF'
NODE_ENV=production
PORT=3001
JWT_SECRET=elsa-tekstil-secret-2025
DOMAIN=istakip.elsatekstil.com.tr
EOF

echo -e "\n${GREEN}✅ Deploy dosyaları hazır!${NC}"
echo
echo -e "${BLUE}📂 Deploy klasörü:${NC} $(pwd)/deploy-temp/"
echo -e "    ${YELLOW}📁 backend/${NC}     → /public_html/istakip-backend/ klasörüne yükle"
echo -e "    ${YELLOW}📁 frontend/${NC}    → /public_html/istakip-app/ klasörüne yükle"
echo
echo -e "${BLUE}🔄 Sonraki adımlar:${NC}"
echo "    1. cPanel File Manager ile dosyaları yükle"
echo "    2. Node.js App oluştur (Application Root: istakip-backend)"
echo "    3. istakip subdomain oluştur (Document Root: istakip-app)"
echo "    4. SSL sertifikası aktifleştir"
echo
echo -e "${GREEN}🌐 Site:${NC} https://istakip.elsatekstil.com.tr"
echo -e "${GREEN}🔧 API:${NC}  https://istakip.elsatekstil.com.tr/api"
echo

read -p "Devam etmek için Enter'a basın..."
