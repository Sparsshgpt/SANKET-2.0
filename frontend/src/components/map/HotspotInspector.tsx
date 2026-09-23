import React from 'react';
import { HotspotRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCoordinates, formatElevation, formatSlope, getRiskBadgeClasses } from '../../utils/formatters';
import { StrataIndicator } from '../widgets/StrataIndicator';
import { Button } from '../common/Button';
import {
  X,
  MapPin,
  Mountain,
  Droplets,
  AlertTriangle,
  Radio,
  Sliders,
  Compass,
  ArrowRight,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HotspotInspectorProps {
  hotspot: HotspotRecord | null;
  onClose: () => void;
}

export const HotspotInspector: React.FC<HotspotInspectorProps> = ({
  hotspot,
  onClose,
}) => {
  const { openBroadcastModal } = useApp();
  const navigate = useNavigate();

  if (!hotspot) return null;

  const badgeStyles = getRiskBadgeClasses(hotspot.risk_class);
  const moisturePct = (hotspot.soil_moisture !== undefined
    ? hotspot.soil_moisture > 1
      ? hotspot.soil_moisture
      : hotspot.soil_moisture * 100
    : 75.0);

  const handleDispatchAlert = () => {
    openBroadcastModal({
      state: hotspot.state,
      district: hotspot.district,
      latitude: hotspot.latitude,
      longitude: hotspot.longitude,
      risk_score: hotspot.risk_score,
      risk_class: hotspot.risk_class,
      message: `URGENT LANDSLIDE ADVISORY: Elevated slope failure risk detected at ${hotspot.district || hotspot.state} (${formatCoordinates(hotspot.latitude, hotspot.longitude)}). Soil saturation: ${moisturePct.toFixed(1)}%. Immediate traffic diversion and community warning recommended.`,
      severity: hotspot.risk_class === 'CRITICAL' ? 'Critical Hazard' : 'High Alert',
    });
  };

  const handleSimulate = () => {
    navigate('/analysis', {
      state: {
        presetFeatures: {
          latitude: hotspot.latitude,
          longitude: hotspot.longitude,
          elevation_m: hotspot.elevation_m || 1200,
          slope_deg: hotspot.slope_deg || 32,
          soil_moisture: moisturePct / 100,
          rainfall_24h_mm: hotspot.rainfall_24h_mm || 150,
          displacement_mm: hotspot.displacement_mm || 25,
          distance_to_road_km: hotspot.distance_to_road_km || 0.1,
          distance_to_settlement_km: hotspot.distance_to_settlement_km || 1.5,
        }
      }
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-l border-stone-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between topographic-lines bg-stone-50/80 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-mountain-100 text-mountain-800">
            <Compass size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Terrain Telemetry Inspector
            </span>
            <h3 className="text-sm font-bold text-stone-900 truncate max-w-[280px]">
              {hotspot.district || hotspot.state}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Risk Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${badgeStyles.bg} ${badgeStyles.border}`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${badgeStyles.dot}`} />
              <span className={`text-xs font-black uppercase tracking-wider ${badgeStyles.text}`}>
                {hotspot.risk_class} Hazard Zone
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Geospatially validated monitoring station
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black font-mono text-stone-900">
              {hotspot.risk_score.toFixed(1)}
            </span>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              / 100 Index
            </span>
          </div>
        </div>

        {/* Environmental & Terrain Matrix */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
            <span className="text-stone-500 flex items-center gap-1 mb-1">
              <Mountain size={13} className="text-mountain-700" /> Elevation
            </span>
            <span className="font-mono font-bold text-stone-900 text-sm">
              {formatElevation(hotspot.elevation_m)}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
            <span className="text-stone-500 flex items-center gap-1 mb-1">
              <Compass size={13} className="text-soil-700" /> Slope Gradient
            </span>
            <span className="font-mono font-bold text-stone-900 text-sm">
              {formatSlope(hotspot.slope_deg)}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
            <span className="text-stone-500 flex items-center gap-1 mb-1">
              <Droplets size={13} className="text-hydro" /> Soil Moisture
            </span>
            <span className="font-mono font-bold text-stone-900 text-sm">
              {moisturePct.toFixed(1)}%
            </span>
          </div>

          <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50">
            <span className="text-stone-500 flex items-center gap-1 mb-1">
              <AlertTriangle size={13} className="text-amber-600" /> InSAR Creep
            </span>
            <span className="font-mono font-bold text-stone-900 text-sm">
              {(hotspot.displacement_mm || 18.5).toFixed(1)} mm
            </span>
          </div>
        </div>

        {/* Strata Visualization */}
        <StrataIndicator
          soilMoisture={moisturePct / 100}
          clayPct={32}
          displacementMm={hotspot.displacement_mm || 24.5}
          geologyIndex={0.82}
        />

        {/* Infrastructure Exposure Details */}
        <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
          <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[11px] mb-2">
            Vulnerability & Corridor Proximity
          </h4>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-500">Distance to Transport Corridor:</span>
            <span className="font-mono font-bold text-stone-800">
              {(hotspot.distance_to_road_km || 0.12).toFixed(2)} km
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-500">Distance to Nearest Settlement:</span>
            <span className="font-mono font-bold text-stone-800">
              {(hotspot.distance_to_settlement_km || 1.8).toFixed(2)} km
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-100">
            <span className="text-stone-500">Coordinates:</span>
            <span className="font-mono text-stone-700">
              {formatCoordinates(hotspot.latitude, hotspot.longitude)}
            </span>
          </div>
          {hotspot.date && (
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Telemetry Timestamp:</span>
              <span className="font-mono text-stone-700">{hotspot.date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex flex-col gap-2 shrink-0">
        <Button
          variant={hotspot.risk_class === 'CRITICAL' ? 'danger' : 'primary'}
          icon={<Radio size={16} />}
          onClick={handleDispatchAlert}
          className="w-full justify-center font-bold"
        >
          Dispatch Emergency Early Warning
        </Button>

        <Button
          variant="outline"
          icon={<Sliders size={16} />}
          onClick={handleSimulate}
          className="w-full justify-center"
        >
          Simulate in AI Prediction Studio
        </Button>
      </div>
    </div>
  );
};
