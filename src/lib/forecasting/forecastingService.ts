import { SalesForecast, ForecastPoint } from '../../types';

export function getSalesForecastData(): SalesForecast {
  // Generate 30 days historical + 30 days forward forecast
  const points: ForecastPoint[] = [
    // Historical 15-day sample (for smooth chart)
    { date: 'Jul 15', actualRevenue: 6420, forecastRevenue: 6420, bestCase: 6800, worstCase: 6100, confidence: 96, ordersEstimated: 108 },
    { date: 'Jul 18', actualRevenue: 6890, forecastRevenue: 6890, bestCase: 7200, worstCase: 6500, confidence: 95, ordersEstimated: 114 },
    { date: 'Jul 21', actualRevenue: 7150, forecastRevenue: 7150, bestCase: 7600, worstCase: 6700, confidence: 95, ordersEstimated: 120 },
    { date: 'Jul 24', actualRevenue: 6940, forecastRevenue: 6940, bestCase: 7400, worstCase: 6600, confidence: 94, ordersEstimated: 116 },
    { date: 'Jul 27', actualRevenue: 7580, forecastRevenue: 7580, bestCase: 8100, worstCase: 7100, confidence: 94, ordersEstimated: 128 },
    { date: 'Jul 30', actualRevenue: 7890, forecastRevenue: 7890, bestCase: 8400, worstCase: 7400, confidence: 93, ordersEstimated: 132 },
    { date: 'Aug 02', actualRevenue: 8120, forecastRevenue: 8120, bestCase: 8700, worstCase: 7600, confidence: 92, ordersEstimated: 136 },
    { date: 'Aug 05', actualRevenue: 7980, forecastRevenue: 7980, bestCase: 8550, worstCase: 7450, confidence: 92, ordersEstimated: 134 },
    { date: 'Aug 08', actualRevenue: 8450, forecastRevenue: 8450, bestCase: 9100, worstCase: 7900, confidence: 91, ordersEstimated: 142 },
    { date: 'Aug 11', actualRevenue: 8720, forecastRevenue: 8720, bestCase: 9400, worstCase: 8100, confidence: 90, ordersEstimated: 146 },
    { date: 'Aug 14 (Today)', actualRevenue: 8960, forecastRevenue: 8960, bestCase: 9650, worstCase: 8300, confidence: 90, ordersEstimated: 150 },
    // Projected 30 days
    { date: 'Aug 17', forecastRevenue: 9180, bestCase: 10100, worstCase: 8350, confidence: 89, ordersEstimated: 154 },
    { date: 'Aug 20', forecastRevenue: 9340, bestCase: 10350, worstCase: 8420, confidence: 88, ordersEstimated: 156 },
    { date: 'Aug 23', forecastRevenue: 9580, bestCase: 10700, worstCase: 8550, confidence: 87, ordersEstimated: 160 },
    { date: 'Aug 26', forecastRevenue: 9820, bestCase: 11100, worstCase: 8680, confidence: 86, ordersEstimated: 164 },
    { date: 'Aug 29', forecastRevenue: 10050, bestCase: 11450, worstCase: 8800, confidence: 85, ordersEstimated: 168 },
    { date: 'Sep 01', forecastRevenue: 10320, bestCase: 11850, worstCase: 8950, confidence: 84, ordersEstimated: 172 },
    { date: 'Sep 04', forecastRevenue: 10480, bestCase: 12100, worstCase: 9020, confidence: 83, ordersEstimated: 175 },
    { date: 'Sep 07', forecastRevenue: 10690, bestCase: 12450, worstCase: 9150, confidence: 82, ordersEstimated: 178 },
    { date: 'Sep 10', forecastRevenue: 10940, bestCase: 12850, worstCase: 9300, confidence: 81, ordersEstimated: 182 },
    { date: 'Sep 13', forecastRevenue: 11180, bestCase: 13200, worstCase: 9420, confidence: 80, ordersEstimated: 186 },
  ];

  return {
    expectedGrowthPercent: 12.4,
    projectedRevenueNext30Days: 246800,
    current30DayRevenue: 219564,
    confidenceScore: 88,
    forecastNarrative:
      'Revenue is projected to grow +12.4% ($246,800 vs $219,564) over the next 30 days, driven by strong repeat buyer cohort retention and seasonal demand acceleration in activewear.',
    growthDrivers: [
      {
        title: 'VIP Cohort Repeat Purchase Lift',
        impact: '+$14,200',
        description: '38.4% of past 60-day purchasers are modeled to repurchase with an average order value of $162.'
      },
      {
        title: 'High-Margin SKU Demand Velocity',
        impact: '+$9,400',
        description: 'Ultra-Hold Leggings and Compression Tights show steady week-over-week organic conversion growth (+18%).'
      },
      {
        title: 'Cart Value Threshold Optimization',
        impact: '+$3,636',
        description: 'New $95 free shipping threshold successfully lifted blended items per cart from 1.62 to 1.84.'
      }
    ],
    risksToWatch: [
      {
        title: 'Hydro Hydration Vest Stockout',
        severity: 'high',
        description: '24 units left in warehouse. Stockout in ~4 days will forfeit $6,200 in modeled revenue if unreplenished.'
      },
      {
        title: 'Paid CAC Volatility on Meta',
        severity: 'medium',
        description: 'Blended acquisition costs increased 8% on prospecting sets over the past 7 days.'
      }
    ],
    points
  };
}
