import React, { useState } from 'react';
import {
  Building2,
  QrCode,
  Truck,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
import { Trip, UserRole } from '../../types';
import { appStore } from '../../services/store';

interface GateCheckinProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onNavigate: (page: string) => void;
}

export const GateCheckin: React.FC<GateCheckinProps> = ({
  trips,
  onSelectTrip,
  onNavigate,
}) => {
  const [truckNumber, setTruckNumber] = useState('KA-25-XX-1234');
  const [tareWeight, setTareWeight] = useState(7420);
  const [grossWeight, setGrossWeight] = useState(23420);
  const [commodityIn, setCommodityIn] = useState('Sweet Corn (Inbound)');
  const [assignedBay, setAssignedBay] = useState('Bay 7 (Amargol Yard)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTripId, setSuccessTripId] = useState<string | null>(null);

  const handleSimulateQRScan = () => {
    setTruckNumber('KA-25-XX-1234');
    setGrossWeight(23420);
    setTareWeight(7420);
  };

  const handleCreateCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const tripId = `HBL-RT-2026-${Math.floor(Math.random() * 90000 + 10000)}`;

    const newTrip: Trip = {
      tripId,
      truckId: truckNumber,
      driverId: 'DRV-001',
      driverName: 'Manjunath Patil',
      driverPhone: '+91 98450 12345',
      truckType: '16T Multi-Axle Covered',
      apmcId: 'APMC-HBL-AMG',
      apmcName: 'Amargol Hubballi APMC',
      arrivalTime: new Date().toISOString(),
      returnDestination: 'Bengaluru',
      capacityTons: 16,
      status: 'CHECKED_IN',
      accountabilityScore: 98,
      currentResponsibleParty: 'APMC',
      currentLocation: `Amargol Gate 1 - ${assignedBay}`,
      tollPassVerified: true,
      eWayBillNo: `EWB-${Math.floor(Math.random() * 899999 + 100000)}`,
    };

    await appStore.recordLedgerEvent({
      tripId,
      actorId: 'APMC-GATE-OFFICER-1',
      actorRole: 'APMC_OPERATOR',
      eventType: 'TRUCK_ARRIVED',
      location: 'Hubballi APMC Amargol Gate 1',
      remarks: `Truck ${truckNumber} passed gate barrier. Inbound gross: ${grossWeight} kg, tare: ${tareWeight} kg. Assigned to ${assignedBay} for unloading.`,
      evidence: {
        type: 'GATE_PASS',
        label: 'FastTag OCR & Weighbridge Gate Pass',
        value: `E-Way Bill ${newTrip.eWayBillNo}`,
      },
    });

    setIsProcessing(false);
    setSuccessTripId(tripId);
  };

  const handleAdvanceToAvailable = async (tripId: string) => {
    await appStore.updateTripStatus(
      tripId,
      'AVAILABLE',
      {
        unloadingCompleted: new Date().toISOString(),
        availableFrom: new Date().toISOString(),
        currentResponsibleParty: 'DRIVER',
        status: 'AVAILABLE',
      },
      'Yard Marshal confirmed bed empty and cleaned. Released for outbound return load matching.'
    );
    alert('Truck released and marked AVAILABLE for return load matching!');
    onSelectTrip(tripId);
    onNavigate('driver');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Gate Officer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Inbound Gate & Yard Control
              </h1>
              <p className="text-xs text-slate-400">
                Drive Anna • FastTag OCR & Weighbridge Verification
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateQRScan}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Simulate FastTag / QR Scan</span>
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
              title="Close Module"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Check-in Form */}
        <form onSubmit={handleCreateCheckin} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Truck Registration Number
              </label>
              <input
                type="text"
                value={truckNumber}
                onChange={(e) => setTruckNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-amber-300 font-mono font-bold focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gross Inbound Weight (KG)
              </label>
              <input
                type="number"
                value={grossWeight}
                onChange={(e) => setGrossWeight(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tare Weight (KG)
              </label>
              <input
                type="number"
                value={tareWeight}
                onChange={(e) => setTareWeight(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Inbound Cargo Details
              </label>
              <input
                type="text"
                value={commodityIn}
                onChange={(e) => setCommodityIn(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Assigned Unloading Bay
              </label>
              <input
                type="text"
                value={assignedBay}
                onChange={(e) => setAssignedBay(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold rounded-xl text-sm shadow-xl transition-transform active:scale-95"
          >
            {isProcessing ? 'Verifying...' : 'Authorize Gate Entry & Generate APMC Trip ID'}
          </button>
        </form>

        {/* Success Notice */}
        {successTripId && (
          <div className="mt-4 p-4 bg-emerald-950/70 border border-emerald-600/60 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>
                Trip ID <strong className="font-mono text-amber-300">{successTripId}</strong> created and recorded into ledger!
              </span>
            </div>
            <button
              onClick={() => handleAdvanceToAvailable(successTripId)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
            >
              Confirm Unloading & Release Truck
            </button>
          </div>
        )}
      </div>

      {/* Yard Trucks Ready for Unloading / Release */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <h3 className="font-bold text-base text-white mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-400" />
          <span>Active Inbound Yard Trucks (Pending Return Release)</span>
        </h3>

        <div className="space-y-3">
          {trips.slice(0, 3).map((tr) => (
            <div
              key={tr.tripId}
              className="bg-slate-850 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{tr.truckId}</span>
                  <span className="font-mono text-[10px] text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {tr.tripId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                    Status: {tr.status}
                  </span>
                </div>
                <div className="text-slate-400 mt-1">
                  Driver: {tr.driverName} • Capacity: {tr.capacityTons}T • Current: {tr.currentLocation}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {tr.status === 'UNLOADING' || tr.status === 'CHECKED_IN' ? (
                  <button
                    onClick={() => handleAdvanceToAvailable(tr.tripId)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                  >
                    <span>Complete Unload & Release</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSelectTrip(tr.tripId);
                      onNavigate('timeline');
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold"
                  >
                    Inspect Ledger Trail
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
