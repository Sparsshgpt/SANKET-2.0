// Comprehensive Indian Geospatial Boundaries & Mountain Corridor Zones

export interface GeoRegion {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  states: string[];
}

export const INDIA_REGIONS: Record<string, GeoRegion> = {
  all_india: {
    id: 'all_india',
    name: 'Pan-India Mountain Belts',
    center: [23.5, 80.5],
    zoom: 5,
    states: [
      'Assam', 'Meghalaya', 'Sikkim', 'Arunachal Pradesh', 'Mizoram',
      'Nagaland', 'Manipur', 'Tripura', 'Uttarakhand', 'Himachal Pradesh',
      'Jammu & Kashmir', 'Ladakh', 'Kerala', 'Maharashtra', 'Karnataka'
    ],
  },
  north_east: {
    id: 'north_east',
    name: 'North Eastern Region (8 States)',
    center: [26.15, 92.9],
    zoom: 7,
    states: [
      'Assam', 'Meghalaya', 'Sikkim', 'Arunachal Pradesh',
      'Mizoram', 'Nagaland', 'Manipur', 'Tripura'
    ],
  },
  himalayan_north: {
    id: 'himalayan_north',
    name: 'Jammu & Kashmir, Ladakh & Himalayas',
    center: [33.5, 76.5],
    zoom: 6,
    states: ['Jammu & Kashmir', 'Ladakh', 'Himachal Pradesh', 'Uttarakhand'],
  },
  western_ghats: {
    id: 'western_ghats',
    name: 'Western Ghats Corridor',
    center: [13.2, 75.8],
    zoom: 7,
    states: ['Kerala', 'Maharashtra', 'Karnataka'],
  },
};

// Proper Territorial Bounding Box for India to lock map view
export const INDIA_MAP_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],   // Southwest coordinates (Indian Ocean / Kanyakumari / Lakshadweep)
  [37.5, 97.5],  // Northeast coordinates (Indira Col / Ladakh / Arunachal Pradesh)
];

// Validates whether coordinates fall within Indian territorial boundaries
export function isWithinIndia(lat: number, lon: number): boolean {
  return lat >= 6.5 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5;
}

// Retained for backward-compatibility with NE-focused filters
export function isWithinNortheastIndia(lat: number, lon: number): boolean {
  // Bounding box covering Sikkim to Arunachal/Mizoram
  return lat >= 21.5 && lat <= 29.8 && lon >= 87.5 && lon <= 97.5;
}
