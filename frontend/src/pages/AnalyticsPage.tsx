import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MOCK_HISTORICAL_DATA, MOCK_STATE_STATISTICS } from '../services/mockData';
import {
  History,
  TrendingUp,
  Droplets,
  Mountain,
  PieChart as PieChartIcon,
  Calendar,
  Layers,
  Filter,
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

const MONTHLY_SEASONALITY = [
  { month: 'Jan', events: 2, rainfall: 45 },
  { month: 'Feb', events: 3, rainfall: 60 },
  { month: 'Mar', events: 8, rainfall: 110 },
  { month: 'Apr', events: 14, rainfall: 190 },
  { month: 'May', events: 42, rainfall: 380 },
  { month: 'Jun', events: 118, rainfall: 740 },
  { month: 'Jul', events: 142, rainfall: 860 },
  { month: 'Aug', events: 125, rainfall: 780 },
  { month: 'Sep', events: 68, rainfall: 490 },
  { month: 'Oct', events: 22, rainfall: 180 },
  { month: 'Nov', events: 5, rainfall: 50 },
  { month: 'Dec', events: 1, rainfall: 25 },
];

const FAILURE_MECHANISMS = [
  { name: 'Pore-Water Saturation Debris Flow', value: 46, color: '#BE123C' },
  { name: 'Escarpment Toe-Cut Erosion', value: 28, color: '#C2410C' },
  { name: 'Structural Joint Rockfall', value: 16, color: '#B45309' },
  { name: 'Highway Cutting Regolith Creep', value: 10, color: '#15803D' },
];

export const AnalyticsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');

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
            className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-mountain-600 text-xs"
          >
            <option value="ALL">All Recorded Years (2018–2025)</option>
            <option value="2025">2025 Season</option>
            <option value="2024">2024 Season</option>
            <option value="2023">2023 Season</option>
          </select>
        </div>
      </div>

      {/* Main Charts Row 1: 7-Year Temporal Correlation + Seasonal Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Year Trend Composed Chart (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            topoPattern
            title="7-Year Antecedent Precipitation vs Landslide Triggers"
            subtitle="Evaluating correlation between annual rainfall and recorded slope failures"
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
            title="Monthly Monsoon Risk Seasonality"
            subtitle="Annual distribution showing June–August peak critical window"
            bodyClassName="p-4"
          >
            <div className="h-[320px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_SEASONALITY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E1E6E4" vertical={false} />
                  <XAxis dataKey="month" stroke="#6D7C78" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6D7C78" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '0.75rem',
                      border: '1px solid #D6DFDD',
                      fontSize: '11px',
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
            <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Peak Risk Months: June & July (68% of incidents)</span>
              <span className="font-bold text-rose-700">Highest Vulnerability</span>
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
