import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { MobileNav } from './MobileNav';
import { HotspotInspector } from '../map/HotspotInspector';
import { BroadcastModal } from './BroadcastModal';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedHotspot, setSelectedHotspot, toast, hideToast } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-canvas font-sans antialiased text-stone-900 select-none">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        {/* Top Navbar */}
        <TopNavbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-topo-pattern p-4 sm:p-6 lg:p-7 pb-20 md:pb-7">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* Mobile Navigation Drawer & Bottom Bar */}
        <MobileNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Global Hotspot Inspector Slide-Over Drawer */}
        <HotspotInspector
          hotspot={selectedHotspot}
          onClose={() => setSelectedHotspot(null)}
        />

        {/* Global Broadcast Early Warning Modal */}
        <BroadcastModal />

        {/* Floating Toast Notification */}
        {toast && (
          <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-white rounded-xl shadow-elevated-earth border border-stone-200 p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-bottom duration-200">
            <span className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 size={18} className="text-emerald-600" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle size={18} className="text-amber-600" />
              )}
              {toast.type === 'error' && (
                <XCircle size={18} className="text-rose-600" />
              )}
              {toast.type === 'info' && (
                <Info size={18} className="text-hydro" />
              )}
            </span>

            <div className="flex-1 min-w-0 text-xs font-medium text-stone-800">
              {toast.message}
            </div>

            <button
              onClick={hideToast}
              className="text-stone-400 hover:text-stone-700 p-0.5 shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
