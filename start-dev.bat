@echo off
echo Starting BlueChip AI Browser...
echo.

echo Step 1: Starting Next.js development server...
start "Next.js Server" cmd /k "npm run dev:next"

echo Step 2: Waiting for Next.js to start...
timeout /t 10 /nobreak > nul

echo Step 3: Starting Electron application...
npm run dev:electron

pause
