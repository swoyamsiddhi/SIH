# KHEL-NET Local Development Guide

## 1. Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis (optional for now, required for Celery pipeline)

## 2. Start PostgreSQL & Redis
Ensure you have a PostgreSQL server running locally on port `5432` and a database named `khelnet` created.
Ensure Redis is running on port `6379`.

## 3. Setup Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# source .venv/bin/activate (Linux/Mac)
# .venv\Scripts\activate (Windows)
pip install -r requirements.txt

# Create the .env file
cp .env.example .env
# Edit .env with your DB credentials

# Run database seed (Drops & Recreates tables)
python -m app.seed

# Start FastAPI server
uvicorn app.main:app --reload
```

## 4. Setup Frontend (SIH-main)
```bash
cd SIH-main
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
echo "NEXT_PUBLIC_API_MODE=strict" >> .env.local

# Start Next.js server
npm run dev
```

## 5. End-to-End Smoke Test
1. Visit `http://localhost:8000/health` to verify API and DB status.
2. Visit `http://localhost:3000/dashboard`.
3. If `NEXT_PUBLIC_API_MODE=strict`, you should see Neeraj's dashboard populated directly from the PostgreSQL database! If the DB is empty, the UI will crash, proving that the fallback is disabled.
