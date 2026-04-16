# CareBridge AI — Progress Summary
*Last updated: 2026-04-16*

## Project Structure
- **Root**: `/Users/sudhanshumishra/code/jsp/ai_health_part/AI_HEALTH/`
- **Server**: Express + TypeScript, port **5001** (macOS AirPlay owns 5000)
- **Client**: Next.js 15 + React 19 + Zustand + Tailwind v4, port **3000**

## Running the Project
```bash
# Terminal 1 — server
cd AI_HEALTH/server && npm run dev

# Terminal 2 — client
cd AI_HEALTH/client && npm run dev
```

## Environment Files Created
- `server/.env` — all required vars filled (MongoDB Atlas, JWT secret, Cloudinary, HuggingFace, OpenRouter)
- `client/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:5001`

---

## Fixes Applied (session recap)

### 1. Server .env + Port conflict
- Created `server/.env` from `.env.example` with real credentials
- Changed PORT from 5000 → 5001 (macOS Control Center owns 5000)
- Updated `client/.env.local` accordingly

### 2. Login redirect bug (`components/auth/login-form.tsx`)
- **Bug**: Zustand `persist` stores `isAuthenticated:true` in localStorage. Visiting `/login` triggered `useEffect` → immediate redirect before user saw the form.
- **Fix**: Call `syncCurrentUser()` first to validate token against server. Only redirect if token is still valid. Invalid/expired tokens clear the session and show the form.
- Also removed duplicate `useAuth()` call (was called twice in same component)
- After login, redirect is now **role-based**: `patient` → `/`, `hospital_admin`/`doctor` → `/hospital`
- Added "Verifying your session…" loading state while token is being validated

### 3. Register page (`app/(public)/register/page.tsx`)
- Same token-validation fix applied (was using blind `isAuthenticated` redirect)
- Fixed deprecated `React.FormEvent` → `React.SyntheticEvent`

### 4. Navbar auth-awareness (`components/layout/public-navbar.tsx`)
- **Bug**: Navbar always showed Login/Register regardless of auth state. Authenticated users clicking "Login" got bounced back to `/`.
- **Fix**: Navbar now reads `isAuthenticated` from auth store. Shows **Dashboard + Logout** when logged in, **Login + Register** when not. Logout works from both desktop and mobile menu.

### 5. Hospitals/Medical-shops/Issues page crash
- **Bug**: `Functions cannot be passed directly to Client Components` — Server Components passed `createPageHref` function as prop to Client Components.
- **Files fixed** (9 total):
  - `components/hospitals/hospitals-pagination.tsx` — added `"use client"` + `useSearchParams()`, builds URLs internally
  - `components/medical-shops/medical-shops-pagination.tsx` — same
  - `components/issues/issues-pagination.tsx` — same
  - `components/hospitals/hospitals-discovery.tsx` — removed `createPageHref` prop
  - `components/medical-shops/medical-shops-discovery.tsx` — removed `createPageHref` prop
  - `components/issues/public-issues-feed.tsx` — removed `createPageHref` prop
  - `app/(public)/hospitals/page.tsx` — removed function + prop
  - `app/(public)/medical-shops/page.tsx` — removed function + prop
  - `app/(public)/issues/page.tsx` — removed function + prop + stale imports

### 6. Dashboard fixes (IN PROGRESS — session ended mid-fix)
Work started on these issues:

**a. `app/(hospital)/hospital/layout.tsx`** ✅ Done
- Changed `allowedRoles={["hospital_admin"]}` → `["hospital_admin", "doctor"]`
- Changed `unauthorizedRedirectTo="/login"` → `"/"`  (was causing redirect loop)

**b. `components/auth/auth-guard.tsx`** ✅ Done
- Fixed CSS typo: `className   =` → `className=`

**c. `services/dashboard.service.ts`** ✅ Done
- Changed `hospitalId: string` → `hospitalId: string | undefined`
- When no hospitalId, skips hospital profile fetch; uses overview metadata as fallback
- Server resolves hospital from user's `linkedHospitalId` DB field automatically

**d. `components/dashboard/dashboard-shell.tsx`** ✅ Done
- Removed hard block that showed error when `user.linkedHospitalId` was missing
- Now tries API call regardless (server handles scope resolution)
- Added skeleton loading state
- Added contextual error UI: if "no linkedHospitalId" error → shows "Link hospital" CTA to `/hospital/network`; otherwise shows retry button

**e. `components/dashboard/dashboard-shell.tsx`** ⚠️ Incomplete
- Unused import `ErrorState` warning remains (minor, non-blocking)
- Topbar has **no user info or logout button** — still needs work

**f. `components/layout/hospital-topbar.tsx`** ❌ NOT STARTED
- Needs `useAuth()` added to show: user name, role badge, logout button

---

## Known Remaining Issues

### High priority
1. **Hospital topbar** — no user info, no logout. User is stuck once inside portal.
   - File: `components/layout/hospital-topbar.tsx`
   - Fix: import `useAuth`, show `user.name`, `user.role` badge, and a Logout button

2. **Unused import in dashboard-shell** — `ErrorState` import no longer used after refactor
   - File: `components/dashboard/dashboard-shell.tsx` line 23
   - Fix: remove `import { ErrorState }` line

3. **TypeScript clean-up** — run `npx tsc --noEmit` from client dir to verify no errors after dashboard changes

### Medium priority
4. **No seed data** — MongoDB is empty. Dashboard will show all zeros. Need to either:
   - Run `npm run seed` from server dir (check `src/scripts/seed.ts` first)
   - Or manually register a hospital via the Network page

5. **Hospital registration flow** — `hospital_admin` users need to register a hospital and link their account. The flow for this isn't obvious in the UI.

6. **Doctor role scope** — doctors are now allowed in the portal but their `linkedHospitalId` may also be missing; same fix applies.

---

## Architecture Notes
- Auth state: Zustand `persist` middleware stores `{ user, token, isAuthenticated }` in localStorage under key `"carebridge-auth"`
- Token: JWT signed with `JWT_SECRET` from `.env`; validated server-side on every protected route
- Analytics: All `/api/analytics/*` routes require `hospital_admin` or `doctor` role. `hospitalId` query param is optional — server falls back to user's DB `linkedHospitalId`
- Sockets: Socket.IO on same port as HTTP server (5001). Client connects to `getApiOrigin()` = `http://localhost:5001`
- File uploads: Cloudinary (configured)
- AI routes: OpenRouter (`sk-or-v1-...`) under `/api/ai`
- Embeddings: HuggingFace `sentence-transformers/all-MiniLM-L6-v2` for semantic search

## Credentials (server/.env)
- MongoDB: Atlas cluster `cluster0.qk0frh8.mongodb.net`
- Cloudinary: cloud `dbhn50nw4`
- HuggingFace: configured in `server/.env` (redacted)
- OpenRouter: configured in `server/.env` (redacted)
