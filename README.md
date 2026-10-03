# BudgetYattra

Full-stack budget travel planner for Indian domestic travel. Calculates realistic cost breakdowns (round-trip transit, accommodation, food, local transit, activities, buffer) and generates day-by-day itineraries using OpenAI with a deterministic fallback engine.

## Tech Stack

- **Client**: React 19, TypeScript, Vite, Tailwind CSS, daisyUI
- **Server**: Node.js, Express, TypeScript, Zod, Mongoose (MongoDB Atlas)
- **AI Engine**: OpenAI SDK (`gpt-4o-mini`) with fallback to local rule-based planner

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Environment Variables

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

### 3. Run Locally
```bash
npm run dev
```

- Client runs at `http://localhost:5173`
- Server runs at `http://localhost:5000`

### 4. Verification & Tests
```bash
# Run backend verification test suite
npm run test --prefix server

# Build client and server
npm run build
```

## API Endpoints

- `GET /api/health` — System status and DB connection health
- `POST /api/trips` — Generate a new trip (rate limited: 3 requests / 10 mins per IP)
- `GET /api/trips` — Fetch recent trips list
- `GET /api/trips/:id` — Fetch trip details by ID

## License

MIT
