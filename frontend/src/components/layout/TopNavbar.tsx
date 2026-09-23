import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  Radio,
  Clock,
  Activity,
  Menu,
  X,
  Search,
  Mountain,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface TopNavbarProps {
  onMobileMenuToggle: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMobileMenuToggle }) => {
  const { health, openBroadcastModal, refreshHealth } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
      setUtcTime(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC',
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await refreshHealth();
    setTimeout(() => setRefreshing(false), 500);
  };

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return { title: 'Command Overview', subtitle: 'Regional Landslide Telemetry & Threat Surveillance' };
      case '/map':
        return { title: 'Geospatial GIS Map', subtitle: 'Interactive Topographic Hazard & Hotspot Matrix' };
      case '/analysis':
        return { title: 'AI Risk Simulation Studio', subtitle: 'Multi-Factor Geotechnical Prediction Laboratory' };
      case '/broadcast':
        return { title: 'Early Warning Broadcast Center', subtitle: 'Multi-Agency Advisory Dispatch & Alert Logs' };
      case '/historical':
        return { title: 'Historical Geotechnical Analytics', subtitle: 'Multi-Year Antecedent Precipitation Correlation' };
      case '/reports':
        return { title: 'Situation Reports (SITREP)', subtitle: 'Automated Briefings for Disaster Management' };
      case '/settings':
        return { title: 'System Configuration', subtitle: 'Threshold Calibration, Telemetry Sync & Diagnostic Logs' };
      default:
        return { title: 'SANKET Platform', subtitle: 'AI-Powered Landslide Risk Monitoring' };
    }
  };

  const pageInfo = getPageTitle(location.pathname);

  return (
    <header className="h-16 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-stone-200/90 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight truncate">
            {pageInfo.title}
          </h1>
          <p className="text-[11px] text-stone-500 hidden sm:block truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Clocks, Telemetry Pill, Quick Broadcast Action */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Real-time IST/UTC Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100/90 border border-stone-200/80 text-xs font-mono text-stone-700">
          <Clock size={13} className="text-mountain-700" />
          <span>{currentTime} IST</span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-400">{utcTime} UTC</span>
        </div>

        {/* Telemetry Status Indicator */}
        <div
          onClick={handleManualRefresh}
          className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-200/70 transition-colors select-none"
          title={`Status: ${health?.service || 'Ready'} - Click to refresh`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              health?.status === 'ok'
                ? 'bg-emerald-500'
                : 'bg-amber-500 animate-pulse'
            }`}
          />
          <span className="hidden sm:inline font-mono text-[11px]">
            {health?.status === 'ok' ? 'LIVE API' : 'LOCAL ENGINE'}
          </span>
          <RefreshCw
            size={11}
            className={`text-stone-400 ml-0.5 ${refreshing ? 'animate-spin' : ''}`}
          />
        </div>

        {/* Quick Emergency Broadcast Action Button */}
        <Button
          variant="danger"
          size="sm"
          icon={<Radio size={14} />}
          onClick={() => openBroadcastModal()}
          className="shadow-sm font-semibold"
        >
          <span className="hidden sm:inline">Emergency</span> Broadcast
        </Button>
      </div>
    </header>
  );
};
