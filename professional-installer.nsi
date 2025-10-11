# Download NSIS from: https://nsis.sourceforge.io/
# Then use this script to create a professional installer

!define APPNAME "BlueChip AI Browser"
!define COMPANYNAME "Bluechip Technologies Asia"
!define DESCRIPTION "AI-powered desktop browser"
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0
!define HELPURL "https://bluechiptech.asia/support"
!define UPDATEURL "https://bluechiptech.asia/updates"
!define ABOUTURL "https://bluechiptech.asia"
!define INSTALLSIZE 50000

RequestExecutionLevel admin
InstallDir "$PROGRAMFILES\${APPNAME}"
Name "${APPNAME}"
outFile "BlueChip-AI-Browser-Setup.exe"

!include LogicLib.nsh

page directory
page instfiles

!macro VerifyUserIsAdmin
UserInfo::GetAccountType
pop $0
${If} $0 != "admin"
    messageBox mb_iconstop "Administrator rights required!"
    setErrorLevel 740
    quit
${EndIf}
!macroend

function .onInit
    setShellVarContext all
    !insertmacro VerifyUserIsAdmin
functionEnd

section "install"
    setOutPath $INSTDIR
    file /r "dist-manual\*"
    
    writeUninstaller "$INSTDIR\uninstall.exe"
    
    createDirectory "$SMPROGRAMS\${APPNAME}"
    createShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\start.bat" "" "$INSTDIR\start.bat"
    createShortCut "$SMPROGRAMS\${APPNAME}\Uninstall.lnk" "$INSTDIR\uninstall.exe"
    
    createShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\start.bat" "" "$INSTDIR\start.bat"
sectionEnd

section "uninstall"
    delete "$INSTDIR\uninstall.exe"
    rmDir /r "$INSTDIR"
    
    delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
    delete "$SMPROGRAMS\${APPNAME}\Uninstall.lnk"
    rmDir "$SMPROGRAMS\${APPNAME}"
    
    delete "$DESKTOP\${APPNAME}.lnk"
sectionEnd
