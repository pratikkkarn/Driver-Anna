import React, { useState } from 'react';
import { Truck, Building, UserCheck, ShieldCheck, ArrowRight, Phone, User, Check, Sparkles } from 'lucide-react';
import { UserRole, Language } from '../../types';
import { getT } from '../../utils/translations';

interface LoginPageProps {
  onLogin: (userProfile: { name: string; phone: string; role: UserRole }) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  language,
  onLanguageChange,
}) => {
  const t = getT(language);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const rolesConfig: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode; defaultName: string; defaultPhone: string }[] = [
    {
      role: 'DRIVER',
      title: 'Truck Driver',
      subtitle: 'Find verified return loads & instant freight payments',
      icon: <Truck className="w-6 h-6 text-amber-400" />,
      defaultName: 'Basavaraj Patil',
      defaultPhone: '+91 98801 23456',
    },
    {
      role: 'BROKER',
      title: 'Broker / Transporter',
      subtitle: 'Post return consignments & match trusted fleet operators',
      icon: <Building className="w-6 h-6 text-emerald-400" />,
      defaultName: 'Hubballi Freight Traders',
      defaultPhone: '+91 98450 67890',
    },
    {
      role: 'LOAD_OWNER',
      title: 'Load Owner / Farmer',
      subtitle: 'Direct agricultural produce dispatch & transparent pricing',
      icon: <UserCheck className="w-6 h-6 text-blue-400" />,
      defaultName: 'Mallikarjun Agriculture Produce',
      defaultPhone: '+91 94481 11223',
    },
    {
      role: 'APMC_OPERATOR',
      title: 'APMC Gate Operator',
      subtitle: 'Gate check-in, weigh-bridge verification & yard release',
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
      defaultName: 'Amargol Gate Security #2',
      defaultPhone: '+91 83622 34567',
    },
    {
      role: 'GOVERNMENT_VIEWER',
      title: 'Government Official',
      subtitle: 'Logistics analytics, deficit forecasts & SLA oversight',
      icon: <Sparkles className="w-6 h-6 text-rose-400" />,
      defaultName: 'Karnataka Transport Dept Officer',
      defaultPhone: '+91 80220 99887',
    },
  ];

  const handleSelectRole = (roleItem: typeof rolesConfig[0]) => {
    setSelectedRole(roleItem.role);
    if (!name) setName(roleItem.defaultName);
    if (!phone) setPhone(roleItem.defaultPhone);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select who is logging in.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }

    onLogin({
      name: name.trim(),
      phone: phone.trim(),
      role: selectedRole,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-amber-400 selection:text-slate-950">
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Language Selector Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-full px-3 py-1.5 z-20">
        <button
          type="button"
          onClick={() => onLanguageChange('en')}
          className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-all ${
            language === 'en'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => onLanguageChange('kn')}
          className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-all ${
            language === 'kn'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ಕನ್ನಡ
        </button>
      </div>

      <div className="w-full max-w-xl z-10 my-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 shadow-xl mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg">
              DA
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight leading-none">
                Drive Anna
              </h1>
              <p className="text-xs text-amber-400/90 font-medium tracking-wide mt-0.5">
                Full Truck In. Verified Load Out.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Logistics intelligence & return load matching system. Choose your portal to log in.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Select Role */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                1. Select Who Is Logging In
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rolesConfig.map((item) => {
                  const isSelected = selectedRole === item.role;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleSelectRole(item)}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 text-slate-100 ring-1 ring-amber-400/50 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950/90'
                      }`}
                    >
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
                        {item.icon}
                      </div>
                      <div className="pr-4">
                        <div className="text-sm font-semibold text-slate-100 leading-tight">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 leading-snug mt-1">
                          {item.subtitle}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Name & Phone */}
            {selectedRole && (
              <div className="space-y-4 pt-4 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                  2. Enter Your Details
                </label>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name / Enterprise Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Basavaraj Patil"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98801 23456"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedRole}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedRole
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20 active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <span>Get Started in Drive Anna</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
           Karnataka Logistics Intelligence Network • Hubballi
        </div>
      </div>
    </div>
  );
};
