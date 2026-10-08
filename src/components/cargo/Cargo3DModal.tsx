import React, { useState } from 'react';
import { Box, Truck, ShieldCheck, X, RefreshCw, Layers, Weight, Info, CheckCircle2 } from 'lucide-react';

interface Cargo3DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CargoBoxItem {
  id: string;
  name: string;
  weightTons: number;
  color: string;
  gridPos: { x: number; y: number; z: number };
  dims: { w: number; h: number; d: number };
  destination: string;
}

export const Cargo3DModal: React.FC<Cargo3DModalProps> = ({ isOpen, onClose }) => {
  const [rotationX, setRotationX] = useState(25);
  const [rotationY, setRotationY] = useState(-35);
  const [selectedBox, setSelectedBox] = useState<CargoBoxItem | null>(null);
  const [activeLayer, setActiveLayer] = useState<'ALL' | 'BOTTOM' | 'TOP'>('ALL');

  if (!isOpen) return null;

  const cargoItems: CargoBoxItem[] = [
    { id: 'C1', name: 'Bellary Red Onions', weightTons: 6.5, color: 'from-amber-600 to-amber-700', gridPos: { x: 0, y: 0, z: 0 }, dims: { w: 90, h: 40, d: 70 }, destination: 'Bengaluru APMC' },
    { id: 'C2', name: 'Hubballi Red Onions', weightTons: 5.0, color: 'from-amber-500 to-amber-600', gridPos: { x: 100, y: 0, z: 0 }, dims: { w: 80, h: 40, d: 70 }, destination: 'Bengaluru APMC' },
    { id: 'C3', name: 'Byadgi Dry Chilli Bales', weightTons: 3.2, color: 'from-red-600 to-red-700', gridPos: { x: 20, y: 45, z: 0 }, dims: { w: 70, h: 35, d: 60 }, destination: 'Mysuru Yard' },
    { id: 'C4', name: 'Cotton Bales Grade A', weightTons: 2.1, color: 'from-slate-200 to-slate-400 text-slate-900', gridPos: { x: 100, y: 45, z: 0 }, dims: { w: 65, h: 35, d: 60 }, destination: 'Davangere Mill' },
  ];

  const totalWeight = cargoItems.reduce((sum, item) => sum + item.weightTons, 0);
  const maxCapacity = 18.0; // 18 Tons capacity
  const capacityPercent = Math.min(100, Math.round((totalWeight / maxCapacity) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400/10 border border-amber-400/30 rounded-2xl text-amber-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Drive Anna 3D Cargo & Axle Inspector
              </h2>
              <p className="text-xs text-slate-400">
                Interactive truck bed load optimization & weight distribution map
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 text-slate-400 hover:text-slate-100 rounded-xl transition-colors border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Controls & Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium mb-1">Total Payload Weight</div>
              <div className="text-2xl font-black text-amber-400">
                {totalWeight.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ 18.0 Tons</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium mb-1">Axle Load Balance</div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-200 mt-1">
                <span>Front: 42%</span>
                <span className="text-emerald-400">Rear: 58% (Optimal)</span>
              </div>
              <div className="text-[11px] text-emerald-400/90 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complies with RTO Karnataka axle limits</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-medium mb-2">Layer Inspection</div>
              <div className="flex gap-2">
                {(['ALL', 'BOTTOM', 'TOP'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setActiveLayer(layer)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all border ${
                      activeLayer === layer
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Visualizer Canvas Box */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 h-80 flex items-center justify-center overflow-hidden">
            <div className="absolute top-4 left-4 text-xs font-mono text-slate-500 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>KA-25-FA-9912 • 16T Multi-Axle Container</span>
            </div>

            {/* Rotation controls overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1.5 backdrop-blur text-xs">
              <button
                onClick={() => setRotationY((prev) => prev - 15)}
                className="text-slate-300 hover:text-amber-400 font-bold px-1"
              >
                ◀ Rotate
              </button>
              <button
                onClick={() => { setRotationX(25); setRotationY(-35); }}
                className="p-1 text-slate-400 hover:text-amber-400"
                title="Reset View"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRotationY((prev) => prev + 15)}
                className="text-slate-300 hover:text-amber-400 font-bold px-1"
              >
                Rotate ▶
              </button>
            </div>

            {/* 3D Container Diagram using CSS 3D */}
            <div
              className="w-72 h-44 transition-transform duration-300 relative"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              }}
            >
              {/* Truck Bed Base Frame */}
              <div className="absolute inset-0 border-2 border-dashed border-amber-400/40 bg-slate-900/60 rounded-xl shadow-2xl flex items-center justify-center">
                <span className="text-[10px] font-mono text-amber-400/60 font-bold uppercase tracking-widest">
                  Truck Deck Floor (24ft)
                </span>
              </div>

              {/* Cargo Blocks */}
              {cargoItems.map((item) => {
                const isSelected = selectedBox?.id === item.id;
                const isVisible =
                  activeLayer === 'ALL' ||
                  (activeLayer === 'BOTTOM' && item.gridPos.y === 0) ||
                  (activeLayer === 'TOP' && item.gridPos.y > 0);

                if (!isVisible) return null;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedBox(item)}
                    style={{
                      position: 'absolute',
                      left: `${item.gridPos.x}px`,
                      top: `${item.gridPos.y}px`,
                      width: `${item.dims.w}px`,
                      height: `${item.dims.h}px`,
                      transform: `translateZ(${item.gridPos.z}px)`,
                    }}
                    className={`cursor-pointer bg-gradient-to-br ${item.color} rounded-lg p-2 border transition-all duration-200 shadow-xl flex flex-col justify-between ${
                      isSelected
                        ? 'ring-2 ring-amber-400 border-white scale-105 z-20'
                        : 'border-slate-800 hover:scale-102 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold leading-tight truncate">
                      {item.name}
                    </div>
                    <div className="text-[9px] font-mono font-black opacity-90">
                      {item.weightTons} Tons
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Cargo Detail */}
          {selectedBox && (
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 flex items-center justify-between animate-in fade-in">
              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                  Selected Consignment
                </div>
                <div className="text-base font-extrabold text-slate-100 mt-0.5">
                  {selectedBox.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Destination: <span className="text-slate-200 font-semibold">{selectedBox.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-amber-400">
                  {selectedBox.weightTons} Tons
                </div>
                <div className="text-[11px] text-slate-400">LIFO Unloading Rank #1</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-400 text-slate-950 rounded-xl font-bold text-xs hover:bg-amber-300 transition-colors shadow-md"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
