@echo off
echo 🔄 Elsa Tekstil İş Takip - Hızlı Güncelleme
echo ========================================

set /p choice="Neyi güncellemek istiyorsunuz? (1:Frontend, 2:Backend, 3:Tümü): "

if "%choice%"=="1" goto frontend
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto all
echo Geçersiz seçenek!
pause
exit /b 1

:frontend
echo.
echo 📦 Frontend build oluşturuluyor...
cd /d "f:\İş takip yazılımı2-07\is-takip-frontend-tailwind-ready"
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build hatası!
    pause
    exit /b 1
)

echo 📁 Frontend dosyaları hazırlanıyor...
cd /d "f:\İş takip yazılımı2-07\is-takip-mail-server"
if exist "update-temp\frontend" rmdir /s /q "update-temp\frontend"
mkdir "update-temp\frontend"
cd /d "f:\İş takip yazılımı2-07\is-takip-frontend-tailwind-ready"
xcopy "build\*" "f:\İş takip yazılımı2-07\is-takip-mail-server\update-temp\frontend\" /E /I /Y

echo ✅ Frontend güncellemesi hazır: update-temp\frontend\
goto end

:backend
echo.
echo 📦 Backend dosyaları hazırlanıyor...
cd /d "f:\İş takip yazılımı2-07\is-takip-mail-server"
if exist "update-temp\backend" rmdir /s /q "update-temp\backend"
mkdir "update-temp\backend"

echo    - Sunucu dosyaları kopyalanıyor...
xcopy "server.js" "update-temp\backend\" /Y
xcopy "package.json" "update-temp\backend\" /Y
xcopy "mailSender.js" "update-temp\backend\" /Y
xcopy "user-management-apis.js" "update-temp\backend\" /Y
xcopy "workflow-apis.js" "update-temp\backend\" /Y

echo ✅ Backend güncellemesi hazır: update-temp\backend\
echo ⚠️  Not: data\ ve uploads\ klasörlerini production'da DEĞİŞTİRMEYİN!
goto end

:all
echo.
echo 📦 Tüm dosyalar güncelleniyor...
call :frontend
call :backend
goto end

:end
echo.
echo 🔄 Güncelleme tamamlandı!
echo.
echo 📋 Yükleme talimatları:
echo    1. cPanel File Manager'a git
echo    2. Eski dosyaları yedekle
echo    3. Yeni dosyaları ilgili klasörlere yükle
echo    4. Node.js App'i restart et
echo.
pause
