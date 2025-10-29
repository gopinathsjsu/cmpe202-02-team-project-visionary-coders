# Campus Marketplace API (FastAPI)

## Highlights
- JWT auth with roles: **buyer**, **seller**, **admin**
- Listings CRUD with photos (S3-ready; local storage by default)
- Search & filter by category and price
- **NL search** endpoint that can call the OpenAI API (optional) or fall back to keyword search
- In‑app chat with WebSocket and persisted messages
- Mark items as sold
- Report incomplete/violating listings to admin
- Input/output are JSON with validation & error handling
- SQLite by default; easy swap to Postgres
- Dockerfile included
- Mock data seeding
- Swagger UI at `/docs`

> For deployment (AWS EC2 Auto Scaling + Load Balancer), see `docs/deployment.md`.

## API DOCS

```bash
Swagger UI: http://127.0.0.1:8000/docs
ReDoc UI: http://127.0.0.1:8000/redoc
```

## Quickstart (Local, Python 3.11+)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Seed mock data (optional):
```bash
python -m app.db.seed_data
```

## Env Vars
Create `.env` in the project root:
```
# security
SECRET_KEY=dev-secret-change-me
ACCESS_TOKEN_EXPIRE_MINUTES=60

# storage
MEDIA_DIR=./media

# optional OpenAI for NL search
OPENAI_API_KEY=sk-...

# database (defaults to SQLite file db.sqlite3 if omitted)
DATABASE_URL=sqlite:///./db.sqlite3
```

## Running with Docker
```bash
docker build -t campus-marketplace .
docker run -p 8000:8000 --env-file .env campus-marketplace
```

## Endpoints (selection)
- `POST /auth/register` / `POST /auth/login`
- `GET /listings` with `?q=&category=&min_price=&max_price=`
- `POST /listings` (seller)
- `PATCH /listings/{id}/sold` (seller)
- `POST /reports` (buyer -> admin moderation)
- `GET /chat/rooms/{room_id}/history` (REST history)
- `WS /ws/chat/{room_id}` (live chat)
- `POST /search/nl` — natural language search via OpenAI (if available) or keyword fallback

## Tests
```bash
pytest -q
```

## Project Journal & Process Artifacts
- See `docs/scrum_journal_template.md`
- See `docs/backlog_templates/` (CSV/Google‑Sheet friendly)
- See `docs/wireframes.md` (wireframe sketches)
- See `docs/diagrams.md` (Component & Deployment diagrams with Mermaid)
