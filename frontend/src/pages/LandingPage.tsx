import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mountain,
  ShieldAlert,
  Radio,
  ArrowRight,
  Activity,
  Layers,
  Droplets,
  Compass,
  FileCheck,
  CheckCircle2,
  BrainCircuit,
  MapPin,
  Globe,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Interactive Live Demo on Landing Page
  const [demoRainfall, setDemoRainfall] = useState<number>(195);
  const [demoSlope, setDemoSlope] = useState<number>(38);
  const [demoMoisture, setDemoMoisture] = useState<number>(90);

  const calculateDemoRisk = () => {
    let score = (demoRainfall / 280) * 45 + (demoSlope / 50) * 30 + (demoMoisture / 100) * 25;
    score = Math.min(99.4, Math.max(10.0, Math.round(score * 10) / 10));
    const tier = score >= 75 ? 'CRITICAL' : score >= 55 ? 'HIGH' : score >= 35 ? 'MODERATE' : 'LOW';
    return { score, tier };
  };

  const demoResult = calculateDemoRisk();

  return (
    <div className="min-h-screen bg-canvas text-stone-900 overflow-x-hidden selection:bg-mountain-200">
      {/* Top Floating Glassmorphic Header */}
      <header className="fixed top-0 inset-x-0 h-16 bg-mountain-950/95 backdrop-blur-md border-b border-mountain-800/80 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mountain-800 border border-mountain-600/60 flex items-center justify-center text-emerald-400 shadow-mountain-glow">
            <Mountain size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-white tracking-wider text-base">
                SANKET
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-mountain-800/80 px-1.5 py-0.2 rounded border border-mountain-600/40">
                2.0
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-mono tracking-wider">
              INDIAN MOUNTAIN RISK INTELLIGENCE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/map"
            className="text-xs font-semibold text-stone-300 hover:text-white transition-colors hidden sm:flex items-center gap-1.5"
          >
            <Globe size={14} className="text-emerald-400" />
            <span>GIS Map Explorer</span>
          </Link>
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight size={15} />}
            iconPosition="right"
            onClick={() => navigate('/dashboard')}
            className="bg-emerald-600 hover:bg-emerald-500 shadow-mountain-glow font-bold text-xs"
          >
            Launch Command Center
          </Button>
        </div>
      </header>

      {/* Hero Section: "Technology Observing the Land" */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-mountain-950 text-white overflow-hidden">
        {/* Layered Mountain Horizon Artwork */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg
            className="absolute bottom-0 w-full h-80 sm:h-96"
            viewBox="0 0 1440 400"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Distant Himalayan Peaks */}
            <path
              d="M0,260 L140,150 L280,240 L460,90 L680,220 L880,120 L1080,230 L1260,110 L1440,240 L1440,400 L0,400 Z"
              fill="#163128"
              opacity="0.6"
            />
            {/* Midground Ridge */}
            <path
              d="M0,310 L220,190 L440,290 L660,170 L920,270 L1160,190 L1440,290 L1440,400 L0,400 Z"
              fill="#1E4237"
              opacity="0.85"
            />
            {/* Foreground Mountain Slope & Soil Mantle */}
            <path
              d="M0,345 L280,265 L600,335 L890,250 L1180,320 L1440,280 L1440,400 L0,400 Z"
              fill="#26170E"
              opacity="0.95"
            />
          </svg>
        </div>

        {/* Topographic Isoline Curves Overlay */}
        <div className="absolute inset-0 topographic-lines opacity-20 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Mission Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mountain-900 border border-mountain-700/60 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>National Environmental Intelligence • Indian Mountain Corridors</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Technology Observing the Land.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-soil-300">
              AI-Powered Landslide Early Warning.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-stone-300 font-normal leading-relaxed">
            SANKET monitors the fragile mountainous terrain of India — from the North Eastern hill states and the High Himalayas to the Western Ghats — delivering predictive slope stability intelligence, soil pore-water saturation analytics, and instant multi-agency early warning bulletins.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-500 shadow-mountain-glow text-white font-bold"
            >
              Enter Command Operations
            </Button>

            <Button
              variant="outline"
              size="lg"
              icon={<Globe size={18} />}
              onClick={() => navigate('/map')}
              className="border-mountain-600 text-stone-200 hover:bg-mountain-900"
            >
              Explore Indian GIS Map
            </Button>
          </div>

          {/* Key Metric Ribbon */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-mountain-800/80">
            <div className="p-3 bg-mountain-900/60 rounded-xl border border-mountain-800">
              <span className="text-2xl font-black font-mono text-white block">
                20,000+
              </span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Geospatial Sectors
              </span>
            </div>
            <div className="p-3 bg-mountain-900/60 rounded-xl border border-mountain-800">
              <span className="text-2xl font-black font-mono text-emerald-400 block">
                12 Mountain States
              </span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                National Coverage
              </span>
            </div>
            <div className="p-3 bg-mountain-900/60 rounded-xl border border-mountain-800">
              <span className="text-2xl font-black font-mono text-soil-300 block">
                87.2%
              </span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Predictive ROC-AUC
              </span>
            </div>
            <div className="p-3 bg-mountain-900/60 rounded-xl border border-mountain-800">
              <span className="text-2xl font-black font-mono text-white block">
                &lt; 2.0s
              </span>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                Broadcast Latency
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Soil & Mountain Simulation Teaser */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-10 relative z-10">
        <Card
          topoPattern
          title="Real-Time Geotechnical Slope Failure Simulator"
          subtitle="Test soil column saturation, antecedent precipitation, and slope gradient parameters"
          className="shadow-elevated-earth border-mountain-200"
          headerAction={
            <Badge variant="risk" riskClass={demoResult.tier} pulse size="sm">
              {demoResult.tier} THREAT
            </Badge>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Sliders */}
            <div className="md:col-span-2 space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Droplets size={14} className="text-hydro" /> 24h Cumulative Precipitation
                  </span>
                  <span className="font-mono text-stone-900">{demoRainfall} mm</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={demoRainfall}
                  onChange={(e) => setDemoRainfall(Number(e.target.value))}
                  className="w-full accent-mountain-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Mountain size={14} className="text-soil-700" /> Terrain Slope Gradient
                  </span>
                  <span className="font-mono text-stone-900">{demoSlope}°</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="55"
                  value={demoSlope}
                  onChange={(e) => setDemoSlope(Number(e.target.value))}
                  className="w-full accent-soil-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-stone-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-700" /> Soil Column Saturation Index
                  </span>
                  <span className="font-mono text-stone-900">{demoMoisture}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={demoMoisture}
                  onChange={(e) => setDemoMoisture(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Score Output */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Predicted Hazard Score
              </span>
              <div className="my-2">
                <span className="text-4xl font-black font-mono text-stone-900">
                  {demoResult.score}
                </span>
                <span className="text-xs text-stone-400 font-bold block">/ 100 Index</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/analysis')}
                className="mt-2 w-full justify-center text-xs"
              >
                Open Full AI Lab
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Core Architectural Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="mountain" size="sm">
            Geospatial Systems
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Comprehensive Mountain Surveillance Architecture
          </h2>
          <p className="text-sm text-stone-600">
            Purpose-built for India's high-risk tectonic and monsoon corridors, integrating geotechnical soil mechanics with remote sensing and automated alert broadcasting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            hoverEffect
            title="Hydrometeorology & Antecedent Radar"
            subtitle="Rainfall Threshold Analytics"
            icon={<Droplets size={20} />}
          >
            <p className="text-xs text-stone-600 leading-relaxed">
              Monitors 24h, 72h, and 7-day cumulative rainfall alongside 3-hour cloudburst intensity to compute pore-water pressure spikes and critical soil saturation.
            </p>
          </Card>

          <Card
            hoverEffect
            title="Geotechnical Soil & InSAR Creep"
            subtitle="Subsurface Stability Mapping"
            icon={<Mountain size={20} />}
          >
            <p className="text-xs text-stone-600 leading-relaxed">
              Quantifies slope gradient, soil clay percentage, vegetation root-matrix, and satellite InSAR surface displacement down to millimeter precision.
            </p>
          </Card>

          <Card
            hoverEffect
            title="Multi-Agency Early Warning"
            subtitle="Rapid Advisory Dispatch"
            icon={<Radio size={20} />}
          >
            <p className="text-xs text-stone-600 leading-relaxed">
              Instantly authorizes and broadcasts emergency hazard bulletins to NDRF, State Disaster Management Authorities (SDMA), and the Border Roads Organisation (BRO).
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-white py-12 px-4 sm:px-8 text-stone-600 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-mountain-900 text-emerald-400 flex items-center justify-center font-bold">
              <Mountain size={16} />
            </div>
            <div>
              <p className="font-bold text-stone-900">SANKET Environmental Systems</p>
              <p className="text-[11px] text-stone-400">National Landslide Early Warning Infrastructure • India</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-stone-500 font-medium">
            <Link to="/dashboard" className="hover:text-stone-900 transition-colors">
              Command Dashboard
            </Link>
            <Link to="/map" className="hover:text-stone-900 transition-colors">
              GIS Map
            </Link>
            <Link to="/analysis" className="hover:text-stone-900 transition-colors">
              AI Simulation
            </Link>
            <Link to="/broadcast" className="hover:text-stone-900 transition-colors">
              Warnings
            </Link>
            <Link to="/reports" className="hover:text-stone-900 transition-colors">
              Reports
            </Link>
          </div>

          <p className="text-[11px] text-stone-400">
            © 2026 SANKET Geospatial Division. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
