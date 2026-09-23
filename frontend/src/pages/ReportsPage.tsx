import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MOCK_SUMMARY, MOCK_HOTSPOTS } from '../services/mockData';
import { formatCoordinates, formatElevation, formatSlope, formatDateTime } from '../utils/formatters';
import {
  FileText,
  Printer,
  Download,
  ShieldAlert,
  CheckCircle2,
  Mountain,
  Compass,
  Droplets,
  Calendar,
  Layers,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportDate] = useState<string>(new Date().toISOString());
  const criticalThreats = MOCK_HOTSPOTS.filter(h => h.risk_class === 'CRITICAL' || h.risk_class === 'HIGH');

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      title: 'SANKET Geotechnical Situation Report (SITREP)',
      bulletin_id: `SITREP-IND-${Date.now().toString(36).toUpperCase()}`,
      region: 'Indian Mountain Belts (Himalayas, North East & Western Ghats)',
      timestamp: reportDate,
      summary: MOCK_SUMMARY,
      critical_threats: criticalThreats,
      system_validation: 'Geospatially validated 20,000 quadrant inventory',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SANKET_SITREP_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = 'District,State,Latitude,Longitude,Elevation_m,Slope_deg,Soil_Moisture_pct,Risk_Score,Risk_Class\n';
    const rows = criticalThreats
      .map(
        (h) =>
          `"${h.district || h.state}","${h.state}",${h.latitude},${h.longitude},${h.elevation_m || 0},${h.slope_deg || 0},${h.soil_moisture || 0},${h.risk_score},"${h.risk_class}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SANKET_Threat_Inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-soft-earth flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print topographic-lines">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            Situation Reports (SITREP) & Executive Briefing Generator
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Official geotechnical assessment reports for NDMA, SDMA, and BRO command
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleExportJSON}
          >
            Export JSON
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Printer size={14} />}
            onClick={handlePrint}
          >
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Printable SITREP Document Body */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-8 shadow-soft-earth space-y-6 text-xs text-stone-800 font-sans print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-mountain-900 text-emerald-400 flex items-center justify-center font-bold">
                <Mountain size={18} />
              </div>
              <span className="font-mono font-black text-xl text-stone-900 tracking-wider">
                SANKET
              </span>
            </div>
            <p className="text-sm font-bold text-stone-800 uppercase tracking-wider">
              Landslide Risk Intelligence & Early Warning System
            </p>
            <p className="text-xs text-stone-500">
              National Disaster Management Operations • Indian Mountain Corridors
            </p>
          </div>

          <div className="text-right font-mono space-y-0.5">
            <div className="font-bold text-stone-900 text-sm">
              SITREP-IND-2026-0923
            </div>
            <div className="text-stone-500">Date: {formatDateTime(reportDate)}</div>
            <Badge variant="risk" riskClass="CRITICAL" size="xs">
              CODE RED OPERATIONAL
            </Badge>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs border-b border-stone-200 pb-1">
            1. Executive Situational Assessment
          </h3>
          <p className="text-stone-700 leading-relaxed">
            Continuous antecedent monsoon rainfall over the preceding 72 hours has elevated pore-water saturation beyond critical geotechnical thresholds across steep hill slopes (gradient &gt; 35°) in Meghalaya (East Khasi Hills), Assam (Dima Hasao Corridor / NH-27), and North Sikkim (Mangan Axis). Soil saturation indices exceeding 88% combined with active InSAR surface creep of 30–60mm indicate high vulnerability to rapid debris avalanches and slope toe failure.
          </p>
        </div>

        {/* High-Level Statistics Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-500">Total Monitored Corridors</span>
            <div className="text-lg font-black font-mono text-stone-900">{MOCK_SUMMARY.total_records.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-500">Critical Hazard Sectors</span>
            <div className="text-lg font-black font-mono text-rose-700">{MOCK_SUMMARY.critical_zones.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-500">High Risk Sectors</span>
            <div className="text-lg font-black font-mono text-orange-700">{MOCK_SUMMARY.high_risk_zones.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-stone-500">Recorded Failures</span>
            <div className="text-lg font-black font-mono text-stone-900">{MOCK_SUMMARY.landslide_events}</div>
          </div>
        </div>

        {/* Priority Threat Inventory Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs border-b border-stone-200 pb-1">
            2. Priority Hazard Zones Requiring Field Intervention
          </h3>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-bold uppercase text-[10px]">
                  <th className="p-3">Sector / Corridor</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Coordinates</th>
                  <th className="p-3">Slope</th>
                  <th className="p-3">Soil Saturation</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3">Recommended Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {criticalThreats.map((spot) => (
                  <tr key={spot.id || spot.district} className="hover:bg-stone-50/70">
                    <td className="p-3 font-semibold text-stone-900">
                      {spot.district || spot.state}
                    </td>
                    <td className="p-3 text-stone-600">{spot.state}</td>
                    <td className="p-3 font-mono text-stone-500">
                      {formatCoordinates(spot.latitude, spot.longitude)}
                    </td>
                    <td className="p-3 font-mono">{formatSlope(spot.slope_deg)}</td>
                    <td className="p-3 font-mono">{(spot.soil_moisture || 88).toFixed(1)}%</td>
                    <td className="p-3 font-mono font-bold text-rose-700">
                      {spot.risk_score.toFixed(1)} / 100
                    </td>
                    <td className="p-3 text-[11px] text-stone-600">
                      {spot.risk_class === 'CRITICAL'
                        ? 'Stop heavy traffic; stage excavators'
                        : 'Deploy slope patrol; monitor culverts'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Model Validation Standards */}
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs border-b border-stone-200 pb-1">
            3. AI Model Credentials & Benchmark Validation
          </h3>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            Predictions generated via the SANKET Logistic Regression geotechnical pipeline trained on 20,000 spatial observations. Achieved Area Under the ROC Curve (ROC-AUC) of <strong>0.8719</strong>, accuracy of <strong>79.67%</strong>, and precision of <strong>80.08%</strong> against physical slope deformation ground truth.
          </p>
        </div>

        {/* Signatures / Authority Sign-off */}
        <div className="pt-8 border-t border-stone-200 flex justify-between items-end text-xs">
          <div>
            <p className="font-bold text-stone-800">Operational Command Desk</p>
            <p className="text-[11px] text-stone-500">SANKET Geospatial Warning Division</p>
            <p className="text-[10px] text-stone-400 font-mono mt-1">Ref: SANKET/NER/OPS/2026</p>
          </div>

          <div className="text-right">
            <div className="h-10 border-b border-stone-300 w-48 mb-1" />
            <p className="font-bold text-stone-800">Authorized Signatory</p>
            <p className="text-[10px] text-stone-500">Incident Response Directorate</p>
          </div>
        </div>
      </div>
    </div>
  );
};
