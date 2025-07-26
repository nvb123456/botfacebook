@echo off
echo ==========================================
echo    KIEM TRA CAI DAT
echo ==========================================
echo.

echo [1] Kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo LOI: Node.js chua duoc cai dat
    echo Tai tai: https://nodejs.org
    goto end
) else (
    echo OK: Node.js da cai dat
    node --version
)

echo.
echo [2] Kiem tra npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo LOI: npm chua duoc cai dat
    goto end
) else (
    echo OK: npm da cai dat
    npm --version
)

echo.
echo [3] Kiem tra thu muc node_modules...
if exist "node_modules" (
    echo OK: Dependencies da duoc cai dat
) else (
    echo CANH BAO: Dependencies chua duoc cai dat
    echo Chay: npm install
)

echo.
echo [4] Kiem tra file quan trong...
if exist "server\index.ts" (
    echo OK: Server file ton tai
) else (
    echo LOI: Server file khong ton tai
)

if exist "package.json" (
    echo OK: Package.json ton tai
) else (
    echo LOI: Package.json khong ton tai
)

echo.
echo CAI DAT HOAN TAT! Co the chay bot.

:end
echo.
pause