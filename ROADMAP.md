# 🗺️ First50: Engineering Roadmap & Strategic Enhancements

> **Target:** SDE-2 / Senior Backend Engineer | **Locations:** Bengaluru & Chennai | **Target Compensation:** 22 to 45+ LPA  
> **Candidate:** Rahul Prasanna T S (Fidelity Investments India — Communications Orchestration Platform)

---

## 🎯 Executive Vision

The core thesis of First50 is **asymmetric speed and signal**:
1. Applying within the **First 4 Hours** (`f_TPR=r14400`) before recruiter fatigue sets in at 10:00 AM IST.
2. Reaching Engineering Managers (EMs) with **metric-backed pitches** (2.1B+ scale, 90% latency reduction) before portal applications.
3. Strict **72-hour follow-up loops** so high-probability opportunities never go cold.

Below is the concrete, prioritized architectural roadmap for upcoming features and integrations.

---

## 🚀 Prioritized Feature Backlog

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROADMAP TIMELINE                               │
├──────────────────┬──────────────────┬──────────────────┬────────────────────┤
│     Phase 1      │     Phase 2      │     Phase 3      │      Phase 4       │
│  Chrome Sidecar  │  ATS Resume Gen  │ Telegram 8:30 AM │  AI Mock Interview │
│  Auto-Fill DMs   │  Tailored 1-page │  Mobile Bot      │  Distributed Sys   │
└──────────────────┴──────────────────┴──────────────────┴────────────────────┘
```

---

### Phase 1: LinkedIn Chrome / Arc Extension Sidecar
* **Priority:** 🟢 High (Maximum daily time-savings)
* **Problem:** Manually copy-pasting the <300-char LinkedIn note into connection requests takes 3–5 minutes per EM.
* **Solution:**
  * Build a lightweight Manifest V3 Chrome Extension connected to First50's local API.
  * When Rahul views an Engineering Manager, Tech Lead, or Recruiter profile on LinkedIn:
    1. A floating **"⚡ First50 Strike"** badge appears.
    2. It detects the target company, pulls the active role ID from First50, and automatically prepares Rahul's tailored pitch citing 2.1B+ scale.
    3. Clicking **"Auto-Fill Note"** clicks "Connect", clicks "Add a note", pastes the pitch, checks length (guaranteed `<300` chars), and stages it for 1-click send.

---

### Phase 2: Automated 1-Page ATS Resume PDF Tailor
* **Priority:** 🟢 High (Directly increases ATS pass rates)
* **Problem:** Even with a strong background, modern ATS filters (Workday, Greenhouse, Lever) score resumes based on exact keyword frequency (e.g. *gRPC*, *Kafka Partitioning*, *DynamoDB Streams*).
* **Solution:**
  * Integrate a headless PDF generation engine (using `@react-pdf/renderer` or serverless Puppeteer).
  * When Gemini analyzes a JD and identifies 3–5 **Missing ATS Keywords**:
    1. Click **"Generate Tailored Resume"**.
    2. First50 automatically injects the relevant matching keywords into Rahul's core resume bullet points without altering factual veracity.
    3. Exports a crisp, 1-page black-and-white ATS-compliant PDF ready for 1-click submission.

---

### Phase 3: Telegram / WhatsApp 8:30 AM Morning Alert Bot
* **Priority:** 🟡 Medium-High (Seamless mobile workflow)
* **Problem:** On busy mornings, opening a laptop before 9:00 AM can be inconvenient.
* **Solution:**
  * Connect the existing `/api/cron/morning-radar` GitHub Actions cron (`0 3 * * 1-5`) to a Telegram Bot webhook or WhatsApp Business API.
  * Every weekday at **8:30 AM IST**, Rahul receives a summary message:
    ```
    ⚡ FIRST50 MORNING RADAR (3 Fresh High-Signal Roles)
    
    1. Razorpay | SDE-2 Core Payments (Bengaluru)
       Fit Score: 94% | Match: Java 21, K8s, PostgreSQL
       Apply: [1-Click Direct Link]
       Pitch: "Hi [EM], saw your team scaling..."
    
    2. Stripe | Software Engineer Backend (Bengaluru)
       Fit Score: 92% | Match: Distributed Systems, High Throughput
       Apply: [1-Click Direct Link]
    ```

---

### Phase 4: Interactive System Design & SDE-2 Mock Interviewer
* **Priority:** 🟡 Medium
* **Objective:** Polish interview delivery for Tier-1 Product, FinTech, and GCC rounds.
* **Solution:**
  * Interactive text & voice practice studio powered by Gemini 3.8 Flash.
  * Dynamic question generator focusing on Rahul's exact production battle scars:
    * *"How did you handle Kubernetes scale-down race conditions with KEDA and SQS visibility timeouts?"*
    * *"Walk me through the active-active multi-region failover architecture using AWS Multi-Region Access Points (MRAP)."*
    * *"How did table partitioning and index pruning reduce batch insert runtimes by 67% on PostgreSQL?"*
  * Real-time scoring on: Depth of Distributed Systems Knowledge, Clarity of Trade-offs, and STAR format delivery.

---

### Phase 5: Compensation Intelligence & Offer Negotiation Studio
* **Priority:** 🔵 Strategic (Crucial during interview offers)
* **Baseline:** Current 13.68 LPA Base + 15% Bonus (~15.73 LPA CTC).
* **Target Bracket:** **22 to 45+ LPA** (Tier-1 Product, FinTechs, Tier-1 GCCs).
* **Features:**
  * Real-time benchmark data for SDE-1 / SDE-2 compensation bands across Bangalore & Chennai (Stripe, Razorpay, Swiggy, Cred, Paypal, Amazon, Chargebee, Goldman Sachs).
  * Counter-offer script generator calculating tax-optimized Base + RSU + Joining Bonus splits to hit the 30–45 LPA target.

---

### Phase 6: Company Stack Radar & Hiring Spree Watchdog
* **Priority:** 🔵 Intelligence
* **Features:**
  * Monitor GitHub commits, tech blogs, and engineering layoff/hiring freeze trackers for target Indian GCCs and Product firms.
  * Alert when teams in Bangalore or Chennai announce major expansions or migrations to Java/AWS/Kubernetes microservices.

---

## 📋 Progress Log & Completed Milestones

- [x] **v1.0.0 Scaffolding:** Full-stack Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide icons.
- [x] **Dark Engineering UI:** Cyber emerald `#10b981` palette with frosted glass panels and IST clock.
- [x] **Seeded Profile:** Pre-loaded with Rahul's 2.1B+ communications and 90% latency reduction metrics.
- [x] **Shift Architecture:** 6 time-blocked daily tasks tailored for 11 AM – 8 PM office hours.
- [x] **Automated 8:30 AM Morning Radar:** Public Greenhouse & Lever ATS fetchers + Gemini 3.8 Flash scoring.
- [x] **9:15 AM Fast Strike:** LinkedIn `f_TPR=r14400` deep link launchers and custom query builder.
- [x] **High-Signal Pitch Studio:** Dynamic `<300`-char LinkedIn note generator + character counter.
- [x] **Deep JD Analyzer:** Fit score, YoE gate check, ATS keywords, and 120-word cold emails.
- [x] **72-Hour Referral Radar:** Automated nudge triggers for dormant DMs and referrals.
- [x] **Dual Data Layer:** LocalStorage fallback + Cloud Firestore multi-user database rules.
- [x] **Production Deployment:** Live on Vercel at `https://first50-three.vercel.app`.
- [x] **Clean Slate Purge:** Removed all placeholder mock jobs and 72-hour dummy notifications.
