import {
  DisputeRecord,
  EventType,
  Language,
  LedgerEvent,
  Load,
  Trip,
  TruckItem,
  UserRole,
} from '../types';
import {
  INITIAL_DISPUTES,
  INITIAL_LEDGER_EVENTS,
  INITIAL_LOADS,
  INITIAL_TRIPS,
  INITIAL_TRUCKS,
} from '../data/seedData';
import { createLedgerEvent } from './ledgerService';

const STORAGE_KEY = 'apmc_returnloop_hubballi_state_v2';

export interface AppState {
  currentRole: UserRole;
  language: Language;
  userProfile: { name: string; phone: string; role: UserRole } | null;
  trips: Trip[];
  loads: Load[];
  trucks: TruckItem[];
  events: LedgerEvent[];
  disputes: DisputeRecord[];
  isOffline: boolean;
  offlineQueue: any[];
  demoStep: number; // 0 = idle, 1..10 = guided demo active
  demoScenarioLogs: string[];
}

const getInitialState = (): AppState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const existingIds = new Set((parsed.events || []).map((e: any) => e.eventId));
        const mergedEvents = [
          ...(parsed.events || []),
          ...INITIAL_LEDGER_EVENTS.filter((e) => !existingIds.has(e.eventId)),
        ];
        return {
          ...parsed,
          userProfile: parsed.userProfile || null,
          events: mergedEvents.length > 0 ? mergedEvents : INITIAL_LEDGER_EVENTS,
        };
      } catch (e) {
        // fallback
      }
    }
  }

  return {
    currentRole: 'DRIVER',
    language: 'en',
    userProfile: null,
    trips: INITIAL_TRIPS,
    loads: INITIAL_LOADS,
    trucks: INITIAL_TRUCKS,
    events: INITIAL_LEDGER_EVENTS,
    disputes: INITIAL_DISPUTES,
    isOffline: false,
    offlineQueue: [],
    demoStep: 0,
    demoScenarioLogs: [],
  };
};

type Listener = () => void;

class AppStore {
  private state: AppState = getInitialState();
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setOffline(false);
        this.flushOfflineQueue();
      });
      window.addEventListener('offline', () => {
        this.setOffline(true);
      });
    }
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        // storage overflow fallback
      }
    }
    this.listeners.forEach((l) => l());
  }

  public setRole(role: UserRole) {
    this.state.currentRole = role;
    if (this.state.userProfile) {
      this.state.userProfile.role = role;
    }
    this.notify();
  }

  public setUserProfile(profile: { name: string; phone: string; role: UserRole }) {
    this.state.userProfile = profile;
    this.state.currentRole = profile.role;
    this.notify();
  }

  public logout() {
    this.state.userProfile = null;
    this.notify();
  }

  public setLanguage(lang: Language) {
    this.state.language = lang;
    this.notify();
  }

  public setOffline(isOffline: boolean) {
    this.state.isOffline = isOffline;
    this.notify();
  }

  public async recordLedgerEvent(params: {
    tripId: string;
    actorId: string;
    actorRole: UserRole | 'SYSTEM' | 'APMC_GATE';
    eventType: EventType;
    location: string;
    remarks: string;
    evidence?: LedgerEvent['evidence'];
    isCorrection?: boolean;
  }): Promise<LedgerEvent> {
    // Get last event for this trip or globally to preserve append-only hash chain
    const tripEvents = this.state.events.filter((e) => e.tripId === params.tripId);
    const lastEvent = tripEvents.length > 0 ? tripEvents[tripEvents.length - 1] : undefined;
    const prevHash = lastEvent ? lastEvent.eventHash : undefined;

    const newEvent = await createLedgerEvent({
      ...params,
      previousEventHash: prevHash,
    });

    if (this.state.isOffline) {
      this.state.offlineQueue.push(newEvent);
    }

    this.state.events = [...this.state.events, newEvent];
    this.notify();
    return newEvent;
  }

  public async updateTripStatus(
    tripId: string,
    status: Trip['status'],
    details?: Partial<Trip>,
    ledgerRemark?: string
  ) {
    const trip = this.state.trips.find((t) => t.tripId === tripId);
    if (!trip) return;

    this.state.trips = this.state.trips.map((t) => {
      if (t.tripId === tripId) {
        return {
          ...t,
          status,
          ...details,
        };
      }
      return t;
    });

    // Append to ledger
    let eventType: EventType = 'TRUCK_AVAILABLE';
    if (status === 'CHECKED_IN') eventType = 'TRUCK_VERIFIED';
    else if (status === 'UNLOADING') eventType = 'UNLOADING_STARTED';
    else if (status === 'UNLOADED') eventType = 'UNLOADING_COMPLETED';
    else if (status === 'OFFER_ACCEPTED') eventType = 'OFFER_ACCEPTED';
    else if (status === 'LOADING_STARTED') eventType = 'LOADING_STARTED';
    else if (status === 'LOADING_COMPLETED') eventType = 'LOADING_COMPLETED';
    else if (status === 'DEPARTED') eventType = 'DEPARTED';
    else if (status === 'DELIVERED') eventType = 'DELIVERY_CONFIRMED';
    else if (status === 'TRIP_CLOSED') eventType = 'PAYMENT_CONFIRMED';
    else if (status === 'SLA_BREACHED') eventType = 'SLA_BREACHED';

    await this.recordLedgerEvent({
      tripId,
      actorId: trip.driverId || 'SYS-HUBBALLI',
      actorRole: this.state.currentRole,
      eventType,
      location: trip.currentLocation || 'Hubballi APMC Yard',
      remarks: ledgerRemark || `Status progressed to ${status}. Responsibility: ${details?.currentResponsibleParty || trip.currentResponsibleParty}`,
    });

    this.notify();
  }

  public async acceptLoadForTrip(tripId: string, loadId: string) {
    const trip = this.state.trips.find((t) => t.tripId === tripId);
    const load = this.state.loads.find((l) => l.loadId === loadId);
    if (!trip || !load) return;

    load.status = 'BOOKED';
    this.state.trips = this.state.trips.map((t) => {
      if (t.tripId === tripId) {
        return {
          ...t,
          status: 'OFFER_ACCEPTED',
          matchedLoadId: load.loadId,
          agreedPrice: load.offeredPrice,
          currentResponsibleParty: 'LOAD_OWNER',
          currentSlaDeadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        };
      }
      return t;
    });

    await this.recordLedgerEvent({
      tripId,
      actorId: trip.driverId,
      actorRole: 'DRIVER',
      eventType: 'OFFER_ACCEPTED',
      location: 'Hubballi APMC Waiting Deck',
      remarks: `Driver ${trip.driverName} accepted verified return load ${load.loadId} (${load.commodity} to ${load.destination}) at ₹${load.offeredPrice.toLocaleString('en-IN')}. Loading slot assigned to ${load.ownerName}.`,
      evidence: {
        type: 'DIGITAL_SIGNATURE',
        label: 'Driver Biometric / Digital Consent',
        value: `Signed by ${trip.driverName} on Mobile terminal #DRV-${trip.driverId}`,
      },
    });

    this.notify();
  }

  public async addNewLoad(newLoad: Load) {
    this.state.loads = [newLoad, ...this.state.loads];
    await this.recordLedgerEvent({
      tripId: `LOAD-REG-${newLoad.loadId}`,
      actorId: newLoad.ownerId,
      actorRole: newLoad.ownerType === 'BROKER' ? 'BROKER' : 'LOAD_OWNER',
      eventType: 'LOAD_CREATED',
      location: newLoad.origin,
      remarks: `New return load posted: ${newLoad.commodity} (${newLoad.weightTons}T) to ${newLoad.destination} at ₹${newLoad.offeredPrice.toLocaleString('en-IN')}. ${newLoad.brokerCommission ? `Declared broker commission: ₹${newLoad.brokerCommission}.` : 'Direct owner posting.'}`,
      evidence: {
        type: 'E_WAY_BILL',
        label: 'Verification Reference',
        value: newLoad.verificationBadge,
      },
    });
    this.notify();
  }

  public async addNewTruck(truck: TruckItem) {
    this.state.trucks = [truck, ...this.state.trucks];
    this.notify();
  }

  public async resolveDispute(disputeId: string, resolutionNotes: string, officerName: string) {
    const disp = this.state.disputes.find((d) => d.disputeId === disputeId);
    if (!disp) return;

    this.state.disputes = this.state.disputes.map((d) => {
      if (d.disputeId === disputeId) {
        return {
          ...d,
          status: 'RESOLVED',
          resolutionNotes,
          resolvedAt: new Date().toISOString(),
          resolvedBy: officerName,
        };
      }
      return d;
    });

    await this.recordLedgerEvent({
      tripId: disp.tripId,
      actorId: officerName,
      actorRole: 'APMC_ADMIN',
      eventType: 'DISPUTE_RESOLVED',
      location: 'Hubballi APMC Dispute Resolution Desk',
      remarks: `Dispute ${disputeId} officially resolved: ${resolutionNotes}`,
      evidence: {
        type: 'GATE_PASS',
        label: 'Arbitration Order',
        value: `Signed by APMC Officer ${officerName}`,
      },
    });

    this.notify();
  }

  public async triggerSlaBreach(tripId: string, reason: string) {
    const trip = this.state.trips.find((t) => t.tripId === tripId);
    if (!trip) return;

    this.state.trips = this.state.trips.map((t) => {
      if (t.tripId === tripId) {
        return {
          ...t,
          isSlaBreached: true,
          slaBreachReason: reason,
        };
      }
      return t;
    });

    await this.recordLedgerEvent({
      tripId,
      actorId: 'SLA-MONITOR-ENGINE',
      actorRole: 'SYSTEM',
      eventType: 'SLA_BREACHED',
      location: trip.currentLocation,
      remarks: `SLA Deadline Breached: ${reason}. Escalated to APMC Supervisor and logged in Government Command Centre.`,
    });

    this.notify();
  }

  public setDemoStep(step: number, logMsg?: string) {
    this.state.demoStep = step;
    if (logMsg) {
      this.state.demoScenarioLogs = [
        ...this.state.demoScenarioLogs,
        `[${new Date().toLocaleTimeString()}] Step ${step}: ${logMsg}`,
      ];
    }
    this.notify();
  }

  public resetToDemoState() {
    this.state = {
      currentRole: 'DRIVER',
      language: 'en',
      userProfile: null,
      trips: INITIAL_TRIPS,
      loads: INITIAL_LOADS,
      trucks: INITIAL_TRUCKS,
      events: INITIAL_LEDGER_EVENTS,
      disputes: INITIAL_DISPUTES,
      isOffline: false,
      offlineQueue: [],
      demoStep: 0,
      demoScenarioLogs: [],
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.notify();
  }

  public flushOfflineQueue() {
    if (this.state.offlineQueue.length > 0) {
      this.state.offlineQueue = [];
      this.notify();
    }
  }
}

export const appStore = new AppStore();
