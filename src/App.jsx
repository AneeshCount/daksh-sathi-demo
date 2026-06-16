import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CHANNELS, VERTICALS, PARTNERS, initials } from './data.js';

/* ════════════════════════════════════════════════════════════════════════
   Small shared UI
   ════════════════════════════════════════════════════════════════════════ */

function VerifiedBadge({ className = '' }) {
  return (
    <svg className={`text-emerald-500 ${className}`} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" title="KYC verified">
      <path d="M12 2l2.4 1.8 3 .2.9 2.9 2.1 2.1-1 2.9 1 2.9-2.1 2.1-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.6 15l1-2.9-1-2.9 2.1-2.1.9-2.9 3-.2z" />
      <path d="M10.5 14.2l-2-2 1.1-1.1.9.9 3-3 1.1 1.1z" fill="#fff" />
    </svg>
  );
}

const Stars = ({ value }) => <span className="text-amber-500 font-semibold">★ {value.toFixed(1)}</span>;

function useInstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setDeferred(e); };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);
  const promptInstall = async () => { if (!deferred) return; deferred.prompt(); await deferred.userChoice; setDeferred(null); };
  return { canInstall: !!deferred, installed, promptInstall };
}

/* ════════════════════════════════════════════════════════════════════════
   1) LANDING — the first view. Bold, animated, premium.
   ════════════════════════════════════════════════════════════════════════ */

function Landing({ onEnter }) {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const floaters = ['🛵', '🔧', '💈', '🩺', '🍲', '🌾', '⚖️', '❄️'];
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-dark text-white flex flex-col">
      {/* aurora background */}
      <div className="aurora bg-emerald-400 w-72 h-72 -top-16 -left-16 float" />
      <div className="aurora bg-gold w-60 h-60 top-40 -right-16 float" style={{ animationDelay: '1.2s' }} />
      <div className="aurora bg-teal-300 w-72 h-72 bottom-0 left-10 float" style={{ animationDelay: '2s' }} />

      {/* floating service chips */}
      <div className="pointer-events-none absolute inset-0">
        {floaters.map((f, i) => (
          <span key={i} className="absolute text-2xl glass rounded-2xl w-12 h-12 grid place-items-center float anim-in"
            style={{ top: `${12 + (i % 4) * 20}%`, left: `${(i * 23) % 85}%`, animationDelay: `${i * 0.25}s` }}>{f}</span>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-16 pb-8">
        <div className="anim-up inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs w-max">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> Live in Madhya Pradesh
        </div>

        <h1 className="anim-up d1 mt-auto text-6xl font-extrabold leading-none tracking-tight">दक्ष<br />साथी</h1>
        <p className="anim-up d2 mt-3 text-lg text-emerald-50/90 font-medium">Sewa <span className="text-gold">+</span> Suraksha</p>
        <p className="anim-up d3 mt-2 text-emerald-100/70 max-w-xs">
          33 verified services. <b className="text-white">0% commission.</b> Your whole city, on demand.
        </p>

        {/* stat strip */}
        <div className="anim-up d4 mt-6 grid grid-cols-3 gap-2">
          {[['33', 'Services'], ['0%', 'Commission'], ['4.6★', 'Min. rating']].map(([n, l]) => (
            <div key={l} className="glass rounded-2xl py-3 text-center">
              <div className="text-2xl font-extrabold">{n}</div>
              <div className="text-[11px] text-emerald-100/80">{l}</div>
            </div>
          ))}
        </div>

        <button onClick={onEnter}
          className="anim-up d5 mt-7 w-full rounded-2xl bg-white text-brand-dark font-bold py-4 text-lg shadow-xl active:scale-[.98] transition flex items-center justify-center gap-2">
          Explore Services <span aria-hidden>→</span>
        </button>

        {!installed && (
          <button onClick={promptInstall}
            className="anim-up d6 mt-3 w-full rounded-2xl glass py-3 text-sm font-medium active:scale-[.98] transition"
            title={canInstall ? 'Add to Home Screen' : 'Use browser menu → Add to Home Screen'}>
            📲 Add to Home Screen
          </button>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   2) HOME — services + featured partners
   ════════════════════════════════════════════════════════════════════════ */

const tints = {
  A_RIDES: 'from-sky-500/10 to-sky-500/0 text-sky-700',
  B_HOME: 'from-emerald-500/10 to-emerald-500/0 text-emerald-700',
  C_MERCHANT: 'from-amber-500/10 to-amber-500/0 text-amber-700',
};

function Home({ onPickChannel, onOpenPartner }) {
  const [filter, setFilter] = useState('ALL');
  const list = useMemo(
    () => (filter === 'ALL' ? CHANNELS : CHANNELS.filter((c) => c.vertical === filter)),
    [filter]
  );
  return (
    <div className="pb-24">
      {/* header */}
      <header className="bg-gradient-to-b from-brand to-brand-light text-white px-5 pt-6 pb-7 rounded-b-[2rem] relative overflow-hidden">
        <div className="aurora bg-emerald-300 w-40 h-40 -top-10 -right-10 opacity-30" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-xs">Good morning 👋</p>
            <h2 className="text-xl font-extrabold">What do you need today?</h2>
          </div>
          <div className="glass rounded-full px-3 py-1.5 text-xs">📍 Betul</div>
        </div>
        <div className="relative mt-4 bg-white rounded-2xl flex items-center px-4 py-3 text-slate-400 text-sm shadow-lg">
          🔍 <span className="ml-2">Search across 33 services…</span>
        </div>
      </header>

      <main className="px-5 mt-5 space-y-6">
        {/* filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {[['ALL', 'All 33']].concat(Object.entries(VERTICALS).map(([k, v]) => [k, v.label])).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === key ? 'bg-brand text-white shadow-md' : 'bg-white ring-1 ring-slate-200 text-slate-600'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* service grid */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            {list.map((c, i) => (
              <button key={c.no} onClick={() => onPickChannel(c)}
                className={`anim-up card p-3 text-center bg-gradient-to-b ${tints[c.vertical]} hover:-translate-y-0.5 transition`}
                style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}>
                <div className="text-3xl mb-1">{c.icon}</div>
                <div className="text-[11px] font-semibold leading-tight text-slate-700">{c.name}</div>
                {c.webrtc && <div className="mt-1 text-[8px] font-bold tracking-wide text-amber-600">🎥 VIDEO</div>}
              </button>
            ))}
          </div>
        </section>

        {/* featured partners */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-lg">Top rated near you</h3>
            <span className="text-xs text-brand font-semibold">Verified ✓</span>
          </div>
          <div className="providers">
            {PARTNERS.map((p, i) => <ProviderCard key={p.name} p={p} i={i} onBook={() => onOpenPartner(p)} />)}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Uniform provider card — identical height for every partner
   ════════════════════════════════════════════════════════════════════════ */

function ProviderCard({ p, i = 0, onBook }) {
  return (
    <article className={`provider-card anim-up ${p.platinum ? 'ring-gold/50' : ''}`} style={{ animationDelay: `${Math.min(i, 6) * 0.05}s` }}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${p.hue} grid place-items-center text-white font-extrabold text-lg shadow-inner`}>
          {initials(p.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold truncate">{p.name}</h4>
            {p.verified && <VerifiedBadge className="shrink-0" />}
          </div>
          <p className="text-xs text-slate-500 truncate">{p.trade}</p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <Stars value={p.rating} />
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{p.jobs} jobs</span>
          </div>
        </div>
        {p.platinum && <span className="shrink-0 text-[10px] font-extrabold text-gold">👑</span>}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.work.slice(0, 2).map((w) => (
          <span key={w} className="text-[11px] bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{w}</span>
        ))}
        {p.webrtc && <span className="text-[11px] bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">🎥 Video consult</span>}
      </div>

      {/* footer pinned to bottom → equal-length cards */}
      <div className="mt-auto pt-3 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          <span className="text-slate-400">{p.km === 0 ? '🟢 Online now' : `📍 ${p.km} km away`}</span>
          <div className="font-bold text-slate-800">from ₹{p.from}</div>
        </div>
        <button onClick={onBook}
          className="rounded-xl bg-brand text-white text-sm font-semibold px-5 py-2.5 active:scale-95 transition shadow-md">
          Book
        </button>
      </div>
    </article>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   3) PARTNERS — provider list scoped to a chosen service
   ════════════════════════════════════════════════════════════════════════ */

function Partners({ channel, onBack, onOpenPartner }) {
  const v = VERTICALS[channel.vertical];
  const mapHint = { A_RIDES: '🗺️ Live moving map tracking', B_HOME: '📍 Sathi is 2 km away (static pin)', C_MERCHANT: channel.webrtc ? '🎥 In-app video consultation' : '🧭 Google Maps navigation' }[channel.vertical];
  return (
    <div className="pb-24">
      <header className="bg-gradient-to-b from-brand to-brand-light text-white px-5 pt-6 pb-6 rounded-b-[2rem]">
        <button onClick={onBack} className="text-emerald-100 text-sm">← Back</button>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl">{channel.icon}</span>
          <div>
            <h2 className="text-2xl font-extrabold leading-none">{channel.name}</h2>
            <p className="text-emerald-100 text-xs mt-1">{v.label}</p>
          </div>
        </div>
        <div className="mt-4 glass rounded-2xl px-4 py-2.5 text-sm">{mapHint}</div>
      </header>

      <main className="px-5 mt-5">
        <p className="text-sm text-slate-500 mb-3"><b className="text-slate-800">{PARTNERS.length} verified Sathis</b> available right now</p>
        <div className="providers">
          {PARTNERS.map((p, i) => <ProviderCard key={p.name} p={p} i={i} onBook={() => onOpenPartner(p)} />)}
        </div>
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4) BOOKING FLOW — the 5-step journey from the vision doc
   ════════════════════════════════════════════════════════════════════════ */

const STEPS = ['Service', 'Details', 'Matching', 'Verify', 'Done'];

function Booking({ channel, partner, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const matchTimer = useRef(null);

  // auto-advance the "smart matching" animation
  useEffect(() => {
    if (step === 2) { matchTimer.current = setTimeout(() => setStep(3), 2200); }
    return () => clearTimeout(matchTimer.current);
  }, [step]);

  const otpDone = otp.every((d) => d !== '');
  const setOtpAt = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* progress header */}
      <header className="bg-white px-5 pt-5 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="text-slate-400 text-sm">✕ Close</button>
          <span className="text-xs font-semibold text-brand">Step {Math.min(step + 1, 5)} / 5</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-brand' : 'bg-slate-200'}`} />
              <div className={`mt-1 text-[10px] text-center ${i <= step ? 'text-brand font-semibold' : 'text-slate-400'}`}>{s}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 py-6">
        {/* STEP 0 — service summary */}
        {step === 0 && (
          <div className="anim-up space-y-4">
            <h3 className="text-xl font-extrabold">Confirm your service</h3>
            <div className="card p-4 flex items-center gap-3">
              <span className="text-3xl">{channel.icon}</span>
              <div><div className="font-bold">{channel.name}</div><div className="text-xs text-slate-500">{VERTICALS[channel.vertical].label}</div></div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${partner.hue} grid place-items-center text-white font-bold`}>{initials(partner.name)}</div>
              <div className="flex-1"><div className="flex items-center gap-1 font-bold">{partner.name} {partner.verified && <VerifiedBadge />}</div><div className="text-xs text-slate-500"><Stars value={partner.rating} /> · from ₹{partner.from}</div></div>
            </div>
          </div>
        )}

        {/* STEP 1 — location & details */}
        {step === 1 && (
          <div className="anim-up space-y-4">
            <h3 className="text-xl font-extrabold">Where & when?</h3>
            <label className="block">
              <span className="text-xs font-semibold text-slate-500">Service address</span>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, area, landmark…"
                className="mt-1 w-full rounded-2xl ring-2 ring-slate-200 focus:ring-brand outline-none px-4 py-3 text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Today', 'Tomorrow'].map((d, i) => (
                <button key={d} className={`card py-3 text-sm font-semibold ${i === 0 ? 'ring-2 ring-brand text-brand' : 'text-slate-600'}`}>{d}</button>
              ))}
            </div>
            <div className="card p-4 bg-emerald-50/60 ring-emerald-100">
              <p className="text-xs text-slate-600">💳 <b>30% advance</b> via UPI now (₹{Math.round(partner.from * 0.3)}). Remaining 70% on completion, released by your PIN.</p>
            </div>
          </div>
        )}

        {/* STEP 2 — smart matching animation */}
        {step === 2 && (
          <div className="anim-in flex flex-col items-center justify-center text-center py-12">
            <div className="relative w-32 h-32 grid place-items-center">
              <span className="absolute inset-0 rounded-full bg-brand/30" style={{ animation: 'ring 1.6s ease-out infinite' }} />
              <span className="absolute inset-0 rounded-full bg-brand/30" style={{ animation: 'ring 1.6s ease-out infinite', animationDelay: '.8s' }} />
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${partner.hue} grid place-items-center text-white text-2xl font-extrabold shadow-xl`}>{initials(partner.name)}</div>
            </div>
            <h3 className="mt-6 text-lg font-extrabold">Smart matching…</h3>
            <p className="text-sm text-slate-500 mt-1">Finding the nearest verified Sathi for you</p>
          </div>
        )}

        {/* STEP 3 — OTP verification */}
        {step === 3 && (
          <div className="anim-up space-y-5">
            <div className="card p-4 flex items-center gap-3 bg-emerald-50/60 ring-emerald-100">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${partner.hue} grid place-items-center text-white font-bold`}>{initials(partner.name)}</div>
              <div className="text-sm"><div className="font-bold flex items-center gap-1">{partner.name} matched! {partner.verified && <VerifiedBadge />}</div><div className="text-xs text-slate-500">Arriving · share OTP to start the job</div></div>
            </div>
            <div>
              <h3 className="text-xl font-extrabold">Secure start (OTP)</h3>
              <p className="text-sm text-slate-500 mt-1">Give this 4-digit PIN to your Sathi to officially begin.</p>
            </div>
            <div className="flex gap-3 justify-center">
              {otp.map((d, i) => (
                <input key={i} id={`otp-${i}`} value={d} onChange={(e) => setOtpAt(i, e.target.value)}
                  inputMode="numeric" maxLength={1} className={`otp-box ${d ? 'filled' : ''}`} />
              ))}
            </div>
            <p className="text-center text-xs text-slate-400">Demo: type any 4 digits</p>
          </div>
        )}

        {/* STEP 4 — done */}
        {step === 4 && (
          <div className="anim-pop flex flex-col items-center justify-center text-center py-10">
            <div className="w-24 h-24 rounded-full bg-emerald-500 grid place-items-center text-white text-5xl shadow-xl">✓</div>
            <h3 className="mt-6 text-2xl font-extrabold">Booking confirmed!</h3>
            <p className="text-sm text-slate-500 mt-1">{partner.name} is on the way for your {channel.name.toLowerCase()}.</p>
            <div className="card mt-6 w-full p-4 text-left">
              <Row k="Booking ID" v={`DS-${Math.floor(100000 + Math.random() * 899999)}`} />
              <Row k="Service" v={channel.name} />
              <Row k="Advance paid" v={`₹${Math.round(partner.from * 0.3)} (30%)`} />
              <Row k="On completion" v={`₹${partner.from - Math.round(partner.from * 0.3)} (70%)`} />
            </div>
          </div>
        )}
      </main>

      {/* sticky CTA */}
      <footer className="px-5 py-4 bg-white border-t border-slate-100">
        {step === 0 && <CTA onClick={() => setStep(1)}>Continue</CTA>}
        {step === 1 && <CTA disabled={!address} onClick={() => setStep(2)}>Pay ₹{Math.round(partner.from * 0.3)} advance & match</CTA>}
        {step === 2 && <p className="text-center text-xs text-slate-400">Please wait…</p>}
        {step === 3 && <CTA disabled={!otpDone} onClick={() => setStep(4)}>Verify & start job</CTA>}
        {step === 4 && <CTA onClick={onDone}>Back to home</CTA>}
      </footer>
    </div>
  );
}

const Row = ({ k, v }) => (
  <div className="flex justify-between py-1.5 text-sm border-b border-slate-50 last:border-0">
    <span className="text-slate-400">{k}</span><span className="font-semibold text-slate-800">{v}</span>
  </div>
);

const CTA = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full rounded-2xl bg-brand text-white font-bold py-4 text-base active:scale-[.98] transition disabled:opacity-40 shadow-lg">
    {children}
  </button>
);

/* ════════════════════════════════════════════════════════════════════════
   App shell — view router
   ════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [view, setView] = useState('landing');     // landing | home | partners | booking
  const [channel, setChannel] = useState(null);
  const [partner, setPartner] = useState(null);

  const openPartner = (p) => { setPartner(p); setView('booking'); };
  const pickChannel = (c) => { setChannel(c); setView('partners'); };

  return (
    <div className="app-frame">
      {view === 'landing' && <Landing onEnter={() => setView('home')} />}

      {view === 'home' && (
        <Home
          onPickChannel={pickChannel}
          onOpenPartner={(p) => { setChannel(CHANNELS.find((c) => p.trade.startsWith(c.name.split(' ')[0])) || CHANNELS[0]); openPartner(p); }}
        />
      )}

      {view === 'partners' && channel && (
        <Partners channel={channel} onBack={() => setView('home')} onOpenPartner={openPartner} />
      )}

      {view === 'booking' && channel && partner && (
        <Booking channel={channel} partner={partner}
          onClose={() => setView(channel ? 'partners' : 'home')}
          onDone={() => setView('home')} />
      )}
    </div>
  );
}
