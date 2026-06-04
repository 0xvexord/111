@echo off
setlocal EnableExtensions
title Vaultline - Cloudflare Tunnel setup
cd /d "%~dp0"

set "PUBLIC_DOMAIN=ukrainecommunity.pp.ua"
set "PORT=4173"
set "TUNNEL_NAME=vaultline"
set "CLOUDFLARED_DIR=%USERPROFILE%\.cloudflared"
set "CLOUDFLARED_CONFIG=%CLOUDFLARED_DIR%\config.yml"

echo.
echo ============================================================
echo  Vaultline Cloudflare Tunnel setup
echo ============================================================
echo  Domain:       %PUBLIC_DOMAIN%
echo  Local app:    http://127.0.0.1:%PORT%
echo  Tunnel name:  %TUNNEL_NAME%
echo.

where cloudflared >nul 2>nul
if errorlevel 1 (
  echo [ERROR] cloudflared was not found.
  echo Install it first from Cloudflare, then run this file again.
  pause
  exit /b 1
)

if not exist "%CLOUDFLARED_DIR%" mkdir "%CLOUDFLARED_DIR%"

if not exist "%CLOUDFLARED_DIR%\cert.pem" (
  echo [LOGIN] Cloudflare login is required.
  echo A browser window will open. Choose the zone for %PUBLIC_DOMAIN%.
  echo.
  cloudflared tunnel login
  if errorlevel 1 (
    echo [ERROR] Cloudflare login failed.
    pause
    exit /b 1
  )
)

echo.
echo [TUNNEL] Creating named tunnel if it does not exist...
cloudflared tunnel create "%TUNNEL_NAME%"

for /f "delims=" %%F in ('powershell -NoProfile -Command "Get-ChildItem -LiteralPath '%CLOUDFLARED_DIR%' -Filter '*.json' | Sort-Object LastWriteTime -Descending | Select-Object -First 1 -ExpandProperty FullName"') do set "CREDS_FILE=%%F"

if "%CREDS_FILE%"=="" (
  echo [ERROR] Could not find tunnel credentials JSON in:
  echo   %CLOUDFLARED_DIR%
  pause
  exit /b 1
)

for %%F in ("%CREDS_FILE%") do set "TUNNEL_ID=%%~nF"

echo.
echo [CONFIG] Writing %CLOUDFLARED_CONFIG%
>"%CLOUDFLARED_CONFIG%" echo tunnel: %TUNNEL_ID%
>>"%CLOUDFLARED_CONFIG%" echo credentials-file: %CREDS_FILE%
>>"%CLOUDFLARED_CONFIG%" echo ingress:
>>"%CLOUDFLARED_CONFIG%" echo   - hostname: %PUBLIC_DOMAIN%
>>"%CLOUDFLARED_CONFIG%" echo     service: http://127.0.0.1:%PORT%
>>"%CLOUDFLARED_CONFIG%" echo   - hostname: www.%PUBLIC_DOMAIN%
>>"%CLOUDFLARED_CONFIG%" echo     service: http://127.0.0.1:%PORT%
>>"%CLOUDFLARED_CONFIG%" echo   - service: http_status:404

echo.
echo [DNS] Routing domain to the tunnel...
cloudflared tunnel route dns "%TUNNEL_NAME%" "%PUBLIC_DOMAIN%"
cloudflared tunnel route dns "%TUNNEL_NAME%" "www.%PUBLIC_DOMAIN%"

echo.
echo [DONE] Tunnel config is ready.
echo Now run:
echo   start-vaultline-domain.bat
echo.
pause
