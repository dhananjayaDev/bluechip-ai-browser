@echo off
echo Starting BlueChip AI Browser...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Electron is available
if not exist "node_modules\.bin\electron.cmd" (
    echo ERROR: Electron is not installed
    echo Please run: npm install
    pause
    exit /b 1
)

REM Start the application
echo Starting BlueChip AI Browser...
node_modules\.bin\electron.cmd electron/main-browser.js

pause
