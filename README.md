# KHEL-NET — AI-Powered Sports Talent Assessment

KHEL-NET is an AI-powered platform for democratizing sports talent assessment.

It combines mobile computer vision, athlete profiling, sport-potential analysis,
growth tracking, scout intelligence, events, and administrative analytics.

> Current R&D sensor-fusion results are simulation-based.
> Real ESP32/IMU hardware validation is planned for a future phase.

---

## Tech Stack

### Frontend
- React / Next.js
- JavaScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLModel / SQLAlchemy
- PostgreSQL

### AI / R&D
- Computer Vision
- Pose Estimation
- Kalman Filter
- Sensor Fusion
- Athlete DNA
- Sport Potential Analysis

---

## Project Structure

```text
KHEL-NET/
├── SIH-main/              # Frontend
├── backend/               # Backend APIs
├── rd_prototype/          # R&D and benchmarking
│   ├── datasets/
│   ├── experiments/
│   ├── models/
│   ├── metrics/
│   ├── plots/
│   ├── results/
│   ├── reports/
│   └── run_all.py
└── README.md
```

## Running the Project

1. Clone
```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY>
```

### Backend
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv .venv
```

Activate it.

Windows
```powershell
.venv\Scripts\activate
```
Linux / macOS
```bash
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Configure the environment variables in `.env`.
Make sure PostgreSQL is running and the database is configured.

Seed the database:
```bash
python -m app.seed
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

### Frontend

Open another terminal:
```bash
cd SIH-main
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open:
http://localhost:3000

## R&D Benchmarking

The R&D experiments are isolated from the production application.

From the project root:
```bash
python rd_prototype/run_all.py
```

This generates:
- `rd_prototype/results/`
- `rd_prototype/plots/`
- `rd_prototype/reports/`

The main reports are:
- `RD_VALIDATION_REPORT.md`
- `PPT_RESULTS.md`

## Current R&D Status

### Sensor Fusion
Camera-only, IMU-only and Camera + IMU Kalman-filter approaches
have been evaluated using synthetic vertical-jump data.

The experiments include:
- Camera noise
- IMU noise
- IMU drift
- Camera occlusion
- Sensor disagreement
- Severe camera dropout

**Important**
The current sensor-fusion results are:
**SIMULATION RESULTS**

They demonstrate algorithmic feasibility under modeled conditions.
They are NOT a substitute for real-world athlete validation.

### Hardware Status
Physical hardware integration is currently planned.

Future implementation:
ESP32 -> Accelerometer + Gyroscope -> Bluetooth -> Android Device -> Camera + IMU Sensor Fusion -> Sports Assessment

Real-world hardware validation will be conducted in a future phase.

## Current Platform Pipeline
Athlete -> Assessment -> Metrics -> Growth -> Athlete DNA -> Sport Potential -> Scout Intelligence -> Events -> Admin Analytics

## R&D Pipeline
Camera + IMU -> Sensor Fusion -> Verified Performance -> Athlete DNA -> Sport Potential

## Scientific Integrity
This project explicitly distinguishes between:
- Simulation Results
- Reference Data
- Database Validation
- Real-World Data
- Pending Validation

No simulated result is presented as real-world validation.

Indian-specific normative datasets and physical hardware validation
remain future research requirements.
