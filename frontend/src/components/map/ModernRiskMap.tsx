import React, { useMemo, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { HotspotRecord } from '../../types';
import { getRiskColor, formatCoordinates, formatElevation, formatSlope } from '../../utils/formatters';
import { isWithinIndia, INDIA_MAP_BOUNDS, INDIA_REGIONS } from '../../utils/geo';
import indiaBoundary from '../../data/india-boundary.json';
import {
  Mountain,
  Droplets,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  Globe,
  Check,
  Info,
} from 'lucide-react';

interface ModernRiskMapProps {
  hotspots: HotspotRecord[];
  selectedHotspot?: HotspotRecord | null;
  onHotspotSelect?: (hotspot: HotspotRecord) => void;
  height?: string;
  zoom?: number;
  center?: [number, number];
  interactive?: boolean;
  activeRegionId?: string;
  onRegionChange?: (regionId: string) => void;
  showStationCount?: boolean;
  totalHotspotsCount?: number;
}

// Controller to smoothly pan/zoom map when user changes region
const MapViewController: React.FC<{
  center: [number, number];
  zoom: number;
  selectedSpot?: HotspotRecord | null;
}> = ({ center, zoom, selectedSpot }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedSpot) {
      map.flyTo([selectedSpot.latitude, selectedSpot.longitude], 11, {
        duration: 1.2,
      });
    } else {
      map.flyTo(center, zoom, {
        duration: 1.0,
      });
    }
  }, [center, zoom, selectedSpot, map]);

  return null;
};

export const ModernRiskMap: React.FC<ModernRiskMapProps> = ({
  hotspots,
  selectedHotspot,
  onHotspotSelect,
  height = '100%',
  zoom: initialZoom,
  center: initialCenter,
  interactive = true,
  activeRegionId = 'all_india',
  onRegionChange,
  showStationCount = true,
  totalHotspotsCount,
}) => {
  const [currentRegion, setCurrentRegion] = useState<string>(activeRegionId);
  const [baseTile, setBaseTile] = useState<'topo' | 'satellite' | 'street'>('topo');
  const [showOfficialBoundary, setShowOfficialBoundary] = useState<boolean>(true);
  const [showBoundaryInfo, setShowBoundaryInfo] = useState<boolean>(false);
  const boundaryInfoRef = useRef<HTMLDivElement>(null);

  // Sync activeRegionId if modified externally
  useEffect(() => {
    if (activeRegionId) {
      setCurrentRegion(activeRegionId);
    }
  }, [activeRegionId]);

  // Handle outside click to close boundary info tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boundaryInfoRef.current && !boundaryInfoRef.current.contains(event.target as Node)) {
        setShowBoundaryInfo(false);
      }
    };
    if (showBoundaryInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBoundaryInfo]);

  const activeRegion = INDIA_REGIONS[currentRegion] || INDIA_REGIONS.all_india;
  const currentCenter = initialCenter || activeRegion.center;
  const currentZoom = initialZoom || activeRegion.zoom;

  const handleRegionSwitch = (regionId: string) => {
    setCurrentRegion(regionId);
    onRegionChange?.(regionId);
  };

  const getRegionLabel = (regionId: string, fallbackName: string) => {
    switch (regionId) {
      case 'all_india':
        return 'Pan-India';
      case 'north_east':
        return 'North East';
      case 'himalayan_north':
        return 'Himalayan North';
      case 'western_ghats':
        return 'Western Ghats';
      default:
        return fallbackName.split(' (')[0];
    }
  };

  // Filter valid Indian territorial hotspots
  const displaySpots = useMemo(() => {
    return hotspots.filter((spot) => {
      if (!spot.latitude || !spot.longitude) return false;
      if (!isWithinIndia(spot.latitude, spot.longitude)) return false;
      if (currentRegion !== 'all_india') {
        const allowedStates = INDIA_REGIONS[currentRegion]?.states || [];
        return allowedStates.some(s => s.toLowerCase() === spot.state.toLowerCase());
      }
      return true;
    });
  }, [hotspots, currentRegion]);

  const tileUrls = {
    topo: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    street: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  };

  return (
    <div style={{ width: '100%', height }} className="relative z-0 overflow-hidden rounded-inherit select-none">
      <MapContainer
        center={currentCenter}
        zoom={currentZoom}
        minZoom={4}
        maxZoom={18}
        maxBounds={INDIA_MAP_BOUNDS}
        maxBoundsViscosity={0.9}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={false}
        className="h-full w-full"
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      >
        <MapViewController
          center={currentCenter}
          zoom={currentZoom}
          selectedSpot={selectedHotspot}
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileUrls[baseTile]}
        />

        {/* Survey of India Official External Boundary (Full Jammu & Kashmir + Ladakh + Arunachal Pradesh) */}
        {showOfficialBoundary && (
          <GeoJSON
            key={`soi-boundary-${currentRegion}`}
            data={indiaBoundary as any}
            style={() => ({
              color: '#14382E',
              weight: 2.8,
              opacity: 0.95,
              fillColor: '#204C3E',
              fillOpacity: 0.04,
            })}
          />
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={45}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
        >
          {displaySpots.map((spot, idx) => {
            const color = getRiskColor(spot.risk_class);
            const isSelected =
              selectedHotspot &&
              selectedHotspot.latitude === spot.latitude &&
              selectedHotspot.longitude === spot.longitude;

            const radius = isSelected
              ? 11
              : spot.risk_class === 'CRITICAL'
              ? 8
              : spot.risk_class === 'HIGH'
              ? 6.5
              : 5;

            return (
              <CircleMarker
                key={`${spot.state}-${spot.latitude}-${spot.longitude}-${idx}`}
                center={[spot.latitude, spot.longitude]}
                radius={radius}
                eventHandlers={{
                  click: () => onHotspotSelect?.(spot),
                }}
                pathOptions={{
                  color: isSelected ? '#0A1813' : color,
                  fillColor: color,
                  fillOpacity: isSelected ? 1 : 0.85,
                  weight: isSelected ? 3 : 1.5,
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[220px] text-stone-900 font-sans text-xs">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-2">
                      <div className="flex items-center gap-1 font-bold text-mountain-900 truncate">
                        <MapPin size={13} className="text-mountain-700 shrink-0" />
                        <span className="truncate">{spot.district || spot.state}</span>
                      </div>
                      <span
                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded text-white shrink-0 ml-1"
                        style={{ backgroundColor: color }}
                      >
                        {spot.risk_class}
                      </span>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-1 text-stone-600">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-500">Predicted Threat:</span>
                        <span className="font-mono font-bold text-sm" style={{ color }}>
                          {spot.risk_score.toFixed(1)} / 100
                        </span>
                      </div>

                      {spot.elevation_m !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-stone-500 flex items-center gap-1">
                            <Mountain size={11} /> Elevation:
                          </span>
                          <span className="font-mono font-medium">
                            {formatElevation(spot.elevation_m)}
                          </span>
                        </div>
                      )}

                      {spot.slope_deg !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-stone-500">Slope Gradient:</span>
                          <span className="font-mono font-medium">{formatSlope(spot.slope_deg)}</span>
                        </div>
                      )}

                      {spot.soil_moisture !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-stone-500 flex items-center gap-1">
                            <Droplets size={11} /> Soil Saturation:
                          </span>
                          <span className="font-mono font-medium">
                            {(spot.soil_moisture > 1 ? spot.soil_moisture : spot.soil_moisture * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}

                      <div className="pt-1.5 border-t border-stone-100 flex justify-between text-[10px] text-stone-400 font-mono">
                        <span>Coordinates:</span>
                        <span>{formatCoordinates(spot.latitude, spot.longitude)}</span>
                      </div>
                    </div>

                    {/* Inspector Action */}
                    <div className="mt-2.5 pt-2 border-t border-stone-200">
                      <button
                        onClick={() => onHotspotSelect?.(spot)}
                        className="w-full py-1 px-2 rounded bg-mountain-800 hover:bg-mountain-700 text-white font-semibold flex items-center justify-center gap-1.5 text-[11px] transition-colors"
                      >
                        <span>Open Detailed Inspector</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Top Map Controls Header Layer */}
      <div className="absolute top-3 inset-x-3 z-[400] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pointer-events-none">
        {/* Left Floating Controls Stack: Mountain Belts & Station Count */}
        <div className="flex flex-col items-start gap-2.5 max-w-full sm:max-w-md pointer-events-none">
          {/* 1. Mountain Belts Geographic Filter Card */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-stone-200/90 shadow-soft-earth flex flex-col gap-2 w-full sm:w-auto">
            <div className="px-1 font-bold text-stone-500 tracking-wider text-[10px] flex items-center gap-1.5 shrink-0 uppercase select-none">
              <Mountain size={12} className="text-mountain-700 shrink-0" />
              <span>MOUNTAIN BELTS</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100/90 p-1 rounded-lg">
              {Object.values(INDIA_REGIONS).map((reg) => {
                const isActive = currentRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => handleRegionSwitch(reg.id)}
                    aria-pressed={isActive}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-mountain-800 text-white font-semibold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                    }`}
                  >
                    {getRegionLabel(reg.id, reg.name)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Station Count Badge (Below Mountain Belts with Clear Gap) */}
          {showStationCount && (
            <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/90 shadow-soft-earth text-xs font-semibold text-stone-700 flex items-center gap-2 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                Showing {displaySpots.length} of {totalHotspotsCount ?? hotspots.length} Indian Mountain Stations
              </span>
            </div>
          )}
        </div>

        {/* Right Floating Controls Stack: Survey of India Boundary Status & Map Style Toggle */}
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 pointer-events-none shrink-0 self-start sm:self-auto">
          {/* Survey of India Boundary Status & Info */}
          <div ref={boundaryInfoRef} className="pointer-events-auto relative flex items-center">
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-stone-200/90 shadow-soft-earth text-[11px] font-medium text-stone-700 flex items-center gap-1.5 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-100 shrink-0" />
              <span className="font-semibold text-stone-800 whitespace-nowrap">Survey of India Boundary</span>
              <button
                type="button"
                onClick={() => setShowBoundaryInfo((prev) => !prev)}
                onMouseEnter={() => setShowBoundaryInfo(true)}
                onMouseLeave={() => setShowBoundaryInfo(false)}
                className="text-stone-400 hover:text-stone-700 transition-colors p-0.5 rounded-full hover:bg-stone-100 focus:outline-none flex items-center justify-center ml-0.5 cursor-pointer"
                aria-label="Boundary Information"
                title="Boundary details"
              >
                <Info size={13} className="shrink-0" />
              </button>
            </div>

            {/* Info Popover / Tooltip */}
            {showBoundaryInfo && (
              <div
                className="absolute top-full mt-2 right-0 sm:left-1/2 sm:-translate-x-1/2 w-64 sm:w-72 p-2.5 bg-stone-900/95 text-stone-100 text-[11px] font-normal rounded-xl shadow-xl border border-stone-700/80 backdrop-blur-md z-[500] text-center leading-relaxed pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
                role="tooltip"
                onMouseEnter={() => setShowBoundaryInfo(true)}
                onMouseLeave={() => setShowBoundaryInfo(false)}
              >
                Boundary visualization based on the Survey of India map/boundary dataset used by SANKET.
                <div className="absolute -top-1 right-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto w-2 h-2 bg-stone-900/95 rotate-45 border-l border-t border-stone-700/80" />
              </div>
            )}
          </div>

          {/* Map Layer Segmented Toggle: [ Topographic | Satellite ] */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-1 rounded-xl border border-stone-200/90 shadow-soft-earth flex items-center text-[11px]">
            <div className="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setBaseTile('topo')}
                aria-pressed={baseTile === 'topo'}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  baseTile === 'topo'
                    ? 'bg-mountain-800 text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                }`}
              >
                <Layers size={12} className={baseTile === 'topo' ? 'text-mountain-200' : 'text-stone-500'} />
                <span>Topographic</span>
              </button>
              <button
                type="button"
                onClick={() => setBaseTile('satellite')}
                aria-pressed={baseTile === 'satellite'}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  baseTile === 'satellite'
                    ? 'bg-mountain-800 text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                }`}
              >
                <Globe size={12} className={baseTile === 'satellite' ? 'text-mountain-200' : 'text-stone-500'} />
                <span>Satellite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Natural Map Legend (Bottom Right) */}
      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-stone-200/90 shadow-elevated-earth z-[400] text-xs pointer-events-auto">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
          <Mountain size={11} className="text-mountain-700" />
          <span>Terrain Hazard Scale</span>
        </p>
        <div className="space-y-1">
          {[
            { label: 'Critical (75–100)', color: '#BE123C' },
            { label: 'High (55–74.9)', color: '#C2410C' },
            { label: 'Moderate (35–54.9)', color: '#B45309' },
            { label: 'Low (0–34.9)', color: '#15803D' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-medium text-stone-700">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
