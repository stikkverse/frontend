# StikkVerse

**Industrial Machine Health & Energy Monitoring Platform**

StikkVerse gives plant managers a real-time view of machine health, energy consumption, carbon emissions, and bearing risk across their mill — all from a single dashboard. Operators upload sensor data via CSV, and the platform surfaces actionable insights: which machines are degrading, where energy is being wasted, and what needs immediate attention.

---

## What It Does

- **Dashboard Overview** — aggregated energy consumption (kWh), CO₂ emissions (kg), active machine count, and pending alerts at a glance.
- **Machine Health Board** — per-machine health scores (0–100), bearing risk levels (NORMAL / WARNING / HIGH), excess CO₂ readings, and live/idle status with animated ECG-style pulse lines.
- **Alerts** — real-time alerts for bearing risk spikes, health score declines, and excess emissions. Filterable by active/acknowledged status with one-click acknowledge.
- **CSV Data Upload** — drag-and-drop upload for operational sensor data and baseline calibration files. Background processing with live progress tracking via task polling.
- **Team Management** — invite teammates by email with role-based access (Owner, Manager, Member). View active members, pending invitations, and manage roles.
- **API Key Management** — reveal/copy API keys for programmatic data uploads. Upload history and baseline current readings displayed in-context.
- **Theme System** — full dark/light/system theme with three-state toggle. All colors driven by CSS custom properties for seamless switching.
- **Auth Flow** — JWT-based login, invite-based registration, email verification, and session management with automatic token refresh handling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties |
| Components | shadcn/ui (Radix primitives) |
| State & Data | TanStack React Query, React Context |
| Forms | React Hook Form + Zod v4 |
| HTTP | Axios (with interceptors) |
| Notifications | Sonner |
| Icons | Lucide React |
| Fonts | Figtree (sans), IBM Plex Mono (mono) |

---

## Backend API

StikkVerse connects to a FastAPI backend. The frontend does **not** proxy requests — all calls go directly from the browser to the API server.

### Auth Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Register new user (email, password, mill_id, role) |
| POST | `/api/v1/auth/login` | — | Login (form-urlencoded: username + password) → JWT + API key |
| POST | `/api/v1/auth/verify-email` | — | Verify email with token |
| POST | `/api/v1/auth/logout` | Bearer | End session |
| GET | `/api/v1/auth/me` | Bearer | Current user info |
| GET | `/api/v1/auth/teammates` | Bearer | List mill teammates |
| POST | `/api/v1/auth/invite` | Bearer | Invite teammate by email |
| GET | `/api/v1/auth/invitations` | Bearer | List pending invitations |

### Dashboard Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/dashboard/summary` | x-api-key | Mill summary (energy, CO₂, machine count, alerts) |
| GET | `/api/v1/dashboard/machines` | x-api-key | All machines with health, risk, status |
| GET | `/api/v1/dashboard/machine-specs` | x-api-key | Machine specifications (type, rated power) |
| GET | `/api/v1/dashboard/machines/{id}/trends` | x-api-key | 7-day health + CO₂ trend for a machine |

### Data Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/upload` | x-api-key | Upload operational CSV (background processing) |
| POST | `/api/v1/baseline/upload` | x-api-key | Upload initial baseline CSV |
| POST | `/api/v1/baseline/update` | x-api-key | Incrementally update baselines |
| GET | `/api/v1/data/history` | x-api-key | Upload history |
| GET | `/api/v1/baseline` | x-api-key | Current baseline readings |
| GET | `/api/v1/task/{task_id}` | x-api-key | Poll background task status |

### Alert Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/alerts/` | x-api-key | All alerts (active + acknowledged) |
| POST | `/api/v1/alerts/{id}/acknowledge` | x-api-key | Acknowledge an alert |

### Two Auth Patterns

The backend uses two authentication mechanisms:

- **Bearer JWT** (`Authorization: Bearer <token>`) — for auth/user management endpoints
- **API Key** (`x-api-key: <key>`) — for dashboard, data, and alert endpoints

Both are attached automatically via axios interceptors from localStorage.

---

## CSV Upload Format

Operational data CSVs must follow this format:

| Column | Type | Example | Description |
|---|---|---|---|
| timestamp | ISO 8601 | 2026-03-12T00:00:00Z | Reading timestamp (UTC) |
| mill_id | string | B | Mill identifier |
| machine_id | string | 1BK1 | Unique machine tag |
| current_A | float | 15.38 | Current draw in Amperes |
| motor_state | enum | RUNNING | RUNNING or OFF |

**Sample row:**
```
2026-03-12T00:00:00Z,B,1BK1,15.38,RUNNING
```

A typical daily file contains ~14,400 rows (one reading per minute per machine). Files are processed asynchronously — the upload returns a `task_id` that can be polled for progress.

---

## Design Philosophy

StikkVerse uses a **Machine Vitals Monitor** metaphor — each machine is treated like a patient on a hospital monitor. Health scores are shown as animated rings, bearing risk drives ECG-style pulse line patterns (calm for NORMAL, erratic for HIGH), and alerts pulse with urgency. The industrial control room aesthetic (dark backgrounds, monospace labels, cyan accent, grid overlays) reinforces the operational context without resorting to generic dashboard patterns.

---

## Author

- StikkVerse team.