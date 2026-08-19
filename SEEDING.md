# KHEL-NET Database Seeding System

This guide explains how to populate the development database with realistic, internally consistent data to test the end-to-end integration of the backend API with the frontend.

## Objective
To prove that `PostgreSQL -> FastAPI -> API Client -> SIH-main frontend` works flawlessly without breaking the UI.

## Running the Seed Script
**WARNING:** NEVER run this script on a production database, as it will **DROP ALL TABLES** and recreate them!

```bash
cd backend
# Make sure your Postgres instance is running and .env DATABASE_URL is correct
python -m app.seed
```

## Demo Roles & Credentials
The seed script will generate the following development accounts:
*   `demo_athlete@khelnet.in`
*   `demo_coach@khelnet.in`
*   `demo_scout@khelnet.in`
*   `demo_event_organizer@khelnet.in`
*   `demo_admin@khelnet.in`
*   `demo_sai_admin@khelnet.in`

**Password for all accounts:** `password123`

## Data Coverage
The primary athlete generated is "Neeraj" (`ATH-28473`), matching the `mockData.js` object exactly. This ensures that when the frontend makes an API call, it receives the exact structure it expects, guaranteeing zero visual breakage.

## STRICT API Mode
If you want to ensure you are actually viewing Database data and NOT the fallback mock data:
1. Open `SIH-main/.env.local`
2. Set `NEXT_PUBLIC_API_MODE=strict`
3. Restart the Next.js dev server.

If the backend is down or the database isn't seeded, the frontend will throw an error instead of silently falling back to mock data.
