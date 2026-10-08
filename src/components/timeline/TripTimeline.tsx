import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  FileCheck,
  AlertTriangle,
  Lock,
  Hash,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Plus,
  RotateCcw,
  Check,
  Copy,
  X,
  FileCode,
  Shield,
  Layers,
  Filter,
} from 'lucide-react';
import { EventType, LedgerEvent, Trip, UserRole } from '../../types';
import { verifyLedgerChain, createCanonicalPayload } from '../../services/ledgerService';
import { appStore } from '../../services/store';

interface TripTimelineProps {
  events: LedgerEvent[];
  selectedTripId?: string;
  allTrips: Trip[];
  onSelectTrip?: (tripId: string) => void;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({
  events,
  selectedTripId,
  allTrips,
  onSelectTrip,
}) => {
  const [activeTripId, setActiveTripId] = useState<string>(
    selectedTripId || 'HBL-RT-2026-10482'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
  const [selectedProofEvent, setSelectedProofEvent] = useState<LedgerEvent | null>(null);
  const [isAppendModalOpen, setIsAppendModalOpen] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // New event form state
  const [newEventTripId, setNewEventTripId] = useState<string>(
    activeTripId === 'ALL_TRIPS' ? allTrips[0]?.tripId || 'HBL-RT-2026-10482' : activeTripId
  );
  const [newEventType, setNewEventType] = useState<EventType>('TRUCK_VERIFIED');
  const [newEventRemarks, setNewEventRemarks] = useState<string>(
    'FastTag OCR verified and weighbridge net tare certification recorded.'
  );
  const [newEventLocation, setNewEventLocation] = useState<string>('Hubballi APMC Amargol Gate 1');
  const [newEventEvidenceLabel, setNewEventEvidenceLabel] = useState<string>('Weigh Slip #KA-HBL-99210');
  const [newEventEvidenceValue, setNewEventEvidenceValue] = useState<string>('Tare: 7,420 kg | Gross: 23,420 kg');

  const [chainIntegrity, setChainIntegrity] = useState<{ isValid: boolean; reason?: string }>({
    isValid: true,
  });

  useEffect(() => {
    if (selectedTripId) {
      setActiveTripId(selectedTripId);
      setNewEventTripId(selectedTripId);
    }
  }, [selectedTripId]);

  // Filter events based on activeTripId, eventTypeFilter, and searchQuery
  const tripEvents = events
    .filter((e) => {
      if (activeTripId !== 'ALL_TRIPS' && e.tripId !== activeTripId) {
        return false;
      }
      if (eventTypeFilter !== 'ALL') {
        if (eventTypeFilter === 'ARRIVALS' && !['TRUCK_ARRIVED', 'TRUCK_VERIFIED'].includes(e.eventType)) return false;
        if (eventTypeFilter === 'UNLOADING' && !['UNLOADING_STARTED', 'UNLOADING_COMPLETED', 'TRUCK_AVAILABLE'].includes(e.eventType)) return false;
        if (eventTypeFilter === 'OFFERS' && !['LOAD_CREATED', 'MATCH_CREATED', 'OFFER_SENT', 'OFFER_ACCEPTED', 'PRICE_CONFIRMED'].includes(e.eventType)) return false;
        if (eventTypeFilter === 'LOADING' && !['LOADING_STARTED', 'LOADING_COMPLETED', 'DEPARTED', 'DELIVERY_CONFIRMED'].includes(e.eventType)) return false;
        if (eventTypeFilter === 'SLA' && e.eventType !== 'SLA_BREACHED') return false;
        if (eventTypeFilter === 'DISPUTES' && !['DISPUTE_OPENED', 'DISPUTE_RESOLVED'].includes(e.eventType)) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.eventId.toLowerCase().includes(q) ||
          e.tripId.toLowerCase().includes(q) ||
          e.actorId.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.remarks.toLowerCase().includes(q) ||
          e.eventHash.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const currentTrip = allTrips.find((t) => t.tripId === activeTripId);

  // Validate chain
  useEffect(() => {
    verifyLedgerChain(tripEvents).then((res) => {
      setChainIntegrity(res);
    });
  }, [tripEvents]);

  const handleVerifyChainNow = async () => {
    const res = await verifyLedgerChain(tripEvents);
    setChainIntegrity(res);
    if (res.isValid) {
      setVerificationFeedback(`Successfully validated ${tripEvents.length} events! Cryptographic hash chain is 100% intact.`);
    } else {
      setVerificationFeedback(`Integrity failure: ${res.reason}`);
    }
    setTimeout(() => setVerificationFeedback(null), 4000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleAppendEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await appStore.recordLedgerEvent({
      tripId: newEventTripId,
      actorId: 'APMC-OPERATOR-1',
      actorRole: 'APMC_OPERATOR',
      eventType: newEventType,
      location: newEventLocation,
      remarks: newEventRemarks,
      evidence: newEventEvidenceLabel
        ? {
            type: 'WEIGH_BRIDGE',
            label: newEventEvidenceLabel,
            value: newEventEvidenceValue,
          }
        : undefined,
    });
    setIsAppendModalOpen(false);
  };

  const handleQuickSeedTrip = async (tripId: string) => {
    const tr = allTrips.find((t) => t.tripId === tripId);
    if (!tr) return;
    await appStore.recordLedgerEvent({
      tripId,
      actorId: 'APMC-GATE-ENTRY',
      actorRole: 'APMC_OPERATOR',
      eventType: 'TRUCK_ARRIVED',
      location: 'Hubballi APMC Amargol Gate 1',
      remarks: `Gate check-in recorded for Truck ${tr.truckId} (${tr.truckType}). Inbound cargo verified.`,
      evidence: {
        type: 'GATE_PASS',
        label: 'FastTag OCR Barcode Verification',
        value: `Gate Pass #GP-${Math.floor(Math.random() * 89999 + 10000)}`,
      },
    });
  };

  const getEventBadgeStyle = (type: string) => {
    if (type.includes('BREACHED')) return 'bg-rose-950 text-rose-300 border-rose-700 shadow-sm shadow-rose-950';
    if (type.includes('DISPUTE')) return 'bg-amber-950 text-amber-300 border-amber-700 shadow-sm shadow-amber-950';
    if (type.includes('COMPLETED') || type.includes('CONFIRMED') || type.includes('ACCEPTED'))
      return 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-sm shadow-emerald-950';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Integrity Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Append-Only Accountability Ledger</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-amber-400 rounded-md border border-slate-700">
                    SHA-256 HASH CHAIN
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Immutable event trail. Historical events cannot be edited; corrections produce audited CORRECTION events.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs: Verify Chain & Append Event */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleVerifyChainNow}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                chainIntegrity.isValid
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-600/60 shadow-lg shadow-emerald-950/40'
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-600/60'
              }`}
            >
              {chainIntegrity.isValid ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify Hash Chain</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Integrity Anomaly</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsAppendModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-950/40 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Append Event</span>
            </button>
          </div>
        </div>

        {/* Verification Toast Feedback */}
        {verificationFeedback && (
          <div className="mt-4 p-3 bg-emerald-950/90 border border-emerald-600/80 rounded-xl text-xs text-emerald-200 flex items-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{verificationFeedback}</span>
          </div>
        )}

        {/* Controls Row: Trip Selector, Search, Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Trip Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold shrink-0">Trip Scope:</span>
            <select
              value={activeTripId}
              onChange={(e) => {
                setActiveTripId(e.target.value);
                if (e.target.value !== 'ALL_TRIPS' && onSelectTrip) {
                  onSelectTrip(e.target.value);
                }
                setNewEventTripId(
                  e.target.value === 'ALL_TRIPS' ? allTrips[0]?.tripId : e.target.value
                );
              }}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:ring-2 focus:ring-amber-400 outline-none cursor-pointer max-w-xs"
            >
              <option value="ALL_TRIPS">
                🌐 All Market Trips / Global APMC Ledger ({events.length} total events)
              </option>
              {allTrips.map((t) => {
                const count = events.filter((e) => e.tripId === t.tripId).length;
                return (
                  <option key={t.tripId} value={t.tripId}>
                    {t.tripId} ({t.truckId} &rarr; {t.returnDestination}) • {count} events
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event ID, hash, actor, remarks..."
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold mr-1 shrink-0">Filter:</span>
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'ARRIVALS', label: 'Arrivals & Gate' },
            { id: 'UNLOADING', label: 'Unloading & Avail' },
            { id: 'OFFERS', label: 'Offers & Matches' },
            { id: 'LOADING', label: 'Loading & Transit' },
            { id: 'SLA', label: 'SLA Breaches' },
            { id: 'DISPUTES', label: 'Disputes' },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setEventTypeFilter(flt.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                eventTypeFilter === flt.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Context Card for Single Trip */}
        {currentTrip && activeTripId !== 'ALL_TRIPS' && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Active Unit (Truck)</span>
              <div className="font-bold text-white mt-0.5">{currentTrip.truckId}</div>
              <div className="text-[10px] text-slate-400">{currentTrip.truckType}</div>
            </div>

            <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Driver</span>
              <div className="font-bold text-white mt-0.5">{currentTrip.driverName}</div>
              <div className="text-[10px] text-slate-400">{currentTrip.driverPhone}</div>
            </div>

            <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Active Responsibility</span>
              <div className="font-bold text-amber-300 mt-0.5">
                {currentTrip.currentResponsibleParty}
              </div>
              <div className="text-[10px] text-slate-400">{currentTrip.currentLocation}</div>
            </div>

            <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px]">Accountability Score</span>
              <div className="font-extrabold text-emerald-400 text-sm mt-0.5">
                {currentTrip.accountabilityScore}%
              </div>
              <div className="text-[10px] text-emerald-300">Audited by APMC Amargol</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Vertical Hash-Chained Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-emerald-500 before:to-slate-700">
        {tripEvents.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400 space-y-3">
            <Lock className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No ledger events found for this filter</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Select another trip or click below to initialize the entry record for {activeTripId}.
            </p>
            {activeTripId !== 'ALL_TRIPS' && (
              <button
                onClick={() => handleQuickSeedTrip(activeTripId)}
                className="mt-2 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-colors"
              >
                Log Gate Entry for {activeTripId}
              </button>
            )}
          </div>
        ) : (
          tripEvents.map((evt, idx) => (
            <div key={evt.eventId} className="relative group">
              {/* Event node dot with Lock icon */}
              <div className="absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-lg shadow-amber-950/50">
                <Lock className="w-3 h-3" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-xl transition-all text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getEventBadgeStyle(
                        evt.eventType
                      )}`}
                    >
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-slate-850 px-2 py-0.5 rounded">
                      {evt.eventId}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Trip: {evt.tripId}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(evt.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                {/* Actor & Action Description */}
                <div className="my-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Actor:</span>
                    <span className="font-semibold text-slate-200">
                      {evt.actorId} ({evt.actorRole})
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-normal">
                    {evt.remarks}
                  </p>
                </div>

                {/* Evidence Artifact if present */}
                {evt.evidence && (
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 mb-3 flex items-start gap-2 text-xs">
                    <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-300">
                        Evidence Attached: {evt.evidence.label}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                        {evt.evidence.value}
                      </div>
                    </div>
                  </div>
                )}

                {/* Hash Chain Proof Footer */}
                <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono">
                  <div className="truncate max-w-sm flex items-center gap-1.5 text-slate-400">
                    <span>prevHash:</span>
                    <span className="text-slate-300">{evt.previousEventHash.slice(0, 18)}...</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="truncate max-w-sm flex items-center gap-1.5 text-emerald-400">
                      <span>eventHash:</span>
                      <strong className="text-emerald-300">{evt.eventHash.slice(0, 24)}...</strong>
                    </div>

                    <button
                      onClick={() => setSelectedProofEvent(evt)}
                      className="px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] flex items-center gap-1 transition-colors"
                      title="Inspect Cryptographic Hash Proof"
                    >
                      <FileCode className="w-3 h-3 text-amber-400" />
                      <span>Inspect Proof</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. Cryptographic Proof Inspector Modal */}
      {selectedProofEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Cryptographic Hash Proof</h3>
              </div>
              <button
                onClick={() => setSelectedProofEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px]">Event ID & Trip</span>
                <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">
                  {selectedProofEvent.eventId} • {selectedProofEvent.tripId}
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px]">Canonical Payload Hashed (SHA-256)</span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap mt-1">
                  {createCanonicalPayload(
                    selectedProofEvent.eventId,
                    selectedProofEvent.tripId,
                    selectedProofEvent.actorId,
                    selectedProofEvent.actorRole,
                    selectedProofEvent.eventType,
                    selectedProofEvent.timestamp,
                    selectedProofEvent.location,
                    selectedProofEvent.previousEventHash,
                    selectedProofEvent.remarks
                  )}
                </pre>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Previous Event Hash</span>
                    <button
                      onClick={() => handleCopy(selectedProofEvent.previousEventHash)}
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {copiedHash === selectedProofEvent.previousEventHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 break-all mt-1">
                    {selectedProofEvent.previousEventHash}
                  </div>
                </div>

                <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-700/60">
                  <div className="text-[10px] text-emerald-400 flex items-center justify-between">
                    <span>Verified SHA-256 Event Hash</span>
                    <button
                      onClick={() => handleCopy(selectedProofEvent.eventHash)}
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {copiedHash === selectedProofEvent.eventHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-200 font-bold break-all mt-1">
                    {selectedProofEvent.eventHash}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setSelectedProofEvent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Append Event Modal */}
      {isAppendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Append Event to Ledger</h3>
              </div>
              <button
                onClick={() => setIsAppendModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAppendEventSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Trip ID</label>
                <select
                  value={newEventTripId}
                  onChange={(e) => setNewEventTripId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {allTrips.map((t) => (
                    <option key={t.tripId} value={t.tripId}>
                      {t.tripId} ({t.truckId} - {t.returnDestination})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Type</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as EventType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="TRUCK_VERIFIED">TRUCK_VERIFIED (Weighbridge / Gate)</option>
                  <option value="UNLOADING_COMPLETED">UNLOADING_COMPLETED (Empty Bed Verified)</option>
                  <option value="TRUCK_AVAILABLE">TRUCK_AVAILABLE (Released for Outbound)</option>
                  <option value="LOADING_STARTED">LOADING_STARTED (Warehouse Staging)</option>
                  <option value="LOADING_COMPLETED">LOADING_COMPLETED (Sealed for Departure)</option>
                  <option value="DEPARTED">DEPARTED (Outbound Barrier Exit)</option>
                  <option value="DELIVERY_CONFIRMED">DELIVERY_CONFIRMED (Receiver Receipt)</option>
                  <option value="SLA_BREACHED">SLA_BREACHED (Threshold Exceeded)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Remarks & Details</label>
                <textarea
                  rows={2}
                  value={newEventRemarks}
                  onChange={(e) => setNewEventRemarks(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Evidence Label</label>
                  <input
                    type="text"
                    value={newEventEvidenceLabel}
                    onChange={(e) => setNewEventEvidenceLabel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Evidence Reference</label>
                  <input
                    type="text"
                    value={newEventEvidenceValue}
                    onChange={(e) => setNewEventEvidenceValue(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAppendModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  Append Event & Hash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
