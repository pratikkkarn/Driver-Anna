import React, { useState, useEffect } from 'react';
import { appStore, AppState } from './services/store';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { SarvamVoiceModal } from './components/voice/SarvamVoiceModal';
import { Cargo3DModal } from './components/cargo/Cargo3DModal';
import { LoginPage } from './components/auth/LoginPage';
import { Landing } from './pages/Landing/Landing';
import { DriverJourney } from './pages/Driver/DriverJourney';
import { CommandCentre } from './pages/Government/CommandCentre';
import { PostLoad } from './pages/LoadOwner/PostLoad';
import { GateCheckin } from './pages/APMC/GateCheckin';
import { DisputesPage } from './pages/Disputes/DisputesPage';
import { PriceBoard } from './pages/PriceBoard/PriceBoard';
import { CorridorMap } from './pages/Map/CorridorMap';
import { ExtractedVoiceIntent } from './services/sarvamVoiceService';

export default function App() {
  const [state, setState] = useState<AppState>(appStore.getState());
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedTripId, setSelectedTripId] = useState<string>('HBL-RT-2026-10482');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [cargoModalOpen, setCargoModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setState({ ...appStore.getState() });
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmedVoiceIntent = (intent: ExtractedVoiceIntent) => {
    setCurrentPage('driver');
  };

  const handleLogin = (userProfile: { name: string; phone: string; role: any }) => {
    appStore.setUserProfile(userProfile);
    // Route to appropriate view based on role
    if (userProfile.role === 'DRIVER') setCurrentPage('driver');
    else if (userProfile.role === 'LOAD_OWNER' || userProfile.role === 'BROKER') setCurrentPage('load-owner');
    else if (userProfile.role === 'APMC_OPERATOR') setCurrentPage('apmc-gate');
    else if (userProfile.role === 'GOVERNMENT_VIEWER') setCurrentPage('command-centre');
    else setCurrentPage('home');
  };

  // If user is not logged in, display the initial Login / Role Selection Screen first!
  if (!state.userProfile) {
    return (
      <LoginPage
        onLogin={handleLogin}
        language={state.language}
        onLanguageChange={(lang) => appStore.setLanguage(lang)}
      />
    );
  }

  const currentTrip =
    state.trips.find((t) => t.tripId === selectedTripId) || state.trips[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Offline sync alert banner */}
      <OfflineBanner
        isOffline={state.isOffline}
        pendingCount={state.offlineQueue.length}
        language={state.language}
      />

      {/* Main Navbar: Drive Anna */}
      <Navbar
        currentRole={state.currentRole}
        language={state.language}
        userProfile={state.userProfile}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenVoice={() => setVoiceModalOpen(true)}
        onLogout={() => appStore.logout()}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {currentPage === 'home' && (
          <Landing
            onNavigate={setCurrentPage}
            onOpenVoice={() => setVoiceModalOpen(true)}
            language={state.language}
          />
        )}

        {currentPage === 'driver' && (
          <DriverJourney
            currentTrip={currentTrip}
            loads={state.loads}
            language={state.language}
            onOpenVoice={() => setVoiceModalOpen(true)}
            onNavigate={setCurrentPage}
            onSelectTrip={(id) => setSelectedTripId(id)}
          />
        )}

        {currentPage === 'command-centre' && (
          <CommandCentre
            trips={state.trips}
            disputes={state.disputes}
            onSelectTrip={(id) => setSelectedTripId(id)}
            onNavigate={setCurrentPage}
            language={state.language}
          />
        )}

        {currentPage === 'load-owner' && (
          <PostLoad
            currentRole={state.currentRole}
            language={state.language}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'apmc-gate' && (
          <GateCheckin
            trips={state.trips}
            onSelectTrip={(id) => setSelectedTripId(id)}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'disputes' && (
          <DisputesPage
            disputes={state.disputes}
            currentRole={state.currentRole}
            onNavigate={setCurrentPage}
            onSelectTrip={(id) => setSelectedTripId(id)}
          />
        )}

        {currentPage === 'price-board' && (
          <PriceBoard onNavigate={setCurrentPage} />
        )}

        {currentPage === 'map' && (
          <CorridorMap
            trips={state.trips}
            onSelectTrip={(id) => setSelectedTripId(id)}
            onNavigate={setCurrentPage}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenVoice={() => setVoiceModalOpen(true)}
        onOpenCargo3D={() => setCargoModalOpen(true)}
        language={state.language}
      />

      {/* Sarvam AI Multilingual Voice Modal */}
      <SarvamVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        language={state.language}
        onConfirmedIntent={handleConfirmedVoiceIntent}
      />

      {/* Interactive 3D Cargo & Freight Inspector Modal */}
      <Cargo3DModal
        isOpen={cargoModalOpen}
        onClose={() => setCargoModalOpen(false)}
      />
    </div>
  );
}
