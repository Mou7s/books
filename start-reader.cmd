@echo off
cd /d "%~dp0"
set HOST=127.0.0.1
set PORT=3000
if exist .output\server\index.mjs (
  node .output\server\index.mjs
) else (
  call npm run dev
)
