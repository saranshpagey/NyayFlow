# NyayaFlow Deployment Guide

This guide covers deploying NyayaFlow to production using Railway (Backend) and Vercel (Frontend).

## Prerequisites

- GitHub Repository connected to Railway and Vercel
- Google Gemini API Key
- Supabase Project URL & Anon Key

## 1. Backend Deployment (Railway)

1. **New Project**: Go to [Railway Dashboard](https://railway.app/new) and select "Deploy from GitHub repo".
2. **Select Repo**: Choose `NyayaFlow/V2`.
3. **Configure Settings**:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   Add the following variables in Railway settings:
   ```env
   GOOGLE_API_KEY=your_key_here
   SUPABASE_URL=your_url_here
   SUPABASE_SERVICE_KEY=your_key_here
   FRONTEND_URL=https://your-vercel-app.vercel.app
   PORT=8000 (Railway sets this automatically, but good to know)
   ```
5. **Deploy**: Railway will automatically build and deploy. Copy the provided domain (e.g., `nyayaflow-production.up.railway.app`).

## 2. Frontend Deployment (Vercel)

1. **New Project**: Go to [Vercel Dashboard](https://vercel.com/new).
2. **Import Repo**: Select `NyayaFlow/V2`.
3. **Build Settings**:
   - Framework Preset: `Vite`
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```env
   VITE_API_URL=https://nyayaflow-production.up.railway.app/api
   ```
5. **Deploy**: Click Deploy.

## 3. Post-Deployment Verification

1. **Health Check**: Visit `https://your-backend.railway.app/health`.
2. **Frontend Check**: Open the Vercel app URL.
3. **PWA Check**: Open DevTools > Application > Manifest to verify PWA installation support.
4. **Accessibility**: Run a Lighthouse audit to confirm WCAG compliance.

## Troubleshooting

- **CORS Errors**: Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly (no trailing slash).
- **Build Failures**: Check that `requirements.txt` includes all Python deps and `package.json` has all Node deps.
