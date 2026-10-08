import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Truck,
  MapPin,
  Clock,
  Weight,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgeCheck,
  Building,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Load, MatchScoreResult, Trip } from '../../types';
import { calculateTransparentPrice } from '../../services/pricingEngine';
import { PriceCard } from './PriceCard';

interface LoadCardProps {
  matchResult: MatchScoreResult;
  trip: Trip;
  onAccept: (loadId: string) => void;
  isAccepted?: boolean;
}

export const LoadCard: React.FC<LoadCardProps> = ({
  matchResult,
  trip,
  onAccept,
  isAccepted,
}) => {
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const { load, score, routeFit, capacityFit, timeFit, priceComparison, emptyKmExpected, explanation, breakdown } = matchResult;

  const priceBreakdown = calculateTransparentPrice({
    distanceKm: load.distanceKm,
    weightTons: load.weightTons,
    offeredPrice: load.offeredPrice,
    brokerCommission: load.brokerCommission,
  });

  const getScoreColor = (sc: number) => {
    if (sc >= 90) return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/60 ring-emerald-500/20';
    if (sc >= 75) return 'text-amber-400 bg-amber-950/80 border-amber-500/60 ring-amber-500/20';
    return 'text-slate-300 bg-slate-800 border-slate-700 ring-transparent';
  };

  return (
    <div className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xl transition-all ${
      isAccepted
        ? 'border-emerald-500 bg-slate-900/90 ring-2 ring-emerald-500/30'
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Top Bar: Match Score & Basic Consignment Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-start gap-3">
          {/* Big Deterministic Match Score Badge */}
          <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 ring-4 shrink-0 ${getScoreColor(score)}`}>
            <span className="text-xl font-black leading-none">{score}</span>
            <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">/100</span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-white text-base sm:text-lg">
                {load.commodity}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                {load.loadId}
              </span>
              {load.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  <BadgeCheck className="w-3 h-3 text-emerald-400" />
                  Verified Consignor
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{load.ownerName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[11px]">{load.verificationBadge}</span>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
          <div className="text-left sm:text-right">
            <div className="text-[10px] text-slate-400">Guaranteed Return Fare</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              ₹{load.offeredPrice.toLocaleString('en-IN')}
            </div>
          </div>

          {isAccepted ? (
            <div className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md">
              <CheckCircle className="w-4 h-4" />
              <span>Accepted & Assigned</span>
            </div>
          ) : (
            <button
              onClick={() => onAccept(load.loadId)}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-950/40 transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <span>Accept Return Load</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Corridor & Logistics Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs">
        <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Route</span>
          </div>
          <div className="font-bold text-white mt-0.5 truncate">{load.destination}</div>
          <div className="text-[10px] text-slate-400">{load.distanceKm} km (NH-48)</div>
        </div>

        <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Weight className="w-3 h-3 text-amber-400" />
            <span>Weight Fit</span>
          </div>
          <div className="font-bold text-white mt-0.5">{load.weightTons} Tons</div>
          <div className="text-[10px] text-emerald-400">{capacityFit}</div>
        </div>

        <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Loading Window</span>
          </div>
          <div className="font-bold text-white mt-0.5">{load.loadingWindow}</div>
          <div className="text-[10px] text-slate-400">{load.loadingBay}</div>
        </div>

        <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Truck className="w-3 h-3 text-emerald-400" />
            <span>Empty Movement</span>
          </div>
          <div className="font-bold text-emerald-300 mt-0.5">Only {emptyKmExpected} km</div>
          <div className="text-[10px] text-slate-400">Within APMC Amargol</div>
        </div>
      </div>

      {/* Explainable Matching Breakdown (Mandatory Spec Requirement) */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/90 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-slate-300 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            Deterministic Match Explanation:
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Weighted Algorithm (No Black Box)</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-xs">
          {explanation}
        </p>

        {/* Score Breakdown Micro-Bars */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2 pt-2 border-t border-slate-850 text-[10px]">
          <div>
            <div className="text-slate-400">Route (30%)</div>
            <div className="font-bold text-amber-400">{breakdown.route}/30</div>
          </div>
          <div>
            <div className="text-slate-400">Capacity (20%)</div>
            <div className="font-bold text-amber-400">{breakdown.capacity}/20</div>
          </div>
          <div>
            <div className="text-slate-400">Time (15%)</div>
            <div className="font-bold text-amber-400">{breakdown.time}/15</div>
          </div>
          <div>
            <div className="text-slate-400">Price (15%)</div>
            <div className="font-bold text-amber-400">{breakdown.price}/15</div>
          </div>
          <div>
            <div className="text-slate-400">Empty KM (10%)</div>
            <div className="font-bold text-amber-400">{breakdown.emptyDistance}/10</div>
          </div>
          <div>
            <div className="text-slate-400">Trust (10%)</div>
            <div className="font-bold text-amber-400">{breakdown.reliability}/10</div>
          </div>
        </div>
      </div>

      {/* Expandable Transparent Price Card */}
      <div className="mt-3">
        <button
          onClick={() => setShowPriceDetails(!showPriceDetails)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            {showPriceDetails ? 'Hide Cost Breakdown' : 'Inspect Transparent Operating Cost Breakdown'}
          </span>
          {showPriceDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showPriceDetails && (
          <div className="mt-2 animate-fadeIn">
            <PriceCard priceData={priceBreakdown} commodityName={load.commodity} />
          </div>
        )}
      </div>
    </div>
  );
};
