# Download Inno Setup from: https://jrsoftware.org/isinfo.php
# Then use this script to create a professional installer

[Setup]
AppName=BlueChip AI Browser
AppVersion=1.0.0
AppPublisher=Bluechip Technologies Asia
AppPublisherURL=https://bluechiptech.asia
DefaultDirName={autopf}\BlueChip AI Browser
DefaultGroupName=BlueChip AI Browser
AllowNoIcons=yes
OutputDir=installer
OutputBaseFilename=BlueChip-AI-Browser-Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist-manual\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\BlueChip AI Browser"; Filename: "{app}\start.bat"
Name: "{group}\{cm:UninstallProgram,BlueChip AI Browser}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\BlueChip AI Browser"; Filename: "{app}\start.bat"; Tasks: desktopicon

[Run]
Filename: "{app}\start.bat"; Description: "{cm:LaunchProgram,BlueChip AI Browser}"; Flags: nowait postinstall skipifsilent
