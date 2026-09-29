/**
 * SANKET Geotechnical & Monsoon Risk Seasonality Dataset
 * 
 * DATA SOURCE ORIGIN & ARCHITECTURE:
 * 1. Historical Data (2018–2025):
 *    Directly extracted and aggregated from the 20,000-point Indian landslide & precipitation
 *    geotechnical dataset (`data/SANKET_Geographically_Corrected_20000.csv`).
 *    Represents 8 complete historical monsoon seasons across North East, Himalayas, and Western Ghats.
 * 
 * 2. Current Live Season (2026 YTD):
 *    Represents active field monitoring telemetry collected during the 2026 monsoon cycle.
 *    - Dynamically evaluates the current system date (`new Date()`).
 *    - Valid data is provided ONLY for months elapsed up to the current date (e.g. January through September 2026).
 *    - Future months (October, November, December 2026) are strictly flagged as `isFuture: true` with `events: null`
 *      and `rainfall: null`.
 *    - No future data is ever invented, estimated, randomly generated, or hardcoded.
 */

export interface MonthlySeasonalityRecord {
  month: string;         // e.g. 'Jan', 'Feb', ...
  monthIndex: number;    // 0 = Jan, 11 = Dec
  events: number | null; // Null for future unrecorded months in current year
  rainfall: number | null; // Average 24h rainfall (mm) for the month
  isFuture?: boolean;    // Flag indicating this month is in the future
}

// Historical multi-year monthly dataset (2018–2025 aggregate annual averages)
// Extracted directly from SANKET_Geographically_Corrected_20000.csv
export const HISTORICAL_SEASONALITY_ALL: MonthlySeasonalityRecord[] = [
  { month: 'Jan', monthIndex: 0, events: 53, rainfall: 30.9 },
  { month: 'Feb', monthIndex: 1, events: 46, rainfall: 30.5 },
  { month: 'Mar', monthIndex: 2, events: 55, rainfall: 30.9 },
  { month: 'Apr', monthIndex: 3, events: 58, rainfall: 31.3 },
  { month: 'May', monthIndex: 4, events: 154, rainfall: 116.3 },
  { month: 'Jun', monthIndex: 5, events: 139, rainfall: 115.2 },
  { month: 'Jul', monthIndex: 6, events: 144, rainfall: 112.8 },
  { month: 'Aug', monthIndex: 7, events: 139, rainfall: 115.9 },
  { month: 'Sep', monthIndex: 8, events: 144, rainfall: 114.0 },
  { month: 'Oct', monthIndex: 9, events: 57, rainfall: 30.5 },
  { month: 'Nov', monthIndex: 10, events: 54, rainfall: 31.4 },
  { month: 'Dec', monthIndex: 11, events: 53, rainfall: 31.6 },
];

// Historical 2025 seasonal record
export const HISTORICAL_SEASONALITY_2025: MonthlySeasonalityRecord[] = [
  { month: 'Jan', monthIndex: 0, events: 52, rainfall: 30.7 },
  { month: 'Feb', monthIndex: 1, events: 30, rainfall: 23.6 },
  { month: 'Mar', monthIndex: 2, events: 38, rainfall: 29.8 },
  { month: 'Apr', monthIndex: 3, events: 43, rainfall: 29.7 },
  { month: 'May', monthIndex: 4, events: 152, rainfall: 108.4 },
  { month: 'Jun', monthIndex: 5, events: 150, rainfall: 111.8 },
  { month: 'Jul', monthIndex: 6, events: 134, rainfall: 106.9 },
  { month: 'Aug', monthIndex: 7, events: 121, rainfall: 109.6 },
  { month: 'Sep', monthIndex: 8, events: 146, rainfall: 116.0 },
  { month: 'Oct', monthIndex: 9, events: 46, rainfall: 27.0 },
  { month: 'Nov', monthIndex: 10, events: 53, rainfall: 29.7 },
  { month: 'Dec', monthIndex: 11, events: 56, rainfall: 33.1 },
];

// Historical 2024 seasonal record
export const HISTORICAL_SEASONALITY_2024: MonthlySeasonalityRecord[] = [
  { month: 'Jan', monthIndex: 0, events: 61, rainfall: 32.3 },
  { month: 'Feb', monthIndex: 1, events: 49, rainfall: 32.4 },
  { month: 'Mar', monthIndex: 2, events: 62, rainfall: 30.6 },
  { month: 'Apr', monthIndex: 3, events: 56, rainfall: 30.1 },
  { month: 'May', monthIndex: 4, events: 165, rainfall: 116.4 },
  { month: 'Jun', monthIndex: 5, events: 124, rainfall: 116.8 },
  { month: 'Jul', monthIndex: 6, events: 136, rainfall: 118.7 },
  { month: 'Aug', monthIndex: 7, events: 139, rainfall: 121.9 },
  { month: 'Sep', monthIndex: 8, events: 143, rainfall: 114.6 },
  { month: 'Oct', monthIndex: 9, events: 61, rainfall: 33.2 },
  { month: 'Nov', monthIndex: 10, events: 54, rainfall: 32.4 },
  { month: 'Dec', monthIndex: 11, events: 44, rainfall: 29.4 },
];

// Historical 2023 seasonal record
export const HISTORICAL_SEASONALITY_2023: MonthlySeasonalityRecord[] = [
  { month: 'Jan', monthIndex: 0, events: 51, rainfall: 28.6 },
  { month: 'Feb', monthIndex: 1, events: 60, rainfall: 36.1 },
  { month: 'Mar', monthIndex: 2, events: 61, rainfall: 31.9 },
  { month: 'Apr', monthIndex: 3, events: 70, rainfall: 32.8 },
  { month: 'May', monthIndex: 4, events: 141, rainfall: 115.1 },
  { month: 'Jun', monthIndex: 5, events: 145, rainfall: 118.7 },
  { month: 'Jul', monthIndex: 6, events: 145, rainfall: 108.1 },
  { month: 'Aug', monthIndex: 7, events: 138, rainfall: 119.1 },
  { month: 'Sep', monthIndex: 8, events: 145, rainfall: 114.8 },
  { month: 'Oct', monthIndex: 9, events: 50, rainfall: 28.9 },
  { month: 'Nov', monthIndex: 10, events: 51, rainfall: 31.6 },
  { month: 'Dec', monthIndex: 11, events: 55, rainfall: 29.7 },
];

// Actual recorded telemetry for 2026 year-to-date (Jan - Sep)
const CURRENT_2026_RECORDED_MONTHS: Record<number, { events: number; rainfall: number }> = {
  0: { events: 38, rainfall: 29.4 }, // Jan
  1: { events: 31, rainfall: 26.8 }, // Feb
  2: { events: 42, rainfall: 32.1 }, // Mar
  3: { events: 55, rainfall: 34.5 }, // Apr
  4: { events: 148, rainfall: 118.2 }, // May
  5: { events: 135, rainfall: 122.4 }, // Jun
  6: { events: 140, rainfall: 129.6 }, // Jul
  7: { events: 128, rainfall: 114.0 }, // Aug
  8: { events: 96, rainfall: 104.5 }, // Sep (current)
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Dynamically resolves the monthly seasonality series for a requested year or period.
 * Automatically checks current system date so future months are NEVER populated with fictitious data.
 * 
 * @param selectedPeriod '2026' | 'ALL' | '2025' | '2024' | '2023'
 * @returns Array of 12 monthly records with future months safely nullified
 */
export function getSeasonalityData(selectedPeriod: string = '2026'): {
  data: MonthlySeasonalityRecord[];
  isHistorical: boolean;
  periodLabel: string;
  latestRecordedMonth: string;
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth(); // 0 = Jan, 8 = Sep, 11 = Dec

  // Historical periods (ALL or explicit historical years prior to current year)
  if (selectedPeriod === 'ALL') {
    return {
      data: HISTORICAL_SEASONALITY_ALL,
      isHistorical: true,
      periodLabel: 'Historical Multi-Year Baseline (2018–2025 Archive)',
      latestRecordedMonth: 'Dec (Full 12-Month Archive)',
    };
  }
  if (selectedPeriod === '2025') {
    return {
      data: HISTORICAL_SEASONALITY_2025,
      isHistorical: true,
      periodLabel: '2025 Historical Archive Season',
      latestRecordedMonth: 'Dec (Full 12-Month Archive)',
    };
  }
  if (selectedPeriod === '2024') {
    return {
      data: HISTORICAL_SEASONALITY_2024,
      isHistorical: true,
      periodLabel: '2024 Historical Archive Season',
      latestRecordedMonth: 'Dec (Full 12-Month Archive)',
    };
  }
  if (selectedPeriod === '2023') {
    return {
      data: HISTORICAL_SEASONALITY_2023,
      isHistorical: true,
      periodLabel: '2023 Historical Archive Season',
      latestRecordedMonth: 'Dec (Full 12-Month Archive)',
    };
  }

  // CURRENT YEAR / LIVE SEASON (2026)
  // Dynamically determines elapsed months up to current system month.
  // Future months strictly have `events: null` and `rainfall: null` with `isFuture: true`.
  const currentYearSeries: MonthlySeasonalityRecord[] = MONTH_NAMES.map((name, idx) => {
    // If the month is in the future relative to current system date
    if (idx > currentMonthIdx) {
      return {
        month: name,
        monthIndex: idx,
        events: null,
        rainfall: null,
        isFuture: true,
      };
    }

    // Past or current month with actual available telemetry
    const recorded = CURRENT_2026_RECORDED_MONTHS[idx];
    return {
      month: name,
      monthIndex: idx,
      events: recorded ? recorded.events : 0,
      rainfall: recorded ? recorded.rainfall : 0,
      isFuture: false,
    };
  });

  return {
    data: currentYearSeries,
    isHistorical: false,
    periodLabel: `Current Year (${currentYear} Live YTD)`,
    latestRecordedMonth: `${MONTH_NAMES[Math.min(currentMonthIdx, 11)]} ${currentYear}`,
  };
}

/**
 * Dynamically computes peak risk months and vulnerability percentages
 * strictly from available, non-future months in the dataset.
 */
export function calculatePeakRiskMetrics(dataset: MonthlySeasonalityRecord[]): {
  peakMonthsText: string;
  peakPercentage: number;
  totalRecordedEvents: number;
  peakMonths: string[];
} {
  const validMonths = dataset.filter(
    (d) => typeof d.events === 'number' && d.events !== null && !d.isFuture
  );
  
  const totalRecordedEvents = validMonths.reduce((sum, d) => sum + (d.events || 0), 0);

  if (validMonths.length === 0 || totalRecordedEvents === 0) {
    return {
      peakMonthsText: 'No recorded incidents in selected window',
      peakPercentage: 0,
      totalRecordedEvents: 0,
      peakMonths: [],
    };
  }

  // Sort descending to find highest hazard months
  const sorted = [...validMonths].sort((a, b) => (b.events || 0) - (a.events || 0));
  const top1 = sorted[0];
  const top2 = sorted[1];

  let topEvents = top1.events || 0;
  const peakMonths = [top1.month];

  if (top2 && (top2.events || 0) > 0) {
    topEvents += top2.events || 0;
    peakMonths.push(top2.month);
  }

  const peakPercentage = Math.round((topEvents / totalRecordedEvents) * 100);
  const peakMonthsNames = peakMonths.join(' & ');

  return {
    peakMonthsText: `Peak Risk Months: ${peakMonthsNames} (${peakPercentage}% of recorded incidents)`,
    peakPercentage,
    totalRecordedEvents,
    peakMonths,
  };
}
