import React from 'react';
import {
  Play,
  RotateCcw,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  Truck,
  FileText,
  Radio,
  Clock,
  X,
} from 'lucide-react';
import { appStore } from '../../services/store';
import { Language, UserRole } from '../../types';

interface GuidedDemoControllerProps {
  currentStep: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  language: Language;
}

export const DEMO_STEPS = [
  {
    step: 1,
    title: 'APMC Gate Arrival & Check-In',
    desc: 'Truck KA-25-XX-1234 (16T Multi-Axle) arrives at Hubballi APMC Amargol Gate. Weighbridge captures gross tare and assigns Trip ID HBL-RT-2026-10482.',
    targetPage: 'apmc-gate',
    targetRole: 'APMC_OPERATOR' as UserRole,
  },
  {
    step: 2,
    title: 'Inbound Unloading & Release',
    desc: 'Sweet corn lot unloaded at Bay 7. Yard marshal verifies empty bed. Truck marked AVAILABLE for outbound return trip.',
    targetPage: 'apmc-gate',
    targetRole: 'APMC_OPERATOR' as UserRole,
  },
  {
    step: 3,
    title: 'Return Load Discovery',
    desc: 'Deterministic engine scans 7+ verified APMC consignments for return journey back toward Bengaluru corridor.',
    targetPage: 'driver',
    targetRole: 'DRIVER' as UserRole,
  },
  {
    step: 4,
    title: 'Deterministic Match: 92/100',
    desc: 'System ranks Karnataka Agri-Exports 14T Onion consignment at 92/100 score with full explainability (route, capacity, time, reliability).',
    targetPage: 'driver',
    targetRole: 'DRIVER' as UserRole,
  },
  {
    step: 5,
    title: 'Transparent Price Breakdown',
    desc: 'Offer of ₹28,000 shown against reference range (₹26,500 - ₹29,500) with operating costs: Fuel, Tolls, Allowance, Margin.',
    targetPage: 'driver',
    targetRole: 'DRIVER' as UserRole,
  },
  {
    step: 6,
    title: 'Driver Digital Acceptance',
    desc: 'Driver confirms offer digitally. Append-only ledger logs OFFER_ACCEPTED with cryptographic SHA-256 hash.',
    targetPage: 'driver',
    targetRole: 'DRIVER' as UserRole,
  },
  {
    step: 7,
    title: 'Loading at Warehouse B',
    desc: 'Responsibility shifts to Warehouse B (Amargol Gate 4). Loading timer starts with 60-minute SLA.',
    targetPage: 'timeline',
    targetRole: 'LOAD_OWNER' as UserRole,
  },
  {
    step: 8,
    title: 'Command Centre Monitoring',
    desc: 'Hubballi APMC Logistics Command Centre displays live active responsibility and return corridor volume.',
    targetPage: 'command-centre',
    targetRole: 'GOVERNMENT_VIEWER' as UserRole,
  },
  {
    step: 9,
    title: 'Artificial Delay & SLA Breach',
    desc: 'Warehouse loading exceeds 60m threshold. SLA_BREACHED event is created and escalated to APMC Supervisor.',
    targetPage: 'command-centre',
    targetRole: 'GOVERNMENT_VIEWER' as UserRole,
  },
  {
    step: 10,
    title: 'Departure, Delivery & Trip Closed',
    desc: 'Loading finalized, truck departs on NH-48, delivery verified at Bengaluru APMC, payment confirmed, accountability score updated to 96%.',
    targetPage: 'timeline',
    targetRole: 'GOVERNMENT_VIEWER' as UserRole,
  },
];

export const GuidedDemoController: React.FC<GuidedDemoControllerProps> = ({
  currentStep,
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen && currentStep === 0) return null;

  const currentStepData = DEMO_STEPS[(currentStep || 1) - 1];

  const handleExecuteStep = async (stepNum: number) => {
    appStore.setDemoStep(stepNum, DEMO_STEPS[stepNum - 1].title);
    const target = DEMO_STEPS[stepNum - 1];
    appStore.setRole(target.targetRole);
    onNavigate(target.targetPage);

    // Business side-effects for each step
    const targetTripId = 'HBL-RT-2026-10482';
    if (stepNum === 1) {
      await appStore.updateTripStatus(targetTripId, 'CHECKED_IN', {
        currentResponsibleParty: 'APMC',
      }, 'Demo Step 1: Gate check-in verified via FastTag');
    } else if (stepNum === 2) {
      await appStore.updateTripStatus(targetTripId, 'AVAILABLE', {
        currentResponsibleParty: 'DRIVER',
        availableFrom: '2026-10-07T15:45:00+05:30',
      }, 'Demo Step 2: Unloading confirmed. Bed cleaned and certified ready for outbound load');
    } else if (stepNum === 6) {
      await appStore.acceptLoadForTrip(targetTripId, 'LOAD-00821');
    } else if (stepNum === 7) {
      await appStore.updateTripStatus(targetTripId, 'LOADING_STARTED', {
        currentResponsibleParty: 'LOAD_OWNER',
        currentLocation: 'Amargol Warehouse Bay 4',
      }, 'Demo Step 7: Warehouse Bay 4 commenced onion crate staging');
    } else if (stepNum === 9) {
      await appStore.triggerSlaBreach(
        targetTripId,
        'Warehouse B loading delayed by 45 minutes beyond 60m SLA threshold'
      );
    } else if (stepNum === 10) {
      await appStore.updateTripStatus(targetTripId, 'TRIP_CLOSED', {
        status: 'TRIP_CLOSED',
        currentResponsibleParty: 'RECEIVER',
        currentLocation: 'Yeshwanthpur APMC Yard, Bengaluru',
        accountabilityScore: 96,
      }, 'Demo Step 10: Full delivery confirmed. Final payment released. Trip successfully closed.');
    }
  };

  const handleNext = () => {
    const next = (currentStep || 0) + 1;
    if (next <= 10) {
      handleExecuteStep(next);
    } else {
      appStore.setDemoStep(0);
    }
  };

  const handleReset = () => {
    appStore.resetToDemoState();
    onNavigate('home');
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-slate-900/95 border-2 border-amber-500 rounded-2xl shadow-2xl p-4 text-white backdrop-blur-md animate-slideUp">
      {/* Step Tracker Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">
            {currentStep || 1}/10
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm text-amber-400">
                APMC ReturnLoop Guided 10-Step Scenario
              </span>
              <span className="px-1.5 py-0.5 text-[9px] bg-emerald-950 text-emerald-300 rounded border border-emerald-700">
                Truck KA-25-XX-1234
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              {currentStepData.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Reset to default seed state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-850"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Content & Action */}
      <div className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          {currentStepData.desc}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          {currentStep > 1 && (
            <button
              onClick={() => handleExecuteStep(currentStep - 1)}
              className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-750 text-white rounded-xl font-medium"
            >
              Prev
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-950/50 transition-transform active:scale-95"
          >
            <span>{currentStep === 10 ? 'Finish Scenario' : `Next: Step ${currentStep + 1}`}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Pill Bar (Clickable steps) */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {DEMO_STEPS.map((s) => (
          <button
            key={s.step}
            onClick={() => handleExecuteStep(s.step)}
            className={`flex-1 min-w-[28px] h-6 rounded text-[10px] font-bold flex items-center justify-center transition-all ${
              s.step === currentStep
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 font-black'
                : s.step < currentStep
                ? 'bg-emerald-800 text-emerald-200'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
            }`}
            title={`Step ${s.step}: ${s.title}`}
          >
            {s.step}
          </button>
        ))}
      </div>
    </div>
  );
};
