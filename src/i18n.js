// Lightweight i18n — just the strings the UI shell needs.
// Chat replies are translated by the AI itself via system prompt language instruction.

const STR = {
  English: {
    home: 'Home',
    schemes: 'Schemes',
    chat: 'AI Chat',
    grievance: 'Grievance',
    profile: 'Profile',
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    udyogMitra: 'Udyog Mitra AI',
    askAnything: 'Ask anything…',
    listening: 'Listening…',
    matchSchemes: 'Match my schemes',
    fileGrievance: 'File grievance',
    buildDPR: 'Build my DPR',
    marketIntel: 'Market intelligence',
    nearbyHelp: 'Nearby help',
    typing: 'Thinking…',
  },
  Hindi: {
    home: 'होम',
    schemes: 'योजनाएं',
    chat: 'AI चैट',
    grievance: 'शिकायत',
    profile: 'प्रोफ़ाइल',
    welcome: 'स्वागत है',
    dashboard: 'डैशबोर्ड',
    udyogMitra: 'उद्योग मित्र AI',
    askAnything: 'कुछ भी पूछिए…',
    listening: 'सुन रहा हूँ…',
    matchSchemes: 'मेरी योजना खोजें',
    fileGrievance: 'शिकायत दर्ज करें',
    buildDPR: 'DPR बनाएं',
    marketIntel: 'बाज़ार इंटेलिजेंस',
    nearbyHelp: 'पास की मदद',
    typing: 'सोच रहा हूँ…',
  },
  Gujarati: {
    home: 'ઘર',
    schemes: 'યોજનાઓ',
    chat: 'AI ચેટ',
    grievance: 'ફરિયાદ',
    profile: 'પ્રોફાઇલ',
    welcome: 'સ્વાગત છે',
    dashboard: 'ડેશબોર્ડ',
    udyogMitra: 'ઉદ્યોગ મિત્ર AI',
    askAnything: 'કંઈ પણ પૂછો…',
    listening: 'સાંભળી રહ્યો છું…',
    matchSchemes: 'મારી યોજના શોધો',
    fileGrievance: 'ફરિયાદ નોંધાવો',
    buildDPR: 'DPR બનાવો',
    marketIntel: 'બજાર માહિતી',
    nearbyHelp: 'નજીકની મદદ',
    typing: 'વિચારી રહ્યો છું…',
  },
}

export function useT(lang) {
  return STR[lang] || STR.English
}

export const LANGUAGES = [
  { code: 'Gujarati', flag: '🪷', label: 'ગુજ' },
  { code: 'Hindi',    flag: '🇮🇳', label: 'हिं' },
  { code: 'English',  flag: '🇬🇧', label: 'EN' },
]
