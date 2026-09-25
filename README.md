# SANKET 🌍

## AI-Powered Landslide Risk Prediction & Monitoring System

SANKET is an AI-powered landslide risk prediction and monitoring platform designed to analyze environmental and terrain-related factors, identify potentially vulnerable regions, and present risk information through an interactive dashboard.

The system combines **Artificial Intelligence, Machine Learning, geographical visualization, analytics, and modern web technologies** to provide an intuitive platform for understanding and monitoring landslide risks.

## Features

### 🗺️ Interactive Risk Map

Visualize landslide-prone regions and understand geographical risk levels.

### 🤖 AI/ML-Based Risk Analysis

Analyze environmental and terrain-related factors to estimate landslide risk.

### 📊 Analytics Dashboard

View risk statistics, trends, and important insights through interactive visualizations.

### 🧪 Risk Simulation

Simulate different environmental conditions and observe potential changes in risk levels.

### 📢 Alert & Broadcast System

Provide important risk information and support communication of alerts.

### 📑 Reports

Access structured risk information and generate reports for analysis.

### 🇮🇳 India-Focused Visualization

Explore geographical risk information across Indian regions.

### 📈 Data Visualization

Present complex risk information through charts, maps, and visual indicators.

### 💻 Modern Responsive Interface

Clean and responsive dashboard designed for easy navigation and monitoring.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Python
* FastAPI

### AI / Machine Learning

* Python
* Machine Learning
* Data Analysis

### Tools & Deployment

* Git
* GitHub
* Vercel
* VS Code

---

## System Architecture

```text
┌──────────────────────────────┐
│ Environmental & Terrain Data │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Data Processing & Preparation│
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     AI / ML Risk Analysis    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Risk Assessment        │
└──────────────┬───────────────┘
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
┌──────────┐ ┌────────┐ ┌──────────┐
│ Risk Map │ │Analytics│ │Simulation│
└────┬─────┘ └────┬───┘ └────┬─────┘
     │            │           │
     └────────────┼───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │   Alerts & Reports   │
       └──────────────────────┘
```

---

## Project Structure

```text
SANKET-2.0/
│
├── backend/
│
├── data/
│
├── frontend/
│
├── models/
│
├── notebooks/
│
├── fix_geography.py
├── run_project.bat
├── vercel.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Python 3.10+
* Node.js 18+
* npm
* Git

Clone the repository:

```bash
git clone https://github.com/Sparsshgpt/SANKET-2.0.git
cd SANKET-2.0
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the environment.

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The API will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

## How SANKET Works

SANKET follows a data-to-decision pipeline:

```text
Environmental / Terrain Data
            ↓
      Data Processing
            ↓
      Feature Analysis
            ↓
      AI / ML Model
            ↓
      Risk Prediction
            ↓
      Risk Assessment
            ↓
 ┌──────────┼───────────┐
 ↓          ↓           ↓
Risk Map  Analytics  Simulation
 └──────────┼───────────┘
            ↓
      Alerts & Reports
```

The system processes relevant environmental and terrain information and uses AI/ML-based analysis to estimate landslide risk.

The resulting risk information is presented through an interactive dashboard containing maps, analytics, simulations, alerts, and reports.

---

## Project Objectives

* Develop an AI-powered system for landslide risk assessment.
* Analyze environmental and terrain-related factors.
* Visualize geographical risk information.
* Provide interactive risk simulations.
* Present risk statistics and analytical insights.
* Support early identification of potentially vulnerable regions.
* Provide a foundation for future real-time monitoring and alert systems.

---

## Future Scope

* Real-time IoT sensor integration
* Live rainfall and soil-moisture monitoring
* Satellite and remote-sensing data integration
* Advanced GIS-based visualization
* Real-time risk heatmaps
* SMS and email alert integration
* Mobile application
* Advanced deep-learning models
* Historical landslide trend analysis
* Cloud-based ML inference
* Automated disaster-management reporting
* Integration with additional geographical and environmental datasets

---

## Live Demo

🌐 **SANKET Web Application**

https://sanket-2-0.vercel.app/

---

## Support

If you find SANKET useful or have suggestions for improving the project, feel free to open an issue or contribute to the repository.

---

## License

This project is licensed under the MIT License.
