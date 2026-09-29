import React, { useMemo, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, GeoJSON, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HotspotRecord } from '../../types';
import { getRiskColor, formatCoordinates, formatElevation, formatSlope, RISK_COLORS, RiskLevel } from '../../utils/formatters';
import { isWithinIndia, INDIA_MAP_BOUNDS, INDIA_REGIONS } from '../../utils/geo';
import indiaBoundary from '../../data/india-boundary.json';
import {
  Mountain,
  Droplets,
  MapPin,
  ArrowRight,
  Layers,
  Globe,
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

// Custom Cluster Icon Generator: Sized by count, colored by worst hazard inside
const createCustomClusterIcon = (cluster: any) => {
  const markers = cluster.getAllChildMarkers();
  let worstSeverity: RiskLevel = 'LOW';

  for (const marker of markers) {
    const risk = ((marker.options as any)?.riskClass || (marker.options as any)?.alt) as RiskLevel;
    if (risk === 'CRITICAL') {
      worstSeverity = 'CRITICAL';
      break;
    } else if (risk === 'HIGH') {
      worstSeverity = 'HIGH';
    } else if (risk === 'MODERATE' && worstSeverity !== 'HIGH') {
      worstSeverity = 'MODERATE';
    }
  }

  const count = cluster.getChildCount();
  const color = RISK_COLORS[worstSeverity] || RISK_COLORS.LOW;

  let size = 30;
  if (count >= 20) size = 42;
  else if (count >= 10) size = 36;
  else if (count >= 5) size = 32;

  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 2.5px solid rgba(255, 255, 255, 0.95);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      color: #ffffff;
      font-weight: 700;
      font-size: ${size <= 32 ? 11 : 12}px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    "><span>${count}</span></div>`,
    className: 'sanket-cluster-icon',
    iconSize: L.point(size, size, true),
  });
};

// Controller to smoothly pan/zoom map and fit stations on initial load
const MapViewController: React.FC<{
  center: [number, number];
  zoom: number;
  selectedSpot?: HotspotRecord | null;
  displaySpots: HotspotRecord[];
}> = ({ center, zoom, selectedSpot, displaySpots }) => {
  const map = useMap();
  const initialFitDone = useRef(false);

  useEffect(() => {
    if (selectedSpot) {
      map.flyTo([selectedSpot.latitude, selectedSpot.longitude], 11, {
        duration: 1.2,
      });
    } else if (!initialFitDone.current && displaySpots.length > 0) {
      initialFitDone.current = true;
      const validSpots = displaySpots.filter((s) => s.latitude && s.longitude);
      if (validSpots.length > 0) {
        const bounds = L.latLngBounds(
          validSpots.map((s) => [s.latitude, s.longitude] as [number, number])
        );
        map.fitBounds(bounds, {
          paddingTopLeft: [20, 60],
          paddingBottomRight: [20, 20],
          maxZoom: 5.5,
          animate: true,
        });
      }
    } else {
      map.flyTo(center, zoom, {
        duration: 1.0,
      });
    }
  }, [center, zoom, selectedSpot, map, displaySpots]);

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
        return allowedStates.some((s) => s.toLowerCase() === spot.state.toLowerCase());
      }
      return true;
    });
  }, [hotspots, currentRegion]);

  // Clean, watermark-free high-precision GIS basemaps
  const tileUrls = {
    topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    street: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  };

  return (
    <div style={{ width: '100%', height }} className="relative z-0 overflow-hidden rounded-inherit select-none">
      <MapContainer
        center={currentCenter}
        zoom={currentZoom}
        minZoom={4.2}
        maxZoom={18}
        maxBounds={INDIA_MAP_BOUNDS}
        maxBoundsViscosity={0.95}
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
          displaySpots={displaySpots}
        />

        <TileLayer
          attribution={
            baseTile === 'satellite'
              ? '&copy; Esri, Maxar, Earthstar Geographics'
              : '&copy; Esri, USGS, NOAA &copy; OpenStreetMap'
          }
          url={tileUrls[baseTile]}
        />

        {/* Survey of India Official External Boundary (Thinned to ~2px with softer color) */}
        {showOfficialBoundary && (
          <GeoJSON
            key={`soi-boundary-${currentRegion}`}
            data={indiaBoundary as any}
            style={() => ({
              color: '#335C4D',
              weight: 2.0,
              opacity: 0.85,
              fillColor: '#335C4D',
              fillOpacity: 0.02,
            })}
          />
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={40}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          zoomToBoundsOnClick={true}
          iconCreateFunction={createCustomClusterIcon}
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
                {...({ riskClass: spot.risk_class } as any)}
                pathOptions={{
                  color: isSelected ? '#0A1813' : color,
                  fillColor: color,
                  fillOpacity: isSelected ? 1 : 0.85,
                  weight: isSelected ? 3.5 : 1.5,
                }}
              >
                {/* Station Hover Tooltip: Name + Hazard Score */}
                <Tooltip direction="top" offset={[0, -radius]} opacity={0.98}>
                  <div className="text-[11px] font-sans font-semibold py-0.5 px-1 flex items-center gap-1.5 whitespace-nowrap">
                    <span className="text-stone-900">{spot.district || spot.state}</span>
                    <span
                      className="font-mono font-bold px-1.5 py-0.5 rounded text-[10px] text-white"
                      style={{ backgroundColor: color }}
                    >
                      {spot.risk_score.toFixed(1)}
                    </span>
                  </div>
                </Tooltip>

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
                        className="w-full py-1 px-2 rounded bg-mountain-800 hover:bg-mountain-700 text-white font-semibold flex items-center justify-center gap-1.5 text-[11px] transition-colors cursor-pointer"
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
      <div className="absolute top-2.5 inset-x-2.5 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Compact Merged Toolbar (Mountain Belts + Station Count) */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-stone-200/90 shadow-soft-earth flex items-center gap-1.5 max-w-full overflow-x-auto text-xs shrink-0">
          <div className="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-lg shrink-0">
            {Object.values(INDIA_REGIONS).map((reg) => {
              const isActive = currentRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handleRegionSwitch(reg.id)}
                  aria-pressed={isActive}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-mountain-800 text-white font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                >
                  {getRegionLabel(reg.id, reg.name)}
                </button>
              );
            })}
          </div>

          {showStationCount && (
            <>
              <div className="w-px h-3.5 bg-stone-200 shrink-0" />
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-700 shrink-0 select-none whitespace-nowrap pr-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>
                  {displaySpots.length} of {totalHotspotsCount ?? hotspots.length} Stations
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right Floating Controls: Survey of India Boundary Status & Map Style Toggle */}
        <div className="flex items-center justify-end gap-1.5 pointer-events-none shrink-0">
          {/* Survey of India Boundary Status & Info */}
          <div ref={boundaryInfoRef} className="pointer-events-auto relative flex items-center">
            <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-stone-200/90 shadow-soft-earth text-[11px] font-medium text-stone-700 flex items-center gap-1 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ring-2 ring-emerald-100 shrink-0" />
              <span className="font-semibold text-stone-800 whitespace-nowrap hidden sm:inline">SOI Boundary</span>
              <button
                type="button"
                onClick={() => setShowBoundaryInfo((prev) => !prev)}
                onMouseEnter={() => setShowBoundaryInfo(true)}
                onMouseLeave={() => setShowBoundaryInfo(false)}
                className="text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-100 focus:outline-none flex items-center justify-center cursor-pointer"
                aria-label="Boundary Information"
                title="Boundary details"
              >
                <Info size={12} className="shrink-0" />
              </button>
            </div>

            {/* Info Popover / Tooltip */}
            {showBoundaryInfo && (
              <div
                className="absolute top-full mt-2 right-0 w-64 sm:w-72 p-2.5 bg-stone-900/95 text-stone-100 text-[11px] font-normal rounded-xl shadow-xl border border-stone-700/80 backdrop-blur-md z-[500] text-center leading-relaxed pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
                role="tooltip"
                onMouseEnter={() => setShowBoundaryInfo(true)}
                onMouseLeave={() => setShowBoundaryInfo(false)}
              >
                Boundary visualization based on the Survey of India map/boundary dataset used by SANKET.
                <div className="absolute -top-1 right-4 w-2 h-2 bg-stone-900/95 rotate-45 border-l border-t border-stone-700/80" />
              </div>
            )}
          </div>

          {/* Map Layer Segmented Toggle: [ Topographic | Satellite ] */}
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-0.5 rounded-xl border border-stone-200/90 shadow-soft-earth flex items-center text-[11px]">
            <div className="flex items-center gap-0.5 bg-stone-100/90 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setBaseTile('topo')}
                aria-pressed={baseTile === 'topo'}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-all duration-150 whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  baseTile === 'topo'
                    ? 'bg-mountain-800 text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                }`}
              >
                <Layers size={11} className={baseTile === 'topo' ? 'text-mountain-200' : 'text-stone-500'} />
                <span>Topographic</span>
              </button>
              <button
                type="button"
                onClick={() => setBaseTile('satellite')}
                aria-pressed={baseTile === 'satellite'}
                className={`px-2 py-0.5 rounded-md text-[11px] transition-all duration-150 whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  baseTile === 'satellite'
                    ? 'bg-mountain-800 text-white font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-medium'
                }`}
              >
                <Globe size={11} className={baseTile === 'satellite' ? 'text-mountain-200' : 'text-stone-500'} />
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
            { label: 'Critical (75–100)', color: RISK_COLORS.CRITICAL },
            { label: 'High (55–74.9)', color: RISK_COLORS.HIGH },
            { label: 'Moderate (35–54.9)', color: RISK_COLORS.MODERATE },
            { label: 'Low (0–34.9)', color: RISK_COLORS.LOW },
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

