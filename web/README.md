# Kern Lead Engine — Web UI

Next.js dashboard for the Kern County Lead Engine. Built with Tailwind CSS, Framer Motion, Recharts, and 21st.dev-inspired components.

## Development

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
cd web
npx vercel
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set **Root Directory** to `web`
3. Framework Preset: **Next.js**
4. Build Command: `npm run build`
5. Output Directory: `.next`
6. Click **Deploy**

### Environment Variables

Set these in Vercel dashboard (Settings → Environment Variables):

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-api.render.com` |

### Connecting to the Python Backend

The UI currently uses mock data. To connect to the real engine:

1. Deploy the Python backend (FastAPI) to Render, Railway, or Fly.io
2. Set `NEXT_PUBLIC_API_URL` to the backend URL
3. Replace mock data calls in `src/lib/mock-data.ts` with API calls to `${NEXT_PUBLIC_API_URL}/leads`

## Pages

- `/` — Dashboard (stats, charts, live lead feed)
- `/leads` — Lead feed with filters, search, sorting
- `/analytics` — Performance metrics, conversion funnel, city breakdown
- `/export` — Export leads as CSV with preview
- `/settings` — Configuration, data sources, API keys, notifications

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **Recharts** (charts)
- **Lucide React** (icons)
- **TypeScript**