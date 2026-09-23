@echo off
title SANKET 2.0 - Environmental Intelligence & Landslide Early Warning
echo ===================================================================
echo     SANKET 2.0 : AI-POWERED GEOSPATIAL LANDSLIDE RISK MONITORING
echo             Mountains + Soil Environmental Intelligence
echo ===================================================================
echo.
echo Starting SANKET Backend API (FastAPI)...
start "SANKET Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --port 8000 --reload"

echo Starting SANKET Frontend (Vite)...
start "SANKET Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 >nul
echo Opening SANKET Command Center in default browser...
start http://localhost:5173

echo.
echo SANKET is now running!
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000
echo - Swagger Docs: http://localhost:8000/docs
echo ===================================================================
