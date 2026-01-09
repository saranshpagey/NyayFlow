#!/bin/bash

# NyayaFlow Backend Startup Script
# This script starts the FastAPI server with the Legal Agent Orchestrator

echo "🚀 Starting NyayaFlow AI Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Please create a .env file with:"
    echo "  - GOOGLE_API_KEY=your_key_here"
    echo "  - SUPABASE_URL=your_url_here"
    echo "  - SUPABASE_SERVICE_KEY=your_key_here"
    echo ""
    exit 1
fi

# Kill any existing servers on port 8000
echo "🧹 Cleaning up existing servers..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

echo "✅ Port 8000 is now available"
echo ""

# Start the server
echo "🎯 Launching Multi-Agent System..."
python3 server.py
