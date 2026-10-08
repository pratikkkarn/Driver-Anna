import React from 'react';
import { WifiOff, RefreshCw, CloudUpload } from 'lucide-react';
import { Language } from '../../types';
import { getT } from '../../utils/translations';
import { appStore } from '../../services/store';

interface OfflineBannerProps {
  isOffline: boolean;
  language: Language;
  pendingCount: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  language,
  pendingCount,
}) => {
  const t = getT(language);

  // Hide banner when everything is online and synced
  if (!isOffline && pendingCount === 0) {
    return null;
  }

  const handleSync = async () => {
    // Don't try to sync if the device is actually offline
    if (!navigator.onLine) {
      return;
    }

    try {
      await appStore.flushOfflineQueue();
      appStore.setOffline(false);
    } catch (error) {
      console.error('Failed to sync offline queue:', error);
    }
  };

  return (
    <div className="bg-amber-600 text-slate-950 px-4 py-2 font-medium text-xs sm:text-sm shadow-md">
      <div className="max-w-5xl mx-auto w-full flex items-center gap-2">
        {/* Status Icon */}
        {isOffline ? (
          <WifiOff
            className="w-4 h-4 shrink-0 animate-pulse"
            aria-hidden="true"
          />
        ) : (
          <CloudUpload
            className="w-4 h-4 shrink-0"
            aria-hidden="true"
          />
        )}

        {/* Message */}
        <span className="flex-1">
          {isOffline
            ? t.offlineBanner
            : `${pendingCount} offline ledger ${
                pendingCount === 1 ? 'action' : 'actions'
              } queued for sync.`}
        </span>

        {/* Sync Button */}
        {pendingCount > 0 && !isOffline && (
          <button
            type="button"
            onClick={handleSync}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded text-xs hover:bg-slate-800 active:bg-slate-700 transition-colors"
          >
            <RefreshCw
              className="w-3 h-3"
              aria-hidden="true"
            />
            <span>Sync Now</span>
          </button>
        )}
      </div>
    </div>
  );
};