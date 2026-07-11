import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CHANNELS, VERTICALS, PARTNERS, initials } from './data.js';

/* ════════════════════════════════════════════════════════════════════════
   Small shared UI
   ════════════════════════════════════════════════════════════════════════ */

/* UI chrome icons are stroke SVGs; the emoji set stays for the 33 services,
   where it works as a warm, instantly readable icon system. */
function Icon({ name, className = 'w-4 h-4' }) {
  const p = {
    search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2.6" /></>,
    back: <path d="M15 18l-6-6 6-6" />,
    close: <path d="M18 6L6 18M6 6l12 12" />,
    video: <><rect x="2" y="6" width="13" height="12" rx="2.5" /><path d="M15 10.5l6-3.5v10l-6-3.5" /></>,
    wallet: <><rect x="2" y="6" width="20" height="14" rx="3" /><path d="M2 10h20M16 15h2" /></>,
    check: <path d="M20 6L9 17l-5-5" />,
    star: <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />,
    download: <><path d="M12 3v12M6 9l6 6 6-6" /><path d="M4 19h16" /></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    shield: <><path d="M12 2l8 3v6c0 5.2-3.4 9.4-8 11-4.6-1.6-8-5.8-8-11V5z" /><path d="M9 12l2 2 4-4" /></>,
  }[name];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {p}
    </svg>
  );
}

function VerifiedBadge({ className = '' }) {
  return (
    <svg className={`text-emerald-500 ${className}`} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" title="KYC verified">
      <path d="M12 2l2.4 1.8 3 .2.9 2.9 2.1 2.1-1 2.9 1 2.9-2.1 2.1-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.6 15l1-2.9-1-2.9 2.1-2.1.9-2.9 3-.2z" />
      <path d="M10.5 14.2l-2-2 1.1-1.1.9.9 3-3 1.1 1.1z" fill="#fff" />
    </svg>
  );
}

const Stars = ({ value }) => (
  <span className="inline-flex items-center gap-1 text-gold font-semibold num">
    <Icon name="star" className="w-3 h-3 fill-current" /> {value.toFixed(1)}
  </span>
);

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
   1) LANDING: the first view. Warm, confident, unmistakably Daksh Sathi.
   ════════════════════════════════════════════════════════════════════════ */

function Landing({ onEnter }) {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  const floaters = ['🛵', '🔧', '💈', '🩺', '🍲', '🌾', '⚖️', '❄️'];
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-deep text-white flex flex-col">
      {/* aurora background */}
      <div className="aurora bg-emerald-400 w-72 h-72 -top-16 -left-16 float" />
      <div className="aurora bg-gold w-60 h-60 top-40 -right-16 float" style={{ animationDelay: '1.2s' }} />
      <div className="aurora bg-teal-300 w-72 h-72 bottom-0 left-10 float" style={{ animationDelay: '2s' }} />

      {/* floating service chips */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        {floaters.map((f, i) => (
          <span key={i} className="absolute text-2xl glass rounded-2xl w-12 h-12 grid place-items-center float anim-in"
            style={{ top: `${12 + (i % 4) * 20}%`, left: `${(i * 23) % 85}%`, animationDelay: `${i * 0.25}s` }}>{f}</span>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-14 pb-8">
        <div className="anim-up inline-flex items-center gap-2 glass rounded-full px-3.5 py-2 text-xs w-max">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" style={{ animation: 'pulse2 2s infinite' }} /> Live in Madhya Pradesh
        </div>

        <h1 className="anim-up d1 mt-auto font-hindi text-[4.4rem] leading-[1.08] tracking-tight">दक्ष<br />साथी</h1>
        <p className="anim-up d2 mt-2 font-display font-bold text-xl text-emerald-50">Sewa <span className="text-gold">+</span> Suraksha</p>
        <p className="anim-up d3 mt-2.5 text-emerald-100/70 max-w-xs leading-relaxed">
          33 verified services. <b className="text-white">0% commission.</b> Your whole city, on demand.
        </p>

        {/* stat strip */}
        <div className="anim-up d4 mt-6 grid grid-cols-3 gap-2.5">
          {[['33', 'Services'], ['0%', 'Commission'], ['4.6', 'Min. rating']].map(([n, l]) => (
            <div key={l} className="glass rounded-2xl py-3.5 text-center">
              <div className="font-display font-bold text-2xl num">{n}</div>
              <div className="tag text-emerald-100/70 mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        <button onClick={onEnter}
          className="anim-up d5 mt-7 w-full rounded-2xl bg-white text-brand-deep font-display font-bold py-4 text-lg active:scale-[.98] transition flex items-center justify-center gap-2.5">
          Explore services <Icon name="arrow" className="w-5 h-5" />
        </button>

        {!installed && (
          <button onClick={promptInstall}
            className="anim-up d6 mt-3 w-full rounded-2xl glass py-3.5 text-sm font-medium active:scale-[.98] transition flex items-center justify-center gap-2"
            title={canInstall ? 'Add to Home Screen' : 'Use browser menu: Add to Home Screen'}>
            <Icon name="download" className="w-4 h-4" /> Add to Home Screen
          </button>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   2) HOME: services + featured partners
   ════════════════════════════════════════════════════════════════════════ */

const tints = {
  A_RIDES: 'from-sky-500/10 to-sky-500/0',
  B_HOME: 'from-emerald-500/10 to-emerald-500/0',
  C_MERCHANT: 'from-amber-500/10 to-amber-500/0',
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
      <header className="bg-gradient-to-b from-brand-dark to-brand text-white px-5 pt-6 pb-7 rounded-b-[2rem] relative overflow-hidden">
        <div className="aurora bg-emerald-300 w-40 h-40 -top-10 -right-10 opacity-30" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="tag text-emerald-200/80">Namaste</p>
            <h2 className="font-display font-bold text-xl mt-0.5">What do you need today?</h2>
          </div>
          <div className="glass rounded-full px-3.5 py-2 text-xs inline-flex items-center gap-1.5"><Icon name="pin" className="w-3.5 h-3.5" /> Betul</div>
        </div>
        <div className="relative mt-4 bg-white rounded-2xl flex items-center gap-2.5 px-4 py-3.5 text-sage2 text-sm shadow-lg">
          <Icon name="search" className="w-4.5 h-4.5 w-[18px] h-[18px] text-brand" /> Search across 33 services…
        </div>
      </header>

      <main className="px-5 mt-5 space-y-7">
        {/* filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {[['ALL', 'All 33']].concat(Object.entries(VERTICALS).map(([k, v]) => [k, v.label])).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition ${
                filter === key ? 'bg-brand text-white shadow-md' : 'bg-white border border-brand-deep/[0.08] text-sage2'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* service grid */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            {list.map((c, i) => (
              <button key={c.no} onClick={() => onPickChannel(c)}
                className={`anim-up card p-3 pt-3.5 text-center bg-gradient-to-b ${tints[c.vertical]} hover:-translate-y-0.5 active:scale-[.97] transition`}
                style={{ animationDelay: `${Math.min(i, 8) * 0.03}s` }}>
                <div className="text-[1.7rem] leading-none mb-1.5">{c.icon}</div>
                <div className="text-[11px] font-semibold leading-tight text-inkx">{c.name}</div>
                {c.webrtc && (
                  <div className="mt-1.5 inline-flex items-center gap-1 tag text-violet-600">
                    <Icon name="video" className="w-3 h-3" /> Video
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* featured partners */}
        <section>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-display font-bold text-lg">Top rated near you</h3>
            <span className="inline-flex items-center gap-1 tag text-brand"><Icon name="shield" className="w-3.5 h-3.5" /> Verified</span>
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
   Uniform provider card: identical height for every partner
   ════════════════════════════════════════════════════════════════════════ */

function ProviderCard({ p, i = 0, onBook }) {
  return (
    <article className={`provider-card anim-up ${p.platinum ? 'border-gold/40' : ''}`} style={{ animationDelay: `${Math.min(i, 6) * 0.05}s` }}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${p.hue} grid place-items-center text-white font-display font-bold text-lg shadow-inner`}>
          {initials(p.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-display font-bold text-[15px] truncate">{p.name}</h4>
            {p.verified && <VerifiedBadge className="shrink-0" />}
          </div>
          <p className="text-xs text-sage2 truncate mt-0.5">{p.trade}</p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <Stars value={p.rating} />
            <span className="text-brand-deep/20">•</span>
            <span className="text-sage2 num">{p.jobs} jobs</span>
          </div>
        </div>
        {p.platinum && (
          <span className="shrink-0 tag rounded-full bg-gold-soft text-gold border border-gold/25 px-2 py-1">Platinum</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.work.slice(0, 2).map((w) => (
          <span key={w} className="text-[11px] bg-brand-tint text-brand-dark rounded-full px-2.5 py-1">{w}</span>
        ))}
        {p.webrtc && (
          <span className="inline-flex items-center gap-1 text-[11px] bg-violet-50 text-violet-700 rounded-full px-2.5 py-1">
            <Icon name="video" className="w-3 h-3" /> Video consult
          </span>
        )}
      </div>

      {/* footer pinned to bottom → equal-length cards */}
      <div className="mt-auto pt-3 flex items-center justify-between">
        <div className="text-xs">
          <span className={`inline-flex items-center gap-1.5 ${p.km === 0 ? 'text-brand font-medium' : 'text-sage2'}`}>
            {p.km === 0
              ? <><span className="w-1.5 h-1.5 rounded-full bg-brand" style={{ animation: 'pulse2 2s infinite' }} /> Online now</>
              : <><Icon name="pin" className="w-3 h-3" /> {p.km} km away</>}
          </span>
          <div className="font-display font-bold text-inkx text-[15px] num">from ₹{p.from}</div>
        </div>
        <button onClick={onBook}
          className="rounded-xl bg-brand text-white text-sm font-semibold px-5 py-2.5 active:scale-95 hover:bg-brand-dark transition shadow-md">
          Book
        </button>
      </div>
    </article>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   3) PARTNERS: provider list scoped to a chosen service
   ════════════════════════════════════════════════════════════════════════ */

function Partners({ channel, onBack, onOpenPartner }) {
  const v = VERTICALS[channel.vertical];
  const mapHint = {
    A_RIDES: 'Live moving-map tracking',
    B_HOME: 'Sathi is 2 km away (static pin)',
    C_MERCHANT: channel.webrtc ? 'In-app video consultation' : 'Google Maps navigation',
  }[channel.vertical];
  return (
    <div className="pb-24">
      <header className="bg-gradient-to-b from-brand-dark to-brand text-white px-5 pt-6 pb-6 rounded-b-[2rem]">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-emerald-100 text-sm"><Icon name="back" className="w-4 h-4" /> Back</button>
        <div className="mt-3 flex items-center gap-3.5">
          <span className="text-4xl">{channel.icon}</span>
          <div>
            <h2 className="font-display font-bold text-2xl leading-none">{channel.name}</h2>
            <p className="tag text-emerald-200/80 mt-1.5">{v.label}</p>
          </div>
        </div>
        <div className="mt-4 glass rounded-2xl px-4 py-3 text-sm inline-flex items-center gap-2">
          <Icon name={channel.webrtc ? 'video' : 'pin'} className="w-4 h-4 text-gold" /> {mapHint}
        </div>
      </header>

      <main className="px-5 mt-5">
        <p className="text-sm text-sage2 mb-3.5"><b className="text-inkx">{PARTNERS.length} verified Sathis</b> available right now</p>
        <div className="providers">
          {PARTNERS.map((p, i) => <ProviderCard key={p.name} p={p} i={i} onBook={() => onOpenPartner(p)} />)}
        </div>
      </main>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4) BOOKING FLOW: the 5-step journey from the vision doc
   ════════════════════════════════════════════════════════════════════════ */

const STEPS = ['Service', 'Details', 'Matching', 'Verify', 'Done'];

function Booking({ channel, partner, onClose, onDone }) {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const matchTimer = useRef(null);

  const advance = Math.round(partner.from * 0.3);
  const balance = partner.from - advance;

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
    <div className="min-h-screen bg-cream flex flex-col">
      {/* progress header */}
      <header className="bg-white px-5 pt-5 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="inline-flex items-center gap-1 text-sage2 text-sm"><Icon name="close" className="w-4 h-4" /> Close</button>
          <span className="tag text-brand">Step {Math.min(step + 1, 5)} / 5</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-brand' : 'bg-brand-deep/[0.08]'}`} />
              <div className={`mt-1.5 text-[10px] text-center ${i <= step ? 'text-brand font-semibold' : 'text-sage2/70'}`}>{s}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 px-5 py-6">
        {/* STEP 0: service summary */}
        {step === 0 && (
          <div className="anim-up space-y-4">
            <h3 className="font-display font-bold text-xl">Confirm your service</h3>
            <div className="card p-4 flex items-center gap-3.5">
              <span className="text-3xl">{channel.icon}</span>
              <div><div className="font-display font-bold">{channel.name}</div><div className="text-xs text-sage2 mt-0.5">{VERTICALS[channel.vertical].label}</div></div>
            </div>
            <div className="card p-4 flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${partner.hue} grid place-items-center text-white font-display font-bold`}>{initials(partner.name)}</div>
              <div className="flex-1"><div className="flex items-center gap-1.5 font-display font-bold">{partner.name} {partner.verified && <VerifiedBadge />}</div><div className="text-xs text-sage2 mt-0.5"><Stars value={partner.rating} /> · from ₹{partner.from}</div></div>
            </div>
          </div>
        )}

        {/* STEP 1: location, time & the escrow explainer */}
        {step === 1 && (
          <div className="anim-up space-y-4">
            <h3 className="font-display font-bold text-xl">Where and when?</h3>
            <label className="block">
              <span className="tag text-sage2">Service address</span>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, area, landmark…"
                className="mt-1.5 w-full rounded-2xl border-2 border-brand-deep/10 focus:border-brand outline-none px-4 py-3 text-sm bg-white transition" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Today', 'Tomorrow'].map((d, i) => (
                <button key={d} className={`card py-3 text-sm font-semibold ${i === 0 ? 'border-brand text-brand border-2' : 'text-sage2'}`}>{d}</button>
              ))}
            </div>

            {/* escrow timeline: how Suraksha payments work */}
            <div className="card p-4 bg-brand-tint/70 border-brand/20">
              <div className="tag text-brand inline-flex items-center gap-1.5"><Icon name="shield" className="w-3.5 h-3.5" /> Suraksha payment</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 text-center">
                  <div className="font-display font-bold text-inkx num">₹{advance}</div>
                  <div className="text-[10px] text-sage2 mt-0.5">30% advance<br />via UPI now</div>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-brand/30 relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] tag text-brand bg-brand-tint px-1">work done</span>
                </div>
                <div className="flex-1 text-center">
                  <div className="font-display font-bold text-inkx num">₹{balance}</div>
                  <div className="text-[10px] text-sage2 mt-0.5">70% released<br />by your PIN</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: smart matching animation */}
        {step === 2 && (
          <div className="anim-in flex flex-col items-center justify-center text-center py-12">
            <div className="relative w-32 h-32 grid place-items-center">
              <span className="absolute inset-0 rounded-full bg-brand/30" style={{ animation: 'ring 1.6s ease-out infinite' }} />
              <span className="absolute inset-0 rounded-full bg-brand/30" style={{ animation: 'ring 1.6s ease-out infinite', animationDelay: '.8s' }} />
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${partner.hue} grid place-items-center text-white text-2xl font-display font-bold shadow-xl`}>{initials(partner.name)}</div>
            </div>
            <h3 className="mt-6 font-display font-bold text-lg">Smart matching…</h3>
            <p className="text-sm text-sage2 mt-1">Finding the nearest verified Sathi for you</p>
          </div>
        )}

        {/* STEP 3: OTP verification */}
        {step === 3 && (
          <div className="anim-up space-y-5">
            <div className="card p-4 flex items-center gap-3.5 bg-brand-tint/70 border-brand/20">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${partner.hue} grid place-items-center text-white font-display font-bold`}>{initials(partner.name)}</div>
              <div className="text-sm"><div className="font-display font-bold flex items-center gap-1.5">{partner.name} matched! {partner.verified && <VerifiedBadge />}</div><div className="text-xs text-sage2 mt-0.5">Arriving · share OTP to start the job</div></div>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl">Secure start (OTP)</h3>
              <p className="text-sm text-sage2 mt-1">Give this 4-digit PIN to your Sathi to officially begin.</p>
            </div>
            <div className="flex gap-3 justify-center">
              {otp.map((d, i) => (
                <input key={i} id={`otp-${i}`} value={d} onChange={(e) => setOtpAt(i, e.target.value)}
                  inputMode="numeric" maxLength={1} className={`otp-box ${d ? 'filled' : ''}`} />
              ))}
            </div>
            <p className="text-center text-xs text-sage2/70">Demo: type any 4 digits</p>
          </div>
        )}

        {/* STEP 4: done, receipt style */}
        {step === 4 && (
          <div className="anim-pop flex flex-col items-center justify-center text-center py-8">
            <div className="w-24 h-24 rounded-full bg-brand grid place-items-center text-white shadow-xl"><Icon name="check" className="w-12 h-12" /></div>
            <h3 className="mt-6 font-display font-bold text-2xl">Booking confirmed!</h3>
            <p className="text-sm text-sage2 mt-1">{partner.name} is on the way for your {channel.name.toLowerCase()}.</p>
            <div className="card mt-6 w-full p-5 text-left">
              <div className="flex items-center justify-between">
                <span className="tag text-sage2">Booking ID</span>
                <span className="font-mono text-sm font-semibold text-brand">DS-{Math.floor(100000 + Math.random() * 899999)}</span>
              </div>
              <div className="tear my-3.5" />
              <Row k="Service" v={channel.name} />
              <Row k="Sathi" v={partner.name} />
              <Row k="Advance paid" v={`₹${advance} (30%)`} />
              <Row k="On completion" v={`₹${balance} (70%)`} />
            </div>
          </div>
        )}
      </main>

      {/* sticky CTA */}
      <footer className="px-5 py-4 bg-white border-t border-brand-deep/[0.06]">
        {step === 0 && <CTA onClick={() => setStep(1)}>Continue</CTA>}
        {step === 1 && <CTA disabled={!address} onClick={() => setStep(2)}>Pay ₹{advance} advance and match</CTA>}
        {step === 2 && <p className="text-center text-xs text-sage2/70">Please wait…</p>}
        {step === 3 && <CTA disabled={!otpDone} onClick={() => setStep(4)}>Verify and start job</CTA>}
        {step === 4 && <CTA onClick={onDone}>Back to home</CTA>}
      </footer>
    </div>
  );
}

const Row = ({ k, v }) => (
  <div className="flex justify-between py-1.5 text-sm">
    <span className="text-sage2">{k}</span><span className="font-semibold text-inkx num">{v}</span>
  </div>
);

const CTA = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full rounded-2xl bg-brand text-white font-display font-bold py-4 text-base active:scale-[.98] hover:bg-brand-dark transition disabled:opacity-40 shadow-lg">
    {children}
  </button>
);

/* ════════════════════════════════════════════════════════════════════════
   App shell: view router
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
