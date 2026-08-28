import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const DAPP_URL = '/slot'

const SOCIALS = [
  { label: 'X',         href: 'https://x.com/flibber_xyz' },
  { label: 'Telegram',  href: 'https://t.me/flibber_xyz' },
  { label: 'Discord',   href: 'https://discord.gg/BxHJWFhKE' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/flibber/' },
  { label: 'YouTube',   href: 'https://youtube.com/@flibber_xyz' },
]

const PAGES = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Contact',       href: 'mailto:flibberfdn@gmail.com' },
  { label: 'Privacy Policy',href: '/privacy' },
  { label: 'Terms',         href: '/terms' },
]

const PAIRS = [
  { from: 'BNB', to: 'SOL' },
  { from: 'USD', to: 'ETH' },
  { from: 'TON', to: 'NGN' },
]

const UTILITIES = [
  {
    key: 'cross-chain',
    title: 'Cross-chain trading',
    copy: 'Slot in one asset and slot out another. The value you hold determines what you receive — never a traditional bridge, never a wrapped placeholder.',
    icon: '◈',
  },
  {
    key: 'fiat',
    title: 'Fiat hybrids',
    copy: 'On-ramp from fiat into digital assets, or off-ramp back out. The same Slotting Mechanism settles both directions, across supported currencies.',
    icon: '◉',
  },
  {
    key: 'launchpad',
    title: 'NFT tiered launchpad',
    copy: 'Collections enter review before admission. Traction — not deposits — moves a collection from the cold market into the hot market.',
    icon: '◎',
  },
]

// ── Slotting Mechanism animation ──────────────────────────────────
function SlottingAnimation() {
  const [pairIdx, setPairIdx] = useState(0)
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const durations = { enter: 1100, match: 900, exit: 1400 }
    const t = setTimeout(() => {
      if (phase === 'enter') setPhase('match')
      else if (phase === 'match') setPhase('exit')
      else { setPhase('enter'); setPairIdx(p => (p + 1) % PAIRS.length) }
    }, durations[phase])
    return () => clearTimeout(t)
  }, [phase])

  const pair = PAIRS[pairIdx]
  const label = phase === 'enter' ? pair.from : phase === 'exit' ? pair.to : '●'
  const statusText = phase === 'enter' ? 'Value enters' : phase === 'match' ? 'Matching' : 'Value exits'

  return (
    <div style={{ textAlign: 'center', margin: '48px 0 24px' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,190,200,0.1), transparent 70%)',
          filter: 'blur(20px)',
        }} />
        <div style={{
          position: 'absolute', inset: '20px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: phase === 'match' ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: phase === 'match' ? '10px' : '16px',
            color: '#ECEEF1',
            letterSpacing: '0.1em',
            transition: 'all 0.3s ease',
            opacity: 1,
          }}>{label}</span>
        </div>
      </div>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#4B5563', marginTop: '12px' }}>
        {statusText}
      </p>
    </div>
  )
}

// ── Waitlist modal ────────────────────────────────────────────────
function WaitlistModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return
    setLoading(true)
    // Simple email collection — can connect to your backend
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(12px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0F1115', border: '1px solid #1E2128', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#ECEEF1', marginBottom: '8px' }}>You're on the list</div>
            <div style={{ fontSize: '13px', color: '#4B5563' }}>We'll reach out when testnet opens.</div>
            <button onClick={onClose} style={{ marginTop: '24px', padding: '10px 24px', background: '#ECEEF1', border: 'none', borderRadius: '20px', color: '#000', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#ECEEF1', marginBottom: '6px' }}>Join the Waitlist</div>
              <div style={{ fontSize: '13px', color: '#4B5563' }}>Be first to access Flibber testnet.</div>
            </div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={{ width: '100%', padding: '12px 16px', background: '#080A0D', border: '1px solid #1E2128', borderRadius: '10px', color: '#ECEEF1', fontSize: '14px', outline: 'none', marginBottom: '12px', fontFamily: 'Manrope, sans-serif', boxSizing: 'border-box' }}
            />
            <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '13px', background: '#ECEEF1', border: 'none', borderRadius: '20px', color: '#000', fontSize: '11px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: '#050505', color: '#ECEEF1', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>

      {/* Nav */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/flibber.png" alt="F" style={{ width: 28, height: 28, borderRadius: '8px', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '14px', fontWeight: '500', letterSpacing: '0.08em', color: '#ECEEF1' }}>FLIBBER</span>
        </div>

        {/* Desktop links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[
            { label: 'Documentation', href: '/docs' },
            { label: 'Community', href: 'https://t.me/flibber_xyz', external: true },
            { label: 'Contact', href: 'mailto:flibberfdn@gmail.com', external: true },
          ].map(l => (
            <a key={l.label} href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}
              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#ECEEF1'}
              onMouseLeave={e => e.target.style.color='#4B5563'}>
              {l.label}
            </a>
          ))}
          <button onClick={() => setShowWaitlist(true)} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4B5563', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color='#ECEEF1'}
            onMouseLeave={e => e.target.style.color='#4B5563'}>
            Waitlist
          </button>
        </nav>

        <Link href={DAPP_URL} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#000', background: '#ECEEF1', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: '500', transition: 'transform 0.2s' }}>
          Launch App
        </Link>
      </header>

      {/* Hero */}
      <section style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(184,190,200,0.06), transparent)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '680px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#4B5563', marginBottom: '20px' }}>
            Flibber · Slotting Mechanism
          </p>
          <h1 style={{ fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: '500', lineHeight: '1.05', letterSpacing: '-0.02em', marginBottom: '24px' }}>
            <span style={{ background: 'linear-gradient(135deg, #ECEEF1 0%, #6B7280 50%, #ECEEF1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Move value.
            </span>
            <br />
            <span style={{ color: '#ECEEF1' }}>Keep value.</span>
          </h1>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#6B7280', maxWidth: '480px', margin: '0 auto 40px' }}>
            Flibber's Slotting Mechanism powers deterministic value movement across cross-chain assets, fiat and digital markets.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={DAPP_URL} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#000', background: '#ECEEF1', padding: '14px 28px', borderRadius: '20px', textDecoration: 'none', fontWeight: '500' }}>
              Launch App
            </Link>
            <button onClick={() => setShowWaitlist(true)} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6B7280', background: 'none', border: '1px solid rgba(107,114,128,0.3)', padding: '14px 28px', borderRadius: '20px', cursor: 'pointer' }}>
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* Utilities */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 40px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '500', letterSpacing: '-0.02em', color: '#ECEEF1', marginBottom: '60px', maxWidth: '400px' }}>
          Three utilities, one mechanism.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {UTILITIES.map(u => (
            <div key={u.key} style={{ padding: '32px', background: '#0F1115', border: '1px solid #1E2128', borderRadius: '16px' }}>
              <div style={{ fontSize: '28px', marginBottom: '20px', opacity: 0.6 }}>{u.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '500', color: '#ECEEF1', marginBottom: '12px', letterSpacing: '-0.01em' }}>{u.title}</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#4B5563' }}>{u.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Slotting Mechanism */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#4B5563', marginBottom: '16px' }}>
          The Slotting Mechanism
        </p>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '500', lineHeight: '1.3', letterSpacing: '-0.01em', color: '#ECEEF1', marginBottom: '0' }}>
          Flibber matches what enters the system with the value a user wants out.
        </h2>
        <SlottingAnimation />
      </section>

      {/* Testnet CTA */}
      <section id="testnet" style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 40px 120px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#4B5563', marginBottom: '16px' }}>
          Flibber Testnet
        </p>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '500', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ECEEF1 0%, #6B7280 50%, #ECEEF1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '40px' }}>
          Live on testnet.
        </h2>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={DAPP_URL} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#000', background: '#ECEEF1', padding: '14px 32px', borderRadius: '20px', textDecoration: 'none', fontWeight: '500' }}>
            Launch App
          </Link>
          <button onClick={() => setShowWaitlist(true)} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6B7280', background: 'none', border: '1px solid rgba(107,114,128,0.3)', padding: '14px 32px', borderRadius: '20px', cursor: 'pointer' }}>
            Join Waitlist
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', maxWidth: '1100px', margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '40px' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#ECEEF1', marginBottom: '16px' }}>Flibber</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '14px', color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color='#ECEEF1'}
                  onMouseLeave={e => e.target.style.color='#4B5563'}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            {PAGES.map(p => (
              <a key={p.label} href={p.href}
                style={{ fontSize: '14px', color: '#4B5563', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#ECEEF1'}
                onMouseLeave={e => e.target.style.color='#4B5563'}>
                {p.label}
              </a>
            ))}
          </div>
        </div>
        <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(107,114,128,0.6)' }}>
          © {new Date().getFullYear()} Flibber. All rights reserved.
        </p>
      </footer>

      {/* Waitlist Modal */}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} />}
    </div>
  )
}