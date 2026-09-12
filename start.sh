#!/bin/bash
# VeraFi Dev Startup Script
# Starts backend (port 8000) then frontend (port 5173)
# Usage: bash start.sh

set -e
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "========================================"
echo "  VeraFi Dev Server Startup"
echo "========================================"
echo ""

# --- Backend ---
echo "[1/2] Starting backend on http://localhost:8000 ..."
cd "$PROJECT_DIR/backend"

if [ ! -d "venv" ]; then
  echo "ERROR: Python venv not found at backend/venv"
  echo "       Run: python3 -m venv venv && venv/bin/pip install -r requirements.txt"
  exit 1
fi

if [ ! -f ".env" ]; then
  echo "WARNING: backend/.env not found. Copying from .env.example ..."
  cp .env.example .env
fi

# Start backend in background
venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"
sleep 2

# Quick health check
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
  echo "  Backend: RUNNING OK"
else
  echo "  Backend: still starting... (it may take a few more seconds)"
fi

echo ""

# --- Frontend ---
echo "[2/2] Starting frontend on http://localhost:5173 ..."
cd "$PROJECT_DIR/frontend"

if [ ! -d "node_modules" ]; then
  echo "ERROR: node_modules not found. Run: npm install"
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi

echo ""
echo "========================================"
echo "  OPEN IN BROWSER: http://localhost:5173"
echo "  Backend API:      http://localhost:8000"
echo "  Press Ctrl+C to stop everything"
echo "========================================"
echo ""

# Trap Ctrl+C to kill backend too
trap "echo 'Shutting down...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM

# Start frontend (foreground)
./node_modules/.bin/vite
