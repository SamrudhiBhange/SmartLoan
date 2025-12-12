@echo off
echo ============================================
echo        SmartLoan System Starter
echo ============================================
echo.

echo [1] Checking if .NET API is running...
echo    If not, please run the API from Visual Studio
echo.

echo [2] Opening Web Application...
timeout /t 2 /nobreak
start "" "SmartLoan.Web\index.html"

echo [3] Opening Swagger API Documentation...
timeout /t 3 /nobreak
start "" "https://localhost:7173/swagger"

echo.
echo ============================================
echo    SmartLoan System Started Successfully!
echo ============================================
echo.
echo Web App:  http://localhost/ (or file:// path)
echo API Docs: https://localhost:7173/swagger
echo.
echo Press any key to exit...
pause >nul