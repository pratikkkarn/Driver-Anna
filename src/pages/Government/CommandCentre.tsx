import React, { useState } from 'react';
import {
  Radio,
  Truck,
  TrendingUp,
  AlertTriangle,
  Scale,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  PieChart,
  Radar,
  Calendar,
  Download,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';
import { DisputeRecord, Language, Trip } from '../../types';
import { getT } from '../../utils/translations';

interface CommandCentreProps {
  trips: Trip[];
  disputes: DisputeRecord[];
  onSelectTrip: (tripId: string) => void;
  onNavigate: (page: string) => void;
  language: Language;
}

export const CommandCentre: React.FC<CommandCentreProps> = ({
  trips,
  disputes,
  onSelectTrip,
  onNavigate,
  language,
}) => {
  const t = getT(language);
  const [selectedCorridorFilter, setSelectedCorridorFilter] = useState('ALL');

  const activeSlaBreaches = trips.filter((t) => t.isSlaBreached);
  const openDisputes = disputes.filter((d) => d.status === 'OPEN');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Signature Screen Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 border border-emerald-600/30 rounded-2xl p-6 shadow-2xl text-white relative overflow-hidden">
        {/* Karnataka red & yellow top edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-emerald-600" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Hubballi APMC Logistics Command Centre
                </h1>
                <p className="text-xs text-emerald-300 font-medium">
                  State APMC Logistics Decision-Support & Return-Load Accountability
                </p>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                LIVE OPERATIONS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Live Synced</span>
            </span>
            <button
              onClick={() => alert('Official Government Report exported to CSV.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export APMC Audit</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 flex items-center gap-1 text-xs font-bold"
              title="Close Module"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Official Target KPI Bar (All strictly from Page 6 of Spec) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Trucks Today</span>
            <div className="text-xl font-black text-white mt-0.5">1,284</div>
            <span className="text-[10px] text-emerald-400">Amargol Gates 1-4</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Matched</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">1,017</div>
            <span className="text-[10px] text-emerald-300">79.2% match rate</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Return Loads</span>
            <div className="text-xl font-black text-amber-400 mt-0.5">842</div>
            <span className="text-[10px] text-slate-400">Verified consignments</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Empty Returns</span>
            <div className="text-xl font-black text-rose-400 mt-0.5">167</div>
            <span className="text-[10px] text-rose-300">Target deficit &lt;150</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. KM Avoided</span>
            <div className="text-xl font-black text-cyan-400 mt-0.5">43,280 km</div>
            <span className="text-[10px] text-cyan-300">Diesel saved ~11,380 L</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Match Time</span>
            <div className="text-xl font-black text-purple-400 mt-0.5">18 min</div>
            <span className="text-[10px] text-purple-300">From yard release</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Accountability</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">94%</div>
            <span className="text-[10px] text-emerald-300">Hash-trail verified</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Funnel & ReturnLoad Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empty-Return Funnel (Strictly from Page 6) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <span>Empty-Return Logistics Funnel</span>
              </h3>
              <p className="text-xs text-slate-400">
                1,284 arrived &rarr; 1,012 eligible &rarr; 842 matched &rarr; 799 loaded &rarr; 780 delivered
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              60.7% Final Conversion
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">1. Total Inbound Arrivals (Gate Check-in)</span>
                <span className="text-white font-mono">1,284 trucks (100%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">2. Eligible for Outbound Return</span>
                <span className="text-white font-mono">1,012 trucks (78.8%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '78.8%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">3. Matched via Deterministic Scoring</span>
                <span className="text-white font-mono">842 trucks (65.5%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '65.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">4. Loading Confirmed at Bay</span>
                <span className="text-white font-mono">799 trucks (62.2%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '62.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">5. Closed & Delivered to Destination</span>
                <span className="text-white font-mono">780 trucks (60.7%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '60.7%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ReturnLoad Radar — Signature Outbound Deficit Forecast (Strictly from Page 6) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Radar className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>ReturnLoad Radar (5:00 PM – 7:00 PM Peak Window)</span>
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                Corridor Shortage Alert: ~42 trucks expected, only 21 verified loads
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-extrabold bg-rose-950 text-rose-300 border border-rose-700 rounded-lg">
              Deficit: -21 Loads
            </span>
          </div>

          <div className="mt-4 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Affected Corridors & Actionable Recommendation:</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg">
                <span className="font-semibold text-white">Hubballi &rarr; Bengaluru (NH-48)</span>
                <span className="text-rose-400 font-bold">14 Truck Deficit</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg">
                <span className="font-semibold text-white">Hubballi &rarr; Hyderabad (NH-67)</span>
                <span className="text-rose-400 font-bold">4 Truck Deficit</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg">
                <span className="font-semibold text-white">Hubballi &rarr; Pune (NH-48 North)</span>
                <span className="text-rose-400 font-bold">3 Truck Deficit</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 bg-emerald-950/60 border border-emerald-600/40 rounded-lg text-xs text-emerald-200">
              <span className="font-bold text-amber-400">APMC Action Directive: </span>
              Incentivize local merchants and Byadgi cold stores to release 14 additional Bengaluru return consignments between 4:00 PM and 6:00 PM to capture returning empty fleets.
            </div>
          </div>
        </div>
      </div>

      {/* Why Empty Breakdown & Active SLA Breaches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Why Empty Breakdown (Strictly from Page 6) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-amber-400" />
                <span>Root Causes for Empty Return (Why Empty)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Empirical distribution of why 167 trucks left without return cargo
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">No matching load on corridor</span>
                <span className="font-bold text-amber-400">42%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">Price mismatch / offer too low</span>
                <span className="font-bold text-rose-400">24%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '24%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">Timing mismatch / loading delayed</span>
                <span className="font-bold text-purple-400">17%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '17%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">Destination mismatch</span>
                <span className="font-bold text-blue-400">10%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '10%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-200">Capacity mismatch (overweight/underload)</span>
                <span className="font-bold text-emerald-400">7%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '7%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Active SLA Breaches & Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Active SLA Breaches & Escalations</span>
              </h3>
              <p className="text-xs text-slate-400">
                Logged automatically into immutable append-only ledger
              </p>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold bg-rose-950 text-rose-300 rounded border border-rose-800">
              {activeSlaBreaches.length} Breaches
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {activeSlaBreaches.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active SLA breaches currently recorded.
              </div>
            ) : (
              activeSlaBreaches.map((b) => (
                <div
                  key={b.tripId}
                  className="bg-rose-950/30 border border-rose-700/60 rounded-xl p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-rose-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      Trip {b.tripId} ({b.truckId})
                    </span>
                    <span className="text-amber-400 uppercase font-mono text-[10px]">
                      Responsible: {b.currentResponsibleParty}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1 leading-snug">
                    {b.slaBreachReason || 'Exceeded stage time threshold. Escalated to APMC Supervisor.'}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-900/40 text-[10px] text-slate-400">
                    <span>Location: {b.currentLocation}</span>
                    <button
                      onClick={() => {
                        onSelectTrip(b.tripId);
                        onNavigate('timeline');
                      }}
                      className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Inspect Hash Proof</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Live Monitored Trips Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-400" />
              <span>Live Monitored Trips & Accountability Ledger Index</span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time state machine tracking from Gate Check-in to Delivery Confirmation
            </p>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                <th className="pb-2">Trip ID</th>
                <th className="pb-2">Truck / Type</th>
                <th className="pb-2">Driver</th>
                <th className="pb-2">Return Corridor</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Responsible</th>
                <th className="pb-2">Accountability</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trips.map((tr) => (
                <tr key={tr.tripId} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-amber-400">{tr.tripId}</td>
                  <td className="py-3">
                    <div className="font-bold text-white">{tr.truckId}</div>
                    <div className="text-[10px] text-slate-400">{tr.truckType}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-slate-200">{tr.driverName}</div>
                    <div className="text-[10px] text-slate-400">{tr.driverPhone}</div>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-emerald-300">{tr.returnDestination}</span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tr.isSlaBreached
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : tr.status === 'TRIP_CLOSED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {tr.status}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-amber-300">
                    {tr.currentResponsibleParty}
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-emerald-400">{tr.accountabilityScore}%</span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        onSelectTrip(tr.tripId);
                        onNavigate('timeline');
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-lg text-xs font-semibold"
                    >
                      Ledger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
