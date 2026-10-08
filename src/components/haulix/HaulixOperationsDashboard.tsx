import React, { useState } from 'react';
import {
  Compass as CompassIcon,
  Search,
  Bell,
  SlidersHorizontal,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  ChevronDown,
  Truck as TruckIcon,
  Copy,
  X,
  Clock,
  Gauge,
  Fuel,
  AlertTriangle,
  Radio,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Menu,
  HelpCircle,
  Settings,
  Grid,
  Map as MapIcon,
  Users,
  Activity,
  ListFilter,
} from 'lucide-react';
import { Trip, UserRole } from '../../types';
import { HaulixCargoLayoutView } from './HaulixCargoLayoutView';

interface HaulixDashboardProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onNavigate: (page: string) => void;
  onOpenVoice: () => void;
}

interface FleetVehicle {
  id: string;
  regNumber: string;
  model: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'OFFLINE';
  driver: string;
  route: {
    origin: string;
    destination: string;
    totalDist: string;
    completedPercent: number;
    eta: string;
    distRemaining: string;
  };
  speed: number;
  speedUnit: string;
  fuelPercent: number;
  fuelRemaining: string;
  temperature: string;
  alert?: string;
  xPercent: number; // map coordinates 0..100
  yPercent: number;
  angle: number; // orientation in degrees
  tripId: string;
}

const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'TX-4821-HX',
    regNumber: 'TX-4821-HX (KA-25-XX-1234)',
    model: 'Volvo FH16 • 2024 • V001 (Tata Prima 16T)',
    status: 'ACTIVE',
    driver: 'Manjunath Patil',
    route: {
      origin: 'Hubballi APMC Yard',
      destination: 'Bengaluru APMC (NH-48)',
      totalDist: '282.1 mi / 412 km',
      completedPercent: 72,
      eta: '~1h 8m',
      distRemaining: '72.9 mi / 117 km',
    },
    speed: 34,
    speedUnit: 'mph',
    fuelPercent: 31,
    fuelRemaining: '0.75 gal / 48 L',
    temperature: '25°F / -4°C',
    alert: 'Required Break: 30 min (After 8h of driving / APMC Weigh Inspection)',
    xPercent: 55,
    yPercent: 72,
    angle: 45,
    tripId: 'HBL-RT-2026-10482',
  },
  {
    id: 'KA-28-B-8890',
    regNumber: 'KA-28-B-8890',
    model: 'BharatBenz 10T • 2023 • V002',
    status: 'ACTIVE',
    driver: 'Basavaraj Hiremath',
    route: {
      origin: 'Hubballi APMC Deck 1',
      destination: 'Belagavi APMC (NH-48 North)',
      totalDist: '64.6 mi / 104 km',
      completedPercent: 45,
      eta: '~55m',
      distRemaining: '35.5 mi / 57 km',
    },
    speed: 48,
    speedUnit: 'mph',
    fuelPercent: 64,
    fuelRemaining: '14.2 gal / 54 L',
    temperature: '28°F / -2°C',
    xPercent: 82,
    yPercent: 65,
    angle: 135,
    tripId: 'HBL-RT-2026-10478',
  },
  {
    id: 'KA-26-E-4512',
    regNumber: 'KA-26-E-4512',
    model: 'Volvo FH16 24T Trailer • 2023 • V003',
    status: 'ACTIVE',
    driver: 'Suresh Angadi',
    route: {
      origin: 'Hubballi APMC Gate 3',
      destination: 'Pune APMC (NH-48 Corridor)',
      totalDist: '270.3 mi / 435 km',
      completedPercent: 28,
      eta: '~5h 20m',
      distRemaining: '194.6 mi / 313 km',
    },
    speed: 52,
    speedUnit: 'mph',
    fuelPercent: 78,
    fuelRemaining: '22.0 gal / 83 L',
    temperature: '30°F / -1°C',
    xPercent: 68,
    yPercent: 30,
    angle: 25,
    tripId: 'HBL-RT-2026-10475',
  },
  {
    id: 'KA-27-M-6701',
    regNumber: 'KA-27-M-6701',
    model: 'Eicher Pro 14T • 2022 • V004',
    status: 'IDLE',
    driver: 'Ramesh Kulkarni',
    route: {
      origin: 'Hubballi Amargol Gate',
      destination: 'Hyderabad APMC (NH-67)',
      totalDist: '307.5 mi / 495 km',
      completedPercent: 12,
      eta: '~7h 15m',
      distRemaining: '270.6 mi / 435 km',
    },
    speed: 0,
    speedUnit: 'mph',
    fuelPercent: 42,
    fuelRemaining: '9.5 gal / 36 L',
    temperature: '26°F / -3°C',
    alert: 'Unloading Bay Detention at Amargol Weighbridge 2',
    xPercent: 34,
    yPercent: 80,
    angle: 120,
    tripId: 'HBL-RT-2026-10470',
  },
  {
    id: 'KA-25-C-9011',
    regNumber: 'KA-25-C-9011',
    model: 'Tata Signa 16T • 2023 • V005',
    status: 'MAINTENANCE',
    driver: 'Mallikarjun G',
    route: {
      origin: 'Hubballi APMC Workshop',
      destination: 'Service Bay 3',
      totalDist: '5.0 mi / 8 km',
      completedPercent: 85,
      eta: '~10m',
      distRemaining: '0.8 mi / 1.2 km',
    },
    speed: 0,
    speedUnit: 'mph',
    fuelPercent: 18,
    fuelRemaining: '4.0 gal / 15 L',
    temperature: '32°F / 0°C',
    alert: 'Brake Pad Servicing & Diagnostic Check',
    xPercent: 20,
    yPercent: 45,
    angle: 90,
    tripId: 'HBL-RT-2026-10465',
  },
  {
    id: 'KA-25-P-3399',
    regNumber: 'KA-25-P-3399',
    model: 'Ashok Leyland 16T • 2021 • V006',
    status: 'ACTIVE',
    driver: 'Ganesh K',
    route: {
      origin: 'Amargol Warehouse Bay 4',
      destination: 'Goa Madgaon APMC (NH-748)',
      totalDist: '94.4 mi / 152 km',
      completedPercent: 60,
      eta: '~1h 30m',
      distRemaining: '37.8 mi / 60 km',
    },
    speed: 38,
    speedUnit: 'mph',
    fuelPercent: 55,
    fuelRemaining: '12.8 gal / 48 L',
    temperature: '27°F / -2°C',
    xPercent: 42,
    yPercent: 22,
    angle: 200,
    tripId: 'HBL-RT-2026-10482',
  },
];

export const HaulixOperationsDashboard: React.FC<HaulixDashboardProps> = ({
  trips,
  onSelectTrip,
  onNavigate,
  onOpenVoice,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('TX-4821-HX');
  const [viewMode, setViewMode] = useState<'MAP' | 'CARGO'>('CARGO');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showAlerts, setShowAlerts] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeVehicle =
    FLEET_VEHICLES.find((v) => v.id === selectedVehicleId) || FLEET_VEHICLES[0];

  const filteredVehicles = FLEET_VEHICLES.filter((v) => {
    if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.regNumber.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.driver.toLowerCase().includes(q) ||
        v.route.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyReg = (text: string) => {
    navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // SVG Gauge calculations
  // Speed gauge: semi-circle from -140 deg to +140 deg
  const maxSpeed = 150;
  const speedRatio = Math.min(1, Math.max(0, activeVehicle.speed / maxSpeed));
  const speedAngle = -135 + speedRatio * 270;

  // Fuel gauge: full circle percentage
  const fuelRadius = 42;
  const fuelCircumference = 2 * Math.PI * fuelRadius;
  const fuelDashoffset = fuelCircumference - (activeVehicle.fuelPercent / 100) * fuelCircumference;

  return (
    <div className="w-full bg-[#0d1117] text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 font-sans flex flex-col md:flex-row min-h-[820px]">
      {/* 1. Left Icon Rail (Haulix Signature Dock) */}
      <aside className="w-full md:w-16 bg-[#080b0f] border-b md:border-b-0 md:border-r border-slate-800/80 flex md:flex-col items-center justify-between p-3 shrink-0 z-20">
        <div className="flex md:flex-col items-center gap-3">
          {/* Brand Logo Yellow/Lime Squircle */}
          <div className="w-10 h-10 rounded-2xl bg-[#D9F99D] text-slate-950 flex items-center justify-center font-black shadow-lg shadow-[#D9F99D]/20 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-5 h-5 flex items-center justify-center font-extrabold text-lg">
              ✦
            </div>
          </div>

          <div className="flex md:flex-col items-center gap-1.5 mt-2">
            <button
              onClick={() => setViewMode('MAP')}
              className={`p-2.5 rounded-xl transition-colors ${
                viewMode === 'MAP'
                  ? 'bg-slate-200 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Overview Map & Fleet Telemetry"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Corridor Route Network"
            >
              <MapIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('CARGO')}
              className={`p-2.5 rounded-xl transition-colors ${
                viewMode === 'CARGO'
                  ? 'bg-white text-slate-950 font-black shadow-lg shadow-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="3D Truck Cargo & Package Layout (TX-9913-HX)"
            >
              <TruckIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('timeline')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Append-Only Ledger"
            >
              <FileText className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('disputes')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Arbitration Desk"
            >
              <Activity className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Rail Icons */}
        <div className="flex md:flex-col items-center gap-2">
          <button
            onClick={onOpenVoice}
            className="p-2.5 rounded-xl text-amber-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Sarvam Voice"
          >
            <Radio className="w-4 h-4 animate-pulse" />
          </button>
          <button
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Help / Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0d13]">
        {/* Top Header Row (Haulix Top Bar) */}
        <header className="px-5 py-3 border-b border-slate-800/80 bg-[#0d1117] flex flex-wrap items-center justify-between gap-3">
          {/* Status Metrics Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">Active:</span>
              <strong className="text-white font-mono">6/10</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
              <span className="text-slate-400">Drivers:</span>
              <strong className="text-white font-mono">6/8</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
              <span className="text-slate-400">Trips:</span>
              <strong className="text-white font-mono">5</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
              <span className="text-slate-400">Avg Fuel:</span>
              <strong className="text-white font-mono">56.2%</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 whitespace-nowrap">
              <span className="text-slate-400">On-time:</span>
              <strong className="text-emerald-400 font-mono">94.2%</strong>
            </div>
          </div>

          {/* Search & User Profile */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search Input with ⌘ K */}
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles, trips, or more..."
                className="bg-slate-900 border border-slate-800 rounded-full pl-9 pr-12 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-64 transition-all"
              />
              <span className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono border border-slate-700">
                ⌘ K
              </span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                LN
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-bold text-white flex items-center gap-1">
                  <span>Lisa Nguyen</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-400">Hubballi Operations Manager</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Title & Filter Controls Bar */}
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Operations Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Monday, April 8, 2026 • Real-time overview • APMC Hubballi Outbound Corridors
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher: Map vs Cargo */}
            <div className="flex items-center bg-slate-900 rounded-full p-0.5 border border-slate-800">
              <button
                onClick={() => setViewMode('CARGO')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'CARGO'
                    ? 'bg-[#D9F99D] text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⬡ 3D Cargo Layout
              </button>
              <button
                onClick={() => setViewMode('MAP')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'MAP'
                    ? 'bg-slate-200 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗺 Fleet Map
              </button>
            </div>

            {/* Date range picker pill */}
            <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white">
              <span>Last 7 days</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {viewMode === 'CARGO' ? (
          <div className="p-4 sm:p-6 overflow-y-auto">
            <HaulixCargoLayoutView onNavigate={onNavigate} onSelectTrip={onSelectTrip} />
          </div>
        ) : (
          <>
            {/* Secondary Filter Row with Count Pills and Show Toggles */}
            <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-3 bg-[#0c1016]/90 border-b border-slate-855 text-xs">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
                filterStatus === 'ALL'
                  ? 'bg-slate-200 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All <span className="ml-1 text-[11px] font-mono opacity-80">10</span>
            </button>

            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                filterStatus === 'ACTIVE'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Active <span className="ml-1 text-[11px] font-mono opacity-80">6</span>
            </button>

            <button
              onClick={() => setFilterStatus('IDLE')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                filterStatus === 'IDLE'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Idle <span className="ml-1 text-[11px] font-mono opacity-80">2</span>
            </button>

            <button
              onClick={() => setFilterStatus('MAINTENANCE')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                filterStatus === 'MAINTENANCE'
                  ? 'bg-purple-500 text-white font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Maintenance <span className="ml-1 text-[11px] font-mono opacity-80">1</span>
            </button>

            <button
              onClick={() => setFilterStatus('OFFLINE')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                filterStatus === 'OFFLINE'
                  ? 'bg-rose-500 text-white font-bold shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Offline <span className="ml-1 text-[11px] font-mono opacity-80">1</span>
            </button>

            <button className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white ml-1">
              <ListFilter className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Switches: Show routes & Show alerts */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-slate-400 font-medium text-xs">Show routes</span>
              <button
                type="button"
                onClick={() => setShowRoutes(!showRoutes)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  showRoutes ? 'bg-[#A3E635]' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.75 transition-transform ${
                    showRoutes ? 'translate-x-4.5' : 'translate-x-0.75'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-slate-400 font-medium text-xs">Show alerts</span>
              <button
                type="button"
                onClick={() => setShowAlerts(!showAlerts)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  showAlerts ? 'bg-[#A3E635]' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.75 transition-transform ${
                    showAlerts ? 'translate-x-4.5' : 'translate-x-0.75'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>

        {/* 3. Main Dark Matte Vector Map Viewport */}
        <div className="flex-1 relative overflow-hidden bg-[#0e131b] select-none min-h-[580px]">
          {/* Dark Vector Cartographic Canvas Grid */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-40">
            <defs>
              <pattern id="street-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M 0 30 L 120 30 M 0 90 L 120 90 M 30 0 L 30 120 M 90 0 L 90 120" stroke="#1f2937" strokeWidth="0.8" />
                <path d="M 0 0 L 120 120 M 120 0 L 0 120" stroke="#16202e" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#street-grid)" />

            {/* Organic curved highway vectors representing Hubballi APMC corridors */}
            <path
              d="M 50 150 Q 220 280 440 380 T 850 560"
              fill="none"
              stroke="#1e293b"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 180 80 Q 320 220 540 450 T 780 720"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 60 500 Q 350 420 580 440 T 920 320"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />

            {/* Active Luminous Route Polyline (Lime glowing line from Haulix UI) */}
            {showRoutes && (
              <g>
                <path
                  d="M 280 340 L 390 380 L 460 410 L 550 440 L 680 470"
                  fill="none"
                  stroke="#A3E635"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx="280" cy="340" r="4" fill="#A3E635" />
                <circle cx="680" cy="470" r="4" fill="#A3E635" />
              </g>
            )}
          </svg>

          {/* Interactive Vehicles Placed on Map */}
          {filteredVehicles.map((veh) => {
            const isSelected = veh.id === selectedVehicleId;
            return (
              <div
                key={veh.id}
                onClick={() => setSelectedVehicleId(veh.id)}
                style={{
                  left: `${veh.xPercent}%`,
                  top: `${veh.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-10 cursor-pointer group"
              >
                {/* Radar ripple circle if selected */}
                {isSelected && (
                  <div className="absolute -inset-10 rounded-full border border-amber-400/40 bg-amber-400/10 animate-ping pointer-events-none" />
                )}

                {/* Overhead 3D styled truck container */}
                <div
                  style={{ transform: `rotate(${veh.angle}deg)` }}
                  className={`w-14 h-7 rounded-md transition-all flex items-center justify-center p-0.5 ${
                    isSelected
                      ? 'bg-slate-200 border-2 border-amber-400 shadow-xl shadow-amber-400/30 scale-110'
                      : 'bg-slate-300 border border-slate-700 opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {/* Truck cab & trailer shape */}
                  <div className="w-full h-full bg-slate-100 rounded flex items-center justify-between px-1">
                    <div className="w-2.5 h-4 bg-slate-700 rounded-sm" />
                    <div className="flex-1 h-3 mx-0.5 bg-slate-300 rounded-sm" />
                    <div className="w-1.5 h-3 bg-slate-500 rounded-sm" />
                  </div>
                </div>

                {/* Truck tooltip label */}
                <div
                  className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md text-center transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                  }`}
                >
                  {veh.id.split(' ')[0]}
                </div>
              </div>
            );
          })}

          {/* 4. Top-Right 3D Interactive Compass Widget (Exact Haulix Feature) */}
          <div className="absolute top-5 right-5 z-20">
            <div className="w-24 h-24 rounded-full bg-[#121721] border-2 border-slate-700/80 shadow-2xl flex items-center justify-center relative select-none">
              {/* Outer dial ring ticks */}
              <div className="absolute inset-1 rounded-full border border-slate-800 flex items-center justify-center">
                <span className="absolute top-1 text-[8px] font-bold text-slate-400">N</span>
                <span className="absolute bottom-1 text-[8px] font-bold text-slate-400">S</span>
                <span className="absolute left-1.5 text-[8px] font-bold text-slate-400">W</span>
                <span className="absolute right-1.5 text-[8px] font-bold text-slate-400">E</span>
              </div>

              {/* Inner core circle */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 flex flex-col items-center justify-center shadow-inner">
                <span className="text-sm font-black text-white tracking-wider">NW</span>
                <span className="text-[9px] font-mono text-amber-400">315°</span>
              </div>

              {/* Red-white direction needle pointing NW */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: 'rotate(-45deg)' }}
              >
                <div className="w-1 h-18 bg-gradient-to-t from-transparent via-amber-500 to-rose-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* 5. Floating Right Toolbar (Haulix Map Tools) */}
          <div className="absolute right-5 bottom-16 z-20 flex flex-col gap-1.5 bg-[#121721]/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowRoutes(!showRoutes)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Toggle Route Paths"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* 6. Signature Floating Truck Telemetry Card (Haulix Exact Visuals) */}
          <div className="absolute top-5 left-5 z-20 w-96 max-w-[calc(100vw-40px)] bg-[#121721]/95 backdrop-blur-md border border-slate-700/80 rounded-3xl p-5 shadow-2xl text-white">
            {/* Top row: Truck icon, Reg ID, Active Badge, Copy, Close */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200">
                  <TruckIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-white tracking-tight">
                      {activeVehicle.regNumber}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
                      {activeVehicle.status}
                    </span>
                    <button
                      onClick={() => handleCopyReg(activeVehicle.regNumber)}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy Registration"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">{activeVehicle.model}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVehicleId('')}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Route & Progress Bar */}
            <div className="my-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">
                  {activeVehicle.route.origin} &rarr; {activeVehicle.route.destination}
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  {activeVehicle.route.totalDist}{' '}
                  <span className="font-bold text-emerald-400">
                    {activeVehicle.route.completedPercent}%
                  </span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-[#A3E635] h-full rounded-full transition-all duration-500"
                  style={{ width: `${activeVehicle.route.completedPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>
                    Est. Time to Arrival (ETA):{' '}
                    <strong className="text-white">{activeVehicle.route.eta}</strong>
                  </span>
                </div>
                <span>
                  <strong className="text-white">{activeVehicle.route.distRemaining}</strong>{' '}
                  remaining
                </span>
              </div>
            </div>

            {/* Twin Circular Telemetry Gauges (Speed & Fuel) */}
            <div className="grid grid-cols-2 gap-3 my-3">
              {/* Gauge 1: Speed Arc Gauge */}
              <div className="bg-[#0b0e14] p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative">
                <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Speed</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    High
                  </span>
                </div>

                {/* SVG Semi-Circle Speedometer */}
                <div className="relative w-28 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 100 65" className="w-full h-full overflow-visible">
                    {/* Background gauge arc */}
                    <path
                      d="M 15 55 A 40 40 0 1 1 85 55"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Active green zone */}
                    <path
                      d="M 15 55 A 40 40 0 0 1 45 18"
                      fill="none"
                      stroke="#4ADE80"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Ticks */}
                    <text x="12" y="64" fill="#64748b" fontSize="6">0</text>
                    <text x="47" y="12" fill="#64748b" fontSize="6">75</text>
                    <text x="82" y="64" fill="#64748b" fontSize="6">150</text>

                    {/* Speed needle */}
                    <g transform={`rotate(${speedAngle} 50 55)`}>
                      <line x1="50" y1="55" x2="50" y2="20" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="50" cy="55" r="3.5" fill="#FACC15" />
                    </g>
                  </svg>

                  {/* Speed reading readout */}
                  <div className="absolute bottom-0 text-center">
                    <span className="text-base font-black text-white">
                      {activeVehicle.speed}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {activeVehicle.speedUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gauge 2: Fuel Level Circle Gauge */}
              <div className="bg-[#0b0e14] p-3 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative">
                <div className="w-full flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Fuel level</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    {activeVehicle.fuelPercent}%
                  </span>
                </div>

                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r={fuelRadius}
                      stroke="#1e293b"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r={fuelRadius}
                      stroke="#F97316"
                      strokeWidth="5"
                      strokeDasharray={fuelCircumference}
                      strokeDashoffset={fuelDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500"
                    />
                  </svg>

                  {/* Center info */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <Fuel className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                    <span className="text-xs font-black text-white leading-tight">
                      {activeVehicle.fuelRemaining.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {activeVehicle.temperature}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert banner if exists (Required Break / Detention) */}
            {showAlerts && activeVehicle.alert && (
              <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-2.5 text-xs text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{activeVehicle.alert}</span>
              </div>
            )}

            {/* Quick action buttons linked to APMC ReturnLoop */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectTrip(activeVehicle.tripId);
                  onNavigate('timeline');
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Trip Ledger</span>
              </button>

              <button
                onClick={() => {
                  onSelectTrip(activeVehicle.tripId);
                  onNavigate('driver');
                }}
                className="px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md"
              >
                <TruckIcon className="w-3.5 h-3.5 text-slate-950" />
                <span>Driver Journey</span>
              </button>
            </div>
          </div>

          {/* Map bottom status footer */}
          <div className="absolute bottom-3 left-6 right-6 z-10 flex items-center justify-between text-[11px] text-slate-400 select-none">
            <span className="hidden sm:inline">
              Space + Drag to pan • Scroll to zoom • Click truck to inspect telemetry
            </span>
            <span className="ml-auto font-mono text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Map updates every 30 seconds • Live Telemetry
            </span>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};
