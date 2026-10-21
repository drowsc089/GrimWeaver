$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.IO.Compression
$root=[IO.Path]::GetFullPath((Split-Path $PSScriptRoot -Parent))
& node (Join-Path $PSScriptRoot 'verify-compatibility.cjs')
if($LASTEXITCODE -ne 0){throw 'Compatibility gate failed'}
foreach($kind in @('Offline','Source')){
 $zipPath=Join-Path (Split-Path $root -Parent) ('GrimWeaver_v1.71_GAL_'+$kind+'.zip')
 if(Test-Path -LiteralPath $zipPath){throw "Preserve the existing package before rebuilding: $zipPath"}
 $files=[Collections.Generic.List[IO.FileInfo]]::new()
 Get-ChildItem -LiteralPath (Join-Path $root 'app') -Recurse -File | ForEach-Object {$files.Add($_)}
 Get-ChildItem -LiteralPath (Join-Path $root 'docs') -File | ForEach-Object {$files.Add($_)}
 Get-ChildItem -LiteralPath (Join-Path $root 'third_party') -File -Filter '*.txt' | ForEach-Object {$files.Add($_)}
 foreach($name in @('LICENSE.txt','lucide.min.js','Start-GrimWeaver.cmd')){$files.Add((Get-Item -LiteralPath (Join-Path $root $name)))}
 if($kind -eq 'Offline'){$files.Add((Get-Item -LiteralPath (Join-Path $root 'GrimWeaver.exe')))}
 else{
  Get-ChildItem -LiteralPath (Join-Path $root 'launcher') -File | ForEach-Object {$files.Add($_)}
  foreach($name in @('build-launcher.ps1','build-data-v16.cjs','build-data-v17.cjs','build-research.cjs','load-db.cjs','read-pack.cjs','normalize-research.cjs','upgrade-research-v16.cjs','export-database-cache.cjs','update-data-v171.cjs','verify-v171.cjs','inspect-v13.cjs','verify-compatibility.cjs','package-v171.ps1','verify-package-v171.ps1')){$files.Add((Get-Item -LiteralPath (Join-Path $root ('tools\'+$name))))}
  $files.Add((Get-Item -LiteralPath (Join-Path $root 'tests\legacy-builds.json')))
 }
 $stream=[IO.File]::Open($zipPath,[IO.FileMode]::CreateNew)
 $zip=[IO.Compression.ZipArchive]::new($stream,[IO.Compression.ZipArchiveMode]::Create,$false,[Text.Encoding]::UTF8)
 try{foreach($file in $files){$relative=[IO.Path]::GetRelativePath($root,$file.FullName).Replace('\','/');$entry=$zip.CreateEntry('GrimWeaver_v1.71/'+$relative,[IO.Compression.CompressionLevel]::Optimal);$input=$file.OpenRead();$output=$entry.Open();try{$input.CopyTo($output)}finally{$input.Dispose();$output.Dispose()}}}finally{$zip.Dispose();$stream.Dispose()}
 $hash=(Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash
 [IO.File]::WriteAllText(($zipPath+'.sha256'),$hash+'  '+[IO.Path]::GetFileName($zipPath)+[Environment]::NewLine,[Text.UTF8Encoding]::new($false))
 [pscustomobject]@{Kind=$kind;Files=$files.Count;Bytes=(Get-Item -LiteralPath $zipPath).Length;SHA256=$hash} | ConvertTo-Json -Compress
}
