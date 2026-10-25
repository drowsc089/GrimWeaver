param([Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
$root=[IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
foreach($kind in @('Offline','Source')){
 $file=Join-Path $OutputDirectory ('GrimWeaver_v1.82_GAL_'+$kind+'.zip')
 $names=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
 $zip=[IO.Compression.ZipFile]::OpenRead($file)
 try{foreach($entry in $zip.Entries){
  if(!$names.Add($entry.FullName)){throw 'Duplicate archive entry'}
  if(!$entry.FullName.StartsWith('GrimWeaver_v1.82/') -or $entry.FullName -match '\.\./|[^\x00-\x7f]'){throw 'Unexpected archive path'}
  $rel=$entry.FullName.Substring('GrimWeaver_v1.82/'.Length)
  if($rel -match 'verification/|\.gdc$|preferences\.json$|/bin/|/obj/|/publish/|^\.git/|Report|报告|核验|截图'){throw ('Private/development data in archive: '+$rel)}
  $local=[IO.Path]::GetFullPath((Join-Path $root $rel))
  if(!$local.StartsWith($root+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Path escaped source root'}
  if((Get-Item -LiteralPath $local).Length -ne $entry.Length){throw ('Size mismatch: '+$rel)}
  $s=$entry.Open();try{$hash=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($s))}finally{$s.Dispose()}
  if($hash -ne (Get-FileHash -LiteralPath $local -Algorithm SHA256).Hash){throw ('Hash mismatch: '+$rel)}
 }
 foreach($required in @('app/catalog-model.js','app/skill-damage.js','app/ui-v18.js','app/ui-v18.css','app/data/research.js','app/data/effects.js','docs/RELEASE_1_82.html','docs/NOTICE.html','third_party/Rem-PERMISSION.txt','README.md')){if(!$names.Contains('GrimWeaver_v1.82/'+$required)){throw ('Missing: '+$required)}}
 if($kind -eq 'Offline' -and !$names.Contains('GrimWeaver_v1.82/GrimWeaver.exe')){throw 'Executable missing'}
 if($kind -eq 'Source' -and (!$names.Contains('GrimWeaver_v1.82/launcher/Program.cs') -or $names.Contains('GrimWeaver_v1.82/GrimWeaver.exe'))){throw 'Source-only archive contract failed'}
 }finally{$zip.Dispose()}
 $hash=(Get-FileHash -LiteralPath $file -Algorithm SHA256).Hash
 if(![IO.File]::ReadAllText($file+'.sha256').StartsWith($hash)){throw 'Checksum sidecar mismatch'}
 [pscustomobject]@{Kind=$kind;Files=$names.Count;HashesMatch=$true;PrivateDataExcluded=$true;SHA256=$hash} | ConvertTo-Json -Compress
}
