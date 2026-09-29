import React, { useState, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MOCK_HISTORICAL_DATA, MOCK_STATE_STATISTICS } from '../services/mockData';
import {
  getSeasonalityData,
  calculatePeakRiskMetrics,
  MonthlySeasonalityRecord,
} from '../data/seasonalityData';
import {
  History,
  TrendingUp,
  Droplets,
  Mountain,
  PieChart as PieChartIcon,
  Calendar,
  Layers,
  Filter,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const FAILURE_MECHANISMS = [
  { name: 'Pore-Water Saturation Debris Flow', value: 46, color: '#BE123C' },
  { name: 'Escarpment Toe-Cut Erosion', value: 28, color: '#C2410C' },
  { name: 'Structural Joint Rockfall', value: 16, color: '#B45309' },
  { name: 'Highway Cutting Regolith Creep', value: 10, color: '#15803D' },
];

export const AnalyticsPage: React.FC = () => {
  // Filter period state: '2026' (Current Live YTD), 'ALL' (2018-2025 Baseline), or historical year
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  // Dynamically resolve monthly seasonality series (auto-detects system date for future months)
  const seasonalityResult = useMemo(() => {
    return getSeasonalityData(selectedYear);
  }, [selectedYear]);

  // Dynamically calculate peak risk months & percentage strictly from actual available data
  const peakMetrics = useMemo(() => {
    return calculatePeakRiskMetrics(seasonalityResult.data);
  }, [seasonalityResult.data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-soft-earth flex flex-col md:flex-row items-start md:items-center justify-between gap-4 topographic-lines">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-mountain-900 text-emerald-400 border border-mountain-700 shadow-mountain-glow">
            <History size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                Historical Geotechnical Analytics & Trends
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-mountain-100 text-mountain-800 border border-mountain-200">
                2018 — 2025 ARCHIVE
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Multi-year precipitation triggers, seasonal peaks, and physical slope failure mechanics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Filter Period:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-mountain-600 text-xs shadow-xs"
          >
            <option value="2026">2026 Season (Current Live YTD)</option>
            <option value="ALL">Historical Baseline (2018–2025 Archive)</option>
            <option value="2025">2025 Season (Historical Archive)</option>
            <option value="2024">2024 Season (Historical Archive)</option>
            <option value="2023">2023 Season (Historical Archive)</option>
          </select>
        </div>
      </div>

      {/* Main Charts Row 1: 7-Year Temporal Correlation + Seasonal Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Year Trend Composed Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            topoPattern
            title="Multi-Year Antecedent Precipitation vs Landslide Triggers"
            subtitle="Evaluating correlation between annual rainfall and recorded slope failures (2018–2025)"
            bodyClassName="p-4"
          >
            <div className="h-[320px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_HISTORICAL_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E6E4" vertical={false} />
                  <XAxis dataKey="year" stroke="#6D7C78" />
                  <YAxis yAxisId="left" stroke="#387360" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#BE123C" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.75rem',
                      border: '1px solid #D6DFDD',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="avgRainfall"
                    name="Annual Precipitation (mm)"
                    fill="#387360"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="events"
                    name="Recorded Incidents"
                    stroke="#BE123C"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#BE123C' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Upward trend correlated with increased high-intensity cloudburst events</span>
              <span className="font-bold text-mountain-800">Confidence: 94.6%</span>
            </div>
          </Card>
        </div>

        {/* Monthly Monsoon Seasonality Curve (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title={
              seasonalityResult.isHistorical
                ? "Historical Monthly Monsoon Risk Seasonality"
                : "Monthly Monsoon Risk Seasonality (Current Year 2026 YTD)"
            }
            subtitle={
              seasonalityResult.isHistorical
                ? `Seasonal distribution across complete historical baseline (${seasonalityResult.periodLabel})`
                : `Recorded incidents through ${seasonalityResult.latestRecordedMonth} • Future months unrecorded`
            }
            headerAction={
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  seasonalityResult.isHistorical
                    ? 'bg-stone-100 text-stone-700 border-stone-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                {seasonalityResult.isHistorical ? 'HISTORICAL ARCHIVE' : 'CURRENT YEAR (LIVE YTD)'}
              </span>
            }
            bodyClassName="p-4"
          >
            <div className="h-[320px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={seasonalityResult.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E6E4" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#6D7C78"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value, idx) => {
                      const item = seasonalityResult.data[idx];
                      return item?.isFuture ? `${value}*` : value;
                    }}
                  />
                  <YAxis stroke="#6D7C78" tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const record = payload[0].payload as MonthlySeasonalityRecord;
                        if (record.isFuture || record.events === null || record.events === undefined) {
                          return (
                            <div className="bg-stone-900/95 text-stone-100 p-2.5 rounded-xl border border-stone-700 text-xs shadow-lg backdrop-blur-md">
                              <p className="font-bold text-stone-200">{label} {selectedYear === 'ALL' ? '(Historical)' : selectedYear}</p>
                              <p className="text-amber-400 text-[11px] mt-1 flex items-center gap-1 font-medium">
                                <span>⚠️ Future Month — No data recorded</span>
                              </p>
                              <p className="text-stone-400 text-[10px] mt-0.5">Telemetry pending until month concludes.</p>
                            </div>
                          );
                        }
                        return (
                          <div className="bg-white/95 text-stone-900 p-2.5 rounded-xl border border-stone-200 text-xs shadow-lg backdrop-blur-md">
                            <p className="font-bold text-mountain-900 mb-1">
                              {label} {selectedYear === 'ALL' ? '(Historical Average)' : `${selectedYear} Season`}
                            </p>
                            <div className="space-y-1 text-stone-600">
                              <p className="flex justify-between gap-4">
                                <span className="text-stone-500">Recorded Incidents:</span>
                                <span className="font-mono font-bold text-rose-700">{record.events} events</span>
                              </p>
                              {record.rainfall !== null && record.rainfall !== undefined && (
                                <p className="flex justify-between gap-4">
                                  <span className="text-stone-500">Avg 24h Precipitation:</span>
                                  <span className="font-mono font-bold text-mountain-800">{record.rainfall} mm</span>
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="events"
                    name="Landslide Events"
                    fill="#C2410C"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Note if viewing current year with future months */}
            {!seasonalityResult.isHistorical && (
              <div className="text-[10px] text-stone-400 italic mt-1 flex items-center gap-1">
                <span>* Asterisk indicates upcoming/future months without telemetry.</span>
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 flex-wrap gap-2">
              <span className="font-medium text-stone-700">{peakMetrics.peakMonthsText}</span>
              <span className="font-bold text-rose-700">Highest Vulnerability Window</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Row 2: State-by-State Frequency & Geotechnical Failure Mechanics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Frequency (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title="State-Wise Hazard & Incident Breakdown"
            subtitle="Comparative volume across all 8 North Eastern states"
            bodyClassName="p-4"
          >
            <div className="h-[300px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_STATE_STATISTICS} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E6E4" horizontal={false} />
                  <XAxis type="number" stroke="#6D7C78" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="state" type="category" stroke="#6D7C78" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.75rem',
                      border: '1px solid #D6DFDD',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="critical" name="Critical Zones" fill="#BE123C" stackId="a" />
                  <Bar dataKey="high" name="High Risk Zones" fill="#C2410C" stackId="a" />
                  <Bar dataKey="moderate" name="Moderate Watch" fill="#B45309" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Geotechnical Failure Mechanics Donut Chart (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Geotechnical Failure Mechanics"
            subtitle="Categorized primary slope failure triggers"
            bodyClassName="p-4"
          >
            <div className="h-[220px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={FAILURE_MECHANISMS}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {FAILURE_MECHANISMS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Frequency']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.75rem',
                      border: '1px solid #D6DFDD',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
              {FAILURE_MECHANISMS.map((m) => (
                <div key={m.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-stone-700">{m.name}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">{m.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
