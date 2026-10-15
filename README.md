# ⚡ First50: AI Job Hunt Command Center & Automated Morning Job Radar

> **"If you apply after 4 hours, you're in a 500-person queue. The First 50 win the interview."**

First50 is a full-stack, local-first Progressive Web App (PWA) engineered specifically for **Rahul Prasanna T S** (Software Engineer at Fidelity Investments India) and tailored for high-scale backend engineers targeting Tier-1 Product Companies, FinTechs, and Global Capability Centers (GCCs) in **Bengaluru** and **Chennai** (target CTC: **22 to 45+ LPA**).

---

## 🎯 The First-50 Strategy

In the 2026 tech job market, applying to jobs more than 4 hours after they are posted virtually guarantees rejection or radio silence because recruiter queues swell to 500+ applicants. Furthermore, standard portal referrals often sit unread in employee inboxes.

First50 reverses this dynamic through an automated, time-blocked protocol tailored to an **11:00 AM – 8:00 PM IST work shift**, utilizing the prime **8:30 AM – 10:30 AM morning window**:

```
08:30 AM  ──►  Automated Morning ATS Radar (Greenhouse/Lever polled + Gemini AI scored)
09:15 AM  ──►  The Past-4-Hours Strike (LinkedIn f_TPR=r14400 1-click launchers)
09:55 AM  ──►  Naukri Profile Refresh (#1 Recruiter 'Recently Updated' rank at 10 AM)
10:00 AM  ──►  3 Direct EM / Senior Dev Connection Pitches (<300 chars, metric-backed)
11:00 AM  ──►  Core Office Shift (Fidelity Platform: 2.1B+ scale, 90% latency cut)
08:30 PM  ──►  Evening Pipeline Triage & 72-Hour Referral Nudge Follow-Ups
```

---

## 🚀 Key Modules & Capabilities

### 1. 📡 Automated 8:30 AM Morning Job Radar
- Automatically polls unauthenticated public JSON endpoints from **Greenhouse** (`stripe`, `razorpay`, `postman`, `chargebee`, `rubrik`, `cloudflare`, `twilio`) and **Lever** (`cred`, `zeta`, `palantir`).
- Filters for Chennai, Bengaluru, and India Backend/Distributed Systems roles.
- Scores fit (0–100%) with **Google Gemini 2.5 Flash** against Rahul's exact 2.1B+ scale background.
- Highlights missing ATS keywords and pre-generates tailored `<300`-character LinkedIn connection pitches.
- Supported by a manual "Scan Live ATS Boards Now" button in the UI.

### 2. ⚡ The 9:15 AM "Past 4 Hours" Strike Launcher
- 1-click deep links leveraging LinkedIn's hidden `f_TPR=r14400` (Past 4 Hours) parameter to land in the first 50 applicants before recruiters log in at 10:00 AM.
- Quick launchers for Bengaluru Java/Distributed Systems, Chennai Java/AWS Microservices, and All-India SDE-1/2 lateral roles.
- Custom URL Builder with custom time windows (`r3600`, `r14400`, `r86400`), locations, and boolean queries.

### 3. ✍️ High-Signal EM Pitch Studio & Deep JD Analyzer
- **Tab 1 (Instant Template Pitch):** Dynamic `<300`-character LinkedIn connection note with live character counter (green <280, amber 280-299, red 300+) citing 2.1B+ communications, 90% latency reduction, and B.Tech 9.1 CGPA.
- **Tab 2 (Gemini Deep JD Analyzer):** Paste any raw Job Description to generate:
  1. Fit Score % & YoE Gate Check (evaluates 2+ YoE alignment vs strict >3 YoE filters).
  2. Missing ATS Keywords to inject into resume.
  3. Custom `<300`-char LinkedIn note + 120-word Cold Email to Hiring Manager.
  4. 1-click "Save to Pipeline" action.

### 4. ⏰ Application Pipeline & 72-Hour Follow-Up Tracker
- Visual pipeline tracking status from `HM DM Sent` ➔ `Applied (<4h)` ➔ `Referred` ➔ `OA / Screening` ➔ `Interviewing` ➔ `Offer`.
- **72-Hour Nudge Radar:** Automatically flags any DM or referral older than 72 hours with an amber alert and provides a 1-click "Copy Follow-Up Nudge" button.

### 5. 📱 Installable PWA with Web Push Notifications
- Full `manifest.json`, Service Worker caching (`public/sw.js`), and Web Push Notification toggle for morning discovery alerts.

---

## 🛠️ Zero-Cost Technical Architecture

| Component | Technology | Cost Tier |
|---|---|---|
| **Framework** | Next.js 14+ (App Router, TypeScript, Tailwind CSS) | Free / Open Source |
| **Icons & Design** | Lucide React, Glassmorphism, Emerald Cyber Palette | Free |
| **Data Layer** | Dual Adapter: LocalStorage Fallback + Firebase Cloud Firestore | Free (Spark Tier) |
| **Authentication** | Firebase Auth (Google Sign-In) + Local Mode | Free |
| **AI Intelligence** | Google Gemini API (`gemini-2.5-flash`) + Heuristic Fallback Engine | Free Tier |
| **Scheduler** | GitHub Actions Cron (`0 3 * * 1-5` = 8:30 AM IST Mon-Fri) | 100% Free |

---

## ⚡ Quickstart & Local Setup

### 1. Run Immediately (Zero Configuration Needed)
First50 includes an intelligent **local-first dual adapter**. It boots out-of-the-box using browser `LocalStorage` pre-seeded with Rahul's profile, routine tasks, and sample applications:

```bash
cd JobHunt
npm run dev
```

Open `http://localhost:3000` in your browser.

### 2. Configure Gemini AI & Firebase (Optional)
To enable Gemini 2.5 Flash analysis and multi-device Firestore synchronization:

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Add your Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/)):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. (Optional) Add your Firebase credentials (from [Firebase Console](https://console.firebase.google.com/)):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=first50-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=first50-app
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=first50-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

---

## ⏰ Automated GitHub Actions Cron Setup

The repository includes `.github/workflows/morning-radar.yml` configured to run at `0 3 * * 1-5` (03:00 UTC = 8:30 AM IST, Monday through Friday):

1. Deploy the Next.js app to Vercel or your hosting platform.
2. In your GitHub repository settings, go to **Settings > Secrets and variables > Actions**.
3. Add repository secret:
   - `APP_URL`: `https://your-deployed-app.vercel.app`
   - `CRON_SECRET`: Optional authentication token matching `CRON_SECRET` in `.env.local`.

---

## 👤 Seeded User Context: Rahul Prasanna T S
- **Role:** Software Engineer, Fidelity Investments India (Communications Orchestration Platform)
- **Experience:** 2+ Years (Full-time since Aug 2024; Intern Jan – Jul 2024)
- **Education:** B.Tech IT, Thiagarajar College of Engineering (Graduated 2024, 9.1 CGPA)
- **Baseline Compensation:** 13.68 LPA Base + 15% Bonus (~15.73 LPA CTC)
- **Target Compensation:** 22 to 45+ LPA
- **Core Metrics:**
  - Scaled backend platform to **2.1B+ annual communications**.
  - Cut batch runtime by **90%** (to <2h) via K8s orchestrator-worker model.
  - Reduced Postgres batch insert runtimes by **67%** across 15M+ statements.
  - Eliminated SQS data loss during KEDA scale-down via graceful SIGTERM handling.
  - Architected active-active AWS Multi-Region Access Points (MRAP) failover pipeline.
