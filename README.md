# Weathere — Weather Forecasting Web App

Weathere is a full‑stack weather forecasting application with user auth, favorites, search history, blog posts, a dashboard with charts, and a chat assistant powered by Gemini. Backend uses Node.js + Express + Mongoose (MongoDB). 
Frontend is React + Vite + Tailwind + Recharts.

## Live
: https://weathere-1.onrender.com

## Tech stack
- Frontend: React, Vite, Tailwind CSS, Recharts   
- Backend: Node.js, Express, Mongoose (MongoDB) / MySQL

## Key features
- Signup / Login / Profile 
- Favorites  
- Search History 
- Blog posts  
- Weather data + 5‑day forecast  
- Gemini LLM chat 

## Quickstart (local)

Prerequisites:
- Node.js (v18+)
- npm
- MongoDB Atlas (or local MongoDB)

1. Clone repo
```bash
git clone <repo>
```

2. Backend
- Copy env template and update:
  - Required vars: `MONGODB_URI`, `JWT_SECRET`, `OPENWEATHER_KEY`, `GEMINI_API_KEY`, `FRONTEND_URL`, `NODE_ENV`

- Install & run:
```bash
cd backend
npm install
npm run dev   # uses nodemon, or: node server.js
```
- Health check: GET http://localhost:5000/api/dbtest  

3. Frontend
```
VITE_API_URL=http://localhost:5000/api
```
- Install & run:
```bash
cd frontend
npm install
npm run dev
```
- Open the Vite URL shown (default http://localhost:5173).


## Environment variables (summary)
- backend/.env:
  - MONGODB_URI (Atlas connection string)
  - JWT_SECRET
  - OPENWEATHER_KEY
  - GEMINI_API_KEY
  - FRONTEND_URL (e.g. https://weathere-1.onrender.com)
  - NODE_ENV=production
- frontend/.env (build-time):
  - VITE_API_URL (e.g. https://<backend>.onrender.com/api)

## API endpoints (summary)
- Auth: POST /api/auth/signup, POST /api/auth/login, POST /api/auth/reset-password, POST /api/auth/change-password, POST /api/auth/change-username — route: [`backend/src/routes/authRoutes.js`](backend/src/routes/authRoutes.js) — controller: [`backend/src/controllers/authController.js`](backend/src/controllers/authController.js)
- Weather: GET /api/weather/all?city=... — [`backend/src/routes/weatherRoutes.js`](backend/src/routes/weatherRoutes.js)
- Favorites: POST /api/favorites/add, GET /api/favorites/list, DELETE /api/favorites/remove — [`backend/src/routes/favoriteRoutes.js`](backend/src/routes/favoriteRoutes.js)
- History: POST /api/history/add, GET /api/history/list, DELETE /api/history/delete, DELETE /api/history/clear — [`backend/src/routes/historyRoutes.js`](backend/src/routes/historyRoutes.js)
- Blogs: GET /api/blogs/list, POST /api/blogs/add, DELETE /api/blogs/delete — [`backend/src/routes/blogRoutes.js`](backend/src/routes/blogRoutes.js)
- Gemini: POST /api/gemini/ask — [`backend/src/routes/geminiRoutes.js`](backend/src/routes/geminiRoutes.js)

## Deployment (Render)
1. Backend service (Node):
   - Set start command: `npm start` (or Render auto-detects)
   - Add Environment variables (Render dashboard → Environment):
     - MONGODB_URI, JWT_SECRET, OPENWEATHER_KEY, GEMINI_API_KEY, FRONTEND_URL, NODE_ENV=production
   - Ensure Atlas allows Render outbound IPs (or use 0.0.0.0/0 temporarily).
   - Deploy / Redeploy and monitor logs (should show "MongoDB connected" then "Server started on port ...").
    
2. Frontend service (Static site):
   - Build command: `npm run build`
   - Set environment: VITE_API_URL=https://<your-backend>.onrender.com/api
   - Redeploy.


## Testing with Postman
- Use base URL `http://localhost:5000/api` (or production API URL).
- Include header `Authorization: Bearer <token>` for protected routes.
- See endpoint list above. Use raw JSON bodies.

## Security
- Do NOT commit `.env`. Ensure `backend/.gitignore` contains `.env` 
- If secrets were committed, rotate them (Mongo user, OpenWeather key, Gemini key, JWT secret) and remove them from git history.

---
