# BudgetYattra

A full-stack, budget-conscious AI travel planner tailored for Indian domestic travellers. Calculates realistic, location-specific cost allocations (round-trip transit, lodging, regional dining, local transit, activities, and emergency buffer) and generates day-by-day itineraries using OpenAI with a deterministic fallback engine.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, daisyUI, React Hook Form, Zod, Lucide React
- **Backend**: Node.js, Express, TypeScript, Zod, Helmet, CORS
- **Database**: MongoDB Atlas, Mongoose ODM
- **AI**: OpenAI JavaScript SDK (`gpt-4o-mini`) + Deterministic Fallback Engine
- **Deployment**: Vercel (Serverless Backend & Frontend SPA)

---

## Architecture

```text
User ──► Frontend (Form Input) ──► Backend API ──► Central Math Engine
                                          │                  │
                                          ├────────► OpenAI API (gpt-4o-mini)
                                          │                  │
                                          ▼                  ▼
                                     Database (MongoDB Atlas)
                                          │
                                          ▼
                                     Frontend (Itinerary Display & Print View)
```

### How It Works:
1. **User Input**: Traveller inputs starting city (origin), destination, duration (days), travellers count, budget (INR ₹), lodging preference, and transport mode.
2. **Central Math Engine**: The server computes exact, uncheatable financial allocations for intercity transit, stay, food, local transit, activities, and an 8% emergency buffer.
3. **AI Generation**: The backend sends origin, destination, and calculated budget constraints to OpenAI (`gpt-4o-mini`). The AI generates location-accurate places, regional dining spots, and day-by-day activity timelines. If OpenAI is unavailable or times out, the system seamlessly uses a deterministic mock engine.
4. **Persistence & Presentation**: The complete trip document is saved to MongoDB Atlas and rendered on the frontend detail view (`/trips/:id`).

---

## How to Run the Project Locally

### 1. Prerequisites
- Node.js (v20+)
- npm (v10+)
- MongoDB Atlas database URI

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup

**Server (`server/.env`):**
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/budgetyattra?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
CLIENT_URL=http://localhost:5173
PORT=5000
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

### 4. Start Development Servers
```bash
# Starts both frontend (port 5173) and backend (port 5000) concurrently
npm run dev
```

### 5. Run Verification Tests
```bash
# Run server logic and correctness test suite
npm run test --prefix server

# Build client and server for production
npm run build
```

---

## Assumptions Made

- **Indian Domestic Travel Context**: All financial algorithms are calibrated for Indian domestic travel rates (e.g. Sleeper/3AC trains, AC Volvo buses, backpacker dorms, 2/3-star budget hotels, and local thali/dhaba dining).
- **Server-Driven Budget Boss**: All rupee totals are calculated by the central math engine on the server, never trusted directly from AI text output, guaranteeing 100% internal mathematical consistency.
- **Hill Station & Transit Realism**: Routes to destinations lacking direct railway stations (e.g., Manali, Shimla, Ooty, Nainital) automatically route via AC Volvo sleeper buses or train-to-railhead + cab transfers rather than fictional direct trains.

---

## Limitations / Known Issues

- **No Live GDS/Airline Querying**: Financial estimates use heuristic real-world rate tables rather than live flight/hotel API vacancy queries.
- **Open Access (No User Accounts)**: Built as an open interview project without authentication; created trips are saved to the shared database collection.
- **IP Rate Limiting**: AI generation is capped at 3 requests per 10 minutes per IP address to prevent API quota exhaustion.

---

## What I Personally Implemented

- **Full-Stack Application Architecture**: Built the React 19 frontend SPA and Express TypeScript backend from scratch.
- **Dual-Engine Planner**: Designed the hybrid system combining server-side budget logic with OpenAI `gpt-4o-mini` and a rule-based mock generator fallback.
- **Budget Math & Reconciliation Engine**: Developed cost distribution algorithms ensuring `sum(day.approximateCost) === grandTotal` to the exact Rupee.
- **Database & Resilience Layer**: Implemented serverless Mongoose connection pooling with graceful in-memory fallbacks when Atlas is unreachable.
- **Rate Limiting & Safety**: Built IP-based rate limiting middleware and input validation using Zod.
- **UI & Print Layout**: Created responsive trip cards, budget utilization meters, and print-ready PDF/itinerary layouts using Tailwind CSS and daisyUI.
