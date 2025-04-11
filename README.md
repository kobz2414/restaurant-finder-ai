# Next Gen Restaurant Finder
A simple restaurant finder powered by bleeding edge AI tech

This project is a full-stack web app built with:

- **Frontend**: [React](https://react.dev/) (Vite + TypeScript + Tailwind) — in `/frontend`
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python) — in `/backend`

The app uses OpenAI to process natural language search queries and translates them into structured parameters to fetch nearby businesses using the Foursquare Places API.

## Setup Instructions for Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/kobz2414/restaurant-finder-ai.git
cd restaurant-finder-ai
```

### 2. Install dependencies

##### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the `/frontend` folder with the following:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Create a `.env` file in the `/backend` folder with the following:

```env
OPENAI_API_KEY=<Message the author for credentials>
FOURSQUARE_API_KEY=<Message the author for credentials>
FRONTEND_URL=http://localhost:5173
```

When running the frontend application using `npm run build` + `npm run preview`, replace the `FRONTEND_URL` value with `http://localhost:4173/`

## Running the App

#### Start the FastAPI backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

#### Start the Vite frontend

```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) for `Development` or [http://localhost:4173](http://localhost:4173) for `Production` in your browser.