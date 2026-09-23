export type RiskClass = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface HotspotRecord {
  id?: string;
  date: string;
  state: string;
  district?: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  slope_deg?: number;
  soil_moisture?: number;
  rainfall_24h_mm?: number;
  risk_score: number;
  risk_class: RiskClass;
  landslide_occurrence: number;
  displacement_mm?: number;
  distance_to_road_km?: number;
  distance_to_settlement_km?: number;
}

export interface PredictionInput {
  latitude: number;
  longitude: number;
  rainfall_24h_mm: number;
  rainfall_72h_mm: number;
  rainfall_7d_mm: number;
  rainfall_intensity_3h_mm: number;
  rainfall_anomaly_pct: number;
  elevation_m: number;
  slope_deg: number;
  aspect_deg: number;
  curvature: number;
  soil_moisture: number;
  clay_pct: number;
  ndvi: number;
  geology_risk_index: number;
  displacement_mm: number;
  historical_landslide_count: number;
  distance_to_road_km: number;
  distance_to_settlement_km: number;
  infrastructure_exposure_index: number;
}

export interface FactorSensitivity {
  key: keyof PredictionInput;
  label: string;
  category: 'hydro' | 'terrain' | 'soil' | 'exposure';
  impactPercent: number; // 0 - 100
  status: 'safe' | 'warning' | 'critical';
  displayValue: string;
}

export interface PredictionResult {
  prediction: number;
  landslide_probability: number;
  risk_score: number;
  risk_class: RiskClass;
  contributing_factors?: FactorSensitivity[];
  action_protocols?: string[];
}

export interface SummaryStats {
  total_records: number;
  critical_zones: number;
  high_risk_zones: number;
  moderate_zones: number;
  low_risk_zones: number;
  landslide_events: number;
  states_monitored: number;
  last_updated?: string;
}

export interface BroadcastAlert {
  broadcast_id: string;
  state: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  risk_score: number;
  risk_class: RiskClass;
  audience: string;
  severity: string;
  message: string;
  timestamp: string;
  status: 'Delivered' | 'Transmitting' | 'Queued';
  advisory_code?: string;
}

export interface BroadcastRequest {
  state: string;
  district?: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  risk_class: string;
  message: string;
  audience?: string;
  severity?: string;
}

export interface BroadcastResponse {
  status: string;
  message: string;
  broadcast_id: string;
  timestamp: string;
  state?: string;
  risk_score?: number;
  risk_class?: string;
  audience?: string;
  severity?: string;
}

export interface AlertsResponse {
  active_alerts: HotspotRecord[];
  recent_broadcasts: BroadcastAlert[];
  total_active: number;
  total_broadcasts: number;
}

export interface HealthCheck {
  status: string;
  service: string;
  model_loaded: boolean;
  active_datasource?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  status: 'Active' | 'Field Deployed' | 'Standby';
  email: string;
  phone: string;
  avatar?: string;
  assignedDistricts?: string[];
}

export interface ScenarioPreset {
  id: string;
  label: string;
  location: string;
  state: string;
  elevation: number;
  slopeDeg: number;
  soilType: string;
  description: string;
  threatLevel: RiskClass;
  features: PredictionInput;
}
