@echo off
title Facebook Gift Code Bot Server
color 0A

:start
cls
echo ==========================================
echo    FACEBOOK GIFT CODE BOT SERVER
echo ==========================================
echo.
echo Bot dang chay tai: http://localhost:5000
echo Nhan Ctrl+C de dung server
echo.
echo Logs:
echo ------------------------------------------

set NODE_ENV=development
npx tsx server/index.ts

echo.
echo Server da dung. Nhan phim bat ky de khoi dong lai...
pause >nul
goto start