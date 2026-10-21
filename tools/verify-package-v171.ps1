$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
$root=[IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
$prefix='GrimWeaver_v1.71/'
foreach($kind in @('Offline','Source')){
 $file=Join-Path (Split-Path $root -Parent) ('GrimWeaver_v1.71_GAL_'+$kind+'.zip')
 $zip=[IO.Compression.ZipFile]::OpenRead($file);$names=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
 try{foreach($entry in $zip.Entries){
  if(!$names.Add($entry.FullName)){throw 'Duplicate archive entry'}
  if(!$entry.FullName.StartsWith($prefix) -or $entry.FullName -match '\.\./|[^\x00-\x7f]'){throw 'Unexpected archive path'}
  $rel=$entry.FullName.Substring($prefix.Length)
  if($rel -match 'verification/|\.gdc$|smoke-build|browser-export|video-probe|/bin/|/obj/|/publish/|Report|报告|核验|核对'){throw "Private/development file in release: $rel"}
  $local=[IO.Path]::GetFullPath((Join-Path $root $rel))
  if(!$local.StartsWith($root+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Path escapes release root'}
  if((Get-Item -LiteralPath $local).Length -ne $entry.Length){throw "File size mismatch: $rel"}
  $stream=$entry.Open();try{$h=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($stream))}finally{$stream.Dispose()}
  if($h -ne (Get-FileHash -LiteralPath $local -Algorithm SHA256).Hash){throw "File hash mismatch: $rel"}
 }
 foreach($required in @('app/ui-v171.js','app/ui-v171.css','app/preferences.js','app/ui-v17.js','app/ui-v17.css','app/effect-model.js','app/presentation-model.js','app/data/effects.js','app/build-document.js','app/data/research.js','app/assets/brand/GrimWeaver.ico','docs/NOTICE.html','docs/CHANGELOG.html','docs/RELEASE_1_71.html','third_party/Rem-PERMISSION.txt','LICENSE.txt')){if(!$names.Contains($prefix+$required)){throw "Missing required file: $required"}}
 if($kind -eq 'Offline' -and !$names.Contains($prefix+'GrimWeaver.exe')){throw 'Executable missing'}
 if($kind -eq 'Source' -and !$names.Contains($prefix+'launcher/Program.cs')){throw 'Launcher source missing'}
 }finally{$zip.Dispose()}
 $hash=(Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash
 if(![IO.File]::ReadAllText($file+'.sha256').StartsWith($hash)){throw 'SHA256 sidecar mismatch'}
 [pscustomobject]@{Kind=$kind;Files=$names.Count;HashesMatch=$true;PrivateDataExcluded=$true;SHA256=$hash} | ConvertTo-Json -Compress
}
