import React, { useState } from 'react';
import {
  Wrench,
  PowerOff,
  Play,
  MoreHorizontal,
  RotateCcw,
  Plus,
  Minus,
  Filter,
  Package,
  Layers,
  Copy,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  MapPin,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  Clock,
  Weight,
  Box,
  Eye,
  Camera,
  Maximize2,
  Sparkles,
  Barcode,
  Search,
  Check,
  Zap,
} from 'lucide-react';

export interface CargoItem {
  id: string;
  title: string;
  client: string;
  loadingOrder: number;
  destination: string;
  weightLbs: number;
  weightTons: number;
  volumeCuFt: number;
  priority: 'Critical' | 'High' | 'Normal' | 'Low';
  riskScorePercent: number;
  isFragile: boolean;
  fragileNote?: string;
  shelfRow: number; // 0 (top), 1 (mid), 2 (bottom)
  shelfCol: number; // 0, 1, 2, 3
  category: 'Electronics' | 'Agri-Fresh' | 'Medical' | 'Machinery' | 'Textile' | 'Chemicals';
}

const INITIAL_CARGO_ITEMS: CargoItem[] = [
  {
    id: 'SHP-8841',
    title: 'Fiber Optic Cables (x200 Spools)',
    client: 'K-Net Telecommunications Ltd',
    loadingOrder: 1,
    destination: 'Bengaluru Tech Park Hub (NH-48)',
    weightLbs: 1800,
    weightTons: 0.82,
    volumeCuFt: 120,
    priority: 'Critical',
    riskScorePercent: 22,
    isFragile: true,
    fragileNote: 'High-precision optical glass core. Absolute zero shock tolerance.',
    shelfRow: 0,
    shelfCol: 0,
    category: 'Electronics',
  },
  {
    id: 'SHP-4574',
    title: '48" Industrial LED Displays (x24)',
    client: 'TechFlow Agri-Electronics Inc.',
    loadingOrder: 4,
    destination: 'Memphis, TN / Bengaluru APMC Gateway',
    weightLbs: 4200,
    weightTons: 1.9,
    volumeCuFt: 320,
    priority: 'High',
    riskScorePercent: 15,
    isFragile: true,
    fragileNote: 'Handle with care. Shock-absorbing pneumatic packaging required.',
    shelfRow: 0,
    shelfCol: 1,
    category: 'Electronics',
  },
  {
    id: 'SHP-9856',
    title: 'Certified Hybrid Sunflower Seeds',
    client: 'Karnataka Seed Development Corp',
    loadingOrder: 2,
    destination: 'Davanagere Distribution Deck',
    weightLbs: 3400,
    weightTons: 1.54,
    volumeCuFt: 280,
    priority: 'Normal',
    riskScorePercent: 8,
    isFragile: false,
    shelfRow: 0,
    shelfCol: 2,
    category: 'Agri-Fresh',
  },
  {
    id: 'SHP-2364',
    title: 'Drip Micro-Irrigation Pipes (x50)',
    client: 'Malaprabha Agro Supplies Co.',
    loadingOrder: 3,
    destination: 'Tumakuru Junction Logistics Hub',
    weightLbs: 2100,
    weightTons: 0.95,
    volumeCuFt: 210,
    priority: 'Low',
    riskScorePercent: 5,
    isFragile: false,
    shelfRow: 0,
    shelfCol: 3,
    category: 'Machinery',
  },
  {
    id: 'SHP-8578',
    title: 'Bellary Export Red Onions (Mesh Sacks)',
    client: 'Karnataka Agri-Exports Ltd',
    loadingOrder: 5,
    destination: 'Bengaluru APMC Yard 3',
    weightLbs: 4800,
    weightTons: 2.18,
    volumeCuFt: 360,
    priority: 'Normal',
    riskScorePercent: 12,
    isFragile: false,
    shelfRow: 1,
    shelfCol: 0,
    category: 'Agri-Fresh',
  },
  {
    id: 'SHP-7841',
    title: 'Byadgi Grade-A Dry Chilli (Bales)',
    client: 'Byadgi Spices Merchant Guild',
    loadingOrder: 6,
    destination: 'Bengaluru Spice Depot (Yeshwanthpur)',
    weightLbs: 3900,
    weightTons: 1.77,
    volumeCuFt: 340,
    priority: 'Normal',
    riskScorePercent: 10,
    isFragile: false,
    shelfRow: 1,
    shelfCol: 1,
    category: 'Agri-Fresh',
  },
  {
    id: 'SHP-1248',
    title: 'Cold-Chain Veterinary Vaccines',
    client: 'State Animal Husbandry Dept',
    loadingOrder: 7,
    destination: 'Shivaji Nagar Cold Depot, Bengaluru',
    weightLbs: 1600,
    weightTons: 0.73,
    volumeCuFt: 140,
    priority: 'Critical',
    riskScorePercent: 28,
    isFragile: true,
    fragileNote: 'Temperature-monitored dry ice crate (2°C - 8°C). Do not top-stack.',
    shelfRow: 1,
    shelfCol: 2,
    category: 'Medical',
  },
  {
    id: 'SHP-8978',
    title: 'Raw Cotton Clean Bales (Grade-1)',
    client: 'Hubballi Cotton Spinning Mills',
    loadingOrder: 8,
    destination: 'Peenya Industrial Estate',
    weightLbs: 4100,
    weightTons: 1.86,
    volumeCuFt: 310,
    priority: 'High',
    riskScorePercent: 14,
    isFragile: false,
    shelfRow: 1,
    shelfCol: 3,
    category: 'Textile',
  },
  {
    id: 'SHP-7787',
    title: 'Organic Soil Bio-Concentrates',
    client: 'Southern Eco-Bio Nutrition Ltd',
    loadingOrder: 9,
    destination: 'Mandya Agro Deck',
    weightLbs: 1800,
    weightTons: 0.82,
    volumeCuFt: 150,
    priority: 'Critical',
    riskScorePercent: 18,
    isFragile: true,
    fragileNote: 'Aerosolized seal. Keep upright with ventilation.',
    shelfRow: 2,
    shelfCol: 0,
    category: 'Chemicals',
  },
  {
    id: 'SHP-7801',
    title: 'Refined Edible Sunflower Oil (Barrels)',
    client: 'KMF Hubballi Depot',
    loadingOrder: 10,
    destination: 'Bengaluru Central Wholesale',
    weightLbs: 2200,
    weightTons: 1.0,
    volumeCuFt: 180,
    priority: 'Low',
    riskScorePercent: 6,
    isFragile: false,
    shelfRow: 2,
    shelfCol: 1,
    category: 'Agri-Fresh',
  },
  {
    id: 'SHP-5678',
    title: 'Rotavator Tractor Gearboxes (x4)',
    client: 'Deccan Agro Heavy Engineering',
    loadingOrder: 11,
    destination: 'Electronic City Cargo Dock',
    weightLbs: 2600,
    weightTons: 1.18,
    volumeCuFt: 220,
    priority: 'High',
    riskScorePercent: 16,
    isFragile: false,
    shelfRow: 2,
    shelfCol: 2,
    category: 'Machinery',
  },
];

interface HaulixCargoLayoutViewProps {
  onNavigate: (page: string) => void;
  onSelectTrip?: (tripId: string) => void;
}

export const HaulixCargoLayoutView: React.FC<HaulixCargoLayoutViewProps> = ({
  onNavigate,
  onSelectTrip,
}) => {
  const [cargoItems, setCargoItems] = useState<CargoItem[]>(INITIAL_CARGO_ITEMS);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('SHP-4574');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Cargo' | 'Trips' | 'Maintenance' | 'Alerts'>('Cargo');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotationAngle, setRotationAngle] = useState<number>(12);
  const [cameraPreset, setCameraPreset] = useState<'3/4' | 'side' | 'isometric'>('3/4');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLightingOn, setIsLightingOn] = useState<boolean>(true);

  // New package form states
  const [newTitle, setNewTitle] = useState('Organic Byadgi Chilli Powder (x50 Cans)');
  const [newClient, setNewClient] = useState('Hubballi Food Cluster Co.');
  const [newWeight, setNewWeight] = useState(1500);
  const [newPriority, setNewPriority] = useState<CargoItem['priority']>('High');

  const activePackage =
    cargoItems.find((item) => item.id === selectedPackageId) || cargoItems[1];

  const totalWeightLbs = cargoItems.reduce((acc, c) => acc + c.weightLbs, 0);
  const totalVolumeCuFt = cargoItems.reduce((acc, c) => acc + c.volumeCuFt, 0);
  const maxWeightLbs = 44000;
  const maxVolumeCuFt = 2400;
  const weightPercent = Math.min(100, Math.round((totalWeightLbs / maxWeightLbs) * 100));
  const volumePercent = Math.min(100, Math.round((totalVolumeCuFt / maxVolumeCuFt) * 100));

  const filteredItems = cargoItems.filter((item) => {
    if (filterPriority === 'ALL') return true;
    if (filterPriority === 'FRAGILE') return item.isFragile;
    return item.priority === filterPriority;
  });

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCameraPreset = (preset: '3/4' | 'side' | 'isometric') => {
    setCameraPreset(preset);
    if (preset === '3/4') setRotationAngle(14);
    if (preset === 'side') setRotationAngle(0);
    if (preset === 'isometric') setRotationAngle(28);
  };

  const handleAddCustomPackage = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `SHP-${Math.floor(Math.random() * 8999 + 1000)}`;
    const newItem: CargoItem = {
      id: newId,
      title: newTitle,
      client: newClient,
      loadingOrder: cargoItems.length + 1,
      destination: 'Bengaluru APMC Gateway',
      weightLbs: newWeight,
      weightTons: Number((newWeight / 2204.62).toFixed(2)),
      volumeCuFt: 180,
      priority: newPriority,
      riskScorePercent: 12,
      isFragile: false,
      shelfRow: 2,
      shelfCol: 3,
      category: 'Agri-Fresh',
    };
    setCargoItems([...cargoItems, newItem]);
    setSelectedPackageId(newId);
    setIsAddModalOpen(false);
  };

  const getPriorityStyle = (priority: CargoItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-950/90 text-rose-300 border border-rose-600/60 shadow-sm shadow-rose-900/30';
      case 'High':
        return 'bg-amber-950/90 text-amber-300 border border-amber-500/60 shadow-sm shadow-amber-900/30';
      case 'Normal':
        return 'bg-sky-950/90 text-sky-300 border border-sky-600/60';
      case 'Low':
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="w-full bg-[#0a0d14] text-slate-100 rounded-3xl p-5 sm:p-7 border border-slate-800/80 shadow-2xl font-sans relative">
      {/* 1. Header Row (Vehicle title, Status, Action buttons) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>TX-9913-HX</span>
              <span className="text-slate-500 font-mono text-sm font-normal">/ KA-25-XX-1234</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-950 text-sky-400 border border-sky-800/60 flex items-center gap-1.5 shadow-sm shadow-sky-950/50">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Idle
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Kenworth T680 Heavy Carrier</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-medium">Driver: Manjunath Patil (DRV-001)</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-mono">APMC Trip #HBL-RT-2026-10482</span>
          </p>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => alert('Vehicle scheduled for diagnostic inspection at Amargol Bay 2.')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-semibold transition-all hover:border-slate-700 active:scale-95"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-400" />
            <span>Maintenance</span>
          </button>

          <button
            onClick={() => alert('Vehicle status changed to Offline.')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-semibold transition-all hover:border-slate-700 active:scale-95"
          >
            <PowerOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Take Offline</span>
          </button>

          <button
            onClick={() => onNavigate('driver')}
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#D9F99D] hover:bg-[#bef264] text-slate-950 text-xs font-black shadow-lg shadow-[#D9F99D]/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Activate Route</span>
          </button>

          <button className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs Bar */}
      <div className="flex items-center gap-6 mt-4 border-b border-slate-850 text-xs font-medium pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('Overview')}
          className={`pb-1 transition-colors ${
            activeTab === 'Overview'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('Cargo')}
          className={`pb-1 flex items-center gap-1.5 transition-colors ${
            activeTab === 'Cargo'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Cargo</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D9F99D] shadow-sm shadow-[#D9F99D]" />
        </button>

        <button
          onClick={() => setActiveTab('Trips')}
          className={`pb-1 flex items-center gap-1 transition-colors ${
            activeTab === 'Trips'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Trips</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
            2
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Maintenance')}
          className={`pb-1 flex items-center gap-1 transition-colors ${
            activeTab === 'Maintenance'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Maintenance</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
            3
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Alerts')}
          className={`pb-1 flex items-center gap-1 transition-colors ${
            activeTab === 'Alerts'
              ? 'text-white font-bold border-b-2 border-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Alerts</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
            0
          </span>
        </button>
      </div>

      {/* 3. Main Two-Column Layout (Left: 3D Cargo Layout | Right: Package Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column (8 cols): Cargo Layout with 3D Cutaway Truck */}
        <div className="lg:col-span-8 bg-[#10141d] border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
          {/* Top Capacity Metrics Bar */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-850 border border-slate-700/80 flex items-center justify-center text-slate-300">
                  <Layers className="w-4 h-4" />
                </div>
                <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Cargo Layout
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  Fully loaded
                </span>
              </div>

              {/* Camera Presets & Reset */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px] font-semibold">
                  <button
                    onClick={() => handleCameraPreset('3/4')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      cameraPreset === '3/4'
                        ? 'bg-slate-750 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3/4 Angle
                  </button>
                  <button
                    onClick={() => handleCameraPreset('side')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      cameraPreset === 'side'
                        ? 'bg-slate-750 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Side Cutaway
                  </button>
                  <button
                    onClick={() => handleCameraPreset('isometric')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      cameraPreset === 'isometric'
                        ? 'bg-slate-750 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Iso Top
                  </button>
                </div>

                <button
                  onClick={() => {
                    setRotationAngle(12);
                    setZoomLevel(1);
                  }}
                  className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                  title="Reset Camera Angle"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weight & Volume Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-850">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Weight className="w-3.5 h-3.5 text-amber-400" />
                    <strong>{totalWeightLbs.toLocaleString()}</strong> / 44 000 lbs
                  </span>
                  <span className="font-mono text-amber-400 font-black text-xs">{weightPercent}%</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    style={{ width: `${weightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Weight capacity • Tandem Axle Load Balanced
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-850">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-rose-400" />
                    <strong>{totalVolumeCuFt.toLocaleString()}</strong> / 2 400 ft³
                  </span>
                  <span className="font-mono text-rose-400 font-black text-xs">{volumePercent}%</span>
                </div>
                <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-600 to-rose-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                    style={{ width: `${volumePercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Volume capacity • Full Cubic Load Limit Reached
                </span>
              </div>
            </div>
          </div>

          {/* 3D Cutaway Truck Container Stage */}
          <div className="relative my-4 min-h-[420px] sm:min-h-[480px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#090d14] via-[#0d121b] to-[#0a0e16] border border-slate-850 p-4">
            {/* Volumetric Radial Floor Light Beam */}
            <div className="absolute inset-0 bg-radial from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-1/4 right-1/4 h-16 bg-gradient-to-t from-slate-900/80 to-transparent blur-xl pointer-events-none" />

            {/* Floating Top Left Stage Controls */}
            <div className="absolute left-3 top-3 flex items-center gap-2 z-20">
              <button
                onClick={() => setIsLightingOn(!isLightingOn)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                  isLightingOn
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60 shadow-sm shadow-cyan-950'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>LED Strips {isLightingOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Floating Zoom & Tool Buttons (Right side) */}
            <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-20">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700/80 shadow-lg"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700/80 shadow-lg"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-mono text-slate-400 text-center border border-slate-800">
                {Math.round(zoomLevel * 100)}%
              </div>
            </div>

            {/* High-Fidelity 3D Cutaway Heavy Carrier Container */}
            <div
              style={{
                transform: `scale(${zoomLevel}) perspective(1100px) rotateY(${rotationAngle}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="w-full max-w-2xl flex items-end justify-center relative mt-4"
            >
              {/* High-Fidelity Heavy Truck Cab (Left Side) */}
              <div className="relative z-10 w-44 sm:w-56 shrink-0 -mr-7 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]">
                <svg viewBox="0 0 220 190" className="w-full h-auto">
                  <defs>
                    <linearGradient id="cabBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e2634" />
                      <stop offset="50%" stopColor="#121822" />
                      <stop offset="100%" stopColor="#0a0e14" />
                    </linearGradient>
                    <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#64748b" />
                      <stop offset="50%" stopColor="#f8fafc" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>

                  {/* Cab Aerodynamic Roof Fairing */}
                  <path
                    d="M 60 40 Q 110 15 170 30 L 210 55 L 210 165 L 15 165 L 15 85 Q 25 55 60 40 Z"
                    fill="url(#cabBodyGrad)"
                    stroke="#2e3b4e"
                    strokeWidth="2.5"
                  />

                  {/* Windshield with Interior Steering Wheel Silhouette */}
                  <polygon
                    points="35,78 120,45 155,50 145,100 30,105"
                    fill="#182333"
                    stroke="#3b4d66"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="90" cy="80" rx="14" ry="7" fill="#0d141e" opacity="0.7" />

                  {/* Side Window */}
                  <polygon points="155,55 195,65 195,100 150,100" fill="#141d2a" stroke="#2a394d" />

                  {/* Heavy Commercial Chrome Grille & Vents */}
                  <rect x="25" y="115" width="80" height="4" rx="2" fill="url(#chromeGrad)" />
                  <rect x="25" y="125" width="80" height="4" rx="2" fill="url(#chromeGrad)" />
                  <rect x="25" y="135" width="80" height="4" rx="2" fill="url(#chromeGrad)" />
                  <rect x="25" y="145" width="80" height="4" rx="2" fill="url(#chromeGrad)" />

                  {/* High-Intensity Projector Headlamp */}
                  <rect x="18" y="122" width="6" height="26" rx="2" fill="#38BDF8" className="animate-pulse" />

                  {/* Chrome Side Exhaust Stack */}
                  <rect x="195" y="20" width="8" height="80" rx="3" fill="url(#chromeGrad)" />
                  <ellipse cx="199" cy="20" rx="4" ry="2" fill="#0f172a" />

                  {/* Heavy Dual Front Wheels with Rim Detailing */}
                  <circle cx="70" cy="165" r="24" fill="#070a0e" stroke="#334155" strokeWidth="4" />
                  <circle cx="70" cy="165" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                  <circle cx="70" cy="165" r="6" fill="#0f172a" />
                  <circle cx="67" cy="160" r="1.5" fill="#f8fafc" />
                  <circle cx="73" cy="160" r="1.5" fill="#f8fafc" />
                  <circle cx="75" cy="166" r="1.5" fill="#f8fafc" />
                  <circle cx="65" cy="166" r="1.5" fill="#f8fafc" />

                  {/* Aerodynamic Side Mirror Bracket */}
                  <rect x="20" y="68" width="6" height="28" rx="2" fill="#0f172a" stroke="#475569" />
                  <circle cx="23" cy="82" r="2" fill="#FACC15" />
                </svg>
              </div>

              {/* 3D Cutaway Steel Container Cargo Box */}
              <div className="flex-1 bg-gradient-to-b from-[#141b26] to-[#0c1017] border-2 border-slate-750 rounded-r-2xl p-4 shadow-[0_25px_50px_rgba(0,0,0,0.9)] relative">
                {/* Overhead Luminous White/Cyan LED Strip Lights */}
                {isLightingOn && (
                  <div className="relative mb-3.5 px-2">
                    <div className="flex items-center justify-around gap-2">
                      <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-cyan-100 to-transparent rounded-full shadow-[0_0_15px_#38bdf8]" />
                      <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-cyan-100 to-transparent rounded-full shadow-[0_0_15px_#38bdf8]" />
                      <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-cyan-100 to-transparent rounded-full shadow-[0_0_15px_#38bdf8]" />
                    </div>
                    {/* Downward light cone falloff */}
                    <div className="absolute top-1 left-4 right-4 h-12 bg-gradient-to-b from-cyan-400/15 to-transparent blur-md pointer-events-none" />
                  </div>
                )}

                {/* Interior Modular Package Grid (3 Rows x 4 Columns) */}
                <div className="grid grid-cols-4 gap-2.5 relative z-10">
                  {cargoItems.map((item) => {
                    const isSelected = item.id === selectedPackageId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedPackageId(item.id)}
                        className={`p-2.5 rounded-xl transition-all cursor-pointer flex flex-col justify-between min-h-[72px] relative transform ${
                          isSelected
                            ? 'bg-[#1e2738] border-2 border-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.35)] ring-4 ring-[#FACC15]/15 scale-[1.04] -translate-y-1 z-30'
                            : 'bg-[#121822] hover:bg-[#18202d] border border-slate-700/70 hover:border-slate-600'
                        }`}
                      >
                        {/* Top ID Row with Copy button */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono font-black text-[11px] ${
                              isSelected ? 'text-amber-300' : 'text-slate-200'
                            }`}
                          >
                            {item.id}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.id);
                            }}
                            className="text-slate-400 hover:text-white transition-colors"
                            title="Copy Package ID"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Title Snippet */}
                        <div className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                          {item.title}
                        </div>

                        {/* Bottom Tag Badges Row */}
                        <div className="mt-1 flex items-center justify-between">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${getPriorityStyle(
                              item.priority
                            )}`}
                          >
                            {item.priority}
                          </span>
                          {item.isFragile && (
                            <span
                              className="text-[10px] px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 font-bold"
                              title="Fragile"
                            >
                              ⚠️
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Lower Tailgate Ramp & Loading Dock Stair Assembly */}
                <div className="absolute -bottom-10 -left-3 right-6 flex items-center justify-between pointer-events-none opacity-90">
                  {/* Folded Industrial Heavy Tailgate Ramp */}
                  <div className="w-48 h-10 bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-slate-750 transform -skew-x-12 rounded shadow-2xl flex items-center justify-around px-3">
                    <div className="h-0.5 w-full bg-slate-700/80" />
                  </div>
                  {/* Heavy-Duty Tread Stairs */}
                  <div className="w-28 h-10 bg-slate-900 border-2 border-slate-750 flex flex-col justify-around px-2 shadow-2xl">
                    <div className="h-0.5 bg-slate-700" />
                    <div className="h-0.5 bg-slate-700" />
                    <div className="h-0.5 bg-slate-700" />
                  </div>
                </div>

                {/* Rear Heavy Carrier Wheels Beneath Container */}
                <div className="absolute -bottom-8 left-16 flex items-center gap-3 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-slate-700" />
                  <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-slate-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Rotation Slider: < [Knob] > */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setRotationAngle((a) => Math.max(-25, a - 10))}
              className="w-8 h-8 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-750 text-xs font-bold"
            >
              &lang;
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono">Angle</span>
              <div className="w-48 sm:w-64 bg-slate-800 h-2 rounded-full relative flex items-center">
                <input
                  type="range"
                  min="-25"
                  max="40"
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(Number(e.target.value))}
                  className="w-full opacity-0 cursor-pointer absolute inset-0 z-10"
                />
                <div
                  style={{
                    left: `${((rotationAngle + 25) / 65) * 100}%`,
                  }}
                  className="w-4.5 h-4.5 rounded-full bg-white border-2 border-slate-900 shadow-[0_0_10px_rgba(255,255,255,0.8)] absolute -translate-x-1/2 pointer-events-none"
                />
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold w-8">
                {rotationAngle}°
              </span>
            </div>

            <button
              onClick={() => setRotationAngle((a) => Math.min(40, a + 10))}
              className="w-8 h-8 rounded-full bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-750 text-xs font-bold"
            >
              &rang;
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Packages List & Active Selected Detail */}
        <div className="lg:col-span-4 bg-[#10141d] border border-slate-800/90 rounded-3xl p-5 shadow-2xl flex flex-col justify-between backdrop-blur-md">
          <div className="space-y-3.5">
            {/* Header: Packages (Item count, Total weight, Filter, Add buttons) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-850">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Packages</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Total:{' '}
                  <strong className="text-white">
                    {cargoItems.length}/{cargoItems.length} Items
                  </strong>{' '}
                  • Total weight:{' '}
                  <strong className="text-white">{totalWeightLbs.toLocaleString()} lbs</strong>
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="bg-slate-850 text-slate-300 border border-slate-750 rounded-lg text-[10px] px-2 py-1 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer"
                  >
                    <option value="ALL">All ({cargoItems.length})</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="FRAGILE">Fragile</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-7 h-7 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                  title="Add Consignment Package"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mini preview card of another package (SHP-8841 from screenshot) */}
            <div
              onClick={() => setSelectedPackageId('SHP-8841')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                selectedPackageId === 'SHP-8841'
                  ? 'bg-slate-850 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-[#0d1118] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* 3D Box Wireframe thumbnail */}
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-center shrink-0">
                <Box className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-white">SHP-8841</span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    Critical
                  </span>
                </div>
                <div className="text-xs text-slate-300 truncate mt-0.5 font-medium">
                  Fiber Optic Cables (x200)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>1 800 lbs</span>
                  <span>120 ft³</span>
                  <span className="text-amber-400 font-semibold">⚠️ Fragile</span>
                </div>
              </div>
            </div>

            {/* Active Expanded Card: Selected Package (e.g. SHP-4574 from screenshot) */}
            <div className="bg-[#0c1017] border border-amber-500/50 rounded-2xl p-4 shadow-2xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Top row: thumbnail, ID, Priority */}
              <div className="flex items-start gap-3">
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
                  <Box className="w-7 h-7 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-sm text-amber-400 tracking-tight">
                        {activePackage.id}
                      </span>
                      <button
                        onClick={() => handleCopy(activePackage.id)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedId === activePackage.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${getPriorityStyle(
                        activePackage.priority
                      )}`}
                    >
                      {activePackage.priority}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5 leading-snug">
                    {activePackage.title}
                  </div>
                </div>
              </div>

              {/* Client & Loading Order Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400">Client</span>
                  <div className="font-bold text-slate-200 mt-0.5 truncate">
                    {activePackage.client}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Loading order</span>
                  <div className="font-bold text-white mt-0.5">#{activePackage.loadingOrder}</div>
                </div>
              </div>

              {/* Destination & Risk Score */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Destination</span>
                  <div className="font-bold text-slate-200 mt-0.5 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{activePackage.destination}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Risk score</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {activePackage.riskScorePercent}%
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">Low</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-[0_0_6px_#34d399]"
                      style={{ width: `${activePackage.riskScorePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Weight & Volume Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-white">
                    {activePackage.weightLbs.toLocaleString()} lbs
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-white">{activePackage.volumeCuFt} ft³</span>
                </div>
              </div>

              {/* Fragile warning callout box (Exact text from screenshot) */}
              {activePackage.isFragile && (
                <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-2.5 text-xs text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Fragile</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {activePackage.fragileNote ||
                        'Handle with care. Shock-absorbing packaging required.'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Row: View Route & Reassign to Another Truck */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigate('operations')}
              className="py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>View Route</span>
            </button>

            <button
              onClick={() => {
                alert(`Package ${activePackage.id} reassigned to alternate fleet carrier KA-26-E-4512.`);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reassign</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Add Consignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>Load New Consignment into Truck</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add cargo package to Kenworth T680 / APMC return consignment queue.
            </p>

            <form onSubmit={handleAddCustomPackage} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cargo Description</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Consignor / Client</label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg"
                >
                  Load into Container
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
