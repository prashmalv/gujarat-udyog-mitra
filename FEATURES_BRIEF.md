# Gujarat MSME AI Platform — Features Brief

> **For CEO / Presales / Client PPT**
> Two deliverables on Azure — **Gujarat Udyog Mitra AI** (govt-facing) + **Gujarat MSME B2B Portal** (market-facing), sitting on top of the same AI + Knowledge Graph spine. Parallel to Bihar's live [bihar-udyog-mitra.vercel.app](https://bihar-udyog-mitra.vercel.app) — proves the platform is **replicable state-by-state**.

---

## 1. Platform positioning (the CEO story)

- **Bihar was v1** — proved that AI can drive citizen-facing MSME conversation in Hindi + regional languages, cite live government data, and personalize by district / sector / category.
- **Gujarat is v2** — same spine, adapted for Gujarat's ecosystem (Surat diamond, Morbi ceramic, Kutch handicraft, Jamnagar brass, Aatmanirbhar Gujarat Sahay Yojana etc.), with **Gujarati language** first-class and **Azure OpenAI GPT-4o-mini** as the LLM instead of Anthropic.
- **B2B Portal is v3** — the "market-side" of the same platform: MSMEs list products, buyers discover + RFQ, AI helps buyers find the right supplier.
- **Together = an "MSME OS"** — state-level AI-driven MSME governance that can be relicensed to any Indian state in weeks, not months.

---

## 2. Gujarat Udyog Mitra AI — Application features

### 2.1 Three-persona architecture

| Persona | AI cockpit tailored to |
|---------|------------------------|
| **MSME Entrepreneur** (owner / job-seeker) | Conversational scheme matching, DPR generation, grievance filing, voice-first flow |
| **DIC / MSME Officer** (Zilla Udyog Kendra staff) | AI-triaged application queue with red / amber / green flags, stressed-MSME predictions, grievance theme clustering |
| **Secretary / CM Office** ("Ask Gujarat" cockpit) | Live state KPIs, AI anomaly stream, what-if policy simulator, cluster heat maps |

### 2.2 Conversational AI (the "wow" moment)

- **Trilingual voice + text**: **ગુજરાતી**, Hindi, English — Web Speech API listens in `gu-IN` / `hi-IN` / `en-IN`, LLM responds in same script.
- **Tap-to-speak** big-button UX (simple mode) + **Advanced tab** for detailed business profile (district, sector, stage, category).
- **First-sentence rule**: AI's first sentence answers the user's question directly — no canned "Namaste Main Udyog Mitra hu" preamble.
- **Mock voice demo works offline**; live browser SpeechRecognition when online.

### 2.3 Authoritative data ingestion

- **Live scrape** of the Ministry of MSME's Gujarat portal (`dcmsme.gov.in/Gujarat.aspx`) refreshed every 6 hours — cluster info, MSME-DI Ahmedabad contacts.
- **MSME Schemes Booklet 2025-26** (M/o MSME, GoI) — all 19 Central schemes with exact subsidy %, project ceilings, apply URLs baked into system prompt.
- **Gujarat state schemes** — Aatmanirbhar Gujarat Sahay Yojana, Gujarat Industrial Policy 2020, Textile Policy 2019, Startup Policy 2022-27, Gujarat MSME Act 2019 (3-year exemption).
- **Every scheme answer cites** both sources at the end — no fabrication.

### 2.4 AI features per persona

**Entrepreneur cockpit:**
- 🎯 **Scheme Matchmaker** — eligibility scored across 20+ Central + State schemes, ranked by fit and subsidy value.
- 📄 **DPR Builder** — 5 conversational questions → bankable Detailed Project Report with cost sheet, revenue projection, breakeven chart.
- ⚖️ **Grievance Auto-Router** — AI classifies grievance and routes to MSEFC / TReDS / Single Window / GST-appellate with MSMED Act 2006 Sec 15-24 citation.
- 📈 **Market Intelligence** — district-level demand signals and cluster-price snapshots.
- 🎓 **Skill Training Matcher** — links to KVIC, NIESBUD, iCreate, iHub, PMKVY 4.0.
- 📍 **Nearby MSMEs / DIO offices** — locate the field officer for the user's district.

**Officer console:**
- 🚦 **AI-triaged application queue** — every incoming application gets green / amber / red flags (docs missing, eligibility mismatch, duplicate Udyam, sector cap breach).
- 🔥 **Stressed-MSME early warning** — AI detects drops in GST filings, delayed payments owed, sudden reduction in electricity bills.
- 🗂 **Grievance theme clustering** — group similar complaints across the district for policy action.
- 📊 **SLA breach dashboard** — where is disbursement stuck?

**Secretary / CM cockpit ("Ask Gujarat"):**
- 📊 **State KPI dashboard** — cumulative Udyam registrations, disbursement, MSEFC resolution rate, RAMP progress.
- 🗺️ **District heat map** — click any district → cluster health, disbursement, grievance load.
- ⚠️ **Anomaly stream** — "Surat diamond MSMEs' loan uptake dropped 22% MoM — root cause: …"
- 🎛 **What-if policy simulator** — "If we add ₹100 Cr to Textile Policy interest subvention, expected impact on Surat + Ahmedabad …"
- 💬 **Conversational BI** — "Show me Category-I taluka MSMEs with SGST reimbursement pending > 90 days."

### 2.5 Embeddable AI Widget

- Same conversational AI, packaged as a **standalone JavaScript widget** that can be dropped into ANY government website (`<script src="…gujarat-udyog-mitra-widget.js" defer></script>`).
- Shadow DOM isolated (no CSS leakage).
- CORS-open API — Industries Commissionerate can embed on `ic.gujarat.gov.in` without a rebuild.

### 2.6 Language support

- **ગુજરાતી** (Gujarati) — full UI + voice (native `gu-IN`).
- **हिन्दी** — Hindi + Devanagari.
- **English** — Indian conventions (₹ / lakh / crore).
- Real-time language toggle from the header.

### 2.7 Non-functional / RFP alignment

- **On-premise deployable** to Gujarat State Data Centre (per state RFP norms).
- **Azure Static Web Apps** (managed API via Azure Functions v4) — fits state IT policies.
- **LLM = Azure OpenAI GPT-4o-mini** — sovereign inference, in-region (East US 2 / Central India), no external Anthropic dependency.
- **CORS + SSO** ready — integrates with SSO Gujarat.
- **Audit trail** — all AI conversations logged for compliance.
- **Response latency**: ~6-13s for full answers with citations; <2s to first token (streaming coming).

---

## 3. Gujarat MSME B2B Portal — features

### 3.1 Objective

The market-facing counterpart of the AI app — connects Gujarat's ~10 lakh MSMEs to domestic + export buyers, powered by the same AI spine.

### 3.2 Core modules

**A. MSME Product Catalog & Directory**
- Each MSME lists products with photos, HS codes, MOQ, price range, GI-tag proof.
- Filter by: district, sector, GI cluster, export capability, ZED certification, women-owned, SC/ST.
- Landing pages for hero clusters: **Surat diamond** · **Morbi ceramics** · **Kutch handicraft** · **Jamnagar brass** · **Patan Patola silk** · **Rajkot machine tools** · **Anand dairy**.

**B. AI Buyer Assistant**
- Buyer types (or speaks): *"Find me tile makers in Morbi with export capacity and ZED Gold certification"*.
- Same Azure OpenAI GPT-4o-mini — returns matched MSME cards with contact CTA + RFQ button.
- Handles complex constraints: capacity, lead time, MOQ, past export data.

**C. RFQ (Request For Quote) Workflow**
- Buyer posts a requirement (product, qty, delivery date, city).
- AI matches to eligible MSMEs; notification sent (SMS / email / WhatsApp).
- MSMEs submit quotes; buyer compares in a side-by-side table.
- Buyer picks winner → both parties get PO-ready summary.

**D. Buyer & seller onboarding**
- Buyer: business PAN + GST verification.
- MSME: auto-fill from Udyam Registration.

**E. Trust signals**
- ZED certification badge.
- Years of export experience.
- Verified GI-tag proof for GI cluster MSMEs.
- Payment reliability score (from MSEFC data).

### 3.3 Where AI shines on B2B side

- **Semantic search** — buyers can ask fuzzy queries ("someone who can make eco-friendly packaging in ≤ 15 days delivery to Mumbai").
- **Auto-generated product descriptions** — MSME uploads photo + basic info; AI drafts a full listing.
- **RFQ triage for MSME owner** — AI summarises 20 incoming RFQs into "3 hot leads to respond first".

---

## 4. Deployment topology

| Deliverable | URL | Hosting | LLM |
|-------------|-----|---------|-----|
| **Bihar Udyog Mitra AI (live, unchanged)** | `bihar-udyog-mitra.vercel.app` | Vercel | Anthropic Claude Haiku 4.5 |
| **Gujarat Udyog Mitra AI (new)** | `gujarat-udyog-mitra.azurestaticapps.net` | Azure Static Web Apps + Azure Functions | Azure OpenAI **GPT-4o-mini** |
| **Gujarat MSME B2B Portal (new)** | `gujarat-msme-b2b.azurestaticapps.net` | Azure Static Web Apps + Azure Functions | Azure OpenAI **GPT-4o-mini** |

- All three sit under a **common design system** (govt palette + typography).
- Shared **Anthropic key** (Bihar) + shared **Azure OpenAI key** (Gujarat + B2B) — no per-app cost duplication.
- GitHub Actions auto-deploy on every push to `main`.

---

## 5. Suggested PPT slide flow

1. **Cover** — "Gujarat's MSME OS — powered by AI. One platform, three doors."
2. **The problem** — Fragmented schemes, low citizen awareness, buyer-seller mismatch, slow decision-making at Secretariat.
3. **Our answer — 3 apps, one spine.**
4. **App 1: Gujarat Udyog Mitra AI (Citizen)** — screenshots of voice interaction, scheme match, DPR builder.
5. **App 2: Officer + Secretary cockpits** — screenshots of AI anomaly stream, what-if simulator.
6. **App 3: MSME B2B Portal** — screenshots of buyer search, cluster landing pages, RFQ flow.
7. **The Bihar precedent** — live at bihar-udyog-mitra.vercel.app, prove the model works.
8. **Tech stack (RFP-friendly)** — Azure Static Web Apps · Azure OpenAI GPT-4o-mini · Azure Functions v4 · React 18 · on-premise-deployable to Gujarat SDC.
9. **Data sovereignty & security** — All data in-region, ISO/GDPR ready, audit-trailed.
10. **Roadmap** — Streaming responses, WhatsApp bot, Android native app (Capacitor), ONDC integration, real Udyam-live ingestion.
11. **Ask** — Pilot in 3 districts / 8 weeks, then state-wide rollout.

---

## 6. Quick demo script (for CEO / client walkthrough)

1. Open `gujarat-udyog-mitra.azurestaticapps.net/widget-demo.html` on phone.
2. Tap 🧑‍💼 → tap 🎤 → say in Gujarati / Hindi:
   *"મારો diamond નો business Surat માં છે, ₹15 lakh loan જોઈએ છે"*
3. AI transcribes, routes to **Aatmanirbhar Gujarat Sahay Yojana + PMEGP + PM MUDRA + CGTMSE**, cites `dcmsme.gov.in/Gujarat.aspx` and MSME Schemes Booklet 2025-26, follows up with clarifying question.
4. Switch to **B2B portal** → search "Morbi tile exporter, ZED Gold".
5. Show 6 matched MSMEs → tap RFQ → post requirement → simulate MSME response.
6. Switch to **Secretary cockpit** → show anomaly stream + what-if simulator on Surat diamond exports.

Total demo: **< 5 minutes**. CEO / client sees the full "citizen ↔ officer ↔ policymaker ↔ market" loop in one platform.
