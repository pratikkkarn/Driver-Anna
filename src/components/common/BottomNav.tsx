import React from 'react';
import { Home, Truck, PackagePlus, Box, Mic } from 'lucide-react';
import { Language } from '../../types';
import { getT } from '../../utils/translations';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenVoice: () => void;
  onOpenCargo3D: () => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenVoice,
  onOpenCargo3D,
  language,
}) => {
  const t = getT(language);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-300 pb-safe">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 2. Driver Journey */}
        <button
          onClick={() => onNavigate('driver')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'driver' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Truck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Driver</span>
        </button>

        {/* 3. Center Prominent Voice Button */}
        <div className="flex justify-center -mt-5">
          <button
            onClick={onOpenVoice}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-slate-900 active:scale-95 transition-transform"
            title="Speak to Find Loads"
          >
            <Mic className="w-6 h-6 animate-pulse" />
            <span className="text-[8px] font-extrabold uppercase tracking-tighter -mt-0.5">
              Speak
            </span>
          </button>
        </div>

        {/* 4. Post Load */}
        <button
          onClick={() => onNavigate('load-owner')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'load-owner' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PackagePlus className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Post Load</span>
        </button>

        {/* 5. Cargo 3D Modal Trigger */}
        <button
          onClick={onOpenCargo3D}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <Box className="w-5 h-5 mb-0.5 text-amber-400" />
          <span className="text-[10px] font-semibold text-amber-400">Cargo 3D</span>
        </button>
      </div>
    </nav>
  );
};
