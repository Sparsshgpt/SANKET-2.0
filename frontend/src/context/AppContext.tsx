import React, { createContext, useContext, useState, useEffect } from 'react';
import { HotspotRecord, BroadcastAlert, BroadcastRequest, HealthCheck } from '../types';
import { api } from '../services/api';

interface AppContextType {
  selectedHotspot: HotspotRecord | null;
  setSelectedHotspot: (hotspot: HotspotRecord | null) => void;
  broadcastModal: { isOpen: boolean; prefill?: Partial<BroadcastRequest> };
  openBroadcastModal: (prefill?: Partial<BroadcastRequest>) => void;
  closeBroadcastModal: () => void;
  toast: { message: string; type: 'success' | 'warning' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  hideToast: () => void;
  health: HealthCheck | null;
  refreshHealth: () => Promise<void>;
  broadcasts: BroadcastAlert[];
  triggerBroadcast: (request: BroadcastRequest) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotRecord | null>(null);
  const [broadcastModal, setBroadcastModal] = useState<{ isOpen: boolean; prefill?: Partial<BroadcastRequest> }>({
    isOpen: false,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [broadcasts, setBroadcasts] = useState<BroadcastAlert[]>([]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(current => (current?.message === message ? null : current));
    }, 4500);
  };

  const hideToast = () => setToast(null);

  const openBroadcastModal = (prefill?: Partial<BroadcastRequest>) => {
    setBroadcastModal({ isOpen: true, prefill });
  };

  const closeBroadcastModal = () => {
    setBroadcastModal({ isOpen: false, prefill: undefined });
  };

  const refreshHealth = async () => {
    try {
      const res = await api.checkHealth();
      setHealth(res);
    } catch {
      setHealth({
        status: 'standby',
        service: 'SANKET Local Core',
        model_loaded: true,
      });
    }
  };

  const loadAlerts = async () => {
    try {
      const res = await api.getAlerts();
      if (res && res.recent_broadcasts) {
        setBroadcasts(res.recent_broadcasts);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    refreshHealth();
    loadAlerts();
    const timer = setInterval(() => {
      refreshHealth();
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const triggerBroadcast = async (req: BroadcastRequest): Promise<boolean> => {
    try {
      const res = await api.broadcastAlert(req);
      showToast(`Advisory dispatched: ${res.broadcast_id}`, 'success');
      // Refresh local alerts list
      await loadAlerts();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to dispatch broadcast', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedHotspot,
        setSelectedHotspot,
        broadcastModal,
        openBroadcastModal,
        closeBroadcastModal,
        toast,
        showToast,
        hideToast,
        health,
        refreshHealth,
        broadcasts,
        triggerBroadcast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
