import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  Radio,
  FileText,
  X,
  Mountain,
  History,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/map', label: 'GIS Map', icon: Map },
  { path: '/analysis', label: 'AI Simulation', icon: BrainCircuit },
  { path: '/broadcast', label: 'Broadcasts', icon: Radio },
  { path: '/historical', label: 'Trends', icon: History },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { broadcasts } = useApp();

  return (
    <>
      {/* Mobile Drawer (Slide out on burger click) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Drawer Menu */}
          <div className="relative w-72 bg-mountain-950 text-stone-200 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="h-16 px-4 flex items-center justify-between border-b border-mountain-850 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-mountain-800 flex items-center justify-center text-emerald-400">
                  <Mountain size={18} />
                </div>
                <span className="font-extrabold text-white font-mono tracking-wider">
                  SANKET 2.0
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-mountain-850"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-mountain-800 text-white font-semibold'
                          : 'text-stone-300 hover:bg-mountain-900 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} className="text-emerald-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="p-4 border-t border-mountain-850 text-xs text-stone-400">
              <p className="font-semibold text-stone-300">
                SANKET Environmental Core
              </p>
              <p className="text-[11px] mt-0.5">
                Indian Mountain Early Warning Infrastructure
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Fixed Bar on Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 z-30 flex items-center justify-around h-14 px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors relative ${
                  isActive
                    ? 'text-mountain-800 font-bold'
                    : 'text-stone-400 hover:text-stone-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={isActive ? 'text-mountain-800' : 'text-stone-400'}
                  />
                  <span className="truncate mt-0.5">{item.label}</span>
                  {item.path === '/broadcast' && broadcasts.length > 0 && (
                    <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
