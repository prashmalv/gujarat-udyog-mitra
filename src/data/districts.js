// Gujarat has 33 districts. Signature MSME cluster / GI tag per district drives
// the AI's ability to give locality-aware advice ("Aap Morbi se hain — CERAMIC TILE
// cluster ka scope kya hai?").
export const GUJARAT_DISTRICTS = [
  { name: 'Ahmedabad',        emoji: '🏙️', signature: 'Textile (denim), garments, pharma, chemicals, food processing' },
  { name: 'Amreli',           emoji: '🥜', signature: 'Cotton ginning, groundnut, agri-processing' },
  { name: 'Anand',            emoji: '🥛', signature: 'Dairy (Amul HQ), tobacco, agri' },
  { name: 'Aravalli',         emoji: '⛰️', signature: 'Marble, mineral, agri' },
  { name: 'Banaskantha',      emoji: '🐄', signature: 'Dairy (Banas Dairy), potato, castor oil' },
  { name: 'Bharuch',          emoji: '⚗️', signature: 'Chemicals, textile, Ankleshwar industrial estate' },
  { name: 'Bhavnagar',        emoji: '⚓', signature: 'Ship-breaking (Alang — world\'s largest), diamonds, plastic' },
  { name: 'Botad',            emoji: '🌾', signature: 'Cotton, edible oil' },
  { name: 'Chhota Udaipur',   emoji: '🎋', signature: 'Bamboo, tribal handicrafts, minerals' },
  { name: 'Dahod',            emoji: '🪵', signature: 'Timber, agri-processing' },
  { name: 'Dangs',            emoji: '🌳', signature: 'Bamboo, forest produce, Warli tribal art' },
  { name: 'Devbhoomi Dwarka', emoji: '🐟', signature: 'Fisheries, port, tourism handicraft' },
  { name: 'Gandhinagar',      emoji: '💻', signature: 'GIFT City (IT/fintech), electronics, capital city' },
  { name: 'Gir Somnath',      emoji: '🦁', signature: 'Cotton, agri, tourism-linked handicrafts' },
  { name: 'Jamnagar',         emoji: '🔩', signature: 'BRASS PARTS (world capital), oil refinery, chemicals' },
  { name: 'Junagadh',         emoji: '🥭', signature: 'Groundnut, Kesar mango (GI), fisheries' },
  { name: 'Kutch',            emoji: '🧵', signature: 'HANDICRAFTS (Rogan art, bandhani, mirror embroidery — all GI), Kutchi dairy, ceramics, salt' },
  { name: 'Kheda',            emoji: '🌱', signature: 'Tobacco, dairy' },
  { name: 'Mahisagar',        emoji: '🪨', signature: 'Agri, minerals' },
  { name: 'Mehsana',          emoji: '🥛', signature: 'Milk (Dudhsagar Dairy), oil & gas (ONGC), auto components' },
  { name: 'Morbi',            emoji: '🧱', signature: 'CERAMIC TILES (world\'s 2nd largest), sanitary ware, WALL CLOCKS' },
  { name: 'Narmada',          emoji: '💧', signature: 'Forest produce, agri, dam-related engineering' },
  { name: 'Navsari',          emoji: '💎', signature: 'DIAMONDS (Surat sister cluster), zari, agri' },
  { name: 'Panchmahal',       emoji: '🏗️', signature: 'Ceramic, marble, plastic, oil' },
  { name: 'Patan',            emoji: '🧣', signature: 'PATAN PATOLA silk (GI, double ikat), embroidery' },
  { name: 'Porbandar',        emoji: '🐚', signature: 'Fishing, salt, cement, chemicals' },
  { name: 'Rajkot',           emoji: '⚙️', signature: 'MACHINE TOOLS, castings, silverware, jewelry' },
  { name: 'Sabarkantha',      emoji: '🏺', signature: 'Ceramic, oil, agri, marble' },
  { name: 'Surat',            emoji: '💎', signature: 'DIAMOND CUTTING & POLISHING (world capital), SILK & TEXTILE (Tanchoi, Kinkhab, Gaji silk), zari, embroidery' },
  { name: 'Surendranagar',    emoji: '🧂', signature: 'Ceramic, cotton, salt' },
  { name: 'Tapi',             emoji: '🌿', signature: 'Bamboo, forest produce, agri' },
  { name: 'Vadodara',         emoji: '⚗️', signature: 'Chemicals, petrochemicals, pharma, engineering, masterbatch' },
  { name: 'Valsad',           emoji: '🥭', signature: 'Chikoo (Sapota GI), Alphonso mango pulp, agro-processing, chemicals' },
]

// Backward-compat alias so any lingering `BIHAR_DISTRICTS` imports from the
// pre-migration Bihar codebase (Gujarat rebrand) keep working during the Gujarat rebrand.
export { GUJARAT_DISTRICTS as BIHAR_DISTRICTS }
