import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { PredictionInput, PredictionResult, ScenarioPreset } from '../types';
import { SCENARIO_PRESETS } from '../services/mockData';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { RiskGauge } from '../components/widgets/RiskGauge';
import { FeatureImpactBar } from '../components/widgets/FeatureImpactBar';
import { StrataIndicator } from '../components/widgets/StrataIndicator';
import {
  BrainCircuit,
  Sliders,
  Droplets,
  Mountain,
  Layers,
  Radio,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const SimulationPage: React.FC = () => {
  const location = useLocation();
  const { openBroadcastModal } = useApp();

  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset_wayanad_extreme');
  const [features, setFeatures] = useState<PredictionInput>(SCENARIO_PRESETS[0].features);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  // Check if features were passed from Hotspot Inspector navigation
  useEffect(() => {
    if (location.state && (location.state as any).presetFeatures) {
      const customFeatures = (location.state as any).presetFeatures;
      setFeatures((prev) => ({ ...prev, ...customFeatures }));
      setSelectedPresetId('custom');
    }
  }, [location.state]);

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setSelectedPresetId(preset.id);
    setFeatures(preset.features);
  };

  const handleFeatureChange = (key: keyof PredictionInput, val: number) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Run AI inference
  const runPrediction = async () => {
    try {
      setEvaluating(true);
      const res = await api.predictRisk(features);
      setResult(res);
    } catch {
      // Handled in api client
    } finally {
      setEvaluating(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, [features]);

  const handleReset = () => {
    const defaultPreset = SCENARIO_PRESETS[0];
    setSelectedPresetId(defaultPreset.id);
    setFeatures(defaultPreset.features);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-soft-earth flex flex-col md:flex-row items-start md:items-center justify-between gap-4 topographic-lines">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-mountain-900 text-emerald-400 border border-mountain-700 shadow-mountain-glow">
            <BrainCircuit size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                AI Geotechnical Risk Simulation Studio
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                SCIKIT PIPELINE ACTIVE
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Simulate soil pore-water saturation, slope angles, and antecedent monsoon precipitation across Indian mountain belts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw size={13} />}
            onClick={handleReset}
          >
            Reset Baseline
          </Button>
          {result && (
            <Button
              variant={result.risk_class === 'CRITICAL' ? 'danger' : 'primary'}
              size="sm"
              icon={<Radio size={13} />}
              onClick={() => {
                openBroadcastModal({
                  state: 'Meghalaya',
                  latitude: features.latitude,
                  longitude: features.longitude,
                  risk_score: result.risk_score,
                  risk_class: result.risk_class,
                  message: `SIMULATION ADVISORY: Geotechnical simulation generated a risk score of ${result.risk_score.toFixed(1)} (${result.risk_class}). Recommended immediate field standby.`,
                });
              }}
            >
              Dispatch Advisory
            </Button>
          )}
        </div>
      </div>

      {/* Preset Mountain Scenarios Carousel / Bar */}
      <Card
        title="Indian Mountain Corridor Presets"
        subtitle="Quick-load real-world geomorphic corridors across Himalayas, Western Ghats & North East"
        bodyClassName="p-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SCENARIO_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1.5 ${
                  isSelected
                    ? 'bg-mountain-50/70 border-mountain-600 shadow-sm ring-1 ring-mountain-600'
                    : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 truncate">
                    {preset.label}
                  </span>
                  <Badge variant="risk" riskClass={preset.threatLevel} size="xs">
                    {preset.threatLevel}
                  </Badge>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-1">
                  <span>{preset.location}</span>
                  <span>{preset.slopeDeg}° slope</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Studio Grid: Parameters (Left) + AI Inferred Threat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Parameter Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Deck 1: Hydrometeorology */}
          <Card
            topoPattern
            title="1. Hydrometeorological & Rainfall Parameters"
            icon={<Droplets size={16} />}
            bodyClassName="p-5 space-y-4 text-xs"
          >
            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>24-Hour Cumulative Rainfall</span>
                <span className="font-mono text-stone-900">{features.rainfall_24h_mm.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="350"
                step="0.5"
                value={features.rainfall_24h_mm}
                onChange={(e) => handleFeatureChange('rainfall_24h_mm', parseFloat(e.target.value))}
                className="w-full accent-hydro cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>72-Hour Antecedent Saturation Rainfall</span>
                <span className="font-mono text-stone-900">{features.rainfall_72h_mm.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="650"
                step="1"
                value={features.rainfall_72h_mm}
                onChange={(e) => handleFeatureChange('rainfall_72h_mm', parseFloat(e.target.value))}
                className="w-full accent-hydro cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  3-Hour Burst Intensity (mm)
                </label>
                <input
                  type="number"
                  value={features.rainfall_intensity_3h_mm}
                  onChange={(e) => handleFeatureChange('rainfall_intensity_3h_mm', parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Monsoon Anomaly (%)
                </label>
                <input
                  type="number"
                  value={features.rainfall_anomaly_pct}
                  onChange={(e) => handleFeatureChange('rainfall_anomaly_pct', parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono text-stone-800"
                />
              </div>
            </div>
          </Card>

          {/* Deck 2: Topography & Soil Mechanics */}
          <Card
            topoPattern
            title="2. Topography & Soil Mechanics"
            icon={<Mountain size={16} />}
            bodyClassName="p-5 space-y-4 text-xs"
          >
            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Slope Gradient (Degrees)</span>
                <span className="font-mono text-stone-900">{features.slope_deg.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="55"
                step="0.5"
                value={features.slope_deg}
                onChange={(e) => handleFeatureChange('slope_deg', parseFloat(e.target.value))}
                className="w-full accent-soil-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Soil Moisture Saturation Ratio</span>
                <span className="font-mono text-stone-900">
                  {(features.soil_moisture > 1 ? features.soil_moisture : features.soil_moisture * 100).toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={features.soil_moisture > 1 ? features.soil_moisture : features.soil_moisture * 100}
                onChange={(e) => handleFeatureChange('soil_moisture', parseFloat(e.target.value) / 100)}
                className="w-full accent-soil-700 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Elevation (m MSL)
                </label>
                <input
                  type="number"
                  value={features.elevation_m}
                  onChange={(e) => handleFeatureChange('elevation_m', parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Clay Percentage (%)
                </label>
                <input
                  type="number"
                  value={features.clay_pct}
                  onChange={(e) => handleFeatureChange('clay_pct', parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono text-stone-800"
                />
              </div>
            </div>
          </Card>

          {/* Deck 3: Geomechanics & Infrastructure Proximity */}
          <Card
            topoPattern
            title="3. InSAR Creep & Exposure Indicators"
            icon={<Layers size={16} />}
            bodyClassName="p-5 space-y-4 text-xs"
          >
            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>InSAR Surface Displacement Creep</span>
                <span className="font-mono text-stone-900">{features.displacement_mm.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                step="0.5"
                value={features.displacement_mm}
                onChange={(e) => handleFeatureChange('displacement_mm', parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Distance to Road Corridor (km)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={features.distance_to_road_km}
                  onChange={(e) => handleFeatureChange('distance_to_road_km', parseFloat(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono text-stone-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Historical Landslides Count
                </label>
                <input
                  type="number"
                  value={features.historical_landslide_count}
                  onChange={(e) => handleFeatureChange('historical_landslide_count', parseInt(e.target.value) || 0)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 font-mono text-stone-800"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Inferred Risk Output & Action Protocols (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Risk Result Meter Card */}
          <Card
            title="AI Inferred Slope Stability Index"
            subtitle="Real-time multi-factor prediction model"
            headerAction={
              evaluating ? (
                <span className="text-[10px] text-mountain-700 animate-pulse font-mono font-bold">
                  Evaluating...
                </span>
              ) : null
            }
            bodyClassName="p-5 flex flex-col items-center justify-center text-center"
          >
            {result ? (
              <div className="w-full space-y-4">
                <RiskGauge
                  score={result.risk_score}
                  riskClass={result.risk_class}
                  probability={result.landslide_probability}
                  size="lg"
                />

                {/* Subsurface Soil Strata visualization */}
                <div className="w-full pt-4 border-t border-stone-100 text-left">
                  <StrataIndicator
                    soilMoisture={features.soil_moisture}
                    clayPct={features.clay_pct}
                    displacementMm={features.displacement_mm}
                    geologyIndex={features.geology_risk_index}
                  />
                </div>
              </div>
            ) : (
              <div className="py-12 text-stone-400 text-xs">
                Awaiting simulation parameters...
              </div>
            )}
          </Card>

          {/* Factor Sensitivity Analysis */}
          {result?.contributing_factors && (
            <Card
              title="Feature Contribution & Sensitivity"
              subtitle="Key geotechnical factors driving this risk prediction"
              bodyClassName="p-5"
            >
              <FeatureImpactBar factors={result.contributing_factors} limit={5} />
            </Card>
          )}

          {/* Standard Operating Action Protocols */}
          {result?.action_protocols && (
            <Card
              title="Recommended Action Directives"
              subtitle="Automated emergency protocols for this threat level"
              bodyClassName="p-5"
            >
              <ul className="space-y-2 text-xs">
                {result.action_protocols.map((protocol, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-700">
                    <CheckCircle2
                      size={14}
                      className="text-mountain-700 shrink-0 mt-0.5"
                    />
                    <span className="leading-snug">{protocol}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
