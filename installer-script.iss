[Setup]
AppName=BlueChip AI Browser
AppVersion=1.0.0
AppPublisher=Bluechip Technologies Asia
AppPublisherURL=https://bluechiptech.asia
AppSupportURL=https://bluechiptech.asia/support
AppUpdatesURL=https://bluechiptech.asia/updates
DefaultDirName={autopf}\BlueChip AI Browser
DefaultGroupName=BlueChip AI Browser
AllowNoIcons=yes
LicenseFile=
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
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1

[Files]
Source: "dist-manual\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\BlueChip AI Browser"; Filename: "{app}\start.bat"
Name: "{group}\{cm:UninstallProgram,BlueChip AI Browser}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\BlueChip AI Browser"; Filename: "{app}\start.bat"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\BlueChip AI Browser"; Filename: "{app}\start.bat"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\start.bat"; Description: "{cm:LaunchProgram,BlueChip AI Browser}"; Flags: nowait postinstall skipifsilent
