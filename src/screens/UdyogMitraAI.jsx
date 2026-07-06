import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'
import LanguageSelector from '../components/LanguageSelector'
import NearbyMSME from '../components/NearbyMSME'
import RenderText from '../components/RenderText'
import { useT } from '../i18n'
import { GUJARAT_DISTRICTS } from '../data/districts'

const SECTORS = [
  { code: 'MFG',     label: 'Manufacturing',   ico: '🏭' },
  { code: 'TEXTILE', label: 'Textile / Silk',  ico: '🧵' },
  { code: 'FOOD',    label: 'Food Processing', ico: '🥫' },
  { code: 'ARTISAN', label: 'Artisan / Craft', ico: '🧑‍🎨' },
  { code: 'SERVICE', label: 'Services',        ico: '💼' },
  { code: 'TRADE',   label: 'Trading',         ico: '🛍' },
  { code: 'TECH',    label: 'Tech / Startup',  ico: '💻' },
  { code: 'LEATHER', label: 'Leather',         ico: '👞' },
]
const STAGES = [
  { code: 'NEW',      label: 'New / idea' },
  { code: 'NEW',      label: '0–6 months' },
  { code: 'EXISTING', label: '6m–3 yrs' },
  { code: 'EXISTING', label: '3+ years' },
]
const CATEGORIES = [
  { code: 'GENERAL_YOUTH', label: 'General' },
  { code: 'SC',            label: 'SC' },
  { code: 'ST',            label: 'ST' },
  { code: 'EBC',           label: 'EBC' },
  { code: 'BC',            label: 'BC' },
  { code: 'MAHILA',        label: 'Mahila' },
  { code: 'MINORITY',      label: 'Minority' },
]

const VOICE_LANG_MAP = {
  Gujarati: 'gu-IN', Hindi: 'hi-IN', English: 'en-IN',
}

async function callAI({ messages, userProfile, language, persona }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, userProfile, language, persona }),
  })
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'AI error')
  return data.reply
}

function localFallback(msg, profile, language) {
  const m = msg.toLowerCase()
  const dist = profile?.district || 'aapke jile'
  const sector = profile?.sector || 'aapke sector'
  const isHi = language !== 'English'
  if (/loan|udhar|paisa|fund|credit|कर्ज|लोन|पैसा/.test(m)) {
    return isHi
      ? `💰 **Gujarat MSME loan ke 3 raste:**\n\n1. **Aatmanirbhar Gujarat Sahay Yojana** — ₹10L total: ₹5L subsidy + ₹5L interest-free. Gujarat ka flagship state scheme. Portal: aatmanirbharguj.gujarat.gov.in\n2. **PM MUDRA** — ₹50K se ₹20L, no collateral. Kisi bhi bank me apply karein.\n3. **PMEGP** — ₹25L tak (mfg), 15-35% subsidy. Portal: kviconline.gov.in/pmegpeportal\n\nSource: dcmsme.gov.in/Gujarat.aspx`
      : `💰 **Three Gujarat MSME loan routes:**\n\n1. **Aatmanirbhar Gujarat Sahay Yojana** — ₹10L total (₹5L subsidy + ₹5L interest-free). Gujarat's flagship. Portal: aatmanirbharguj.gujarat.gov.in\n2. **PM MUDRA** — ₹50K to ₹20L, no collateral.\n3. **PMEGP** — up to ₹25L (mfg), 15-35% subsidy. Portal: kviconline.gov.in/pmegpeportal\n\nSource: dcmsme.gov.in/Gujarat.aspx`
  }
  if (/grievance|payment|shikayat|delayed|nahi mila/.test(m)) {
    return `⚖️ **MSEFC route — delayed payment ke liye:**\n\n• Udyam-registered hone chahiye, payment 45+ days overdue\n• File: samadhaan.msme.gov.in\n• Legal basis: MSMED Act 2006, Sec 15-24\n• Invoice discounting: TReDS (rxil.in / m1xchange.com)`
  }
  if (/scheme|yojana|योजना|યોજના/.test(m)) {
    return `🎯 **Top schemes for ${sector} · ${dist}:**\n\n• 🟢 **Aatmanirbhar Gujarat Sahay Yojana** — cooperative bank loan, 2% effective interest (state bears 6%). Portal: aatmanirbharguj.gujarat.gov.in\n• 🟢 **Gujarat Industrial Policy 2020** — up to 25% capex subsidy + 7% interest subvention + SGST reimbursement. Portal: ic.gujarat.gov.in\n• 🔵 **PM MUDRA** — ₹50K-₹20L, no collateral\n• 🔵 **PMEGP** — 15-35% subsidy for new mfg units\n• 🔵 **PMFME** — 35% subsidy for food processing\n• 🔵 **CGTMSE** — collateral-free credit guarantee up to ₹5Cr\n\n📘 Source: MSME Schemes Booklet 2025-26 · dcmsme.gov.in/Gujarat.aspx`
  }
  if (/training|skill|hunar|कौशल|कोर्स|તાલીમ|કૌશલ્ય/.test(m)) {
    return `🎓 **Skill training routes in Gujarat:**\n\n• 🟢 **ESDP (Entrepreneurship & Skill Development Programme)** — 6-week free hands-on training in food processing, welding, carpentry, mechanical, glass, ceramics. MSME-DFO Ahmedabad + Rajkot. Portal: dcmsme.gov.in/Enterprise&skillDevelopment.htm\n• 🟢 **PM Vishwakarma** — 5-7 day basic + 15+ day advanced for 18 artisan trades. **₹500/day stipend + ₹1,000 transport + ₹15,000 toolkit**. Apply via nearest CSC.\n• 🔵 **Gujarat Skill Development Mission (KVK)** — sector-specific short courses.\n• 🔵 **NIESBUD / IIE** — entrepreneurship training.\n• 🔵 **PMKVY 4.0** — Pradhan Mantri Kaushal Vikas Yojana.\n\n📞 **MSME-DFO Ahmedabad**: 079-27540619 · dcdi-ahmbad@dcmsme.gov.in\n\n📘 Source: MSME Schemes Booklet 2025-26 · dcmsme.gov.in/Gujarat.aspx`
  }
  if (/dpr|project report|प्रोजेक्ट|પ્રોજેક્ટ/.test(m)) {
    return `📄 **DPR (Detailed Project Report) banane ke liye:**\n\n1. Use the **DPR Builder** in this app — 5 conversational questions → bankable DPR.\n2. Or take a sample DPR from PMEGP portal: kviconline.gov.in/pmegpeportal (they publish sector-wise model DPRs).\n3. Approach **MSME-DFO Ahmedabad** (079-27540619) for hand-holding — free.\n\n📘 Source: MSME Schemes Booklet 2025-26 · dcmsme.gov.in/Gujarat.aspx`
  }
  return `🙏 **Live AI thodi der ke liye busy hai.** Aap mujhse ye poochh sakte hain — mai offline mode me bhi jawab de sakta hu:\n\n• 💰 **Loan / funding** — "₹10 lakh loan kahaan se milega"\n• 🎯 **Scheme / yojana** — "mere liye best scheme"\n• 🎓 **Skill training** — "skill training gujarat sarkar se"\n• ⚖️ **Grievance / payment** — "buyer se payment nahi mil rahi"\n• 📄 **DPR banwana**\n\nVoice icon 🎤 dabake bolke bhi poochh sakte hain (ગુજરાતી · Hindi · English).`
}

const QUICK_HI = [
  '🎯 Mere liye best scheme',
  '💰 ₹15 lakh loan kahaan se milega (Aatmanirbhar Gujarat)',
  '⚖️ Payment nahi mil rahi',
  '🎓 Skill training',
]
const QUICK_EN = [
  '🎯 Best scheme for me',
  '💰 ₹10 lakh loan options',
  '⚖️ Delayed payment help',
  '🎓 Skill training',
]

function ChipBtn({ active, onClick, children, style }) {
  return (
    <button onClick={onClick} className="chip"
      style={{
        padding: '6px 11px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
        border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
        background: active ? 'var(--grad-hero)' : '#fff',
        color: active ? '#fff' : 'var(--ink-soft)',
        ...style,
      }}>{children}</button>
  )
}

export default function UdyogMitraAI() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, setProfile, persona, appLanguage, showToast } = useApp()
  const t = useT(appLanguage)

  const [tab, setTab] = useState('simple') // simple | advanced
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [form, setForm] = useState({
    name:         profile?.name || user?.name || '',
    businessName: profile?.businessName || '',
    district:     profile?.district || '',
    sector:       profile?.sector || '',
    sectorCode:   profile?.sectorCode || '',
    stage:        profile?.stage || '',
    stageLabel:   profile?.stageLabel || '',
    categoryCode: profile?.categoryCode || '',
    category:     profile?.category || '',
    products:     profile?.products || '',
  })

  const appLanguageRef = useRef(appLanguage)
  const recognitionRef = useRef(null)
  const initialFired = useRef(false)
  const bottomRef = useRef(null)

  useEffect(() => { appLanguageRef.current = appLanguage }, [appLanguage])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const greeting = () => {
    const name = user?.name || profile?.name || ''
    const sector = profile?.sector || ''
    const dist = profile?.district || ''
    if (appLanguage === 'Gujarati') {
      return name
        ? `નમસ્તે ${name}! 🙏 હું તમારો AI ઉદ્યોગ મિત્ર છું.${sector ? ` તમે **${sector}** માં છો${dist ? `, **${dist}** થી` : ''} — હું બધું personalise કરીશ 🎯` : ''}`
        : `🙏 નમસ્તે! હું તમારો AI ઉદ્યોગ મિત્ર છું — Gujarat MSMEs માટે. મને પૂછો — schemes, loan, DPR, ફરિયાદ.`
    }
    if (appLanguage === 'English') {
      return name
        ? `Hello ${name}! 🙏 I'm your AI Udyog Mitra.${sector ? ` I see you're in **${sector}**${dist ? ` at **${dist}**` : ''} — I'll tailor everything 🎯` : ''}`
        : `🙏 Namaskar! I'm your AI Udyog Mitra — Gujarat MSMEs ke liye. Ask me anything — schemes, loans, DPR, grievances.`
    }
    return name
      ? `नमस्कार ${name} जी! 🙏 Main aapka AI Udyog Mitra hu.${sector ? ` Aap **${sector}** me hain${dist ? `, **${dist}** se` : ''} — personalise karunga 🎯` : ''}`
      : `🙏 नमस्कार! Main aapka AI Udyog Mitra hu — Gujarat MSMEs ke liye. Mujhse poochho — scheme, loan, DPR, grievance.`
  }

  useEffect(() => {
    const initialMsg = location.state?.initialMsg
    if (!initialFired.current) {
      initialFired.current = true
      const hist = [{ from: 'bot', text: greeting() }]
      setMsgs(hist)
      if (initialMsg) setTimeout(() => doSend(initialMsg, hist), 200)
    }
  }, [])

  const doSend = async (text, history) => {
    const newMsgs = [...history, { from: 'user', text }]
    setMsgs(newMsgs)
    setTyping(true)
    // The API now cascades gpt-4o-mini → gpt-5 internally, so a reply is
    // guaranteed under normal conditions. If it still fails, retry once from
    // the client before showing an error.
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const reply = await callAI({ messages: newMsgs, userProfile: profile || {}, language: appLanguageRef.current, persona })
        setTyping(false)
        setMsgs(prev => [...prev, { from: 'bot', text: reply }])
        return
      } catch (err) {
        if (attempt === 1) continue  // silent retry
        setTyping(false)
        setMsgs(prev => [...prev, { from: 'bot', text: '⚡ Ek moment lagega — network hiccup. Aap thoda ruk ke phir se poochh sakte hain, ya अपना question rephrase karke bhej dijiye. 🔄' }])
      }
    }
  }

  const send = (textOverride) => {
    const msg = (textOverride || input).trim()
    if (!msg || typing) return
    setInput('')
    doSend(msg, msgs)
  }

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { showToast('Voice not supported · Chrome try kareiye'); return }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const rec = new SR()
    rec.lang = VOICE_LANG_MAP[appLanguage] || 'en-IN'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => {
      let interim = '', finalT = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalT += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      const txt = (finalT + interim).trim()
      if (txt) setInput(txt)
      if (finalT) {
        setTimeout(() => {
          if (txt) doSend(txt, msgs)
          setInput('')
        }, 400)
      }
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
    setIsListening(true)
  }

  const saveAdvanced = () => {
    setProfile({ ...form, domicile: 'GUJARAT' })
    showToast('Profile saved · ab AI personalised replies dega')
    setTab('simple')
    setMsgs([{ from: 'bot', text: greeting() }])
  }

  const quickChips = appLanguage === 'English' ? QUICK_EN : QUICK_HI

  return (
    <div className="app-shell">
      <StatusBar light />

      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '10px 14px', color: '#fff', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <button onClick={() => navigate('/home')} style={{ fontSize: 18, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, position: 'relative', flexShrink: 0 }}>
          🧑‍💼
          <span style={{ position: 'absolute', bottom: -1, right: -1, width: 11, height: 11, background: '#10B981', border: '2px solid var(--primary)', borderRadius: '50%' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 900 }}>Udyog Mitra AI</div>
          <div style={{ fontSize: 9.5, opacity: 0.9 }}>
            {typing ? '⚡ Soch raha hu…' : profile?.name ? `For ${profile.name} · ${appLanguage}` : `● Online · ${appLanguage}`}
          </div>
        </div>
        <LanguageSelector light />
        <button
          onClick={() => { setMsgs([{ from: 'bot', text: greeting() }]); setInput('') }}
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '5px 8px', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
        >↺</button>
      </div>

      {/* Simple/Advanced tabs */}
      <div style={{ display: 'flex', background: 'var(--soft)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={() => setTab('simple')}
          style={{
            flex: 1, padding: '8px 10px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer',
            background: tab === 'simple' ? '#fff' : 'transparent',
            color: tab === 'simple' ? 'var(--primary)' : 'var(--ink-mute)',
            border: 'none', borderBottom: tab === 'simple' ? '2px solid var(--primary)' : '2px solid transparent',
          }}>🎤 Simple — Bolke poochho</button>
        <button onClick={() => setTab('advanced')}
          style={{
            flex: 1, padding: '8px 10px', fontSize: 11.5, fontWeight: 800, cursor: 'pointer',
            background: tab === 'advanced' ? '#fff' : 'transparent',
            color: tab === 'advanced' ? 'var(--primary)' : 'var(--ink-mute)',
            border: 'none', borderBottom: tab === 'advanced' ? '2px solid var(--primary)' : '2px solid transparent',
          }}>⚙️ Advanced — Set business profile</button>
      </div>

      {/* Profile bar (only when relevant fields filled) */}
      {tab === 'simple' && profile && (profile.sector || profile.district) && (
        <div style={{ background: 'var(--primary-ghost)', borderBottom: '1px solid var(--primary-light)', padding: '6px 12px', display: 'flex', gap: 6, alignItems: 'center', overflowX: 'auto', flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-dark)', flexShrink: 0 }}>🎯</span>
          {profile.sector && <span className="chip chip-primary" style={{ fontSize: 10, flexShrink: 0 }}>{profile.sector}</span>}
          {profile.district && <span className="chip chip-neutral" style={{ fontSize: 10, flexShrink: 0 }}>📍 {profile.district}</span>}
          {profile.stageLabel && <span className="chip chip-neutral" style={{ fontSize: 10, flexShrink: 0 }}>⏳ {profile.stageLabel}</span>}
          <button onClick={() => setTab('advanced')} style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>Edit →</button>
        </div>
      )}

      {/* SIMPLE tab — voice-first chat */}
      {tab === 'simple' && (
        <>
          {/* AI tool shortcuts */}
          <div style={{ display: 'flex', gap: 6, padding: '8px 12px 0', overflowX: 'auto', flexShrink: 0, background: 'var(--bg)' }}>
            {[
              { ico: '🎯', label: t.matchSchemes, to: '/schemes' },
              { ico: '📄', label: t.buildDPR,     to: '/dpr' },
              { ico: '⚖️', label: t.fileGrievance, to: '/grievance/new' },
              { ico: '📈', label: t.marketIntel,  to: '/market' },
            ].map(tool => (
              <button key={tool.label}
                onClick={() => navigate(tool.to)}
                className="chip chip-neutral"
                style={{ fontSize: 10.5, padding: '6px 10px', flexShrink: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {tool.ico} {tool.label}
              </button>
            ))}
          </div>

          <div className="screen-scroll" style={{ background: 'linear-gradient(180deg,var(--soft) 0%,var(--bg) 100%)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-mute)', fontWeight: 700 }}>
              Today · Responding in {appLanguage} · Source: dcmsme.gov.in/Gujarat.aspx
            </div>

            {msgs.map((m, i) =>
              m.from === 'bot' ? (
                <div key={i} className="chat-msg-bot">
                  <div className="chat-avatar">🧑‍💼</div>
                  <div className="chat-bubble-bot"><RenderText text={m.text} /></div>
                </div>
              ) : (
                <div key={i} className="chat-msg-user"><div className="chat-bubble-user">{m.text}</div></div>
              )
            )}
            {typing && (
              <div className="chat-msg-bot">
                <div className="chat-avatar">🧑‍💼</div>
                <div className="chat-bubble-bot" style={{ padding: '12px 16px' }}>
                  <div className="ai-thinking"><span /><span /><span /></div>
                </div>
              </div>
            )}
            {msgs.length === 1 && !typing && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 38, marginTop: 4 }}>
                {quickChips.map(q => (
                  <button key={q} className="chip chip-neutral" style={{ cursor: 'pointer', padding: '6px 10px', fontSize: 11 }} onClick={() => send(q)}>{q}</button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <NearbyMSME bottomOffset={72} />

          {/* Big voice button — primary action */}
          <div style={{ padding: '8px 12px 0', background: '#fff', flexShrink: 0 }}>
            <button
              onClick={toggleVoice}
              style={{
                width: '100%', padding: '12px 14px', border: 'none', borderRadius: 14, cursor: 'pointer',
                background: isListening ? 'linear-gradient(135deg,#c41e3a,#ef4444)' : 'var(--grad-hero)',
                color: '#fff', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center',
                animation: isListening ? 'pulseRing 1.2s ease-out infinite' : 'none',
                fontWeight: 800, fontSize: 13,
              }}
            >
              {isListening ? (
                <>
                  <div className="voice-waves"><span/><span/><span/><span/><span/></div>
                  <span>{t.listening} — bolna band kareiye, automatic send hoga</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 20 }}>🎤</span>
                  <span>
                    {appLanguage === 'Gujarati' ? 'Tap to Speak — ગુજરાતી · Hindi · English સમજું છું'
                    : appLanguage === 'Hindi'   ? 'Tap to Speak — Hindi · English · ગુજરાતી sab samajhta hu'
                                                : 'Tap to Speak — Gujarati · Hindi · English (I understand all three)'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Text input fallback */}
          <div className="chat-input-bar" style={{ paddingTop: 8 }}>
            <input
              className="chat-input"
              placeholder={`…ya yahaan ${t.askAnything}`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              style={{ width: 38, height: 38, borderRadius: '50%', background: input.trim() ? 'var(--grad-hero)' : 'var(--soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: input.trim() ? '#fff' : 'var(--ink-mute)', flexShrink: 0, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed' }}
            >➤</button>
          </div>
        </>
      )}

      {/* ADVANCED tab — collapsible profile form */}
      {tab === 'advanced' && (
        <div className="screen-scroll">
          <div className="content">
            <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>⚙️</span>
              <div style={{ fontSize: 11, color: 'var(--accent-dark)', lineHeight: 1.5, fontWeight: 700 }}>
                Apna business profile ek baar set kar dijiye — har scheme, loan, training suggestion <b>aapke business ke liye sahi</b> hoga.
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>👤 Naam</div>
              <div className="input"><input placeholder="e.g. Rajesh Kumar" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🏪 Business ka naam (optional)</div>
              <div className="input"><input placeholder="e.g. Maa Tara Silk Weavers" value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} /></div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>📍 District</div>
              <div className="input">
                <span className="ic">🗺</span>
                <select value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', outline: 'none' }}>
                  <option value="">— select Gujarat district —</option>
                  {GUJARAT_DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.emoji} {d.name} · {d.signature}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🏭 Sector</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SECTORS.map(s => (
                  <ChipBtn key={s.code + s.label} active={form.sectorCode === s.code} onClick={() => setForm(p => ({ ...p, sectorCode: s.code, sector: s.label }))}>
                    {s.ico} {s.label}
                  </ChipBtn>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>⏳ Business stage</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STAGES.map(s => (
                  <ChipBtn key={s.label} active={form.stageLabel === s.label} onClick={() => setForm(p => ({ ...p, stage: s.code, stageLabel: s.label }))}>
                    {s.label}
                  </ChipBtn>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>🪪 Category</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.map(c => (
                  <ChipBtn key={c.code} active={form.categoryCode === c.code} onClick={() => setForm(p => ({ ...p, categoryCode: c.code, category: c.label }))}>
                    {c.label}
                  </ChipBtn>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>📦 Products / services</div>
              <div className="input"><input placeholder="e.g. Surat diamond sarees" value={form.products} onChange={e => setForm(p => ({ ...p, products: e.target.value }))} /></div>
            </div>

            <button className="btn-pri" onClick={saveAdvanced}>💾 Save & switch to Simple chat</button>
            <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setTab('simple')}>← Cancel</button>
            <div style={{ height: 12 }} />
          </div>
        </div>
      )}
    </div>
  )
}
