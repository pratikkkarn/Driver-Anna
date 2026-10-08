export type UserRole =
  | 'DRIVER'
  | 'TRUCK_OPERATOR'
  | 'LOAD_OWNER'
  | 'BROKER'
  | 'APMC_OPERATOR'
  | 'APMC_ADMIN'
  | 'GOVERNMENT_VIEWER';

export type Language = 'en' | 'kn';

export type TripStatus =
  | 'ARRIVED'
  | 'CHECKED_IN'
  | 'UNLOADING'
  | 'UNLOADED'
  | 'AVAILABLE'
  | 'MATCHING'
  | 'OFFER_SENT'
  | 'OFFER_ACCEPTED'
  | 'LOADING_STARTED'
  | 'LOADING_COMPLETED'
  | 'DEPARTED'
  | 'DELIVERED'
  | 'TRIP_CLOSED'
  | 'SLA_BREACHED'
  | 'DISPUTED';

export type EventType =
  | 'TRUCK_ARRIVED'
  | 'TRUCK_VERIFIED'
  | 'UNLOADING_STARTED'
  | 'UNLOADING_COMPLETED'
  | 'TRUCK_AVAILABLE'
  | 'LOAD_CREATED'
  | 'LOAD_VERIFIED'
  | 'MATCH_CREATED'
  | 'OFFER_SENT'
  | 'OFFER_ACCEPTED'
  | 'PRICE_CONFIRMED'
  | 'LOADING_STARTED'
  | 'LOADING_COMPLETED'
  | 'DEPARTED'
  | 'DELIVERY_STARTED'
  | 'DELIVERY_CONFIRMED'
  | 'PAYMENT_CONFIRMED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  | 'SLA_BREACHED'
  | 'CANCELLATION'
  | 'CORRECTION';

export interface LedgerEvent {
  eventId: string;
  tripId: string;
  actorId: string;
  actorRole: UserRole | 'SYSTEM' | 'APMC_GATE';
  eventType: EventType;
  timestamp: string;
  location: string;
  evidence?: {
    type: 'GATE_PASS' | 'WEIGH_BRIDGE' | 'PHOTO' | 'E_WAY_BILL' | 'VOICE_LOG' | 'DIGITAL_SIGNATURE';
    label: string;
    value: string;
  };
  remarks: string;
  previousEventHash: string;
  eventHash: string;
  isCorrection?: boolean;
}

export interface Trip {
  tripId: string; // e.g. HBL-RT-2026-10482
  truckId: string; // e.g. KA-25-XX-1234
  driverId: string;
  driverName: string;
  driverPhone: string;
  truckType: string; // e.g. "16T Multi-Axle", "10T Heavy", "24T Trailer"
  apmcId: string; // e.g. "APMC-HBL-AMG"
  apmcName: string; // "Amargol Hubballi APMC"
  arrivalTime: string;
  unloadingCompleted?: string;
  availableFrom?: string;
  returnDestination: string; // e.g. "Bengaluru"
  capacityTons: number; // e.g. 16
  status: TripStatus;
  matchScore?: number;
  matchedLoadId?: string;
  accountabilityScore: number;
  currentResponsibleParty: 'APMC' | 'LOAD_OWNER' | 'DRIVER' | 'RECEIVER' | 'WAREHOUSE';
  currentSlaDeadline?: string;
  isSlaBreached?: boolean;
  slaBreachReason?: string;
  agreedPrice?: number;
  suggestedPriceRange?: { min: number; max: number };
  advancePaid?: number;
  currentLocation: string;
  tollPassVerified?: boolean;
  eWayBillNo?: string;
}

export interface Load {
  loadId: string; // e.g. LOAD-00821
  ownerId: string;
  ownerName: string;
  ownerType: 'LOAD_OWNER' | 'BROKER' | 'FARMER';
  brokerCommission?: number;
  brokerScore?: number;
  origin: string; // "Hubballi APMC Yard 3"
  destination: string; // "Bengaluru APMC Yeshwanthpur"
  distanceKm: number;
  commodity: string; // e.g. "Onion", "Dry Chilli", "Cotton"
  weightTons: number;
  loadingWindow: string; // "16:00 - 18:00"
  offeredPrice: number;
  suggestedMin: number;
  suggestedMax: number;
  status: 'OPEN' | 'MATCHED' | 'BOOKED' | 'CONFIRMED' | 'LOADING' | 'IN_TRANSIT' | 'DELIVERED';
  verified: boolean;
  verificationBadge: string;
  contactPhone: string;
  loadingBay?: string;
  createdAt: string;
}

export interface MatchScoreResult {
  load: Load;
  score: number;
  routeFit: string;
  capacityFit: string;
  timeFit: string;
  priceComparison: string;
  emptyKmExpected: number;
  explanation: string;
  breakdown: {
    route: number; // max 30
    capacity: number; // max 20
    time: number; // max 15
    price: number; // max 15
    emptyDistance: number; // max 10
    reliability: number; // max 10
  };
}

export interface PriceBreakdown {
  suggestedMin: number;
  suggestedMax: number;
  offeredPrice: number;
  difference: number;
  fuelCost: number;
  tolls: number;
  driverAllowance: number;
  vehicleCost: number;
  estimatedMargin: number;
  brokerCommission?: number;
  mandatoryLabel: string;
}

export interface SlaRule {
  stage: string;
  responsibleParty: string;
  demoSlaMinutes: number;
  escalatesTo: string;
}

export interface DisputeRecord {
  disputeId: string;
  tripId: string;
  loadId: string;
  raisedBy: string;
  actorRole: UserRole;
  againstParty: string;
  claimedAmount: number;
  paidAmount: number;
  difference: number;
  reason: string;
  originalEvidence: string;
  status: 'OPEN' | 'RESOLVED';
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ChatMessage {
  id: string;
  tripId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isAudio?: boolean;
  audioDuration?: string;
  language?: Language;
}

export interface TruckItem {
  id: string;
  regNumber: string;
  capacityTons: number;
  truckType: string;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  status: 'UNLOADING' | 'AVAILABLE' | 'EN_ROUTE' | 'MAINTENANCE';
  preferredDestinations: string[];
  reliabilityScore: number;
}
