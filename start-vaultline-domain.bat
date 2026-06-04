@echo off
setlocal EnableExtensions
title Vaultline - ukrainecommunity.pp.ua
cd /d "%~dp0"

set "PUBLIC_DOMAIN=ukrainecommunity.pp.ua"
set "PORT=4173"
set "HOST=127.0.0.1"
set "BASE_URL=https://%PUBLIC_DOMAIN%"
set "TRUST_PROXY=true"
set "COOKIE_SECURE=auto"
set "ALLOWED_HOSTS=%PUBLIC_DOMAIN%,www.%PUBLIC_DOMAIN%,localhost,127.0.0.1,[::1]"
if "%TUNNEL_NAME%"=="" set "TUNNEL_NAME=vaultline"

echo.
echo ============================================================
echo  Vaultline secure one-click launcher
echo ============================================================
echo  Domain:        https://%PUBLIC_DOMAIN%
echo  Internal app:  http://127.0.0.1:%PORT%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Install Node.js LTS first: https://nodejs.org/
  pause
  exit /b 1
)

if not exist "data" mkdir "data"
if not exist "storage" mkdir "storage"
if not exist ".env" (
  echo [SETUP] Creating .env for %PUBLIC_DOMAIN%...
  >".env" echo PORT=%PORT%
  >>".env" echo HOST=%HOST%
  >>".env" echo PUBLIC_DOMAIN=%PUBLIC_DOMAIN%
  >>".env" echo BASE_URL=%BASE_URL%
  >>".env" echo COOKIE_SECURE=%COOKIE_SECURE%
  >>".env" echo TRUST_PROXY=%TRUST_PROXY%
  >>".env" echo ALLOWED_HOSTS=%ALLOWED_HOSTS%
)

echo [OK] Node.js found.
echo [OK] data\ and storage\ are ready.

echo [RESTART] Restarting Vaultline Node service with domain settings...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$root=(Resolve-Path '%CD%').Path; Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*server.js*' -and $_.CommandLine -like ('*' + $root + '*') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort %PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { $p = Get-Process -Id $_ -ErrorAction SilentlyContinue; if ($p -and $p.ProcessName -eq 'node') { Stop-Process -Id $_ -Force } }"
timeout /t 1 /nobreak >nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:PORT='%PORT%'; $env:HOST='%HOST%'; $env:PUBLIC_DOMAIN='%PUBLIC_DOMAIN%'; $env:BASE_URL='%BASE_URL%'; $env:COOKIE_SECURE='%COOKIE_SECURE%'; $env:TRUST_PROXY='%TRUST_PROXY%'; $env:ALLOWED_HOSTS='%ALLOWED_HOSTS%'; Start-Process -FilePath node -ArgumentList 'server.js' -WorkingDirectory '%CD%' -WindowStyle Hidden -RedirectStandardOutput 'data\vaultline-node.log' -RedirectStandardError 'data\vaultline-node-error.log'"
for /l %%i in (1,1,20) do (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 1 http://127.0.0.1:%PORT%/api/health; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>nul
  if not errorlevel 1 goto app_ready
  timeout /t 1 /nobreak >nul
)
echo [ERROR] Vaultline did not start. Check:
echo   %CD%\data\vaultline-node-error.log
pause
exit /b 1

:app_ready
echo [OK] Vaultline health check passed.
echo.

where cloudflared >nul 2>nul
if not errorlevel 1 (
  if exist "%USERPROFILE%\.cloudflared\config.yml" (
    echo [TUNNEL] cloudflared config found.
    echo [TUNNEL] Running tunnel "%TUNNEL_NAME%".
    echo Make sure DNS for %PUBLIC_DOMAIN% points to this Cloudflare tunnel.
    echo.
    cloudflared tunnel run "%TUNNEL_NAME%"
    pause
    exit /b %errorlevel%
  ) else (
    echo [TUNNEL] cloudflared found, but no config.yml was found.
    echo.
    echo [ACTION REQUIRED]
    echo Run this file once first:
    echo   setup-cloudflare-tunnel.bat
    echo.
    echo It will open Cloudflare login and create:
    echo   %USERPROFILE%\.cloudflared\cert.pem
    echo   %USERPROFILE%\.cloudflared\config.yml
    echo.
    echo After setup finishes, run this launcher again:
    echo   start-vaultline-domain.bat
    echo.
    pause
    exit /b 1
  )
)

where caddy >nul 2>nul
if not errorlevel 1 (
  echo [HTTPS] Caddy found. Creating data\Caddyfile...
  >"data\Caddyfile" echo %PUBLIC_DOMAIN%, www.%PUBLIC_DOMAIN% {
  >>"data\Caddyfile" echo     encode zstd gzip
  >>"data\Caddyfile" echo     header {
  >>"data\Caddyfile" echo         Strict-Transport-Security "max-age=31536000; includeSubDomains"
  >>"data\Caddyfile" echo         X-Content-Type-Options "nosniff"
  >>"data\Caddyfile" echo         X-Frame-Options "DENY"
  >>"data\Caddyfile" echo         Referrer-Policy "strict-origin-when-cross-origin"
  >>"data\Caddyfile" echo     }
  >>"data\Caddyfile" echo     reverse_proxy 127.0.0.1:%PORT%
  >>"data\Caddyfile" echo }
  echo.
  echo [HTTPS] Starting Caddy. Keep this window open.
  echo DNS A-record for %PUBLIC_DOMAIN% must point to this computer's public IP.
  echo Router must forward TCP 80 and 443 to this computer.
  echo.
  caddy run --config "data\Caddyfile" --adapter caddyfile
  pause
  exit /b %errorlevel%
)

echo [WARNING] Neither configured cloudflared nor Caddy was found.
echo.
echo Vaultline is running locally, but a secure custom domain needs one HTTPS front:
echo   1. Recommended for home PC without static IP: install/configure cloudflared tunnel.
echo   2. Recommended with static IP and port forwarding: install Caddy.
echo.
echo Local test URL:
echo   http://127.0.0.1:%PORT%
echo.
echo After installing Caddy or cloudflared, run this same .bat again.
pause
