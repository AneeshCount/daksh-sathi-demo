import React, { useEffect, useMemo, useState } from 'react';
import { CHANNELS, VERTICALS, PARTNERS } from './data.js';

/* ── Reusable bits ──────────────────────────────────────────────────────── */

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-emerald-600" title="KYC verified">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 1.8 3 .2.9 2.9 2.1 2.1-1 2.9 1 2.9-2.1 2.1-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.6 15l1-2.9-1-2.9 2.1-2.1.9-2.9 3-.2z" />
        <path d="M10.5 14.2l-2-2 1.1-1.1.9.9 3-3 1.1 1.1z" fill="#fff" />
      </svg>
    </span>
  );
}

function Stars({ value }) {
  return (
    <span className="text-amber-500 text-sm font-semibold">
      ★ {value.toFixed(1)}
    </span>
  );
}

/* ── Add-to-Home-Screen prompt (the PWA "wow") ──────────────────────────── */

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
  const promptInstall = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };
  return { canInstall: !!deferred, installed, promptInstall };
}

function InstallBanner() {
  const { canInstall, installed, promptInstall } = useInstallPrompt();
  // Always render the banner in the demo so reviewers see the intent even when
  // the browser hasn't fired beforeinstallprompt (e.g. already installed / iOS).
  if (installed) return null;
  return (
    <div className="bg-brand-dark text-white px-4 py-3 flex items-center justify-between gap-3 text-sm">
      <span>📲 Install <b>Daksh Sathi</b> — works offline, opens like a native app.</span>
      <button
        onClick={promptInstall}
        disabled={!canInstall}
        className="shrink-0 rounded-full bg-gold text-brand-dark font-bold px-4 py-1.5 disabled:opacity-60"
        title={canInstall ? 'Add to Home Screen' : 'Use browser menu → Add to Home Screen'}
      >
        Add to Home Screen
      </button>
    </div>
  );
}

/* ── Partner portfolio card (masonry item) ──────────────────────────────── */

function PartnerCard({ p }) {
  return (
    <article
      className={`rounded-2xl bg-white shadow-sm ring-1 overflow-hidden ${
        p.platinum ? 'ring-gold/60' : 'ring-slate-100'
      }`}
    >
      {/* "media gallery" panel — coloured placeholder stands in for work photos */}
      <div
        className={`relative ${p.platinum ? 'bg-gradient-to-br from-brand-dark to-brand' : 'bg-gradient-to-br from-brand to-brand-light'}`}
        style={{ height: p.h }}
      >
        {p.platinum && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-gold/95 text-brand-dark text-[11px] font-extrabold px-2 py-0.5">
            👑 PLATINUM
          </span>
        )}
        {p.webrtc && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 text-brand-dark text-[11px] font-bold px-2 py-0.5">
            🎥 Video Consult
          </span>
        )}
        <span className="absolute bottom-2 right-2 text-white/90 text-[11px] font-medium">
          {p.km === 0 ? 'Online now' : `${p.km} KM away`}
        </span>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold leading-tight">{p.name}</h3>
          {p.verified && <VerifiedBadge />}
        </div>
        <p className="text-xs text-slate-500">{p.trade}</p>

        <div className="mt-1.5 flex items-center justify-between">
          <Stars value={p.rating} />
          <span className="text-xs text-slate-400">{p.jobs} jobs</span>
        </div>

        <p className="mt-1 text-[11px] text-slate-400">{p.edu}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {p.work.map((w) => (
            <span key={w} className="text-[11px] bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
              {w}
            </span>
          ))}
        </div>

        <button className="mt-3 w-full rounded-xl bg-brand text-white text-sm font-semibold py-2 active:scale-[.99] transition">
          Book Now
        </button>
      </div>
    </article>
  );
}

/* ── Service channel chips ──────────────────────────────────────────────── */

function ChannelGrid({ filter, onPick }) {
  const list = useMemo(
    () => (filter === 'ALL' ? CHANNELS : CHANNELS.filter((c) => c.vertical === filter)),
    [filter]
  );
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
      {list.map((c) => (
        <button
          key={c.no}
          onClick={() => onPick(c)}
          className="rounded-xl bg-white ring-1 ring-slate-100 p-3 text-center hover:ring-brand/40 transition"
        >
          <div className="text-2xl">{c.icon}</div>
          <div className="mt-1 text-[11px] font-medium leading-tight text-slate-700">{c.name}</div>
          {c.webrtc && <div className="text-[9px] text-amber-600 font-semibold mt-0.5">VIDEO</div>}
        </button>
      ))}
    </div>
  );
}

/* ── App shell ──────────────────────────────────────────────────────────── */

export default function App() {
  const [filter, setFilter] = useState('ALL');
  const [picked, setPicked] = useState(null);

  return (
    <div className="min-h-screen pb-10">
      <InstallBanner />

      {/* Header */}
      <header className="bg-brand text-white px-4 pt-4 pb-5 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold leading-none">दक्ष साथी</div>
            <div className="text-[11px] text-emerald-100">Sewa + Suraksha · 0% Commission</div>
          </div>
          <div className="text-[11px] bg-white/15 rounded-full px-3 py-1">📍 Betul, MP</div>
        </div>

        <div className="mt-4 bg-white rounded-2xl flex items-center px-3 py-2.5 text-slate-500 text-sm">
          🔍 <span className="ml-2">Search 33 services…</span>
        </div>
      </header>

      <main className="px-4 mt-4 space-y-5">
        {/* Vertical filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[['ALL', 'All 33']].concat(
            Object.entries(VERTICALS).map(([k, v]) => [k, v.label])
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                filter === key ? 'bg-brand text-white' : 'bg-white ring-1 ring-slate-200 text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <ChannelGrid filter={filter} onPick={setPicked} />

        {/* Portfolio masonry */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold">Verified Sathis near you</h2>
            <span className="text-xs text-slate-400">Masonry portfolio</span>
          </div>
          <div className="masonry">
            {PARTNERS.map((p) => <PartnerCard key={p.name} p={p} />)}
          </div>
        </section>
      </main>

      {/* Channel pick toast */}
      {picked && (
        <button
          onClick={() => setPicked(null)}
          className="fixed inset-x-0 bottom-0 bg-brand-dark text-white px-4 py-3 text-sm flex items-center justify-between"
        >
          <span>{picked.icon} <b>{picked.name}</b> selected · {VERTICALS[picked.vertical].map}</span>
          <span className="text-emerald-200">tap to dismiss ✕</span>
        </button>
      )}
    </div>
  );
}
