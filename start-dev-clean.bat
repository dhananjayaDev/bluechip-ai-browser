@echo off
echo Starting BlueChip AI Browser - Development Mode
echo.

echo Step 1: Killing any existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Step 2: Starting Next.js development server...
start "Next.js Server" cmd /k "npm run dev:next"

echo Step 3: Waiting for Next.js to start...
timeout /t 8 /nobreak > nul

echo Step 4: Starting Electron application...
npm run dev:electron

pause

