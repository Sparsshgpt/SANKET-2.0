import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SummaryStats, HotspotRecord } from '../types';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/widgets/MetricCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ModernRiskMap } from '../components/map/ModernRiskMap';
import { Skeleton } from '../components/common/Skeleton';
import { MOCK_STATE_STATISTICS, MOCK_HISTORICAL_DATA } from '../services/mockData';
import { formatCoordinates, formatElevation, formatSlope, getRiskBadgeClasses } from '../utils/formatters';
import {
  Mountain,
  AlertTriangle,
  ShieldCheck,
  Droplets,
  Layers,
  Radio,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  Clock,
  Compass,
  Search,
  Globe,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedHotspot, openBroadcastModal } = useApp();

  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [hotspots, setHotspots] = useState<HotspotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');
  const [feedSearch, setFeedSearch] = useState<string>('');
  const [activeRegion, setActiveRegion] = useState<string>('all_india');
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  const loadData = async () => {
    try {
      setLoading(true);
      const [sumData, spotData] = await Promise.all([
        api.getSummary(),
        api.getHotspots({ limit: 200 }),
      ]);
      setSummary(sumData);
      setHotspots(spotData);
      setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Handled in api client
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered hotspots for mini radar map
  const filteredHotspots = useMemo(() => {
    if (selectedRiskFilter === 'ALL') return hotspots;
    return hotspots.filter((h) => h.risk_class === selectedRiskFilter);
  }, [hotspots, selectedRiskFilter]);

  // Priority threats for immediate action feed
  const priorityThreats = useMemo(() => {
    return [...hotspots]
      .filter((h) => {
        const matchesClass = h.risk_class === 'CRITICAL' || h.risk_class === 'HIGH';
        if (!matchesClass) return false;
        if (feedSearch.trim()) {
          const q = feedSearch.toLowerCase();
          return (
            h.district?.toLowerCase().includes(q) ||
            h.state.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.risk_score - a.risk_score)
      .slice(0, 7);
  }, [hotspots, feedSearch]);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Environmental Telemetry Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-soft-earth flex flex-col md:flex-row items-start md:items-center justify-between gap-4 topographic-lines">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-mountain-900 border border-mountain-700 flex items-center justify-center text-emerald-400 shrink-0 shadow-mountain-glow">
            <Mountain size={24} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                National Mountain Risk Command Dashboard
              </h2>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                ACTIVE SURVEILLANCE
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Live multi-sensor geotechnical and antecedent precipitation surveillance across India's mountain corridors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto text-xs">
          <span className="text-stone-400 font-mono text-[11px] hidden sm:inline">
            Updated: {lastRefreshed}
          </span>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={13} className={loading ? 'animate-spin' : ''} />}
            onClick={loadData}
          >
            Refresh
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Radio size={13} />}
            onClick={() => openBroadcastModal()}
          >
            Dispatch Warning
          </Button>
        </div>
      </div>

      {/* KPI Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton height={110} />
            <Skeleton height={110} />
            <Skeleton height={110} />
            <Skeleton height={110} />
          </>
        ) : (
          <>
            <MetricCard
              label="Critical Hazard Sectors"
              value={summary?.critical_zones.toLocaleString() || '1,420'}
              unit="quadrants"
              sublabel="Active slope shear risk"
              icon={<AlertTriangle size={20} />}
              variant="critical"
              trend={{ value: 'Elevated monsoon alert', direction: 'up', isGood: false }}
              onClick={() => setSelectedRiskFilter('CRITICAL')}
            />

            <MetricCard
              label="High Vigilance Corridors"
              value={summary?.high_risk_zones.toLocaleString() || '3,890'}
              unit="sectors"
              sublabel="Antecedent saturation alert"
              icon={<Compass size={20} />}
              variant="warning"
              trend={{ value: '44 National Highway cuts', direction: 'neutral' }}
              onClick={() => setSelectedRiskFilter('HIGH')}
            />

            <MetricCard
              label="Peak Soil Saturation"
              value="97.5%"
              unit="saturation"
              sublabel="Wayanad & Sohra Ridge"
              icon={<Droplets size={20} />}
              variant="soil"
              trend={{ value: 'Above critical shear limit', direction: 'up', isGood: false }}
            />

            <MetricCard
              label="Total Monitored Terrain"
              value={summary?.total_records.toLocaleString() || '20,000'}
              unit="points"
              sublabel="Himalayas, NE & Western Ghats"
              icon={<Mountain size={20} />}
              variant="mountain"
              trend={{ value: '12 States connected', direction: 'neutral', isGood: true }}
              onClick={() => setSelectedRiskFilter('ALL')}
            />
          </>
        )}
      </div>

      {/* Dual Pane: Proper Indian GIS Threat Radar + 7-Year Antecedent Rainfall Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Indian GIS Threat Radar (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            topoPattern
            title="Pan-India Mountain Threat Radar"
            subtitle="Geospatial distribution across the Himalayas, North East & Western Ghats"
            headerAction={
              <div className="flex items-center gap-1.5">
                <div className="flex bg-stone-200/70 p-0.5 rounded-lg text-[11px] font-semibold text-stone-700">
                  <button
                    onClick={() => setSelectedRiskFilter('ALL')}
                    className={`px-2 py-0.5 rounded ${
                      selectedRiskFilter === 'ALL'
                        ? 'bg-white shadow-sm text-stone-900 font-bold'
                        : ''
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedRiskFilter('CRITICAL')}
                    className={`px-2 py-0.5 rounded ${
                      selectedRiskFilter === 'CRITICAL'
                        ? 'bg-rose-600 text-white font-bold'
                        : ''
                    }`}
                  >
                    Critical
                  </button>
                  <button
                    onClick={() => setSelectedRiskFilter('HIGH')}
                    className={`px-2 py-0.5 rounded ${
                      selectedRiskFilter === 'HIGH'
                        ? 'bg-orange-600 text-white font-bold'
                        : ''
                    }`}
                  >
                    High
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowRight size={13} />}
                  iconPosition="right"
                  onClick={() => navigate('/map')}
                  className="hidden sm:inline-flex text-xs py-1"
                >
                  Full GIS Explorer
                </Button>
              </div>
            }
            bodyClassName="p-0 h-[380px] sm:h-[430px]"
          >
            <ModernRiskMap
              hotspots={filteredHotspots}
              onHotspotSelect={(spot) => setSelectedHotspot(spot)}
              activeRegionId={activeRegion}
              onRegionChange={(reg) => setActiveRegion(reg)}
            />
          </Card>
        </div>

        {/* Right: Antecedent Rainfall vs Incident Correlation (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Rainfall vs Slope Failure Correlation"
            subtitle="7-Year Antecedent precipitation vs recorded landslides (2018–2025)"
            headerAction={
              <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600 font-bold">
                Multi-Year Core
              </span>
            }
            bodyClassName="p-4"
          >
            <div className="h-[330px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_HISTORICAL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E6E4" vertical={false} />
                  <XAxis dataKey="year" stroke="#6D7C78" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" stroke="#387360" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#BE123C" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.75rem',
                      border: '1px solid #D6DFDD',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="avgRainfall"
                    name="Antecedent Rainfall (mm)"
                    fill="#387360"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="events"
                    name="Landslide Events"
                    stroke="#BE123C"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#BE123C' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Primary Failure Trigger: Cumulative 72h precipitation &gt; 220mm</span>
              <span className="font-bold text-mountain-800">R² = 0.89</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Regional Threat Matrix & Priority Incident Action Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Breakdown Table (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="State-Wise Mountain Vulnerability"
            subtitle="Geospatial hazard density across Indian mountain states"
            bodyClassName="p-0 overflow-hidden"
          >
            <div className="divide-y divide-stone-100 text-xs max-h-[380px] overflow-y-auto">
              {MOCK_STATE_STATISTICS.map((st) => (
                <div
                  key={st.state}
                  className="px-4 py-2.5 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-stone-900 block truncate">
                      {st.state}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {st.totalHotspots.toLocaleString()} sectors monitored
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {st.critical} Critical
                    </span>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {st.high} High
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Priority Threat Feed (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title="Urgent Hazard Feed — Immediate Action Required"
            subtitle="Priority sectors exceeding critical shear and saturation thresholds"
            headerAction={
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Filter sectors..."
                    value={feedSearch}
                    onChange={(e) => setFeedSearch(e.target.value)}
                    className="pl-7 pr-2 py-1 bg-stone-100 border border-stone-200 rounded-lg text-[11px] w-28 sm:w-36 focus:outline-none focus:bg-white"
                  />
                </div>
                <Badge variant="risk" riskClass="CRITICAL" pulse size="xs">
                  Active
                </Badge>
              </div>
            }
            bodyClassName="p-0 divide-y divide-stone-100 max-h-[380px] overflow-y-auto"
          >
            {priorityThreats.map((spot) => {
              const badgeStyles = getRiskBadgeClasses(spot.risk_class);
              return (
                <div
                  key={spot.id || spot.district}
                  className="p-4 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${badgeStyles.dot}`} />
                      <span className="font-bold text-stone-900 text-sm truncate">
                        {spot.district || spot.state}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.2 rounded ${badgeStyles.badge}`}
                      >
                        {spot.risk_class}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Mountain size={12} className="text-mountain-700" />
                        {formatElevation(spot.elevation_m)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Compass size={12} className="text-soil-700" />
                        {formatSlope(spot.slope_deg)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets size={12} className="text-hydro" />
                        {(spot.soil_moisture || 85).toFixed(1)}% sat
                      </span>
                      <span className="font-mono text-stone-400">
                        {formatCoordinates(spot.latitude, spot.longitude)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedHotspot(spot)}
                      className="text-xs py-1"
                    >
                      Inspect
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Radio size={12} />}
                      onClick={() => {
                        openBroadcastModal({
                          state: spot.state,
                          district: spot.district,
                          latitude: spot.latitude,
                          longitude: spot.longitude,
                          risk_score: spot.risk_score,
                          risk_class: spot.risk_class,
                          message: `URGENT RED WARNING: Active slope instability detected at ${spot.district || spot.state}. Immediate diversion of highway traffic and evacuation of vulnerable road cut sectors advised.`,
                        });
                      }}
                      className="text-xs py-1 font-semibold"
                    >
                      Warn
                    </Button>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
};
