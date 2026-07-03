/*
 * Gujarat-specific MSME schemes — state government + state agencies.
 * Sources: Industries Commissionerate Gujarat (ic.gujarat.gov.in),
 * Industries & Mines Department, Gujarat MSME Act 2019.
 *
 * These are injected into the system prompt as the "state-flagship" schemes
 * that the AI should mention first for any Gujarat-resident enquiry, alongside
 * the Central MSME Schemes Booklet 2025-26.
 */
const GUJARAT_STATE_SCHEMES = `
GUJARAT STATE-SPECIFIC MSME SCHEMES — Government of Gujarat.
When a Gujarat resident asks about state support, ALWAYS mention these
FIRST (as flagship offerings), then supplement with Central schemes.

────────────────────────────────────────────────────────
1. Aatmanirbhar Gujarat Sahay Yojana (Yuva Uddyam)  ⭐ FLAGSHIP
────────────────────────────────────────────────────────
• Cooperative bank loan support for MSMEs and self-employed.
• Loan up to ₹1 lakh (individual) via District Cooperative Banks.
• State bears 6% interest, borrower effectively pays only 2%.
• Guarantee: Collateral-free with state guarantee cover.
• Eligibility: Gujarat domicile, 18+ years, business plan.
• Portal: aatmanirbharguj.gujarat.gov.in
• When to mention: user asks about "loan", "shuru karvi che", "seed funding".

────────────────────────────────────────────────────────
2. Scheme for Assistance to MSMEs (Gujarat Industrial Policy 2020)
────────────────────────────────────────────────────────
Umbrella scheme with 8 sub-components:
• Capital Investment Subsidy: 25% (Category-I taluka) / 20% (Cat-II) / 10% (Cat-III)
  on plant & machinery — max ₹35 lakh (micro), ₹35 lakh (small), ₹35 lakh (medium)
• Interest Subvention: 7% (Category-I) / 6% (Cat-II) / 5% (Cat-III) for 5-8 years
• SGST Reimbursement: up to 100% for 10 years (for eligible units in Cat-I talukas)
• Electricity Duty Exemption: 5 years
• Stamp Duty & Registration Fee reimbursement (up to 100%)
• Quality Certification (ISO, BIS, CE) — 50% reimbursement, max ₹1 lakh
• Technology Acquisition — 50% cost, max ₹25 lakh
• Patent Registration — 50% reimbursement, max ₹5 lakh (domestic), ₹15 lakh (international)
• Portal: ic.gujarat.gov.in
• Category-I talukas (highest subsidy) include: tribal/aspirational areas.
• Notification: G.R. No. IP/102019/... dated 07-Aug-2020

────────────────────────────────────────────────────────
3. Gujarat Textile Policy 2019 (Atmanirbhar Vastra)
────────────────────────────────────────────────────────
• Interest Subsidy: 6% (Category-I taluka) / 4% (Category-II) for 5 years.
• Capital Subsidy: 25% (up to ₹30 crore per unit) for MSMEs.
• Payroll assistance: ₹4,000 (Skilled) / ₹3,000 (Semi-skilled) / ₹2,000 (Unskilled) per worker/month for 5 yrs.
• EPF reimbursement: 100% employer's contribution for 10 years.
• Sector focus: Weaving, dyeing, printing, garment, technical textiles, made-ups.
• Best for: Surat silk, Ahmedabad denim/garments, Jetpur printing.
• Portal: itdcgujarat.com / textile.gujarat.gov.in

────────────────────────────────────────────────────────
4. Gujarat Startup & Innovation Policy (revised 2022-27)
────────────────────────────────────────────────────────
• Seed Support: up to ₹30 lakh (idea → validation → prototype).
• Sustenance Allowance: ₹20,000/month for individual founder + ₹1L one-time
  assistance during pre-revenue phase (12 months, extendable).
• Nodal agency: iCreate (Ahmedabad), iHub (Gandhinagar).
• IPR reimbursement, marketing assistance, mentorship access.
• Portal: startup.gujarat.gov.in

────────────────────────────────────────────────────────
5. Gujarat MSME Act, 2019 — "Ease of Doing Business" landmark
────────────────────────────────────────────────────────
• 3-year exemption from prior approvals, NOCs, permissions for NEW MSMEs
  (from Ordinance/Consent to Establish, Consent to Operate, Trade License,
   Fire NOC, etc.).
• Time-bound issuance of remaining NOCs.
• Single Window System: Gujarat's Single Window System → https://ifp.gujarat.gov.in
• After 3 years, MSME must apply for regularisation.

────────────────────────────────────────────────────────
6. Sagarkhedu Sarvangi Vikas Yojana (Coastal Districts)
────────────────────────────────────────────────────────
• Focused on 15 coastal districts: Kutch, Devbhoomi Dwarka, Jamnagar,
  Porbandar, Junagadh, Gir Somnath, Amreli, Bhavnagar, Anand, Bharuch,
  Surat, Navsari, Valsad, Ahmedabad, Botad.
• Infrastructure + livelihood + coastal MSME cluster development.
• Nodal: Fisheries Dept / Industries Commissionerate.

────────────────────────────────────────────────────────
7. Mukhyamantri Yuva Swavalamban Yojana (MYSY)
────────────────────────────────────────────────────────
• Higher education support (Diploma, Degree, Medical, Nursing, Engineering).
• Not direct MSME finance — mentioned for youth transitioning to entrepreneurship.
• Portal: mysy.guj.nic.in

────────────────────────────────────────────────────────
8. Zilla Udyog Kendra (ZUK) — District Industries Centre equivalent
────────────────────────────────────────────────────────
• Every Gujarat district has a ZUK — first stop for MSME onboarding.
• Handholding: Udyam registration, scheme applications, cluster info.
• Nodal District Industries Officer (DIO) is the field contact.

────────────────────────────────────────────────────────
9. iHub & iCreate — Startup ecosystem anchors
────────────────────────────────────────────────────────
• iCreate (Ahmedabad, Ambli) — Gujarat's flagship deep-tech incubator.
• iHub (Gandhinagar) — sectoral incubators across Ahmedabad, Surat, Rajkot, Vadodara.
• Both offer seed grants, mentorship, co-working, investor demo days.

────────────────────────────────────────────────────────
10. Vibrant Gujarat Global Summit (biennial)
────────────────────────────────────────────────────────
• Investor connect + partnership signing forum. MSMEs can register for
  matchmaking meetings via vibrantgujarat.com.

────────────────────────────────────────────────────────
KEY OFFICES (cite when relevant)
────────────────────────────────────────────────────────
• Industries Commissionerate, Block No. 1, Udyog Bhavan, Gandhinagar
  Ph: 079-23252587 / 23252585 · Web: ic.gujarat.gov.in
• Gujarat Industrial Development Corporation (GIDC) — gidc.gujarat.gov.in
• MSME-DFO AHMEDABAD — Harsiddh Chamber, 4th Floor, Ashram Road, Ahmedabad-380014
  Ph: 079-27540619 / 27544248 / 27543147
  Email: dcdi-ahmbad@dcmsme.gov.in · Web: www.msmediahmedabad.gov.in
• BR.MSME-DFO RAJKOT — 3rd Floor, Annexe Bldg, Amruta (Jasani) Bldg,
  Near Girnar Cinema, MG Road, Rajkot-360001 · Ph: 0281-2471045
  Email: brdcdi-rajk@dcmsme.gov.in
`

module.exports.GUJARAT_STATE_SCHEMES = GUJARAT_STATE_SCHEMES
