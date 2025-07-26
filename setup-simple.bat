@echo off
echo =========================================
echo  FACEBOOK GIFT CODE BOT - SETUP DON GIAN
echo =========================================
echo.

echo Dang clear npm cache...
npm cache clean --force

echo.
echo Dang cai dat lai dependencies...
npm install --no-audit --no-fund

if errorlevel 1 (
    echo.
    echo LOI CAI DAT! Thu cac lenh sau:
    echo 1. npm cache clean --force
    echo 2. del package-lock.json
    echo 3. npm install
    echo.
    pause
    exit /b 1
)

echo.
echo CAI DAT THANH CONG!
echo.
echo Khoi chay bot...
set NODE_ENV=development
node_modules\.bin\tsx server/index.ts
pause