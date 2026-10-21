$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
dotnet publish (Join-Path $root 'launcher\GrimWeaver.csproj') -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -o (Join-Path $root 'launcher\publish')
if($LASTEXITCODE -ne 0){throw 'Build failed'}
Copy-Item -LiteralPath (Join-Path $root 'launcher\publish\GrimWeaver.exe') -Destination $root
