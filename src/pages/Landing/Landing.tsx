import React from 'react';
import {
  Truck,
  PackagePlus,
  Radio,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Mic,
  Scale,
  ArrowRight,
  Clock,
  Building2,
  Tag,
  Box,
} from 'lucide-react';
import { Language } from '../../types';
import { getT } from '../../utils/translations';

interface LandingProps {
  onNavigate: (page: string) => void;
  onOpenVoice: () => void;
  language: Language;
}

export const Landing: React.FC<LandingProps> = ({
  onNavigate,
  onOpenVoice,
  language,
}) => {
  const t = getT(language);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl text-white">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Karnataka Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Drive Anna • Freight Intelligence & Logistics Decision System</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Full Truck In. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">
              Verified Load Out.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Eliminating empty return trips across Karnataka transport corridors. Powered by deterministic freight matching, transparent cost breakdowns, and instant multilingual voice search.
          </p>
        </div>

        {/* Primary Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {/* 1. Find Return Load (Driver) */}
          <button
            onClick={() => onNavigate('driver')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 hover:border-amber-400/60 border border-slate-800 shadow-xl text-left transition-all hover:scale-[1.02] active:scale-95 flex items-start justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-3 shadow-lg">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
                Driver Return Journey
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Find verified return loads with transparent fare breakdowns & 1-tap accept.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-300 mt-2 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>

          {/* 2. Post Return Consignment */}
          <button
            onClick={() => onNavigate('load-owner')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:border-amber-400/60 border border-slate-800 shadow-xl text-left transition-all hover:scale-[1.02] active:scale-95 flex items-start justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400 mb-3 border border-slate-700">
                <PackagePlus className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
                Post Return Consignment
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Merchants & Brokers: Publish produce loads with transparent fees & loading slots.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-300 mt-2 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>

          {/* 3. Operations Command Centre */}
          <button
            onClick={() => onNavigate('command-centre')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 hover:border-amber-400/60 border border-slate-800 shadow-xl text-left transition-all hover:scale-[1.02] active:scale-95 flex items-start justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-amber-300 text-base group-hover:text-amber-200 transition-colors">
                Operations Command Centre
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Real-time freight metrics, return-load funnel analytics & capacity deficit forecasts.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400 mt-2 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>

          {/* 4. APMC Gate Check-in */}
          <button
            onClick={() => onNavigate('apmc-gate')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:border-amber-400/60 border border-slate-800 shadow-xl text-left transition-all hover:scale-[1.02] active:scale-95 flex items-start justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 mb-3 border border-slate-700">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                APMC Gate & Yard Check-in
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                FastTag OCR check-in, weighbridge tare verification & unloading bay release.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-300 mt-2 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>

          {/* 5. Disputes & Arbitration Desk */}
          <button
            onClick={() => onNavigate('disputes')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:border-rose-500/60 border border-slate-800 shadow-xl text-left transition-all hover:scale-[1.02] active:scale-95 flex items-start justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base group-hover:text-rose-300 transition-colors">
                Disputes & Arbitration Desk
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Structured claim resolution desk with preserved digital offer evidence.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-rose-300 mt-2 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>

          {/* 6. Corridor Price Board */}
          <button
            onClick={() => onNavigate('price-board')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 hover:border-amber-400/60 border border-slate-800 shadow-xl text-left transition-all hover:scale-[1.02] active:scale-95 flex items-start justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-300 mb-3 border border-slate-700">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-base group-hover:text-amber-300 transition-colors">
                Corridor Price Board
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Official mandi produce rates & interactive distance-based tariff simulator.
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-300 mt-2 transition-transform group-hover:translate-x-1 shrink-0" />
          </button>
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">43,280 KM</div>
            <div className="text-xs text-slate-400 mt-0.5">Empty Travel Avoided</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">1,017</div>
            <div className="text-xs text-slate-400 mt-0.5">Verified Load Matches</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">98%</div>
            <div className="text-xs text-slate-400 mt-0.5">SLA Compliance Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">18 Min</div>
            <div className="text-xs text-slate-400 mt-0.5">Average Match Velocity</div>
          </div>
        </div>
      </div>
    </div>
  );
};
