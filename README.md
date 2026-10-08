# StikkVerse

**Keep every machine in your mill healthy, efficient, and running — from one screen.**

StikkVerse watches the machines in an industrial mill the way a hospital monitor watches a patient. It takes the raw readings coming off each machine, turns them into a simple health score, and tells you in plain terms which machines are fine, which need attention soon, and which need it now. It also tracks how much energy each machine uses and how much carbon it produces, so you can see where money and emissions are being wasted.

---

## Who it's for

- **Plant and operations managers** who need a single, up-to-date picture of the whole mill without walking the floor or reading spreadsheets.
- **Maintenance teams** who want early warning before a machine fails, instead of finding out after it breaks.
- **Companies running several mills** who need to oversee all of them from one place and spot the sites that need help first.

---

## What you can do with it

**See the health of every machine at a glance.**
Each machine gets a health score from 0 to 100 and a simple risk label — Normal, Warning, or High. A machine in good shape shows a calm, steady line; a machine at risk shows a jumpy, urgent one, like a heartbeat on a monitor. You can tell the state of the whole mill in a few seconds.

**Get warned before something breaks.**
StikkVerse raises an alert when a machine's readings drift into dangerous territory — a bearing starting to wear, a gap in the data coming from a machine, or a jump in carbon output. Alerts stay in one list where your team can see them, mark the ones they've seen, and close the ones they've dealt with.

**Track energy and carbon.**
For every machine and for the mill as a whole, you can see how much electricity is being used and how much carbon dioxide is being produced, including the "excess" amount above what a healthy machine should produce. That turns vague efficiency goals into concrete numbers you can act on.

**Feed in your own data.**
Your machine readings go in as a simple spreadsheet-style file (CSV). You drag and drop the file, and StikkVerse processes it in the background while you keep working, showing a progress bar until it's done. There's also a one-time "baseline" upload that teaches the system what normal looks like for each of your machines.

**Work as a team, with the right permissions.**
People are invited by email and given a role that matches what they should be allowed to do:

| Role           | What they can do                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------- |
| **Member**     | View the dashboards and data. Read-only.                                                       |
| **Manager**    | Everything a member can do, plus upload data and act on alerts.                                |
| **Admin**      | Everything a manager can do, plus manage their mill's team and approve people who ask to join. |
| **Superadmin** | Oversees the whole platform across every mill and every company.                               |

**Oversee many mills at once (Superadmin).**
If you run more than one mill, the Superadmin area gives you a command center: the overall health of the platform, a sortable and filterable list of every mill with its latest activity, and a view of all open alerts grouped by mill so you can see at a glance which sites have the most problems and drill into any one of them.

**Sign in the way that suits you.**
You can log in with a password, reset it by email if you forget it, or skip the password entirely and get a one-time "magic link" sent to your inbox that signs you straight in.

---

## How it works, in plain terms

1. **Your machines produce readings** — things like how much electrical current each motor is drawing, minute by minute.
2. **You upload those readings** to StikkVerse as a file (or your systems send them automatically).
3. **StikkVerse does the maths** — it compares each machine against its own normal baseline, scores its health, works out energy and carbon figures, and decides whether anything needs an alert.
4. **You see the results** on clear dashboards, and your team acts on what matters.

You don't need to understand the calculations to use it. The job of the app is to turn a flood of raw numbers into a short list of "here's what's fine and here's what needs you."

---

## A note on accuracy

StikkVerse is a monitoring and early-warning tool. It highlights machines that look like they're degrading and flags unusual patterns, but it doesn't replace a trained engineer's inspection or a formal maintenance schedule. Treat its alerts as a prompt to look closer, not as the final word.

---

## For developers

Everything below is technical reference for the people building and running StikkVerse. A non-technical reader can stop here.

### Tech stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| Framework     | Next.js 16 (App Router)                |
| Language      | TypeScript                             |
| Styling       | Tailwind CSS v4, CSS custom properties |
| Components    | shadcn/ui (Radix primitives)           |
| State & data  | TanStack React Query, React Context    |
| Forms         | React Hook Form + Zod v4               |
| HTTP          | Axios (with interceptors)              |
| Notifications | Sonner                                 |
| Icons         | Lucide React                           |
| Fonts         | Figtree (sans), IBM Plex Mono (mono)   |

### Architecture

StikkVerse is a Next.js front end that talks directly to a FastAPI backend from the browser — there is no proxy layer in between. It has two separate areas:

- **Mill dashboard** — what an admin, manager, or member of a single mill uses day to day (cyan accent).
- **Superadmin panel** — the platform-wide command center, isolated with its own auth token and context (violet accent).

### Roles and permissions

Roles are `superadmin` > `admin` > `manager` > `member`. Member is read-only; manager adds upload and alert actions; admin adds team management and join-request approval for their mill; superadmin is platform-wide. The superadmin account is seeded on the server at startup and cannot be created through sign-up.

### Two ways to authenticate

The backend uses two mechanisms, both attached automatically by axios interceptors from `localStorage`:

- **Bearer JWT** (`Authorization: Bearer <token>`) — auth, admin, and superadmin endpoints.
- **API key** (`x-api-key: <key>`) — dashboard, data, and alert endpoints.

Login takes JSON (`{ email, password }`) and returns a JWT plus an API key. Passwordless sign-in and password reset are also supported via emailed one-time links.

### Signing up for a mill

Registration has two paths against `/api/v1/auth/register`:

- **Create a new mill** — if the mill ID is unclaimed, you become its admin.
- **Join an existing mill** — your request is queued and emailed to the mill's current admins for approval; nothing is created until one of them approves.

### API reference

Base path: `/api/v1`. Endpoints are grouped as **Auth**, **Data**, **Dashboard**, **Alerts**, **Admin**, and **Superadmin**.

**Auth** — `register`, `login`, `logout`, `me`, `verify-email`, `forgot-password`, `reset-password`, `magic-link`, `magic-login`, `approve-mill-access`, `mill-available`.

**Dashboard** (`x-api-key`) — `summary`, `machines`, `machine-specs`, `machines/{id}/trends`.

**Data** (`x-api-key`) — `upload`, `baseline/upload`, `baseline/update`, `baseline`, `baseline/history`, `data/history`, `task/{task_id}`.

**Alerts** (`x-api-key`) — `alerts/` (active + acknowledged), `alerts/history` (resolved), `alerts/{id}/acknowledge` (PATCH), `alerts/{id}/resolve` (PATCH).

**Admin** (Bearer) — `admin/users`, `admin/mills`, `admin/tasks`, `admin/uploads`, `admin/pending-approvals`, and user/stats management.

**Superadmin** (Bearer, superadmin only) —

| Method | Endpoint                      | Purpose                                                                                                     |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| GET    | `/superadmin/health`          | Platform health score, uptime, latency, machine-health distribution, alert and task counts, service checks  |
| GET    | `/superadmin/mills/activity`  | Every mill with last-seen data, machine count, 7-day average health, status. Supports `sort_by` and `order` |
| GET    | `/superadmin/alerts/overview` | All open alerts; pass `group_by=mill` for per-mill grouped counts and full alert lists                      |

### CSV upload format

Operational data CSVs follow this shape:

| Column      | Type     | Example              | Description             |
| ----------- | -------- | -------------------- | ----------------------- |
| timestamp   | ISO 8601 | 2026-03-12T00:00:00Z | Reading timestamp (UTC) |
| mill_id     | string   | B                    | Mill identifier         |
| machine_id  | string   | 1BK1                 | Unique machine tag      |
| current_A   | float    | 15.38                | Current draw in amperes |
| motor_state | enum     | RUNNING              | RUNNING or OFF          |

Sample row:

```
2026-03-12T00:00:00Z,B,1BK1,15.38,RUNNING
```

A typical daily file is around 14,400 rows (one reading per minute per machine). Uploads are processed asynchronously: the call returns a `task_id` you can poll for progress. Alert types raised by processing are `DATA_GAP`, `WARNING`, and `CO2_INCREASE`.

### Design philosophy

StikkVerse uses a **machine vitals monitor** metaphor: each machine is a patient on a hospital monitor. Health scores render as animated rings, bearing risk drives ECG-style pulse lines (calm for Normal, erratic for High), and alerts carry urgency in their colour. The industrial control-room aesthetic — dark backgrounds, monospace labels, cyan accent on the mill side and violet on the superadmin side, grid overlays — reinforces the operational context rather than defaulting to generic dashboard styling.

---

## Author

StikkVerse team.
