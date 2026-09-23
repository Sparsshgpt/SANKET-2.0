import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  Radio,
  History,
  FileText,
  Settings,
  Mountain,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Command Overview', icon: LayoutDashboard },
  { path: '/map', label: 'Geospatial GIS Map', icon: Map },
  { path: '/analysis', label: 'AI Risk Simulation', icon: BrainCircuit },
  { path: '/broadcast', label: 'Early Warnings', icon: Radio, hasBadge: true },
  { path: '/historical', label: 'Historical Trends', icon: History },
  { path: '/reports', label: 'SITREP Reports', icon: FileText },
  { path: '/settings', label: 'System Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { broadcasts } = useApp();

  return (
    <aside
      className={`hidden md:flex flex-col bg-mountain-950 text-stone-200 border-r border-mountain-800/80 transition-all duration-200 ease-in-out z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-mountain-850 shrink-0">
        <NavLink
          to="/"
          className="flex items-center gap-3 overflow-hidden text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-mountain-800 border border-mountain-600/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-mountain-glow">
            <Mountain size={22} className="stroke-[2.2]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white font-mono">
                  SANKET
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-mountain-800/80 px-1.5 py-0.2 rounded border border-mountain-600/40">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-stone-400 truncate uppercase tracking-widest mt-0.5">
                Geospatial Warning Core
              </p>
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-mountain-850 transition-colors focus:outline-none shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Mission Control
            </span>
          )}
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-mountain-800/90 text-white font-semibold shadow-sm border border-mountain-600/50'
                    : 'text-stone-300 hover:text-white hover:bg-mountain-900'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? 'text-emerald-400'
                        : 'text-stone-400 group-hover:text-stone-200'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!collapsed && item.hasBadge && broadcasts.length > 0 && (
                    <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800/80">
                      {broadcasts.length}
                    </span>
                  )}
                  {collapsed && item.hasBadge && broadcasts.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Mountain & Terrain Status Badge */}
      <div className="p-3 border-t border-mountain-850 shrink-0">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-mountain-900 border border-mountain-800/80 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Telemetry Live
              </span>
              <span className="text-[10px] font-mono text-stone-400">Indian Belts</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-snug">
              Surveillance across Himalayan, North East & Western Ghats mountain corridors.
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="Telemetry Live — India Mountain Belts">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
