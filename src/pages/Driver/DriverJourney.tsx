import React, { useState } from 'react';
import {
  Truck,
  Mic,
  MapPin,
  Clock,
  Weight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import { Language, Load, Trip } from '../../types';
import { findTopDeterministicMatches } from '../../services/matchingEngine';
import { LoadCard } from '../../components/dashboard/LoadCard';
import { getT } from '../../utils/translations';
import { appStore } from '../../services/store';

interface DriverJourneyProps {
  currentTrip: Trip;
  loads: Load[];
  language: Language;
  onOpenVoice: () => void;
  onNavigate: (page: string) => void;
  onSelectTrip: (tripId: string) => void;
}

export const DriverJourney: React.FC<DriverJourneyProps> = ({
  currentTrip,
  loads,
  language,
  onOpenVoice,
  onNavigate,
  onSelectTrip,
}) => {
  const t = getT(language);
  const [targetDestination, setTargetDestination] = useState(
    currentTrip?.returnDestination || 'Bengaluru'
  );

  // Compute deterministic matches for current truck trip
  const modifiedTrip = {
    ...currentTrip,
    returnDestination: targetDestination,
  };
  const matches = findTopDeterministicMatches(modifiedTrip, loads, 5);

  const handleAcceptLoad = async (loadId: string) => {
    await appStore.acceptLoadForTrip(currentTrip.tripId, loadId);
    alert('Return Load accepted! Loading slot confirmed at Hubballi APMC warehouse.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Module Close Banner Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-slate-100">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-400" />
          <span className="font-extrabold text-sm sm:text-base">Driver Return Journey Module</span>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
          title="Close Module"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>

      {/* Driver & Truck Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white">
                  Driver: Your Return Journey
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-300 rounded border border-emerald-700">
                  {currentTrip.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentTrip.driverName} • Truck {currentTrip.truckId} ({currentTrip.capacityTons}T {currentTrip.truckType})
              </p>
            </div>
          </div>

          {/* Quick Voice Search Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-transform active:scale-95"
          >
            <Mic className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>{t.speakWithSarvam}</span>
          </button>
        </div>

        {/* State Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">APMC Trip ID</span>
            <div className="font-mono font-bold text-amber-400 mt-0.5">{currentTrip.tripId}</div>
          </div>
          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Unloading Status</span>
            <div className="font-bold text-emerald-400 mt-0.5">Completed (Bay 7)</div>
          </div>
          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Accountability Score</span>
            <div className="font-extrabold text-emerald-400 mt-0.5">
              {currentTrip.accountabilityScore}% (Top Tier)
            </div>
          </div>
          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400">Active Responsibility</span>
            <div className="font-bold text-amber-300 mt-0.5">
              {currentTrip.currentResponsibleParty}
            </div>
          </div>
        </div>
      </div>

      {/* Target Return Destination Picker */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 shrink-0">Return Corridor:</span>
        <div className="flex items-center gap-2">
          {['Bengaluru', 'Belagavi', 'Goa', 'Pune', 'Hyderabad'].map((dest) => (
            <button
              key={dest}
              onClick={() => setTargetDestination(dest)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                targetDestination.toLowerCase() === dest.toLowerCase()
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Return Loads (Top Deterministic Matches) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{t.recommendedLoads} ({matches.length} Top Matches)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic ranking based on route (30%), capacity (20%), time (15%), price (15%), empty km (10%) and trust (10%).
            </p>
          </div>

          <button
            onClick={() => {
              onSelectTrip(currentTrip.tripId);
              onNavigate('timeline');
            }}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Trip Ledger Trail</span>
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No active open consignments matching this corridor right now. Try switching destinations or speaking with Sarvam AI.
          </div>
        ) : (
          matches.map((m) => (
            <LoadCard
              key={m.load.loadId}
              matchResult={m}
              trip={currentTrip}
              onAccept={handleAcceptLoad}
              isAccepted={currentTrip.matchedLoadId === m.load.loadId}
            />
          ))
        )}
      </div>
    </div>
  );
};
