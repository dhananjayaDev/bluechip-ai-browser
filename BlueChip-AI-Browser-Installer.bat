@echo off
title BlueChip AI Browser Installer
color 0A

echo.
echo ========================================
echo   BlueChip AI Browser - Installer
echo   Powered by Bluechip Technologies Asia
echo ========================================
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Administrator privileges required!
    echo Please right-click this file and select "Run as Administrator"
    pause
    exit /b 1
)

echo Installing BlueChip AI Browser...
echo.

REM Create installation directory
set "INSTALL_DIR=%PROGRAMFILES%\BlueChip AI Browser"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM Copy files
echo Copying application files...
xcopy "dist-manual\*" "%INSTALL_DIR%\" /E /I /Y >nul

REM Create desktop shortcut
echo Creating desktop shortcut...
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\BlueChip AI Browser.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\start.bat'; $Shortcut.Save()"

REM Create start menu shortcut
echo Creating start menu shortcut...
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"
if not exist "%START_MENU%\BlueChip AI Browser" mkdir "%START_MENU%\BlueChip AI Browser"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%START_MENU%\BlueChip AI Browser\BlueChip AI Browser.lnk'); $Shortcut.TargetPath = '%INSTALL_DIR%\start.bat'; $Shortcut.Save()"

REM Create uninstaller
echo Creating uninstaller...
echo @echo off > "%INSTALL_DIR%\uninstall.bat"
echo title BlueChip AI Browser Uninstaller >> "%INSTALL_DIR%\uninstall.bat"
echo echo Uninstalling BlueChip AI Browser... >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /s /q "%INSTALL_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo del "%USERPROFILE%\Desktop\BlueChip AI Browser.lnk" >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /s /q "%START_MENU%\BlueChip AI Browser" >> "%INSTALL_DIR%\uninstall.bat"
echo echo Uninstallation complete! >> "%INSTALL_DIR%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\uninstall.bat"

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo BlueChip AI Browser has been installed to:
echo %INSTALL_DIR%
echo.
echo Desktop shortcut created.
echo Start menu shortcut created.
echo.
echo Would you like to launch BlueChip AI Browser now? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    echo Launching BlueChip AI Browser...
    start "" "%INSTALL_DIR%\start.bat"
)

echo.
echo Thank you for choosing BlueChip AI Browser!
echo Powered by Bluechip Technologies Asia - We Build AI Future
echo.
pause
