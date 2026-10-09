# 🏥 MediCompare Frontend
### React.js UI — "Zomato for Hospitals"

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Real-time | STOMP.js + SockJS |
| Styling | Pure CSS (custom design system) |
| Fonts | Playfair Display + DM Sans + DM Mono |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Backend running on `http://localhost:8080`

### Install & Run
```bash
npm install
npm start
```

App starts on **http://localhost:3000**

The `proxy` in `package.json` forwards all `/api` calls to `http://localhost:8080` automatically.

---

## 📄 Pages

| Route | Page | Who |
|---|---|---|
| `/` | Hero landing with search | Everyone |
| `/search` | Hospital results + filters | Everyone |
| `/hospital/:id` | Full detail: costs, beds, reviews, booking | Everyone |
| `/treatments` | Browse all treatments by category | Everyone |
| `/login` | Login with demo account shortcuts | Everyone |
| `/register` | Patient or Hospital Admin signup | Everyone |
| `/my-appointments` | View & cancel booked appointments | Patient |
| `/hospital-dashboard` | Manage beds, view reviews + replies | Hospital Admin |

---

## 🎨 Design System

Built around a **deep navy & teal** medical-luxury palette:

| Token | Value | Usage |
|---|---|---|
| `--navy` | `#0A1628` | Background |
| `--teal` | `#00B4A6` | Primary actions, highlights |
| `--gold` | `#F0A500` | Star ratings, accreditation |
| `--green` | `#2ECC8F` | Available / positive status |
| `--red` | `#E05A5A` | Full / negative status |
| `--font-display` | Playfair Display | Headings, prices |
| `--font-body` | DM Sans | Body text, UI |
| `--font-mono` | DM Mono | Confirmation codes, prices |

---

## 🔑 Key Features

### 1. Smart Search (HomePage + SearchPage)
- Autocomplete on treatment names from backend
- Filter by insurance provider + city
- Results show starting price, bed status, rating

### 2. Cost Breakdown (CostBreakdown component)
- Shows every line item: surgeon, room, medicines, anesthesia…
- Computes total with room × days
- "No hidden charges" framing

### 3. Live Bed Status (BedStatusBadge)
- 🟢 Green pulsing dot = beds available
- 🔴 Red dot = full
- WebSocket subscription for real-time updates

### 4. Booking Flow
- Select treatment → pick date/time → confirm
- Returns confirmation code immediately

### 5. Hospital Dashboard
- Admin updates bed counts via form
- Reply to patient reviews inline

---

## 🔌 WebSocket (Real-time Beds)

The frontend can subscribe to live bed updates:

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    client.subscribe(`/topic/beds/${hospitalId}`, (msg) => {
      const bedStatus = JSON.parse(msg.body);
      // bedStatus.status === 'GREEN' or 'RED'
    });
  }
});
client.activate();
```

---

## 🗂️ Project Structure

```
src/
├── App.js                        # Routing
├── index.js                      # Entry point
├── index.css                     # Global design tokens + utilities
├── context/
│   └── AuthContext.js            # JWT auth state (login/logout)
├── services/
│   └── api.js                    # All Axios API calls
├── components/
│   ├── Navbar.js / .css          # Top navigation
│   ├── BedStatusBadge.js         # 🟢/🔴 live indicator
│   ├── StarRating.js             # ★ rating display
│   └── CostBreakdown.js / .css   # "No Surprises" calculator
└── pages/
    ├── HomePage.js / .css        # Hero + search card
    ├── SearchPage.js / .css      # Hospital results grid
    ├── HospitalDetailPage.js / .css  # Full detail + tabs
    ├── TreatmentsPage.js / .css  # Browse treatments
    ├── LoginPage.js              # Login + demo shortcuts
    ├── RegisterPage.js           # Sign up
    ├── AuthPages.css             # Shared auth styles
    ├── MyAppointmentsPage.js / .css  # Patient appointments
    └── HospitalDashboardPage.js / .css  # Admin dashboard
```

---

## 📱 Responsive

All pages are mobile-friendly:
- Search filters stack vertically on mobile
- Hospital grid switches to 1 column
- Navbar collapses to hamburger menu
- Dashboard grids adapt to 2-column on tablet

---

## 🔐 Auth Flow

1. User logs in → JWT stored in `localStorage`
2. `AuthContext` exposes `user`, `token`, `login()`, `logout()`
3. Every Axios request auto-attaches `Authorization: Bearer <token>`
4. Role-based redirects: Patient → `/my-appointments`, Hospital Admin → `/hospital-dashboard`
