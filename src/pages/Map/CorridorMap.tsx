import React, { useState } from 'react';
import { MapPin, Navigation, Truck, AlertTriangle, ShieldCheck, Info, X } from 'lucide-react';
import { CORRIDOR_ROUTES } from '../../data/seedData';
import { Trip } from '../../types';

interface CorridorMapProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onNavigate: (page: string) => void;
}

export const CorridorMap: React.FC<CorridorMapProps> = ({
  trips,
  onSelectTrip,
  onNavigate,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>('Bengaluru');

  const nodes = [
    { id: 'HBL', name: 'Hubballi APMC (Origin)', x: 400, y: 300, isHub: true, color: '#FACC15' },
    { id: 'BLR', name: 'Bengaluru (NH-48)', x: 550, y: 520, isHub: false, color: '#38BDF8', deficit: '-14 Trucks (Peak Deficit)' },
    { id: 'BLG', name: 'Belagavi (NH-48 N)', x: 300, y: 190, isHub: false, color: '#4ADE80' },
    { id: 'DHW', name: 'Dharwad Industrial', x: 360, y: 260, isHub: false, color: '#94A3B8' },
    { id: 'GOA', name: 'Goa (NH-748)', x: 190, y: 290, isHub: false, color: '#FB923C' },
    { id: 'PUN', name: 'Pune (NH-48 N)', x: 230, y: 90, isHub: false, color: '#C084FC', deficit: '-3 Trucks' },
    { id: 'HYD', name: 'Hyderabad (NH-67)', x: 670, y: 220, isHub: false, color: '#F472B6', deficit: '-4 Trucks' },
    { id: 'DVG', name: 'Davanagere', x: 480, y: 400, isHub: false, color: '#A7F3D0' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Navigation className="w-6 h-6 text-emerald-400" />
              <span>Outbound Transport Corridors & Real-Time Flow</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Drive Anna • Karnataka logistics nexus routes & active capacity deficit map.
            </p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 text-xs font-bold"
            title="Close Module"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Interactive SVG Network Map */}
        <div className="mt-6 bg-slate-950 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Amargol Hubballi APMC (Core Origin)</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Corridor Deficit Warning: Bengaluru NH-48 (-14 Return Loads Needed)
            </div>
          </div>

          <svg viewBox="0 0 800 600" className="w-full h-[400px] sm:h-[500px]">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#grid)" />

            {/* Connecting Corridor Highway Lines */}
            {nodes.filter((n) => !n.isHub).map((node) => (
              <g key={node.id}>
                <line
                  x1={400}
                  y1={300}
                  x2={node.x}
                  y2={node.y}
                  stroke={node.color}
                  strokeWidth={node.id === 'BLR' ? '4' : '2'}
                  strokeDasharray={node.id === 'BLR' ? '6 4' : 'none'}
                  opacity={0.65}
                />
                {/* Truck Pulse marker along line */}
                <circle
                  cx={(400 + node.x) / 2}
                  cy={(300 + node.y) / 2}
                  r={5}
                  fill={node.color}
                  className="animate-ping"
                  opacity={0.7}
                />
              </g>
            ))}

            {/* Nodes */}
            {nodes.map((node) => (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => setSelectedRoute(node.name)}
              >
                {node.isHub ? (
                  <>
                    <circle cx={node.x} cy={node.y} r={28} fill="#FACC15" opacity={0.2} className="animate-pulse" />
                    <circle cx={node.x} cy={node.y} r={16} fill="#FACC15" stroke="#0f172a" strokeWidth={3} />
                  </>
                ) : (
                  <>
                    <circle cx={node.x} cy={node.y} r={12} fill={node.color} stroke="#0f172a" strokeWidth={2.5} />
                  </>
                )}
                <text
                  x={node.x}
                  y={node.y + 24}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={node.isHub ? '13' : '11'}
                  fontWeight="bold"
                >
                  {node.name}
                </text>
                {node.deficit && (
                  <text
                    x={node.x}
                    y={node.y + 38}
                    textAnchor="middle"
                    fill="#F87171"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {node.deficit}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Corridor Legend & Live Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">Primary Southbound Artery</span>
            <div className="font-bold text-white mt-0.5">NH-48 Hubballi &rarr; Bengaluru</div>
            <div className="text-[10px] text-amber-400 mt-0.5">412 KM • 68% of Total Return Traffic</div>
          </div>

          <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">Northbound Inter-State Artery</span>
            <div className="font-bold text-white mt-0.5">NH-48 Hubballi &rarr; Pune / Mumbai</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">435 KM • High Heavy Trailer Demand</div>
          </div>

          <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px]">Coastal & Mining Artery</span>
            <div className="font-bold text-white mt-0.5">NH-748 Hubballi &rarr; Goa / Karwar</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">152 KM • Perishable Vegetables & Grain</div>
          </div>
        </div>
      </div>
    </div>
  );
};
