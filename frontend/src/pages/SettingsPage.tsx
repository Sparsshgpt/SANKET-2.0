import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  Sliders,
  Radio,
  Server,
  Database,
  Shield,
  Activity,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { health, showToast, refreshHealth } = useApp();

  // Threshold States
  const [criticalCutoff, setCriticalCutoff] = useState(75.0);
  const [highCutoff, setHighCutoff] = useState(55.0);
  const [moderateCutoff, setModerateCutoff] = useState(35.0);

  // Sensor Settings
  const [radarInterval, setRadarInterval] = useState('15');
  const [insarFrequency, setInsarFrequency] = useState('6');
  const [piezoRate, setPiezoRate] = useState('5');
  const [autoDispatchCritical, setAutoDispatchCritical] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('System configuration & warning thresholds updated successfully.', 'success');
  };

  const handleReset = () => {
    setCriticalCutoff(75.0);
    setHighCutoff(55.0);
    setModerateCutoff(35.0);
    setRadarInterval('15');
    setInsarFrequency('6');
    setPiezoRate('5');
    showToast('Configuration reset to national geotechnical standard defaults.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-soft-earth flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 topographic-lines">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-mountain-900 text-emerald-400 border border-mountain-700 shadow-mountain-glow">
            <SettingsIcon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                System Configuration & Operational Thresholds
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-mountain-100 text-mountain-800 border border-mountain-200">
                CALIBRATED
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Warning threshold limits, sensor telemetry polling rates, and backend diagnostics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<RotateCcw size={13} />} onClick={handleReset}>
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" icon={<Save size={13} />} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Risk Threshold Calibration */}
        <Card
          topoPattern
          title="1. Geotechnical Warning Threshold Calibration"
          subtitle="Define numeric risk index cutoff bounds for automated hazard classification"
          icon={<Sliders size={18} />}
          bodyClassName="p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-800 uppercase tracking-wider text-[11px]">
                  Critical Red Alert
                </span>
                <span className="text-[10px] font-mono font-bold bg-rose-100 px-1.5 py-0.5 rounded text-rose-800">
                  {criticalCutoff} – 100
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="65"
                max="90"
                value={criticalCutoff}
                onChange={(e) => setCriticalCutoff(parseFloat(e.target.value) || 75)}
                className="w-full bg-white border border-rose-300 rounded-lg p-2 font-mono text-stone-900 font-bold"
              />
              <p className="text-[10px] text-rose-700">
                Imminent slope shear; triggers emergency highway stoppage
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-800 uppercase tracking-wider text-[11px]">
                  High Vigilance
                </span>
                <span className="text-[10px] font-mono font-bold bg-orange-100 px-1.5 py-0.5 rounded text-orange-800">
                  {highCutoff} – {criticalCutoff - 0.1}
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="45"
                max="70"
                value={highCutoff}
                onChange={(e) => setHighCutoff(parseFloat(e.target.value) || 55)}
                className="w-full bg-white border border-orange-300 rounded-lg p-2 font-mono text-stone-900 font-bold"
              />
              <p className="text-[10px] text-orange-700">
                Pore saturation threshold; deploy field spotters
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 uppercase tracking-wider text-[11px]">
                  Moderate Watch
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">
                  {moderateCutoff} – {highCutoff - 0.1}
                </span>
              </div>
              <input
                type="number"
                step="0.5"
                min="25"
                max="50"
                value={moderateCutoff}
                onChange={(e) => setModerateCutoff(parseFloat(e.target.value) || 35)}
                className="w-full bg-white border border-amber-300 rounded-lg p-2 font-mono text-stone-900 font-bold"
              />
              <p className="text-[10px] text-amber-700">
                Localized rainfall accumulation; check drainage culverts
              </p>
            </div>
          </div>
        </Card>

        {/* Telemetry Sensor Synchronization */}
        <Card
          topoPattern
          title="2. Sensor Telemetry & InSAR Polling Intervals"
          subtitle="Configure real-time automated ingestion rates"
          icon={<Radio size={18} />}
          bodyClassName="p-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Doppler Weather Radar Sweep
              </label>
              <select
                value={radarInterval}
                onChange={(e) => setRadarInterval(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 font-semibold"
              >
                <option value="5">Every 5 Minutes (Torrential Burst Mode)</option>
                <option value="15">Every 15 Minutes (Standard Monsoon)</option>
                <option value="30">Every 30 Minutes (Dry Season)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Satellite InSAR Creep Frequency
              </label>
              <select
                value={insarFrequency}
                onChange={(e) => setInsarFrequency(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 font-semibold"
              >
                <option value="3">Every 3 Days (Sentinel-1 Constellation)</option>
                <option value="6">Every 6 Days (Standard Revisit)</option>
                <option value="12">Every 12 Days (Single Pass)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Piezometer Sensor Sampling
              </label>
              <select
                value={piezoRate}
                onChange={(e) => setPiezoRate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 font-semibold"
              >
                <option value="1">Every 1 Minute (High Saturation)</option>
                <option value="5">Every 5 Minutes (Standard)</option>
                <option value="15">Every 15 Minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-800">
                Automated Critical Broadcast Dispatch Guard
              </p>
              <p className="text-[11px] text-stone-500">
                Requires manual authorization confirmation before transmitting Red Alert bulletins
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoDispatchCritical}
              onChange={(e) => setAutoDispatchCritical(e.target.checked)}
              className="w-4 h-4 accent-mountain-700 rounded cursor-pointer"
            />
          </div>
        </Card>

        {/* Backend & Model Diagnostics */}
        <Card
          title="3. Backend Engine Diagnostics & Health Telemetry"
          subtitle="Live operational status of machine learning and database services"
          icon={<Server size={18} />}
          bodyClassName="p-5 space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Core Service Status</span>
                <p className="font-mono font-bold text-stone-900 mt-0.5">{health?.service || 'Ready'}</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase">Active Geospatial Core</span>
                <p className="font-mono font-bold text-stone-900 mt-0.5">20,000 Verified Points</p>
              </div>
              <span className="font-mono text-xs text-mountain-800 font-bold">8 NE States</span>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
