import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { HotspotRecord, RiskClass } from '../types';
import { useApp } from '../context/AppContext';
import { ModernRiskMap } from '../components/map/ModernRiskMap';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatCoordinates, formatElevation, formatSlope, getRiskBadgeClasses } from '../utils/formatters';
import { INDIA_REGIONS } from '../utils/geo';
import {
  MapPin,
  Filter,
  Search,
  Mountain,
  Droplets,
  Radio,
  SlidersHorizontal,
  Compass,
  RotateCcw,
  List,
  Layers,
  Globe,
} from 'lucide-react';

const ALL_INDIAN_STATES = [
  'ALL',
  'Meghalaya',
  'Assam',
  'Uttarakhand',
  'Himachal Pradesh',
  'Kerala',
  'Sikkim',
  'Arunachal Pradesh',
  'Jammu & Kashmir',
  'Ladakh',
  'Mizoram',
  'Nagaland',
  'Manipur',
  'Maharashtra',
  'Tripura',
];

export const MapExplorerPage: React.FC = () => {
  const { setSelectedHotspot, openBroadcastModal } = useApp();

  const [hotspots, setHotspots] = useState<HotspotRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeRegion, setActiveRegion] = useState<string>('all_india');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskClass>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showListSidebar, setShowListSidebar] = useState<boolean>(true);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        setLoading(true);
        const data = await api.getHotspots();
        setHotspots(data);
      } catch {
        // Fallback handled in API
      } finally {
        setLoading(false);
      }
    };
    fetchHotspots();
  }, []);

  // Filtered hotspots based on user selections and region
  const filteredSpots = useMemo(() => {
    const regionStates = INDIA_REGIONS[activeRegion]?.states || [];
    return hotspots.filter((spot) => {
      // Region
      if (activeRegion !== 'all_india') {
        const matchesRegion = regionStates.some(
          (s) => s.toLowerCase() === spot.state.toLowerCase()
        );
        if (!matchesRegion) return false;
      }
      // Risk severity
      if (riskFilter !== 'ALL' && spot.risk_class !== riskFilter) {
        return false;
      }
      // State
      if (stateFilter !== 'ALL' && spot.state.toLowerCase() !== stateFilter.toLowerCase()) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDistrict = spot.district?.toLowerCase().includes(q);
        const matchesState = spot.state.toLowerCase().includes(q);
        const matchesCoord = `${spot.latitude},${spot.longitude}`.includes(q);
        if (!matchesDistrict && !matchesState && !matchesCoord) {
          return false;
        }
      }
      return true;
    });
  }, [hotspots, activeRegion, riskFilter, stateFilter, searchQuery]);

  const handleResetFilters = () => {
    setActiveRegion('all_india');
    setRiskFilter('ALL');
    setStateFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Console */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-soft-earth flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            type="text"
            placeholder="Search district, corridor, or coordinates (e.g. Wayanad, Joshimath, 25.2)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-mountain-600 focus:bg-white transition-all text-xs"
          />
        </div>

        {/* State Dropdown & Risk Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* State select */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-semibold focus:outline-none focus:ring-2 focus:ring-mountain-600 text-xs"
          >
            {ALL_INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Mountain States' : s}
              </option>
            ))}
          </select>

          {/* Risk severity buttons */}
          <div className="flex bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  riskFilter === r
                    ? r === 'CRITICAL'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : r === 'HIGH'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : r === 'MODERATE'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : r === 'LOW'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Reset button */}
          {(riskFilter !== 'ALL' || stateFilter !== 'ALL' || searchQuery || activeRegion !== 'all_india') && (
            <button
              onClick={handleResetFilters}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw size={15} />
            </button>
          )}

          {/* Toggle list sidebar button */}
          <button
            onClick={() => setShowListSidebar(!showListSidebar)}
            className={`p-2 rounded-xl border transition-colors ${
              showListSidebar
                ? 'bg-mountain-100 text-mountain-800 border-mountain-300'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Toggle Station List"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Main Map & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[560px]">
        {/* Interactive Full Leaflet Indian GIS Map */}
        <div
          className={`${
            showListSidebar ? 'lg:col-span-8' : 'lg:col-span-12'
          } h-full rounded-2xl overflow-hidden border border-stone-200/90 shadow-soft-earth relative bg-white transition-all duration-200`}
        >
          <ModernRiskMap
            hotspots={filteredSpots}
            onHotspotSelect={(spot) => setSelectedHotspot(spot)}
            activeRegionId={activeRegion}
            onRegionChange={(reg) => setActiveRegion(reg)}
            height="100%"
          />

          {/* Filter Status Badge */}
          <div className="absolute top-14 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-stone-200 shadow-md text-xs font-semibold text-stone-700 z-[400] pointer-events-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Showing {filteredSpots.length} of {hotspots.length} Indian Mountain Stations
            </span>
          </div>
        </div>

        {/* Collapsible Station List Sidebar */}
        {showListSidebar && (
          <div className="lg:col-span-4 h-full bg-white rounded-2xl border border-stone-200/90 shadow-soft-earth flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 bg-stone-50 flex items-center justify-between shrink-0">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Mountain size={14} className="text-mountain-800" />
                Target Stations ({filteredSpots.length})
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Click to inspect</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 space-y-1">
              {filteredSpots.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400 space-y-2">
                  <Compass size={28} className="mx-auto text-stone-300" />
                  <p>No stations match current filter criteria.</p>
                  <Button variant="outline" size="sm" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                filteredSpots.map((spot) => {
                  const badgeStyles = getRiskBadgeClasses(spot.risk_class);
                  return (
                    <div
                      key={spot.id || `${spot.latitude}-${spot.longitude}`}
                      onClick={() => setSelectedHotspot(spot)}
                      className="p-3 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer border border-transparent hover:border-stone-200 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-stone-900 truncate">
                          {spot.district || spot.state}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.2 rounded shrink-0 ${badgeStyles.badge}`}
                        >
                          {spot.risk_class}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>Risk Index:</span>
                        <span className="font-mono font-bold text-stone-900">
                          {spot.risk_score.toFixed(1)} / 100
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span>{formatElevation(spot.elevation_m)}</span>
                        <span>{formatCoordinates(spot.latitude, spot.longitude)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
