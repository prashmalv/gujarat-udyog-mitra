/*
 * /api/live-data — Gujarat MSME ecosystem snapshot.
 * Azure Functions v3 (context, req) handler.
 *
 * Returns cached synthetic (but Gujarat-realistic) stats every 5 minutes.
 * Consumed by the home dashboard, Officer console, and Secretary cockpit.
 */

let cache = null
let cacheTime = 0
const TTL = 5 * 60 * 1000

function build() {
  const now = new Date()
  const r = (min, max) => Math.floor(min + Math.random() * (max - min))

  return {
    asOf: now.toISOString(),
    state: {
      udyamRegistrations: 10_43_218 + r(0, 400),
      activeSchemes: 54,
      msefcOpenCases: 2_143,
      msefcResolvedThisQtr: 892,
      avgResolutionDays: 32,
      rampDisbursedCr: 2_940,
      rampTargetCr: 8_412,
      todayNewRegistrations: r(420, 620),
      monthDisbursementCr: r(410, 520),
      femaleEntrepreneursPct: 31.2,
    },
    districts: [
      { name: 'Ahmedabad',    msmes: 82_140, disbursementCr: 512.8, stress: 'low' },
      { name: 'Surat',        msmes: 74_620, disbursementCr: 468.2, stress: 'medium', stressReason: 'Diamond exports softness — US buyer slowdown' },
      { name: 'Rajkot',       msmes: 39_840, disbursementCr: 231.4, stress: 'low' },
      { name: 'Vadodara',     msmes: 32_150, disbursementCr: 198.6, stress: 'low' },
      { name: 'Morbi',        msmes: 12_480, disbursementCr: 144.2, stress: 'medium', stressReason: 'Natural gas price hike — ceramic kilns under margin pressure' },
      { name: 'Jamnagar',     msmes: 21_930, disbursementCr: 168.4, stress: 'low' },
      { name: 'Bhavnagar',    msmes: 14_820, disbursementCr:  84.1, stress: 'medium', stressReason: 'Alang ship-breaking regulatory review' },
      { name: 'Kutch',        msmes: 18_610, disbursementCr: 102.6, stress: 'high',   stressReason: 'Handicraft cluster market access post-tourism season' },
      { name: 'Gandhinagar',  msmes:  9_240, disbursementCr:  62.7, stress: 'low' },
      { name: 'Junagadh',     msmes: 11_080, disbursementCr:  74.2, stress: 'low' },
      { name: 'Anand',        msmes: 15_720, disbursementCr:  98.4, stress: 'low' },
      { name: 'Patan',        msmes:  4_910, disbursementCr:  22.6, stress: 'high',   stressReason: 'Patola weavers ageing, no next-gen entrants' },
    ],
    schemes: [
      { code: 'AGSY',    name: 'Aatmanirbhar Gujarat Sahay Yojana', applicationsThisMonth: r(3200, 4200), disbursedThisMonth: r(68,  92), status: 'OPEN' },
      { code: 'GIP2020', name: 'Gujarat Industrial Policy 2020',    applicationsThisMonth: r(1400, 1800), disbursedThisMonth: r(210, 280), status: 'OPEN' },
      { code: 'GTP2019', name: 'Gujarat Textile Policy 2019',       applicationsThisMonth: r( 380,  520), disbursedThisMonth: r( 42,  58), status: 'OPEN' },
      { code: 'PMEGP',   name: 'PMEGP',                              applicationsThisMonth: r(1200, 1600), disbursedThisMonth: r( 28,  42), status: 'OPEN' },
      { code: 'MUDRA',   name: 'PM MUDRA',                           applicationsThisMonth: r(6800, 8200), disbursedThisMonth: r(110, 145), status: 'OPEN' },
      { code: 'STANDUP', name: 'Stand-Up India',                     applicationsThisMonth: r( 320,  460), disbursedThisMonth: r( 12,  20), status: 'OPEN' },
      { code: 'PMFME',   name: 'PM FME (Food Processing)',           applicationsThisMonth: r( 260,  360), disbursedThisMonth: r(  8,  14), status: 'OPEN' },
      { code: 'VISHWA',  name: 'PM Vishwakarma',                     applicationsThisMonth: r( 380,  520), disbursedThisMonth: r(  6,  11), status: 'OPEN' },
      { code: 'CLCSS',   name: 'CLCSS (Tech Upgrade)',               applicationsThisMonth: r( 120,  180), disbursedThisMonth: r(  2,   5), status: 'OPEN' },
      { code: 'ZED',     name: 'ZED Certification',                  applicationsThisMonth: r(  80,  140), disbursedThisMonth: 0,          status: 'OPEN' },
    ],
    anomalies: [
      { id: 1, severity: 'high',   text: 'Surat diamond: US buyer orders down 22% MoM — MSME exporter working capital gap forming', district: 'Surat' },
      { id: 2, severity: 'high',   text: 'Morbi ceramic: natural gas cost up 18% — 60+ small kilns operating at negative EBITDA', district: 'Morbi' },
      { id: 3, severity: 'medium', text: 'Aatmanirbhar Gujarat Sahay Yojana disbursement lag in Kutch (avg 47 days vs state 32) — cooperative bank capacity issue', district: 'Kutch' },
      { id: 4, severity: 'medium', text: 'Patan Patola: only 4 registered weavers under 40; GI cluster at succession risk', district: 'Patan' },
      { id: 5, severity: 'low',    text: 'Female entrepreneur share crossed 31% statewide — Gujarat leads all major industrial states', district: 'STATE' },
    ],
  }
}

module.exports = async function (context, req) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (req.method === 'OPTIONS') {
    context.res = { status: 200, headers, body: '' }
    return
  }
  const now = Date.now()
  if (!cache || now - cacheTime > TTL) {
    cache = build()
    cacheTime = now
  }
  context.res = { status: 200, headers, body: cache }
}
