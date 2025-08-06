@echo off
echo 🚀 Elsa Tekstil İş Takip - Production Deploy
echo ==========================================

echo.
echo 📦 1. Frontend Build oluşturuluyor...
cd /d "f:\İş takip yazılımı2-07\is-takip-frontend-tailwind-ready"
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build hatası!
    pause
    exit /b 1
)

echo.
echo 📦 2. Backend production dependencies kontrol ediliyor...
cd /d "f:\İş takip yazılımı2-07\is-takip-mail-server"
call npm install --production --silent

echo.
echo 📁 3. Deploy dosyaları hazırlanıyor...

REM Backend için gerekli dosyaları kopyala (node_modules hariç)
if exist "deploy-temp" rmdir /s /q "deploy-temp"
mkdir "deploy-temp\backend"
mkdir "deploy-temp\frontend"

echo    - Backend dosyaları kopyalanıyor...
xcopy "server.js" "deploy-temp\backend\" /Y
xcopy "package.json" "deploy-temp\backend\" /Y
xcopy "mailSender.js" "deploy-temp\backend\" /Y
xcopy "user-management-apis.js" "deploy-temp\backend\" /Y
xcopy "workflow-apis.js" "deploy-temp\backend\" /Y
xcopy "railway.json" "deploy-temp\backend\" /Y
xcopy "README.md" "deploy-temp\backend\" /Y
xcopy "data\*" "deploy-temp\backend\data\" /E /I /Y
xcopy "uploads\*" "deploy-temp\backend\uploads\" /E /I /Y

echo    - Frontend build kopyalanıyor...
cd /d "f:\İş takip yazılımı2-07\is-takip-frontend-tailwind-ready"
xcopy "build\*" "f:\İş takip yazılımı2-07\is-takip-mail-server\deploy-temp\frontend\" /E /I /Y

cd /d "f:\İş takip yazılımı2-07\is-takip-mail-server"

echo.
echo 📋 4. .htaccess dosyaları oluşturuluyor...

REM Frontend .htaccess
echo RewriteEngine On > "deploy-temp\frontend\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-f >> "deploy-temp\frontend\.htaccess"
echo RewriteCond %%{REQUEST_FILENAME} !-d >> "deploy-temp\frontend\.htaccess"
echo RewriteRule . /index.html [L] >> "deploy-temp\frontend\.htaccess"
echo. >> "deploy-temp\frontend\.htaccess"
echo # HTTPS Yönlendirme >> "deploy-temp\frontend\.htaccess"
echo RewriteCond %%{HTTPS} off >> "deploy-temp\frontend\.htaccess"
echo RewriteRule ^^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301] >> "deploy-temp\frontend\.htaccess"
echo. >> "deploy-temp\frontend\.htaccess"
echo # API Proxy >> "deploy-temp\frontend\.htaccess"
echo RewriteRule ^^api/(.*) http://localhost:3001/api/$1 [P,L] >> "deploy-temp\frontend\.htaccess"

REM Backend .htaccess (güvenlik)
echo ^<Files "*.json"^> > "deploy-temp\backend\.htaccess"
echo     Order Allow,Deny >> "deploy-temp\backend\.htaccess"
echo     Deny from all >> "deploy-temp\backend\.htaccess"
echo ^</Files^> >> "deploy-temp\backend\.htaccess"
echo. >> "deploy-temp\backend\.htaccess"
echo ^<Files "package.json"^> >> "deploy-temp\backend\.htaccess"
echo     Order Allow,Deny >> "deploy-temp\backend\.htaccess"
echo     Deny from all >> "deploy-temp\backend\.htaccess"
echo ^</Files^> >> "deploy-temp\backend\.htaccess"

echo.
echo 🌍 5. Production environment dosyası...
echo NODE_ENV=production > "deploy-temp\backend\.env"
echo PORT=3001 >> "deploy-temp\backend\.env"
echo JWT_SECRET=elsa-tekstil-secret-2025 >> "deploy-temp\backend\.env"
echo DOMAIN=istakip.elsatekstil.com.tr >> "deploy-temp\backend\.env"

echo.
echo ✅ Deploy dosyaları hazır!
echo.
echo 📂 Deploy klasörü: %cd%\deploy-temp\
echo    📁 backend\     → /public_html/istakip-backend/ klasörüne yükle
echo    📁 frontend\    → /public_html/istakip-app/ klasörüne yükle
echo.
echo 🔄 Sonraki adımlar:
echo    1. cPanel File Manager ile dosyaları yükle
echo    2. Node.js App oluştur (Application Root: istakip-backend)
echo    3. istakip subdomain oluştur (Document Root: istakip-app)
echo    4. SSL sertifikası aktifleştir
echo.
echo 🌐 Site: https://istakip.elsatekstil.com.tr
echo 🔧 API:  https://istakip.elsatekstil.com.tr/api
echo.
pause
