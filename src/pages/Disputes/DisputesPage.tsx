import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Building,
  User,
  ArrowRight,
  Gavel,
  X,
} from 'lucide-react';
import { DisputeRecord, UserRole } from '../../types';
import { appStore } from '../../services/store';

interface DisputesPageProps {
  disputes: DisputeRecord[];
  currentRole: UserRole;
  onNavigate: (page: string) => void;
  onSelectTrip: (tripId: string) => void;
}

export const DisputesPage: React.FC<DisputesPageProps> = ({
  disputes,
  currentRole,
  onNavigate,
  onSelectTrip,
}) => {
  const [selectedDispute, setSelectedDispute] = useState<DisputeRecord | null>(
    disputes[0] || null
  );
  const [resolutionRemarks, setResolutionRemarks] = useState(
    'APMC Officer verified digital offer in append-only ledger. Receiver instructed to disburse ₹4,000 balance via APMC Direct Settlement Gateway.'
  );

  const handleResolve = async (disputeId: string) => {
    await appStore.resolveDispute(
      disputeId,
      resolutionRemarks,
      'APMC Officer Raghavendra Rao'
    );
    alert('Dispute officially resolved and DISPUTE_RESOLVED event appended to immutable ledger.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Dispute Resolution & Arbitration Desk
              </h1>
              <p className="text-xs text-slate-400">
                Ground-truth accountability. Original digital offer is permanently locked.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
              {disputes.filter((d) => d.status === 'OPEN').length} Open Grievances
            </span>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
              title="Close Module"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Dispute Split List / Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* List of Disputes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dispute Register
            </h3>
            {disputes.map((d) => (
              <div
                key={d.disputeId}
                onClick={() => setSelectedDispute(d)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedDispute?.disputeId === d.disputeId
                    ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                    : 'bg-slate-850 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-amber-400">{d.disputeId}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.status === 'OPEN'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <div className="font-bold text-white text-xs truncate">{d.reason}</div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Trip: {d.tripId}</span>
                  <span className="text-rose-400 font-bold">Diff: ₹{d.difference.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Arbitration Inspector */}
          {selectedDispute && (
            <div className="lg:col-span-2 bg-slate-850 border border-slate-700/80 rounded-2xl p-5 shadow-xl text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">Dispute Claim Record</div>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    {selectedDispute.disputeId} • Trip {selectedDispute.tripId}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    onSelectTrip(selectedDispute.tripId);
                    onNavigate('timeline');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <span>Verify In Ledger</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Price comparison card: Promised ₹28,000 vs Received ₹24,000 */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-2">
                  Financial Discrepancy Breakdown
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Promised In Ledger</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">
                      ₹{selectedDispute.claimedAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="bg-slate-850 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">Actual Disbursed</div>
                    <div className="text-lg font-black text-rose-400 mt-0.5">
                      ₹{selectedDispute.paidAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="bg-rose-950/60 p-2.5 rounded-lg border border-rose-700/60">
                    <div className="text-[10px] text-rose-300">Withheld Difference</div>
                    <div className="text-lg font-black text-rose-300 mt-0.5">
                      ₹{selectedDispute.difference.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parties involved */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Claimant (Raised By)</span>
                  <div className="font-bold text-white mt-0.5">{selectedDispute.raisedBy}</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Respondent (Against)</span>
                  <div className="font-bold text-white mt-0.5">{selectedDispute.againstParty}</div>
                </div>
              </div>

              {/* Evidence Preserved */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Preserved Digital Evidence Trail:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {selectedDispute.originalEvidence}
                </p>
              </div>

              {/* Resolution Panel */}
              {selectedDispute.status === 'OPEN' ? (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    APMC Administrative Resolution Order
                  </label>
                  <textarea
                    rows={2}
                    value={resolutionRemarks}
                    onChange={(e) => setResolutionRemarks(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={() => handleResolve(selectedDispute.disputeId)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Issue Official Binding Resolution (Append DISPUTE_RESOLVED)</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-xs text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Resolved by {selectedDispute.resolvedBy} on {new Date(selectedDispute.resolvedAt || '').toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1 text-slate-300">{selectedDispute.resolutionNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
