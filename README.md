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

## Assumptions & Limitations
- Location-based only: The app is currently limited to searching for restaurants (or other establishments) within a city, place, or region. It does not support searching inside specific establishments (e.g., malls, airports).
- User intent assumptions: It is assumed that the user query includes:
    - A location or general area (e.g. “Manila”, “Davao City”)
    - An optional price range
    - Whether the place should be open now
- Category bias: While the search category is set to restaurants, users can also explore other establishment types (e.g. hotels, resorts, cafes) through phrasing (e.g. “cheap hotel in Cebu”).
- Limited advanced filters: Parameters like user ratings, cuisine type, or wheelchair accessibility are not explicitly extracted or supported—but may still work sporadically depending on how well the LLM infers them and how Foursquare interprets the query.