@echo off
setlocal EnableExtensions
title Vaultline - local start
cd /d "%~dp0"

echo.
echo ============================================================
echo  Vaultline local launcher
echo ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found.
  echo Install Node.js LTS first: https://nodejs.org/
  pause
  exit /b 1
)

if not exist ".env" (
  echo [SETUP] Creating .env from .env.example...
  if exist ".env.example" (
    copy ".env.example" ".env" >nul
  ) else (
    >".env" echo PORT=4173
    >>".env" echo HOST=0.0.0.0
    >>".env" echo PUBLIC_DOMAIN=ukrainecommunity.pp.ua
    >>".env" echo BASE_URL=http://localhost:4173
    >>".env" echo COOKIE_SECURE=auto
    >>".env" echo TRUST_PROXY=true
    >>".env" echo ALLOWED_HOSTS=ukrainecommunity.pp.ua,www.ukrainecommunity.pp.ua,localhost,127.0.0.1,[::1]
  )
)

if not exist "data" mkdir "data"
if not exist "storage" mkdir "storage"

echo [OK] Node.js found.
echo [OK] data\ and storage\ are ready.
echo.
echo Open after start:
echo   http://localhost:4173
echo.
node server.js
pause
