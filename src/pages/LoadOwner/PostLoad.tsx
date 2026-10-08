import React, { useState } from 'react';
import {
  PackagePlus,
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  Weight,
  MapPin,
  IndianRupee,
  BadgeCheck,
  AlertCircle,
  Truck,
  X,
} from 'lucide-react';
import { Language, Load, UserRole } from '../../types';
import { appStore } from '../../services/store';
import { calculateTransparentPrice, MANDATORY_PRICE_LABEL } from '../../services/pricingEngine';

interface PostLoadProps {
  currentRole: UserRole;
  language: Language;
  onNavigate: (page: string) => void;
}

export const PostLoad: React.FC<PostLoadProps> = ({ currentRole, language, onNavigate }) => {
  const isBroker = currentRole === 'BROKER';

  const [commodity, setCommodity] = useState('Onion (Bellary Red)');
  const [destination, setDestination] = useState('Bengaluru');
  const [weightTons, setWeightTons] = useState(14);
  const [loadingWindow, setLoadingWindow] = useState('16:00 - 18:00');
  const [offeredPrice, setOfferedPrice] = useState(28000);
  const [brokerCommission, setBrokerCommission] = useState(1200);
  const [ownerName, setOwnerName] = useState(
    isBroker ? 'Kalyan Logistics (Broker)' : 'Hubballi Agro Traders Co-op'
  );
  const [loadingBay, setLoadingBay] = useState('Amargol Gate 2 Bay 4');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Distance estimation based on destination
  const distanceKm =
    destination === 'Bengaluru'
      ? 412
      : destination === 'Belagavi'
      ? 104
      : destination === 'Goa'
      ? 152
      : destination === 'Pune'
      ? 435
      : destination === 'Hyderabad'
      ? 495
      : 350;

  const priceBreakdown = calculateTransparentPrice({
    distanceKm,
    weightTons,
    offeredPrice,
    brokerCommission: isBroker ? brokerCommission : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newLoad: Load = {
      loadId: `LOAD-${Math.floor(Math.random() * 90000 + 10000)}`,
      ownerId: isBroker ? 'BRK-089' : 'OWNER-044',
      ownerName,
      ownerType: isBroker ? 'BROKER' : 'LOAD_OWNER',
      brokerCommission: isBroker ? brokerCommission : undefined,
      brokerScore: isBroker ? 92 : undefined,
      origin: 'Hubballi APMC Amargol',
      destination,
      distanceKm,
      commodity,
      weightTons,
      loadingWindow,
      offeredPrice,
      suggestedMin: priceBreakdown.suggestedMin,
      suggestedMax: priceBreakdown.suggestedMax,
      status: 'OPEN',
      verified: true,
      verificationBadge: isBroker
        ? `Declared Broker Commission (₹${brokerCommission})`
        : 'e-NAM APMC Licensed Merchant (KA-HBL-992)',
      contactPhone: '+91 94481 99201',
      loadingBay,
      createdAt: new Date().toISOString(),
    };

    await appStore.addNewLoad(newLoad);
    setIsSubmitted(true);
    setTimeout(() => {
      onNavigate('driver');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {isBroker ? 'Broker Consignment Declaration' : 'Post Return Consignment'}
              </h1>
              <p className="text-xs text-slate-400">
                Drive Anna • Karnataka Freight Intelligence Network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Consignor</span>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 flex items-center gap-1 text-xs font-bold"
              title="Close Module"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {isBroker && (
          <div className="mt-4 p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs text-amber-200">
            <span className="font-bold">Broker Accountability Notice: </span>
            Brokers are registered and scored. All commissions must be declared upfront. Commission identity never alters matching priority ranking.
          </div>
        )}

        {isSubmitted ? (
          <div className="p-8 text-center text-emerald-300">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-2 animate-bounce" />
            <h3 className="text-lg font-bold text-white">Return Load Published & Verified!</h3>
            <p className="text-xs text-slate-400 mt-1">
              Logged into the append-only ledger. Returning trucks on this corridor will immediately receive deterministic match cards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Commodity Name
                </label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Onion (Bellary Red)">Onion (Bellary Red)</option>
                  <option value="Byadgi Dry Chilli">Byadgi Dry Chilli</option>
                  <option value="Groundnut (TMV-2)">Groundnut (TMV-2)</option>
                  <option value="Cotton (Bunny/Bt)">Cotton (Bunny/Bt)</option>
                  <option value="Maize (Hybrid)">Maize (Hybrid)</option>
                  <option value="Soybean (Yellow)">Soybean (Yellow)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination Return Corridor
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Bengaluru">Bengaluru (NH-48)</option>
                  <option value="Belagavi">Belagavi (NH-48 North)</option>
                  <option value="Goa">Goa (NH-748)</option>
                  <option value="Pune">Pune (NH-48)</option>
                  <option value="Hyderabad">Hyderabad (NH-67)</option>
                  <option value="Davanagere">Davanagere</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Weight (Tons)
                </label>
                <input
                  type="number"
                  value={weightTons}
                  onChange={(e) => setWeightTons(Number(e.target.value))}
                  min={1}
                  max={40}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Loading Time Window
                </label>
                <input
                  type="text"
                  value={loadingWindow}
                  onChange={(e) => setLoadingWindow(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. 16:00 - 18:00"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Offered Consignment Price (₹)
                </label>
                <input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Number(e.target.value))}
                  step={500}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {isBroker ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Declared Broker Commission (₹)
                  </label>
                  <input
                    type="number"
                    value={brokerCommission}
                    onChange={(e) => setBrokerCommission(Number(e.target.value))}
                    step={100}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    APMC Loading Bay / Warehouse
                  </label>
                  <input
                    type="text"
                    value={loadingBay}
                    onChange={(e) => setLoadingBay(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              )}
            </div>

            {/* Live Pricing Reference Preview */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">System Reference Tariff Range:</span>
                <span className="font-bold text-amber-400">
                  ₹{priceBreakdown.suggestedMin.toLocaleString('en-IN')} – ₹
                  {priceBreakdown.suggestedMax.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 italic font-mono">
                {MANDATORY_PRICE_LABEL}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-xl transition-transform active:scale-95"
            >
              Publish Verified Load & Generate Ledger Hash
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
