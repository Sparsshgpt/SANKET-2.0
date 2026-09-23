import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { BroadcastAlert, HotspotRecord, RiskClass } from '../types';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Tabs, TabItem } from '../components/common/Tabs';
import { formatCoordinates, formatElevation, formatSlope, formatDateTime, getRiskBadgeClasses } from '../utils/formatters';
import {
  Radio,
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Users,
  Send,
  PlusCircle,
  FileText,
  Filter,
  Search,
  Mountain,
} from 'lucide-react';

export const BroadcastPage: React.FC = () => {
  const { openBroadcastModal, broadcasts } = useApp();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [activeAlerts, setActiveAlerts] = useState<HotspotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const res = await api.getAlerts();
        setActiveAlerts(res.active_alerts || []);
      } catch {
        // Handled in api client
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [broadcasts]);

  const tabs: TabItem[] = [
    {
      id: 'ACTIVE',
      label: 'Active Threat Alerts',
      icon: <AlertTriangle size={15} />,
      badge: activeAlerts.length,
    },
    {
      id: 'HISTORY',
      label: 'Broadcast Dispatch History',
      icon: <Radio size={15} />,
      badge: broadcasts.length,
    },
  ];

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return broadcasts;
    const q = searchQuery.toLowerCase();
    return broadcasts.filter(
      (b) =>
        b.broadcast_id.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        b.message.toLowerCase().includes(q) ||
        b.audience.toLowerCase().includes(q)
    );
  }, [broadcasts, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-soft-earth flex flex-col md:flex-row items-start md:items-center justify-between gap-4 topographic-lines">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-mountain-900 text-emerald-400 border border-mountain-700 shadow-mountain-glow">
            <Radio size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                Emergency Early Warning Broadcast Center
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                DISPATCH PROTOCOL ACTIVE
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Authorized transmission of landslide hazard warnings to NDRF, SDMA, BRO, and District Magistrates
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="md"
          icon={<PlusCircle size={16} />}
          onClick={() => openBroadcastModal()}
          className="font-bold shadow-sm"
        >
          Compose New Advisory
        </Button>
      </div>

      {/* Broadcast Network Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-soft-earth flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Active Unresolved Threats
            </span>
            <div className="text-2xl font-black font-mono text-rose-700 mt-1">
              {activeAlerts.length} Critical/High
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-soft-earth flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Dispatched Advisories
            </span>
            <div className="text-2xl font-black font-mono text-mountain-800 mt-1">
              {broadcasts.length} Bulletins
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-mountain-50 text-mountain-800 border border-mountain-200">
            <Send size={20} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-soft-earth flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Network Delivery Latency
            </span>
            <div className="text-2xl font-black font-mono text-emerald-700 mt-1">
              &lt; 1.8s
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as 'ACTIVE' | 'HISTORY')}
        />

        {activeTab === 'HISTORY' && (
          <div className="relative max-w-xs w-full text-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search dispatched bulletins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mountain-600 text-xs"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Active Threat Alerts Requiring Action */}
      {activeTab === 'ACTIVE' && (
        <Card
          topoPattern
          title="Active Terrain Sectors Exceeding Critical Thresholds"
          subtitle="Directly dispatch early warning notices to designated regional commanders"
          bodyClassName="p-0 divide-y divide-stone-100"
        >
          {activeAlerts.map((alert) => {
            const badgeStyles = getRiskBadgeClasses(alert.risk_class);
            return (
              <div
                key={alert.id || `${alert.latitude}-${alert.longitude}`}
                className="p-4 sm:p-5 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${badgeStyles.dot} beacon-critical`} />
                    <span className="font-bold text-stone-900 text-sm">
                      {alert.district || alert.state}
                    </span>
                    <Badge variant="risk" riskClass={alert.risk_class} size="xs">
                      {alert.risk_class} THREAT
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Mountain size={12} className="text-mountain-700" />
                      {formatElevation(alert.elevation_m)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-stone-600">
                      Slope: {formatSlope(alert.slope_deg)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-stone-600">
                      Soil Saturation: {(alert.soil_moisture || 88).toFixed(1)}%
                    </span>
                    <span className="font-mono text-stone-400">
                      {formatCoordinates(alert.latitude, alert.longitude)}
                    </span>
                  </div>
                </div>

                <Button
                  variant={alert.risk_class === 'CRITICAL' ? 'danger' : 'primary'}
                  size="sm"
                  icon={<Radio size={14} />}
                  onClick={() => {
                    openBroadcastModal({
                      state: alert.state,
                      district: alert.district,
                      latitude: alert.latitude,
                      longitude: alert.longitude,
                      risk_score: alert.risk_score,
                      risk_class: alert.risk_class,
                      message: `EMERGENCY ADVISORY: Critical slope instability confirmed at ${alert.district || alert.state} (${formatCoordinates(alert.latitude, alert.longitude)}). Immediate highway traffic diversion and public evacuation recommended.`,
                    });
                  }}
                  className="font-bold shrink-0 self-end sm:self-center"
                >
                  Dispatch Advisory
                </Button>
              </div>
            );
          })}
        </Card>
      )}

      {/* Tab 2: Broadcast Dispatch History */}
      {activeTab === 'HISTORY' && (
        <Card
          topoPattern
          title="Dispatched Advisory Bulletin Archive"
          subtitle="Authenticated delivery receipts across multi-agency network"
          bodyClassName="p-0 divide-y divide-stone-100"
        >
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No dispatched broadcasts found matching search.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.broadcast_id} className="p-5 hover:bg-stone-50/70 transition-colors space-y-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-sm">
                      {item.broadcast_id}
                    </span>
                    <Badge variant="risk" riskClass={item.risk_class} size="xs">
                      {item.severity || item.risk_class}
                    </Badge>
                    <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-bold">
                      {item.advisory_code || 'SANKET-AUTH'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-stone-500 text-[11px] font-mono">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 size={13} /> {item.status}
                    </span>
                    <span>{formatDateTime(item.timestamp)}</span>
                  </div>
                </div>

                <p className="text-stone-800 leading-relaxed font-mono bg-stone-50/80 p-3 rounded-xl border border-stone-200/60">
                  {item.message}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Users size={12} className="text-stone-400" />
                    Recipient: <strong className="text-stone-700">{item.audience}</strong>
                  </span>

                  <span className="font-mono text-stone-400">
                    Target Sector: {item.district || item.state} (Score: {item.risk_score.toFixed(1)}/100)
                  </span>
                </div>
              </div>
            ))
          )}
        </Card>
      )}
    </div>
  );
};
