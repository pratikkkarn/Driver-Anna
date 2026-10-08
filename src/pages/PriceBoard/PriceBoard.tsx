import React, { useState } from 'react';
import {
  TrendingUp,
  Tag,
  Building,
  ShieldCheck,
  Calculator,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Fuel,
  X,
} from 'lucide-react';
import { OFFICIAL_COMMODITY_PRICES, CORRIDOR_ROUTES } from '../../data/seedData';
import { calculateTransparentPrice, MANDATORY_PRICE_LABEL } from '../../services/pricingEngine';

interface PriceBoardProps {
  onNavigate?: (page: string) => void;
}

export const PriceBoard: React.FC<PriceBoardProps> = ({ onNavigate }) => {
  const [calcDist, setCalcDist] = useState(412);
  const [calcWeight, setCalcWeight] = useState(16);
  const [customPrice, setCustomPrice] = useState(28000);

  const priceCalc = calculateTransparentPrice({
    distanceKm: calcDist,
    weightTons: calcWeight,
    offeredPrice: customPrice,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                Corridor Market Reference Board
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                Official Corridor Mandi Rates
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Commodity price benchmarks from Hubballi, Byadgi, and Dharwad produce markets.
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-bold self-start sm:self-center"
              title="Close Module"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          )}
        </div>

        {/* Commodity Prices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {OFFICIAL_COMMODITY_PRICES.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-850 p-4 rounded-xl border border-slate-800 hover:border-emerald-600/50 transition-colors"
            >
              <div className="text-xs font-bold text-white truncate">{item.commodity}</div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl font-black text-amber-400">
                  ₹{item.modalPricePerQtl.toLocaleString('en-IN')}
                </span>
                <span
                  className={`text-[11px] font-bold flex items-center ${
                    item.trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.trend.startsWith('+') ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {item.trend}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{item.unit}</span>
                <span className="text-[9px] font-mono text-slate-400 truncate max-w-[120px]">
                  {item.source.replace('AGMARKNET', 'Mandi')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column: Route Corridors & Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Corridors */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Standard Outbound Transport Corridors</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">10 Primary Routes</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {CORRIDOR_ROUTES.map((r, i) => (
              <div
                key={i}
                onClick={() => setCalcDist(r.distanceKm)}
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  calcDist === r.distanceKm
                    ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                    : 'bg-slate-850 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-white">{r.to}</div>
                  <div className="text-[10px] text-slate-400">
                    {r.highway} • Typical: {r.typicalHours}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-amber-400">{r.distanceKm} KM</div>
                  <span className="text-[9px] text-emerald-400">Click to Calculate &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Return Tariff Estimator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>Distance-Based Tariff & Margin Simulator</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Corridor Distance (KM)
              </label>
              <input
                type="number"
                value={calcDist}
                onChange={(e) => setCalcDist(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Truck Weight / Capacity (Tons)
              </label>
              <input
                type="number"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Proposed Return Freight (₹)
            </label>
            <input
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(Number(e.target.value))}
              step={500}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-amber-300 font-bold"
            />
          </div>

          {/* Results card */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">System Suggested Reference Range:</span>
              <span className="font-bold text-amber-400 text-sm">
                ₹{priceCalc.suggestedMin.toLocaleString('en-IN')} – ₹
                {priceCalc.suggestedMax.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-400">Diesel Fuel:</span>
                <div className="font-bold text-slate-200">₹{priceCalc.fuelCost.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-400">NHAI Tolls:</span>
                <div className="font-bold text-slate-200">₹{priceCalc.tolls.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-slate-400">Driver Allowance:</span>
                <div className="font-bold text-slate-200">₹{priceCalc.driverAllowance.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span className="text-emerald-400">Estimated Margin:</span>
                <div className="font-extrabold text-emerald-300">
                  ₹{priceCalc.estimatedMargin.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 italic font-mono pt-1">
              “{MANDATORY_PRICE_LABEL}”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
