@echo off

:: Step 1: Change directory to src
cd /d "%~dp0src"

:: Step 2: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js to run this application.
    pause
    exit /b
)

:: Step 3: Start the Node.js application
node index.js
if %errorlevel% neq 0 (
    echo An error occurred while running the Node.js application.
    pause
    exit /b
)

exit /b
