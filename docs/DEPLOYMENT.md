# VeraFi — Deployment Guide 🚀

This guide explains how to deploy both the Frontend and Backend to free-tier cloud platforms for live demo links.

---

## 1. Frontend Deployment (Vercel)

1. Push your repository to GitHub (`main` branch).
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import the `VeraFi` GitHub repository.
4. Configure Project Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://verafi-backend.onrender.com/api`)
6. Click **Deploy**. Your frontend will be live at `https://your-project.vercel.app`!

---

## 2. Backend Deployment (Render / Railway)

### Using Render (Free Web Service)
1. Go to [Render](https://render.com/) and click **"New +"** $\rightarrow$ **"Web Service"**.
2. Connect your `VeraFi` repository.
3. Configure Service:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google AI Studio API key.
5. Click **Create Web Service**.

