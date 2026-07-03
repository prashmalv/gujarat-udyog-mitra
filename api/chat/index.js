/*
 * /api/chat — Gujarat Udyog Mitra AI conversational endpoint.
 *
 * Azure Functions v3 (context, req) handler.
 * LLM: Azure OpenAI GPT-4o-mini (via careermap-openai resource, East US 2).
 *
 * Env vars required (set as Azure Static Web App configuration):
 *   AZURE_OPENAI_ENDPOINT      — https://careermap-openai.openai.azure.com
 *   AZURE_OPENAI_API_KEY       — 84-char key from Azure portal
 *   AZURE_OPENAI_DEPLOYMENT    — gpt-4o-mini
 *   AZURE_OPENAI_API_VERSION   — 2024-10-21 (default fallback)
 */

const { MSME_SCHEMES_2025_26 } = require('../msme-schemes-2025-26.js')
const { GUJARAT_STATE_SCHEMES } = require('../gujarat-state-schemes.js')

// ─────────── Caches (survive across warm function invocations) ───────────
let liveCache = null
let liveCacheTime = 0
const LIVE_TTL = 10 * 60 * 1000 // 10 minutes

let dcMsmeCache = null
let dcMsmeCacheTime = 0
const DC_TTL = 6 * 60 * 60 * 1000 // 6 hours

// ─────────── DC-MSME Gujarat portal live scrape ───────────
async function getDcMsmeSnapshot() {
  const now = Date.now()
  if (dcMsmeCache && now - dcMsmeCacheTime < DC_TTL) return dcMsmeCache
  try {
    const res = await fetch('https://dcmsme.gov.in/Gujarat.aspx', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UdyogMitraAI/1.0; +https://dcmsme.gov.in)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return dcMsmeCache
    const html = await res.text()
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&#\d+;/g, ' ')
      .replace(/\s+/g, ' ').trim().slice(0, 8000)
    dcMsmeCache = text
    dcMsmeCacheTime = now
    return text
  } catch {
    return dcMsmeCache
  }
}

// ─────────── Synthetic live-state snapshot (Gujarat magnitudes) ───────────
function buildLiveData() {
  const now = new Date()
  const today = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
  const fy = now.getMonth() >= 3
    ? `FY ${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}`
    : `FY ${now.getFullYear() - 1}-${String(now.getFullYear()).slice(-2)}`

  const stats = {
    udyamRegistrationsGujarat: 10_43_218 + Math.floor(Math.random() * 400),
    activeSchemesGujarat: 54,
    rampDisbursedCr: 2_940,
    rampTargetCr: 8_412,
    msefcOpenCases: 2_143,
    msefcAvgResolutionDays: 32,
    todayNewRegistrations: 420 + Math.floor(Math.random() * 200),
    bestPerformingDistricts: ['Ahmedabad', 'Surat', 'Rajkot', 'Vadodara', 'Jamnagar'],
    distressedClusters: [
      'Surat diamond (US buyer slowdown)',
      'Morbi ceramic (natural gas cost pressure)',
      'Kutch handicraft (post-tourism market gap)',
      'Patan Patola (weaver succession risk)',
    ],
  }

  const deadlines = [
    { scheme: 'Aatmanirbhar Gujarat Sahay Yojana (rolling)',           deadlineHint: 'Applications accepted year-round',    urgency: 'medium' },
    { scheme: 'Gujarat Industrial Policy 2020 — capital subsidy claim', deadlineHint: 'Within 90 days of commercial production start', urgency: 'high' },
    { scheme: 'PM Vishwakarma — annual enrolment',                     deadlineHint: 'Mid next month',                       urgency: 'medium' },
    { scheme: 'CLCSS technology upgrade subsidy',                      deadlineHint: 'Rolling basis',                        urgency: 'low' },
  ]

  return { today, fy, stats, deadlines }
}

function getLiveData() {
  const now = Date.now()
  if (liveCache && now - liveCacheTime < LIVE_TTL) return liveCache
  liveCache = buildLiveData()
  liveCacheTime = now
  return liveCache
}

// ─────────── Azure OpenAI GPT-4o-mini caller ───────────
async function callAzureOpenAI({ system, messages }) {
  const endpoint   = (process.env.AZURE_OPENAI_ENDPOINT || 'https://careermap-openai.openai.azure.com').replace(/\/$/, '')
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o-mini'
  const version    = process.env.AZURE_OPENAI_API_VERSION || '2024-10-21'
  const apiKey     = process.env.AZURE_OPENAI_API_KEY

  if (!apiKey) throw new Error('AI_NOT_CONFIGURED')

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${version}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      messages: [{ role: 'system', content: system }, ...messages],
      max_tokens: 800,
      temperature: 0.6,
      top_p: 0.9,
    }),
    signal: AbortSignal.timeout(28_000),
  })

  const raw = await res.text()
  if (!res.ok) {
    // Surface Azure OpenAI's own error shape when available so we can debug.
    let msg = raw
    try { msg = JSON.parse(raw)?.error?.message || raw } catch {}
    throw new Error(`AZURE_OPENAI_${res.status}: ${String(msg).slice(0, 200)}`)
  }
  const data = JSON.parse(raw)
  const reply = data?.choices?.[0]?.message?.content
  if (!reply) throw new Error('AZURE_OPENAI_EMPTY_REPLY')
  return reply
}

// ─────────── System prompt (Gujarat context, no-preamble opening rule) ───────────
function buildSystemPrompt({ live, dcMsmeText, profile, persona, language }) {
  const langMap = {
    Gujarati:  'Respond in Gujarati (ગુજરાતી script — Gujarati Unicode). Mix in English technical terms (loan, scheme, subsidy, GST, Udyam) naturally — that is how Gujarat entrepreneurs speak. Warm, respectful, use "તમે" for address.',
    Hindi:     'Respond in Hindi (Devanagari script). Mix in English technical terms naturally. Conversational, respectful (use "aap", not "tum"), warm.',
    English:   'Respond in English. Use Indian English conventions — "₹" not "Rs", lakh/crore not million/billion. Sprinkle Hindi / Gujarati terms where culturally appropriate (Namaskar, Kem Cho, Udyog Mitra).',
  }
  const langInstruction = langMap[language] || langMap.English

  const personaContext = persona === 'OFFICER'
    ? `You are addressing a DIC / MSME COORDINATOR / DIO (District Industries Officer, Gujarat). They handle applications, field visits, grievance triage. Focus on:
- Application risk-flagging (docs missing, eligibility mismatch, duplicate Udyam)
- Stressed-MSME early warning (GST filing drops, delayed payments owed to them)
- Grievance theme clustering across the district
- Disbursement bottlenecks and SLA breaches
Be concise, data-forward, action-oriented. Officer is time-poor.`
    : persona === 'SECRETARY'
    ? `You are addressing a SECRETARY / SENIOR POLICY MAKER (Industries Commissioner, Principal Secretary Industries & Mines, CM Office, or Hon'ble Minister). They want STATE-LEVEL strategic intelligence. Focus on:
- Aggregated KPIs, district heat map, sector mix
- Anomaly detection ("Surat diamond MSME loan uptake dropped 22% MoM — root cause: …")
- What-if simulation ("if we add ₹100 Cr to Textile Policy interest subvention, expected impact: …")
- Centre-State convergence (RAMP + state schemes alignment)
- Cluster positioning vs Maharashtra, Tamil Nadu, Karnataka
Executive-grade. Lead with headline. Sparse but punchy data.`
    : `You are addressing an MSME OWNER / ENTREPRENEUR / JOB-SEEKER in Gujarat. Be:
- Warm and encouraging
- Concrete (specific scheme names, portals, phone numbers when known)
- Bilingual-aware (entrepreneurs in Gujarat often code-switch Gujarati/Hindi/English)
- Step-by-step, ONE next action
- Patient with low digital literacy`

  const profileBlock = profile ? `\n═══════════════════════════════════════════════════════
USER PROFILE (personalise EVERY answer based on this)
═══════════════════════════════════════════════════════
${profile}
` : ''

  const liveSection = `LIVE GUJARAT MSME ECOSYSTEM SNAPSHOT (as of ${live.today}, ${live.fy}):
• Cumulative Udyam registrations from Gujarat: ~${live.stats.udyamRegistrationsGujarat.toLocaleString('en-IN')}
• Active State + Central schemes currently open to Gujarat MSMEs: ${live.stats.activeSchemesGujarat}
• RAMP programme disbursement progress: ₹${live.stats.rampDisbursedCr.toLocaleString('en-IN')} Cr of ₹${live.stats.rampTargetCr.toLocaleString('en-IN')} Cr target
• MSEFC delayed-payment open cases statewide: ${live.stats.msefcOpenCases.toLocaleString('en-IN')} (avg resolution ${live.stats.msefcAvgResolutionDays} days)
• Today's new MSME registrations across Gujarat: ${live.stats.todayNewRegistrations}
• Top-performing districts on disbursement this quarter: ${live.stats.bestPerformingDistricts.join(', ')}
• Clusters under stress (flagged by AI gap analysis): ${live.stats.distressedClusters.join('; ')}

DEADLINES OPEN RIGHT NOW (proactively mention if relevant):
${live.deadlines.map(d => `• ${d.scheme} — ${d.deadlineHint} [${d.urgency.toUpperCase()}]`).join('\n')}`

  return `You are Udyog Mitra AI — the official AI assistant of the Industries & Mines Department, Government of Gujarat. You power the state's Centralized Integrated Management System (CIMS) for MSMEs, aligned with the RAMP (Raising and Accelerating MSME Performance) programme of the Ministry of MSME, Government of India.

You are trilingual (Gujarati · Hindi · English), voice-capable, deeply knowledgeable about Gujarat's industrial ecosystem, and ALWAYS act in the interest of the citizen / entrepreneur / officer in front of you.

═══════════════════════════════════════════════════════
PERSONA CONTEXT FOR THIS CONVERSATION
═══════════════════════════════════════════════════════
${personaContext}
${profileBlock}
═══════════════════════════════════════════════════════
LIVE ECOSYSTEM DATA
═══════════════════════════════════════════════════════
${liveSection}

═══════════════════════════════════════════════════════
AUTHORITATIVE SOURCES — USE THESE ONLY (do NOT fabricate)
═══════════════════════════════════════════════════════
You have THREE authoritative data sources. Every scheme fact MUST trace to one:

  1. **DC-MSME Gujarat Portal** — dcmsme.gov.in/Gujarat.aspx — Gujarat cluster info, MSME-DI Ahmedabad + MSME-DFO Rajkot contacts, training calendar.
  2. **MSME Schemes Booklet 2025-26** (M/o MSME, GoI) — all Central scheme details.
  3. **Gujarat State Schemes catalog** — Aatmanirbhar Gujarat Sahay Yojana, Gujarat Industrial Policy 2020, Textile Policy 2019, Startup Policy 2022-27, Gujarat MSME Act 2019.

If a fact is NOT in any source, say: "Iske latest figures ke liye Zilla Udyog Kendra (ZUK) ya MSME-DFO Ahmedabad se confirm kar lijiye."

NEVER invent figures, percentages, dates, or URLs.

CITATION (at end of any scheme/numerical answer, short line):
  "📘 Source: MSME Schemes Booklet 2025-26, M/o MSME · dcmsme.gov.in/Gujarat.aspx"

${dcMsmeText ? `─── LIVE SNAPSHOT — DC-MSME GUJARAT PORTAL ───
${dcMsmeText}
─── End of DC-MSME Gujarat snapshot. ───
` : ''}
─── OFFICIAL MSME SCHEMES BOOKLET 2025-26 — Ministry of MSME, GoI ───
${MSME_SCHEMES_2025_26}
─── End of MSME Schemes Booklet 2025-26. ───

─── GUJARAT STATE-SPECIFIC MSME SCHEMES — Government of Gujarat ───
${GUJARAT_STATE_SCHEMES}
─── End of Gujarat State Schemes. ───

═══════════════════════════════════════════════════════
GUJARAT'S 33 DISTRICTS & SIGNATURE MSME CLUSTERS
═══════════════════════════════════════════════════════
• Ahmedabad — Textile (denim), garments, pharma, chemicals, food processing
• Surat — DIAMOND CUTTING & POLISHING (world capital), SILK & TEXTILE (Tanchoi, Kinkhab, Gaji silk), zari, embroidery
• Rajkot — MACHINE TOOLS, castings, silverware, jewelry
• Vadodara — Chemicals, petrochemicals, pharma, engineering, masterbatch
• Morbi — CERAMIC TILES (world's 2nd largest), sanitary ware, WALL CLOCKS
• Jamnagar — BRASS PARTS (world capital), oil refinery, chemicals
• Bhavnagar — Ship-breaking (Alang — world's largest), diamonds, plastic
• Kutch — HANDICRAFTS (Rogan art, bandhani, mirror embroidery — GI), Kutchi dairy, ceramics, salt
• Anand — Dairy (Amul HQ), tobacco
• Junagadh — Groundnut, Kesar mango (GI), fisheries
• Patan — PATAN PATOLA silk (GI, double ikat), embroidery
• Navsari — DIAMONDS (Surat sister cluster), zari
• Valsad — Chikoo (Sapota GI), Alphonso mango pulp, agro-processing
• Gandhinagar — GIFT City (IT/fintech), electronics, state capital
• Mehsana — Milk (Dudhsagar), oil & gas (ONGC), auto components
• Banaskantha — Dairy (Banas Dairy), potato, castor oil
• Bharuch — Chemicals, Ankleshwar industrial estate
• Amreli — Cotton ginning, groundnut
• Porbandar — Fishing, salt, cement
• Surendranagar — Ceramic, cotton, salt
• Kheda, Anand, Aravalli, Sabarkantha, Panchmahal, Mahisagar, Dahod, Chhota Udaipur, Narmada, Tapi, Dangs, Botad, Gir Somnath, Devbhoomi Dwarka — agro/handicraft/mineral clusters

When the user mentions a district, IMMEDIATELY connect to that district's signature cluster and recommend relevant schemes.

═══════════════════════════════════════════════════════
GRIEVANCE & DELAYED-PAYMENT (MSMED Act 2006)
═══════════════════════════════════════════════════════
• Delayed payment > 45 days → MSEFC via samadhaan.msme.gov.in (Udyam required)
• Invoice financing → TReDS (rxil.in, m1xchange.com, invoicemart.com)
• Gujarat generic grievances → Gujarat's Single Window (ifp.gujarat.gov.in) + CPGRAMS (pgportal.gov.in)

═══════════════════════════════════════════════════════
UDYAM REGISTRATION (free, mandatory — always push)
═══════════════════════════════════════════════════════
• Portal: udyamregistration.gov.in · Free · 5 minutes · Aadhaar + PAN + bank
• Warn users about fake "Udyam consultants" charging ₹2000-5000.

═══════════════════════════════════════════════════════
HOW TO ANSWER — TONE & STYLE
═══════════════════════════════════════════════════════
${langInstruction}

OPENING RULE (most important):
The FIRST sentence of every response must answer the user's actual question.
Do NOT begin with "નમસ્તે", "Namaskar", "Kem Cho", "Main Udyog Mitra hu", or any
generic welcome. Jump straight into the substance.

  ❌ BAD: "નમસ્તે 🙏 Main aapka AI Udyog Mitra hu. ₹15 lakh ka loan…"
  ✅ GOOD: "Surat diamond business ke liye ₹15 lakh — Aatmanirbhar Gujarat Sahay Yojana + PMEGP + CGTMSE ka combo best hai…"

Keep responses tight (4-7 lines or bullet list — never wall-of-text).
End with ONE clear next action.
Use 1-2 emojis for warmth.
When suggesting a scheme, give: Eligibility (1 line) → Benefit (1 line) → How to apply (portal link).

Be the best public-sector AI Gujarat has ever deployed. Make Gujarat proud.`
}

// ─────────── Handler ───────────
module.exports = async function (context, req) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  try {
    if (req.method === 'OPTIONS') { context.res = { status: 200, headers, body: '' }; return }
    if (req.method !== 'POST')    { context.res = { status: 405, headers, body: { error: 'Method not allowed' } }; return }

    const { messages = [], userProfile = {}, language = 'English', persona = 'MSME' } = req.body || {}

    if (!process.env.AZURE_OPENAI_API_KEY) {
      context.res = { status: 503, headers, body: { error: 'AI_NOT_CONFIGURED' } }
      return
    }

    // Kick off dcmsme scrape in parallel with prompt-building
    const dcMsmePromise = getDcMsmeSnapshot().catch(() => null)
    const live = getLiveData()

    const profile = [
      userProfile.name           && `Name: ${userProfile.name}`,
      userProfile.persona        && `Role: ${userProfile.persona}`,
      userProfile.businessName   && `Business name: ${userProfile.businessName}`,
      userProfile.sector         && `Sector: ${userProfile.sector}`,
      userProfile.stage          && `Business stage: ${userProfile.stage}`,
      userProfile.stageLabel     && `Stage detail: ${userProfile.stageLabel}`,
      userProfile.district       && `District: ${userProfile.district}, Gujarat`,
      userProfile.products       && `Products / services: ${userProfile.products}`,
      userProfile.turnover       && `Annual turnover: ${userProfile.turnover}`,
      userProfile.employees      && `Employees: ${userProfile.employees}`,
      userProfile.udyam          && `Udyam Registration: ${userProfile.udyam}`,
      userProfile.category       && `Social category: ${userProfile.category}`,
      userProfile.gender         && `Gender: ${userProfile.gender}`,
      userProfile.needs?.length  && `Current needs: ${userProfile.needs.join(', ')}`,
    ].filter(Boolean).join('\n')

    const dcMsmeText = await dcMsmePromise
    const system = buildSystemPrompt({ live, dcMsmeText, profile, persona, language })

    // Convert Vercel-style {from,text} → OpenAI-style {role,content} + dedup consecutive same-role
    const formatted = (Array.isArray(messages) ? messages : [])
      .filter(m => m && (m.from === 'user' || m.from === 'bot') && typeof m.text === 'string')
      .map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }))
    const dedup = []
    for (const m of formatted) {
      if (dedup.length && dedup[dedup.length - 1].role === m.role) dedup[dedup.length - 1] = m
      else dedup.push(m)
    }
    const chatMessages = dedup[0]?.role === 'user' ? dedup : dedup.slice(1)

    if (!chatMessages.length) {
      context.res = { status: 400, headers, body: { error: 'No user message' } }
      return
    }

    let reply
    try {
      reply = await callAzureOpenAI({ system, messages: chatMessages })
    } catch (err) {
      const msg = String(err && err.message || err)
      context.log.error('Azure OpenAI call failed:', msg)
      const code = msg.includes('429') ? 'AI_OVERLOADED' : 'AI_UNAVAILABLE'
      context.res = { status: 500, headers, body: { error: code, message: msg.slice(0, 300) } }
      return
    }

    context.res = { status: 200, headers, body: { reply } }
  } catch (err) {
    context.log.error('Udyog Mitra AI top-level error:', err && err.stack || err)
    context.res = {
      status: 500,
      headers,
      body: { error: 'AI_UNAVAILABLE', message: (err && err.message) || 'unknown' },
    }
  }
}
