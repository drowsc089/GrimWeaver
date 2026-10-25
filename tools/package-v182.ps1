param([Parameter(Mandatory=$true)][string]$OutputDirectory)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
$root=[IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
$out=[IO.Path]::GetFullPath($OutputDirectory)
if(!(Test-Path -LiteralPath $out -PathType Container)){throw 'The output parent directory must already exist'}
& node (Join-Path $PSScriptRoot 'verify-compatibility.cjs')
if($LASTEXITCODE){throw 'Compatibility gate failed'}
& node (Join-Path $PSScriptRoot 'verify-v18.cjs')
if($LASTEXITCODE){throw 'v1.8 regression gate failed'}
& node (Join-Path $PSScriptRoot 'verify-v181.cjs')
if($LASTEXITCODE){throw 'v1.82 model gate failed'}
& node (Join-Path $PSScriptRoot 'verify-v182.cjs')
if($LASTEXITCODE){throw 'v1.82 composition gate failed'}
$common=[Collections.Generic.List[IO.FileInfo]]::new()
foreach($folder in @('app','docs')){Get-ChildItem -LiteralPath (Join-Path $root $folder) -Recurse -File | ForEach-Object {$common.Add($_)}}
Get-ChildItem -LiteralPath (Join-Path $root 'third_party') -File -Filter '*.txt' | ForEach-Object {$common.Add($_)}
foreach($name in @('LICENSE.txt','lucide.min.js','Start-GrimWeaver.cmd','README.md')){$common.Add((Get-Item -LiteralPath (Join-Path $root $name)))}
$source=[Collections.Generic.List[IO.FileInfo]]::new()
foreach($f in $common){$source.Add($f)}
foreach($folder in @('tools','tests')){Get-ChildItem -LiteralPath (Join-Path $root $folder) -File | Where-Object {$_.Extension -in @('.cjs','.ps1','.md','.json')} | ForEach-Object {$source.Add($_)}}
foreach($name in @('launcher/Program.cs','launcher/GrimWeaver.csproj','.gitignore','.gitattributes')){$source.Add((Get-Item -LiteralPath (Join-Path $root $name)))}
$destination=Join-Path $out 'GrimWeaver_v1.82'
if(Test-Path -LiteralPath $destination){throw 'Preserve the existing v1.82 folder before rebuilding'}
foreach($kind in @('Offline','Source')){if(Test-Path -LiteralPath (Join-Path $out ('GrimWeaver_v1.82_GAL_'+$kind+'.zip'))){throw 'Preserve the existing v1.82 archives before rebuilding'}}
New-Item -ItemType Directory -Path $destination | Out-Null
foreach($kind in @('Offline','Source')){
 $files=[Collections.Generic.List[IO.FileInfo]]::new()
 foreach($f in $(if($kind -eq 'Offline'){$common}else{$source})){$files.Add($f)}
 if($kind -eq 'Offline'){$files.Add((Get-Item -LiteralPath (Join-Path $root 'GrimWeaver.exe')))}
 $zipPath=Join-Path $out ('GrimWeaver_v1.82_GAL_'+$kind+'.zip')
 $stream=[IO.File]::Open($zipPath,[IO.FileMode]::CreateNew)
 $zip=[IO.Compression.ZipArchive]::new($stream,[IO.Compression.ZipArchiveMode]::Create,$false,[Text.Encoding]::UTF8)
 try{foreach($file in $files){$relative=[IO.Path]::GetRelativePath($root,$file.FullName).Replace('\','/');if($relative -match 'verification/|\.gdc$|preferences\.json$|/bin/|/obj/|/publish/|^\.git/'){throw 'Unexpected private or build file'}
  $entry=$zip.CreateEntry('GrimWeaver_v1.82/'+$relative,[IO.Compression.CompressionLevel]::Optimal);$input=$file.OpenRead();$output=$entry.Open();try{$input.CopyTo($output)}finally{$input.Dispose();$output.Dispose()}
  if($kind -eq 'Offline'){$target=Join-Path $destination $relative;$parent=Split-Path $target -Parent;New-Item -ItemType Directory -Path $parent -Force | Out-Null;Copy-Item -LiteralPath $file.FullName -Destination $target}
 }}finally{$zip.Dispose();$stream.Dispose()}
 $hash=(Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
 [IO.File]::WriteAllText(($zipPath+'.sha256'),$hash+'  '+[IO.Path]::GetFileName($zipPath)+[Environment]::NewLine,[Text.UTF8Encoding]::new($false))
 [pscustomobject]@{Kind=$kind;Files=$files.Count;Bytes=(Get-Item -LiteralPath $zipPath).Length;SHA256=$hash} | ConvertTo-Json -Compress
}
