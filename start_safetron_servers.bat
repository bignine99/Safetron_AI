@echo off
chcp 65001 > nul
echo ====================================================
echo         Safetron AI Integrated Server Starter        
echo ====================================================
echo.

echo [1/2] Starting Next.js Dashboard Server (Port 3000)...
start "Safetron Dashboard (Port 3000)" cmd /k "cd dashboard && npm run dev"

echo [2/2] Starting Python Hero Landing Page Server (Port 8080)...
start "Safetron Hero Landing (Port 8080)" cmd /k "cd hero_landing && python -m http.server 8080"

echo.
echo ====================================================
echo All servers have been successfully launched!
echo Two new terminal windows should have opened.
echo.
echo [Dashboard] http://localhost:3000/safetron
echo [Hero Page] http://localhost:8080/templates/landing.html
echo ====================================================
echo.
pause
