import React from 'react';

interface StrataIndicatorProps {
  soilMoisture: number; // percentage or decimal 0-1
  clayPct: number;
  displacementMm: number;
  geologyIndex: number;
  className?: string;
}

export const StrataIndicator: React.FC<StrataIndicatorProps> = ({
  soilMoisture,
  clayPct,
  displacementMm,
  geologyIndex,
  className = '',
}) => {
  const moisturePct = soilMoisture > 1 ? soilMoisture : soilMoisture * 100;
  const isSaturated = moisturePct >= 80;
  const hasCreep = displacementMm >= 20;

  return (
    <div
      className={`rounded-xl border border-stone-200 bg-stone-50/70 p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-soil-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Geotechnical Soil Strata Profile
          </h4>
        </div>
        <span className="text-[10px] font-mono text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded">
          In-Situ Column
        </span>
      </div>

      {/* Layer 1: Topsoil / Humus */}
      <div className="space-y-2">
        <div className="rounded-lg bg-soil-800 text-soil-100 p-2.5 text-xs flex items-center justify-between border border-soil-900/40">
          <div>
            <div className="font-semibold flex items-center gap-1.5">
              <span>Layer A: Active Organic Topsoil</span>
              <span className="text-[9px] bg-soil-900/60 text-soil-300 px-1.5 py-0.2 rounded font-mono">
                0.0 – 0.5 m
              </span>
            </div>
            <p className="text-[10px] text-soil-300 mt-0.5">
              High root-cohesion mantle | Surface infiltration zone
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-soil-200">
            Clay: {clayPct.toFixed(0)}%
          </span>
        </div>

        {/* Layer 2: Saturated Clay Subsoil (Slip plane candidate) */}
        <div
          className={`rounded-lg p-2.5 text-xs flex items-center justify-between border transition-colors ${
            isSaturated
              ? 'bg-soil-600 text-white border-rose-400'
              : 'bg-soil-400/90 text-stone-900 border-soil-500/40'
          }`}
        >
          <div>
            <div className="font-semibold flex items-center gap-1.5">
              <span>Layer B: Silt-Clay Shear Transition</span>
              <span className="text-[9px] bg-black/20 px-1.5 py-0.2 rounded font-mono">
                0.5 – 2.5 m
              </span>
              {isSaturated && (
                <span className="text-[9px] font-bold bg-rose-700 text-white px-1.5 py-0.2 rounded animate-pulse">
                  CRITICAL SATURATION
                </span>
              )}
            </div>
            <p
              className={`text-[10px] mt-0.5 ${
                isSaturated ? 'text-soil-100' : 'text-stone-700'
              }`}
            >
              Pore-water pressure zone | Liquefaction vulnerability
            </p>
          </div>
          <span className="text-xs font-mono font-bold">
            Sat: {moisturePct.toFixed(1)}%
          </span>
        </div>

        {/* Layer 3: Weathered Regolith / InSAR Creep Plane */}
        <div
          className={`rounded-lg p-2.5 text-xs flex items-center justify-between border ${
            hasCreep
              ? 'bg-soil-200 text-soil-950 border-amber-400'
              : 'bg-stone-200/80 text-stone-800 border-stone-300'
          }`}
        >
          <div>
            <div className="font-semibold flex items-center gap-1.5">
              <span>Layer C: Weathered Regolith & Scree</span>
              <span className="text-[9px] bg-stone-300/80 px-1.5 py-0.2 rounded font-mono text-stone-700">
                2.5 – 5.0 m
              </span>
              {hasCreep && (
                <span className="text-[9px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded">
                  ACTIVE CREEP
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-600 mt-0.5">
              Disintegrated bedrock fragments & slip interface
            </p>
          </div>
          <span className="text-xs font-mono font-bold">
            Creep: {displacementMm.toFixed(1)} mm
          </span>
        </div>

        {/* Layer 4: Bedrock Basement */}
        <div className="rounded-lg bg-stone-800 text-stone-200 p-2.5 text-xs flex items-center justify-between border border-stone-900">
          <div>
            <div className="font-semibold flex items-center gap-1.5">
              <span>Layer D: Competent Lithic Bedrock</span>
              <span className="text-[9px] bg-stone-900 text-stone-400 px-1.5 py-0.2 rounded font-mono">
                &gt; 5.0 m
              </span>
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">
              Gneiss/Sandstone basement | Jointed geological matrix
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-stone-300">
            Risk Idx: {geologyIndex.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
