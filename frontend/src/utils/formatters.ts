import { RiskClass, PredictionInput, FactorSensitivity } from '../types';

export function getRiskColor(riskClass?: string): string {
  switch (riskClass?.toUpperCase()) {
    case 'CRITICAL':
      return '#BE123C'; // Mineral Crimson
    case 'HIGH':
      return '#C2410C'; // Terracotta Orange
    case 'MODERATE':
      return '#B45309'; // Ochre Amber
    case 'LOW':
    default:
      return '#15803D'; // Alpine Pine Green
  }
}

export function getRiskBadgeClasses(riskClass?: string): {
  badge: string;
  dot: string;
  border: string;
  bg: string;
  text: string;
} {
  switch (riskClass?.toUpperCase()) {
    case 'CRITICAL':
      return {
        badge: 'bg-rose-50 text-rose-800 border-rose-200',
        dot: 'bg-rose-600',
        border: 'border-rose-300',
        bg: 'bg-rose-50',
        text: 'text-rose-700',
      };
    case 'HIGH':
      return {
        badge: 'bg-orange-50 text-orange-800 border-orange-200',
        dot: 'bg-orange-600',
        border: 'border-orange-300',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
      };
    case 'MODERATE':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-600',
        border: 'border-amber-300',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
      };
    case 'LOW':
    default:
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        border: 'border-emerald-300',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
      };
  }
}

export function formatCoordinates(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(3)}°${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(3)}°${lon >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lonStr}`;
}

export function formatElevation(meters?: number): string {
  if (meters === undefined || isNaN(meters)) return 'N/A';
  return `${Math.round(meters).toLocaleString()} m MSL`;
}

export function formatSlope(deg?: number): string {
  if (deg === undefined || isNaN(deg)) return 'N/A';
  return `${deg.toFixed(1)}°`;
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function calculateSensitivities(input: PredictionInput): FactorSensitivity[] {
  // Scientifically grounded geotechnical weighting
  const factors: FactorSensitivity[] = [
    {
      key: 'rainfall_24h_mm',
      label: '24h Precipitation Intensity',
      category: 'hydro',
      impactPercent: Math.min(100, Math.round((input.rainfall_24h_mm / 250) * 100)),
      status: input.rainfall_24h_mm > 150 ? 'critical' : input.rainfall_24h_mm > 75 ? 'warning' : 'safe',
      displayValue: `${input.rainfall_24h_mm.toFixed(1)} mm`,
    },
    {
      key: 'soil_moisture',
      label: 'Soil Pore-Water Saturation',
      category: 'soil',
      impactPercent: Math.min(100, Math.round((input.soil_moisture > 1 ? input.soil_moisture : input.soil_moisture * 100))),
      status: (input.soil_moisture > 0.85 || input.soil_moisture > 85) ? 'critical' : (input.soil_moisture > 0.7 || input.soil_moisture > 70) ? 'warning' : 'safe',
      displayValue: `${(input.soil_moisture > 1 ? input.soil_moisture : input.soil_moisture * 100).toFixed(1)}%`,
    },
    {
      key: 'slope_deg',
      label: 'Terrain Slope Gradient',
      category: 'terrain',
      impactPercent: Math.min(100, Math.round((input.slope_deg / 45) * 100)),
      status: input.slope_deg >= 35 ? 'critical' : input.slope_deg >= 25 ? 'warning' : 'safe',
      displayValue: `${input.slope_deg.toFixed(1)}°`,
    },
    {
      key: 'displacement_mm',
      label: 'Active Surface InSAR Creep',
      category: 'terrain',
      impactPercent: Math.min(100, Math.round((input.displacement_mm / 50) * 100)),
      status: input.displacement_mm >= 30 ? 'critical' : input.displacement_mm >= 15 ? 'warning' : 'safe',
      displayValue: `${input.displacement_mm.toFixed(1)} mm`,
    },
    {
      key: 'rainfall_72h_mm',
      label: '72h Antecedent Saturation',
      category: 'hydro',
      impactPercent: Math.min(100, Math.round((input.rainfall_72h_mm / 450) * 100)),
      status: input.rainfall_72h_mm >= 300 ? 'critical' : input.rainfall_72h_mm >= 180 ? 'warning' : 'safe',
      displayValue: `${input.rainfall_72h_mm.toFixed(1)} mm`,
    },
    {
      key: 'distance_to_road_km',
      label: 'Highway Corridor Proximity',
      category: 'exposure',
      impactPercent: Math.max(0, Math.min(100, Math.round((1 - Math.min(input.distance_to_road_km, 2) / 2) * 100))),
      status: input.distance_to_road_km <= 0.1 ? 'critical' : input.distance_to_road_km <= 0.5 ? 'warning' : 'safe',
      displayValue: `${input.distance_to_road_km.toFixed(2)} km`,
    }
  ];

  return factors.sort((a, b) => b.impactPercent - a.impactPercent);
}

export function generateProtocols(riskClass: RiskClass, input: PredictionInput): string[] {
  switch (riskClass) {
    case 'CRITICAL':
      return [
        'RED ADVISORY: Immediately notify District Disaster Management Authority (DDMA) and State Control Room.',
        'Issue urgent stop-traffic advisory along vulnerable transport corridors (road cuts < 100m).',
        'Pre-position National Disaster Response Force (NDRF) and State SDRF units at forward staging points.',
        'Activate drone/camera telemetry for active escarpment toe inspection.',
        'Commence preventive evacuation of settlements situated directly below steep runoff gullies.'
      ];
    case 'HIGH':
      return [
        'ORANGE ADVISORY: Alert Border Roads Organisation (BRO) and local highway maintenance squads.',
        'Stage heavy earth-moving equipment (excavators, loaders) within 15-minute response radius.',
        'Restrict non-essential heavy transport movements on roads exceeding 25° hill cuts.',
        'Monitor hourly soil saturation and rainfall telemetry updates.'
      ];
    case 'MODERATE':
      return [
        'YELLOW WATCH: Maintain heightened vigilance at vulnerable landslide inventory coordinates.',
        'Verify drainage channels and culverts along mountain roads are cleared of debris.',
        'Notify local community early-warning focal points to report any sudden spring discharge changes.'
      ];
    case 'LOW':
    default:
      return [
        'GREEN STATUS: Baseline standard environmental monitoring active.',
        'Continue routine satellite InSAR telemetry and automated weather radar checks.',
        'All regional transport corridors operating normally.'
      ];
  }
}
