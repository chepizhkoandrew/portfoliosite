# Deployment Guide: Railway + Vercel

This guide covers automated deployment of the portfolio site using **Railway** for the backend (Python/FastAPI) and **Vercel** for the frontend (Next.js).

## Prerequisites

- [Railway CLI](https://docs.railway.app/develop/cli) installed
- [Vercel CLI](https://vercel.com/cli) installed  
- GitHub repository with both `/chatbot-backend` and `/cv-portfolio` directories
- API keys and secrets ready

---

## Backend Deployment (Railway)

### 1. Initial Railway Setup

```bash
railway login
railway init
```

Select your GitHub repository when prompted.

### 2. Configure Environment Variables

In Railway dashboard:
1. Go to your project → Variables
2. Add these environment variables:
   - `GOOGLE_API_KEY`: Your Google Generative AI API key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://yourdomain.com`)
   - `ENVIRONMENT`: `production`
   - `LOG_LEVEL`: `INFO`
   - `PORT`: Leave empty (Railway sets this automatically)

### 3. Configure Railway Deployment

Railway will automatically detect the `railway.json` and `Dockerfile`.

To deploy:
```bash
railway up
```

Or use the Railway dashboard to enable automatic deploys from GitHub.

### 4. Get Your Backend URL

After deployment:
1. Go to Railway dashboard → Your Service
2. Copy the public URL (e.g., `https://your-service-railway.app`)
3. Save this for the frontend configuration

---

## Frontend Deployment (Vercel)

### 1. Initial Vercel Setup

```bash
cd cv-portfolio
vercel login
vercel link
```

Follow the prompts to link your GitHub repository.

### 2. Configure Environment Variables

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_BACKEND_URL`: Your Railway backend URL (from step 4 above)

### 3. Deploy

```bash
vercel deploy --prod
```

Or enable automatic deployments from GitHub in the Vercel dashboard.

---

## Automated Deployments (GitHub Integration)

### Railway
1. Dashboard → Settings → GitHub Integration
2. Connect your GitHub repository
3. Select branch for auto-deploy (e.g., `main`)
4. Every push to that branch will trigger a deployment

### Vercel  
1. Dashboard → Settings → Git → Deploy on every push to `main`
2. Or push to preview branches for staging deployments

---

## Environment Variable Checklist

### Backend (.env on Railway)
- [ ] `GOOGLE_API_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `FRONTEND_URL` (set to your Vercel domain)
- [ ] `ENVIRONMENT=production`
- [ ] `LOG_LEVEL=INFO`

### Frontend (Vercel Dashboard)
- [ ] `NEXT_PUBLIC_BACKEND_URL` (set to your Railway domain)

---

## Troubleshooting

### Backend won't start on Railway
- Check logs: `railway logs`
- Verify `PORT` env var is not hardcoded (Railway injects it automatically)
- Ensure all required env vars are set

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_BACKEND_URL` is correctly set in Vercel
- Verify backend `FRONTEND_URL` includes correct frontend domain
- Check CORS headers in backend logs

### Build failures
- Frontend: Run `npm run build` locally to test
- Backend: Run `docker build -t test .` locally to test

---

## Local Testing Before Deployment

### Backend
```bash
cd chatbot-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your keys
python main.py
```

### Frontend
```bash
cd cv-portfolio
npm install
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local
npm run dev
```

Test at `http://localhost:3000`

---

## Health Checks

### Backend Health
```bash
curl https://your-railway-url/health
```

### Frontend
Visit `https://your-vercel-domain.com`

---

## Monitoring

### Railway
- Dashboard shows real-time logs and metrics
- Set up alerts for failures

### Vercel  
- Analytics dashboard shows performance
- Email notifications for deployment status

---

## Rollback

### Railway
```bash
railway logs --tail # See recent deployments
# Redeploy previous version from dashboard
```

### Vercel
- Dashboard → Deployments → Select previous deployment → Promote to Production

---

## Cost Considerations

- **Railway**: Free tier includes $5/month credit (sufficient for most hobby projects)
- **Vercel**: Free tier includes unlimited deployments (Pro for advanced features)
