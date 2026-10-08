import React from 'react';
import {
  Truck,
  Menu,
  X,
  Building2,
  Scale,
  MapPin,
  Mic,
  User,
  LogOut,
  Radio,
  BarChart2,
} from 'lucide-react';
import { Language, UserRole } from '../../types';
import { appStore } from '../../services/store';
import { getT } from '../../utils/translations';

interface NavbarProps {
  currentRole: UserRole;
  language: Language;
  userProfile: { name: string; phone: string; role: UserRole } | null;
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenVoice: () => void;
  onLogout: () => void;
}

const ROLES: { id: UserRole; label: string }[] = [
  { id: 'DRIVER', label: 'Driver (ಲಾರಿ ಚಾಲಕ)' },
  { id: 'LOAD_OWNER', label: 'Load Owner / Farmer' },
  { id: 'BROKER', label: 'Broker / Transporter' },
  { id: 'APMC_OPERATOR', label: 'APMC Gate Operator' },
  { id: 'GOVERNMENT_VIEWER', label: 'Govt Command Centre' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  language,
  userProfile,
  onNavigate,
  currentPage,
  onOpenVoice,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = getT(language);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top accent border line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-400" />

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name: Drive Anna */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              DA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-100 flex items-center gap-1">
                  Drive <span className="text-amber-400">Anna</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400/10 text-amber-300 rounded-full border border-amber-400/30 uppercase tracking-wider">
                  Karnataka
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                Full Truck In. Verified Load Out.
              </p>
            </div>
          </div>

          {/* Center Circular "Speak to Find" Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenVoice}
              title="Speak to Find Loads"
              className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-500/10 transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:bg-amber-300">
                <Mic className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-xs font-extrabold tracking-wide text-amber-300 group-hover:text-amber-200">
                Speak to Find
              </span>
            </button>
          </div>

          {/* Right Controls: Language, Role & Profile/Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher (EN & KN only) */}
            <div className="flex items-center bg-slate-950 rounded-full p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => appStore.setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => appStore.setLanguage('kn')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
                  language === 'kn'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Role Dropdown */}
            <div className="relative hidden md:block">
              <select
                value={currentRole}
                onChange={(e) => appStore.setRole(e.target.value as UserRole)}
                className="bg-slate-950 text-slate-200 text-xs font-semibold py-2 pl-3 pr-7 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none transition-colors"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                ▼
              </div>
            </div>

            {/* User Profile / Logout Button */}
            {userProfile ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                    {userProfile.name}
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono">
                    {userProfile.phone}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  title="Switch Account / Logout"
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700 transition-colors border border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-xl hover:bg-amber-300 transition-colors shadow-sm"
              >
                Log In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop secondary bar */}
      <div className="hidden lg:block bg-slate-950/90 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-2 text-xs font-semibold">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'home'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('driver')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPage === 'driver'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Driver Journey</span>
            </button>
            <button
              onClick={() => onNavigate('load-owner')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'load-owner'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Post Return Load
            </button>
            <button
              onClick={() => onNavigate('apmc-gate')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPage === 'apmc-gate'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>APMC Gate Check-in</span>
            </button>
            <button
              onClick={() => onNavigate('command-centre')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPage === 'command-centre'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Operations Command Centre</span>
            </button>
            <button
              onClick={() => onNavigate('disputes')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPage === 'disputes'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-rose-400" />
              <span>Disputes & Arbitration</span>
            </button>
            <button
              onClick={() => onNavigate('price-board')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                currentPage === 'price-board'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Price Board
            </button>
            <button
              onClick={() => onNavigate('map')}
              className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                currentPage === 'map'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Corridor Map</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          <div className="pb-3 border-b border-slate-800">
            <button
              onClick={() => {
                onOpenVoice();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-400 text-slate-950 rounded-2xl text-xs font-black shadow"
            >
              <Mic className="w-4 h-4" />
              <span>Speak to Find</span>
            </button>
          </div>

          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Overview
          </button>
          <button
            onClick={() => {
              onNavigate('driver');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Driver Journey</span>
          </button>
          <button
            onClick={() => {
              onNavigate('load-owner');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Post Return Load
          </button>
          <button
            onClick={() => {
              onNavigate('apmc-gate');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            APMC Gate Check-in
          </button>
          <button
            onClick={() => {
              onNavigate('command-centre');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Operations Command Centre
          </button>
          <button
            onClick={() => {
              onNavigate('disputes');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
          >
            <Scale className="w-4 h-4 text-rose-400" />
            <span>Disputes & Arbitration</span>
          </button>
          <button
            onClick={() => {
              onNavigate('price-board');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Price Board
          </button>
          <button
            onClick={() => {
              onNavigate('map');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-xl"
          >
            Corridor Map
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Role: <span className="font-bold text-slate-200">{currentRole}</span>
            </span>
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-rose-400 font-bold hover:underline"
            >
              Log Out / Switch
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
