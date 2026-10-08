import React from 'react';
import {
  IndianRupee,
  Fuel,
  Receipt,
  UserCheck,
  Wrench,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { PriceBreakdown } from '../../types';
import { MANDATORY_PRICE_LABEL } from '../../services/pricingEngine';

interface PriceCardProps {
  priceData: PriceBreakdown;
  commodityName?: string;
}

export const PriceCard: React.FC<PriceCardProps> = ({ priceData, commodityName }) => {
  const isAboveMin = priceData.difference >= 0;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Consignment Fare & Cost Breakdown
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              ₹{priceData.offeredPrice.toLocaleString('en-IN')}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                isAboveMin
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-rose-950 text-rose-300 border border-rose-700'
              }`}
            >
              {isAboveMin ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  +₹{Math.abs(priceData.difference).toLocaleString('en-IN')} vs base benchmark
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  -₹{Math.abs(priceData.difference).toLocaleString('en-IN')} below base benchmark
                </>
              )}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400">Reference Corridor Range</div>
          <div className="text-xs sm:text-sm font-bold text-slate-200">
            ₹{priceData.suggestedMin.toLocaleString('en-IN')} – ₹
            {priceData.suggestedMax.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Transparent Itemized Operating Costs */}
      <div className="my-3 space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
          <span>Estimated Operating Components:</span>
          <span className="text-[10px] text-slate-500">Karnataka NH-48 Tariff Standards</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Fuel className="w-3 h-3 text-amber-400" />
              <span>Fuel (Diesel)</span>
            </div>
            <div className="font-bold text-slate-200">₹{priceData.fuelCost.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Receipt className="w-3 h-3 text-cyan-400" />
              <span>NHAI Tolls</span>
            </div>
            <div className="font-bold text-slate-200">₹{priceData.tolls.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span>Driver Allowance</span>
            </div>
            <div className="font-bold text-slate-200">₹{priceData.driverAllowance.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
              <Wrench className="w-3 h-3 text-purple-400" />
              <span>Vehicle Maintenance</span>
            </div>
            <div className="font-bold text-slate-200">₹{priceData.vehicleCost.toLocaleString('en-IN')}</div>
          </div>

          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/60 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1 text-[11px] text-emerald-300 mb-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Estimated Net Margin</span>
            </div>
            <div className="font-bold text-emerald-200 text-sm">
              ₹{priceData.estimatedMargin.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Broker commission transparency if present */}
      {priceData.brokerCommission ? (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="font-bold">Broker Fee Declared:</span>
            <span>Commission transparently declared by coordinator</span>
          </div>
          <span className="font-extrabold text-amber-400">
            ₹{priceData.brokerCommission.toLocaleString('en-IN')}
          </span>
        </div>
      ) : null}

      {/* Mandatory Statutory Label (Explicitly required by spec) */}
      <div className="pt-2 border-t border-slate-800/80 flex items-start gap-1.5 text-[10px] text-slate-400">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span className="leading-tight italic font-mono">
          “{priceData.mandatoryLabel || MANDATORY_PRICE_LABEL}”
        </span>
      </div>
    </div>
  );
};
