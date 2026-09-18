@echo off
title ManasMitra AI - Cognitive Health Platform
color 0A
cls

echo ====================================================================
echo               MANASMITRA AI (मानस मित्र)
echo      AI-Assisted Dementia & Cognitive Support Platform
echo ====================================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found on your system PATH!
    echo Please download and install Node.js (LTS version) from:
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] First time setup detected: Installing dependencies...
    call npm.cmd install
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
)

echo [INFO] Starting Vite development server...
echo [INFO] The application will open automatically at http://localhost:5173
echo.

:: Launch browser in background after 2 seconds
start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:5173'"

:: Run Vite Dev Server via npm.cmd to prevent PowerShell ExecutionPolicy errors
call npm.cmd run dev

pause
