@echo off
cd /d "%~dp0"
echo ===========================================
echo  FACEBOOK GIFT CODE BOT - WINDOWS SETUP
echo ===========================================
echo.

echo [1/3] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo KHONG: Node.js chua duoc cai dat!
    echo Vui long tai Node.js tai: https://nodejs.org
    pause
    exit /b 1
) else (
    echo OK: Node.js da duoc cai dat
)

echo.
echo [2/3] Cai dat dependencies...
call npm install
if errorlevel 1 (
    echo LOI: Khong the cai dat dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Khoi chay Facebook Gift Code Bot...
echo Giao dien quan ly: http://localhost:5000
echo Nhan Ctrl+C de dung bot
echo.
set NODE_ENV=development
npx tsx server/index.ts
pause