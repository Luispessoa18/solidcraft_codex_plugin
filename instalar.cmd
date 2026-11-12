@echo off
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 18 ou superior e reabra esta janela.
  pause
  exit /b 1
)
node "%~dp0instalar.cjs"
pause
