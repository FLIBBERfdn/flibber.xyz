import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const DAPP_URL = '/slot'

const SOCIALS = [
  { label: 'X',        href: 'https://x.com/flibber_xyz' },
  { label: 'Telegram', href: 'https://t.me/flibber_xyz' },
  { label: 'Discord',  href: 'https://discord.gg/BxHJWFhKE' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/flibber/' },
  { label: 'YouTube',  href: 'https://youtube.com/@flibber_xyz' },
]

const PAIRS = [
  { from: 'BNB', to: 'SOL' },
  { from: 'USD', to: 'ETH' },
  { from: 'TON', to: 'NGN' },
]

const CURRENCIES = ['USD', 'GBP', 'NGN', 'GHS', 'CAD']

const LAUNCHPAD_STEPS = [
  'Create collection',
  'Review',
  'Market admission',
  'Cold market',
  'Traction',
  'Hot market',
]

// ── Phone Frame ───────────────────────────────────────────────────
function PhoneFrame({ children }) {
  return (
    <div style={{ position: 'relative', width: '260px', margin: '0 auto' }}>
      <div style={{
        position: 'relative',
        borderRadius: '42px',
        background: 'linear-gradient(180deg, #1a1b1d, #0a0a0a)',
        padding: '10px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '22px', background: '#050505', borderRadius: '20px', zIndex: 10 }} />
        <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', background: '#0A0A0A', aspectRatio: '9/19.5', border: '1px solid rgba(255,255,255,0.05)' }}>
          {children}
        </div>
      </div>
      <div style={{ position: 'absolute', left: '-40px', right: '-40px', bottom: '-40px', height: '96px', background: 'radial-gradient(ellipse at center, rgba(184,190,200,0.15), transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
    </div>
  )
}

// ── Slot Scene ────────────────────────────────────────────────────
function SlotScene({ fromAsset, fromAmount, toAsset }) {
  const SEQUENCE = ['idle', 'slot', 'matching', 'settling', 'received']
  const LABELS = { idle: 'SLOTTING', slot: 'SLOTTING', matching: 'MATCHING', settling: 'SETTLING', received: 'RECEIVED' }
  const [idx, setIdx] = useState(0)
  const stage = SEQUENCE[idx]

  useEffect(() => {
    const hold = stage === 'received' ? 2200 : stage === 'idle' ? 1800 : 1100
    const t = setTimeout(() => setIdx(i => (i + 1) % SEQUENCE.length), hold)
    return () => clearTimeout(t)
  }, [stage])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', padding: '44px 20px 28px', background: '#0A0A0A' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563' }}>{LABELS[stage]}</span>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6B7280', display: 'inline-block' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center', margin: '16px 0' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563', marginBottom: '4px' }}>You have</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '22px', fontWeight: '500', color: '#ECEEF1' }}>{fromAmount}</span>
            <span style={{ fontSize: '13px', color: '#B8BEC8' }}>{fromAsset}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {stage === 'idle' ? (
            <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
            </div>
          ) : (
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `1px solid ${stage === 'matching' ? '#B8BEC8' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: stage === 'matching' ? 'spin 1.1s linear infinite' : 'none' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B8BEC8', display: 'inline-block' }} />
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563', marginBottom: '4px' }}>{stage === 'received' ? 'Received' : 'You want'}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '22px', fontWeight: '500', color: '#ECEEF1' }}>{stage === 'received' ? fromAmount : '—'}</span>
            <span style={{ fontSize: '13px', color: '#B8BEC8' }}>{toAsset}</span>
          </div>
        </div>
      </div>

      <button style={{ width: '100%', padding: '12px', background: '#ECEEF1', borderRadius: '20px', border: 'none', fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', fontWeight: '500', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', cursor: 'pointer' }}>
        {stage === 'received' ? 'Slotted' : 'Slot'}
      </button>
    </div>
  )
}

// ── Fiat Scene ────────────────────────────────────────────────────
function FiatScene() {
  const [onRamp, setOnRamp] = useState(true)
  const [currIdx, setCurrIdx] = useState(0)
  const currency = CURRENCIES[currIdx]

  useEffect(() => {
    const t = setInterval(() => {
      setCurrIdx(i => {
        const next = (i + 1) % CURRENCIES.length
        if (next === 0) setOnRamp(o => !o)
        return next
      })
    }, 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '44px 20px 28px', background: '#0A0A0A' }}>
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '4px', marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '4px', bottom: '4px', width: 'calc(50% - 4px)', background: '#ECEEF1', borderRadius: '16px', transition: 'transform 0.3s ease', transform: onRamp ? 'translateX(0)' : 'translateX(calc(100% + 0px))', left: '4px' }} />
        <span style={{ flex: 1, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: onRamp ? '#000' : '#4B5563', padding: '8px', position: 'relative', zIndex: 1, transition: 'color 0.3s' }}>On-ramp</span>
        <span style={{ flex: 1, textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: !onRamp ? '#000' : '#4B5563', padding: '8px', position: 'relative', zIndex: 1, transition: 'color 0.3s' }}>Off-ramp</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563', marginBottom: '4px' }}>{onRamp ? 'Deposit' : 'You send'}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '22px', fontWeight: '500', color: '#ECEEF1' }}>$1,000</span>
            <span style={{ fontSize: '13px', color: '#B8BEC8' }}>{onRamp ? currency : 'TON'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '1px', height: '24px', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563', marginBottom: '4px' }}>{onRamp ? 'Receive' : 'Destination'}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '22px', fontWeight: '500', color: '#ECEEF1' }}>$1,000</span>
            <span style={{ fontSize: '13px', color: '#B8BEC8' }}>{onRamp ? 'ETH' : currency}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
        {CURRENCIES.map((c, i) => (
          <span key={c} style={{ width: '4px', height: '4px', borderRadius: '50%', background: i === currIdx ? '#B8BEC8' : 'rgba(255,255,255,0.1)', display: 'inline-block', transition: 'background 0.3s' }} />
        ))}
      </div>
    </div>
  )
}

// ── Launchpad Scene ───────────────────────────────────────────────
function LaunchpadScene() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setActive(i => (i + 1) % LAUNCHPAD_STEPS.length), 1300)
    return () => clearTimeout(t)
  }, [active])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '44px 20px 28px', background: '#0A0A0A' }}>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563', marginBottom: '20px' }}>Admission status</p>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4B5563', marginBottom: '4px' }}>Collection</p>
        <p style={{ fontSize: '14px', color: '#ECEEF1' }}>Untitled Genesis</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: '0' }}>
        {LAUNCHPAD_STEPS.map((step, i) => {
          const done = i < active
          const current = i === active
          return (
            <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: i < LAUNCHPAD_STEPS.length - 1 ? '16px' : '0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: done || current ? '#B8BEC8' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: current ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.3s', flexShrink: 0 }}>
                  {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                {i < LAUNCHPAD_STEPS.length - 1 && <div style={{ width: '1px', height: '16px', background: done ? 'rgba(184,190,200,0.5)' : 'rgba(255,255,255,0.06)', marginTop: '4px' }} />}
              </div>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: current ? '#ECEEF1' : done ? '#B8BEC8' : '#4B5563', paddingTop: '1px', transition: 'color 0.3s' }}>{step}</span>
            </div>
          )
        })}
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '10px', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4B5563', marginTop: '16px' }}>
        {active === LAUNCHPAD_STEPS.length - 1 ? 'Review complete' : LAUNCHPAD_STEPS[active]}
      </div>
    </div>
  )
}

// ── Slotting Mechanism Animation ──────────────────────────────────
function SlottingAnimation() {
  const [pairIdx, setPairIdx] = useState(0)
  const [phase, setPhase] = useState('enter')
  const pair = PAIRS[pairIdx]

  useEffect(() => {
    const d = { enter: 1100, match: 900, exit: 1400 }
    const t = setTimeout(() => {
      if (phase === 'enter') setPhase('match')
      else if (phase === 'match') setPhase('exit')
      else { setPhase('enter'); setPairIdx(p => (p + 1) % PAIRS.length) }
    }, d[phase])
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,190,200,0.1), transparent 70%)', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: phase === 'match' ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s ease' }}>
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: phase === 'match' ? '10px' : '18px', color: '#ECEEF1', letterSpacing: '0.1em', transition: 'font-size 0.3s' }}>
            {phase === 'match' ? '●' : phase === 'enter' ? pair.from : pair.to}
          </span>
        </div>
      </div>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4B5563', marginTop: '12px' }}>
        {phase === 'enter' ? 'Value enters' : phase === 'match' ? 'Matching' : 'Value exits'}
      </p>
    </div>
  )
}

// ── Waitlist Modal ────────────────────────────────────────────────
function WaitlistModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(12px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0F1115', border: '1px solid #1E2128', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '380px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#ECEEF1', marginBottom: '8px' }}>You're on the list</div>
            <div style={{ fontSize: '13px', color: '#4B5563' }}>We'll reach out when testnet opens.</div>
            <button onClick={onClose} style={{ marginTop: '24px', padding: '10px 24px', background: '#ECEEF1', border: 'none', borderRadius: '20px', color: '#000', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#ECEEF1', marginBottom: '6px' }}>Join the Waitlist</div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>Be first to access Flibber testnet.</div>
            </div>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '12px 16px', background: '#080A0D', border: '1px solid #1E2128', borderRadius: '10px', color: '#ECEEF1', fontSize: '14px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'Manrope, sans-serif' }}
            />
            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', background: '#ECEEF1', border: 'none', borderRadius: '20px', color: '#000', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {loading ? 'Submitting…' : 'Join Waitlist'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main Landing Page ─────────────────────────────────────────────
export default function LandingPage() {
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [activeUtil, setActiveUtil] = useState(0)

  const UTILITIES = [
    { key: 'cross-chain', title: 'Cross-chain trading', copy: "Slot in one asset and slot out another. The value you hold determines what you receive — never a traditional bridge, never a wrapped placeholder.", scene: <SlotScene fromAsset="BNB" fromAmount="$1,000" toAsset="SOL" /> },
    { key: 'fiat', title: 'Fiat hybrids', copy: "On-ramp from fiat into digital assets, or off-ramp back out. The same Slotting Mechanism settles both directions, across supported currencies.", scene: <FiatScene /> },
    { key: 'launchpad', title: 'NFT tiered launchpad', copy: "Collections enter review before admission. Traction — not deposits — moves a collection from the cold market into the hot market.", scene: <LaunchpadScene /> },
  ]

  const navLinks = [
    { label: 'Documentation', href: '/docs' },
    { label: 'Community', href: 'https://t.me/flibber_xyz', external: true },
    { label: 'Contact', href: 'mailto:flibberfdn@gmail.com', external: true },
  ]

  return (
    <div style={{ background: '#050505', color: '#ECEEF1', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
      `}</style>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/flibber.png" alt="F" style={{ width: 28, height: 28, borderRadius: '8px', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', fontWeight: '500', letterSpacing: '0.1em', color: '#ECEEF1' }}>FLIBBER</span>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="landing-desktop-nav">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}
              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4B5563', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#ECEEF1'} onMouseLeave={e => e.target.style.color='#4B5563'}>
              {l.label}
            </a>
          ))}
          <button onClick={() => setShowWaitlist(true)} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4B5563', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color='#ECEEF1'} onMouseLeave={e => e.target.style.color='#4B5563'}>
            Waitlist
          </button>
        </nav>

        <Link href={DAPP_URL} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#000', background: '#ECEEF1', padding: '9px 22px', borderRadius: '20px', fontWeight: '500' }}>
          Launch App
        </Link>
      </header>
      <style>{`.landing-desktop-nav { display: flex; } @media (max-width: 768px) { .landing-desktop-nav { display: none; } }`}</style>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '100px 24px 60px', position: 'relative', overflow: 'hidden', maxWidth: '1200px', margin: '0 auto', gap: '60px', flexWrap: 'wrap' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(184,190,200,0.06), transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '520px', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#4B5563', marginBottom: '20px' }}>
            Flibber · Slotting Mechanism
          </p>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: '500', lineHeight: '1.05', letterSpacing: '-0.02em', marginBottom: '24px' }}>
            <span style={{ background: 'linear-gradient(135deg, #ECEEF1 0%, #6B7280 50%, #ECEEF1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Move value.</span>
            <br />
            <span style={{ color: '#ECEEF1' }}>Keep value.</span>
          </h1>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#6B7280', marginBottom: '40px' }}>
            Flibber's Slotting Mechanism powers deterministic value movement across cross-chain assets, fiat and digital markets.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href={DAPP_URL} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#000', background: '#ECEEF1', padding: '14px 28px', borderRadius: '20px', fontWeight: '500' }}>
              Launch App
            </Link>
            <button onClick={() => setShowWaitlist(true)} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6B7280', background: 'none', border: '1px solid rgba(107,114,128,0.3)', padding: '14px 28px', borderRadius: '20px', cursor: 'pointer' }}>
              Join Waitlist
            </button>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <PhoneFrame><SlotScene fromAsset="BNB" fromAmount="$1,000" toAsset="SOL" /></PhoneFrame>
        </div>
      </section>

      {/* ── Utilities ─────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '500', letterSpacing: '-0.02em', color: '#ECEEF1', maxWidth: '380px' }}>
            Three utilities, one mechanism.
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setActiveUtil(a => Math.max(a-1, 0))} disabled={activeUtil === 0}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#B8BEC8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeUtil === 0 ? 0.3 : 1 }}>
              ‹
            </button>
            <button onClick={() => setActiveUtil(a => Math.min(a+1, UTILITIES.length-1))} disabled={activeUtil === UTILITIES.length-1}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#B8BEC8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeUtil === UTILITIES.length-1 ? 0.3 : 1 }}>
              ›
            </button>
          </div>
        </div>

        {/* Desktop: show all 3 */}
        <div style={{ display: 'flex', gap: '32px', overflowX: 'auto', paddingBottom: '16px' }}>
          {UTILITIES.map((u, i) => (
            <div key={u.key} style={{ minWidth: '260px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <PhoneFrame>{u.scene}</PhoneFrame>
              <h3 style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '-0.01em', color: '#ECEEF1', margin: '28px 0 12px' }}>{u.title}</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#4B5563', maxWidth: '260px' }}>{u.copy}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {UTILITIES.map((u, i) => (
            <button key={u.key} onClick={() => setActiveUtil(i)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <span style={{ display: 'block', height: '4px', borderRadius: '4px', background: i === activeUtil ? '#B8BEC8' : 'rgba(255,255,255,0.12)', width: i === activeUtil ? '24px' : '6px', transition: 'all 0.3s' }} />
            </button>
          ))}
        </div>
      </section>

      {/* ── Slotting Mechanism ────────────────────────────────── */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#4B5563', marginBottom: '16px' }}>
          The Slotting Mechanism
        </p>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-0.01em', color: '#ECEEF1' }}>
          Flibber matches what enters the system with the value a user wants out.
        </h2>
        <SlottingAnimation />
      </section>

      {/* ── Testnet CTA ───────────────────────────────────────── */}
      <section id="testnet" style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 40px 120px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#4B5563', marginBottom: '16px' }}>
          Flibber Testnet
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '500', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ECEEF1 0%, #6B7280 50%, #ECEEF1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '40px' }}>
          Live on testnet.
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={DAPP_URL} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#000', background: '#ECEEF1', padding: '14px 32px', borderRadius: '20px', fontWeight: '500' }}>
            Launch App
          </Link>
          <button onClick={() => setShowWaitlist(true)} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6B7280', background: 'none', border: '1px solid rgba(107,114,128,0.3)', padding: '14px 32px', borderRadius: '20px', cursor: 'pointer' }}>
            Join Waitlist
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#ECEEF1', marginBottom: '16px' }}>Flibber</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '14px', color: '#4B5563', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color='#ECEEF1'} onMouseLeave={e => e.target.style.color='#4B5563'}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            {[
              { label: 'Documentation', href: '/docs' },
              { label: 'Contact', href: 'mailto:flibberfdn@gmail.com' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Terms of Service', href: '/terms' },
            ].map(p => (
              <a key={p.label} href={p.href} style={{ fontSize: '14px', color: '#4B5563', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#ECEEF1'} onMouseLeave={e => e.target.style.color='#4B5563'}>
                {p.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 40px' }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(107,114,128,0.6)' }}>
            © {new Date().getFullYear()} Flibber. All rights reserved.
          </p>
        </div>
      </footer>

      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </div>
  )
}