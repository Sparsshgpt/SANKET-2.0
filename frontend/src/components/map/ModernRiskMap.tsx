import React, { useMemo, useEffect, useState } from 'react';
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
}) => {
  const [currentRegion, setCurrentRegion] = useState<string>(activeRegionId);
  const [baseTile, setBaseTile] = useState<'topo' | 'satellite' | 'street'>('topo');
  const [showOfficialBoundary, setShowOfficialBoundary] = useState<boolean>(true);

  const activeRegion = INDIA_REGIONS[currentRegion] || INDIA_REGIONS.all_india;
  const currentCenter = initialCenter || activeRegion.center;
  const currentZoom = initialZoom || activeRegion.zoom;

  const handleRegionSwitch = (regionId: string) => {
    setCurrentRegion(regionId);
    onRegionChange?.(regionId);
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

      {/* Floating Region Selector Bar (Top Left) */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-stone-200 shadow-elevated-earth z-[400] flex flex-wrap items-center gap-1 text-xs">
        <span className="px-2 font-bold text-stone-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
          <Globe size={11} className="text-mountain-700" />
          <span>Mountain Belts:</span>
        </span>
        {Object.values(INDIA_REGIONS).map((reg) => (
          <button
            key={reg.id}
            onClick={() => handleRegionSwitch(reg.id)}
            className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all ${
              currentRegion === reg.id
                ? 'bg-mountain-800 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {reg.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Official Survey of India Boundary Status (Top Center) */}
      <div className="hidden sm:flex absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-[11px] font-semibold text-stone-700 z-[400] items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <span>Official Survey of India Boundary (Full J&K, Ladakh & Aksai Chin)</span>
      </div>

      {/* Tile Switcher (Top Right) */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-stone-200 shadow-md z-[400] flex items-center gap-1 text-[11px]">
        <button
          onClick={() => setBaseTile('topo')}
          className={`px-2 py-0.5 rounded font-semibold ${
            baseTile === 'topo' ? 'bg-mountain-800 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Topographic
        </button>
        <button
          onClick={() => setBaseTile('satellite')}
          className={`px-2 py-0.5 rounded font-semibold ${
            baseTile === 'satellite' ? 'bg-mountain-800 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Satellite
        </button>
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
