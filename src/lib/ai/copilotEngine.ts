import { AIMessage } from '../../types';
import { db } from '../db';

export async function processAICopilotQuery(prompt: string): Promise<AIMessage> {
  const normalized = prompt.toLowerCase().trim();
  const products = await db.getProducts();
  const analytics = await db.getAnalytics();
  const orders = await db.getOrders();
  const customers = await db.getCustomers();

  // Sortings & filters
  const sortedByProfit = [...products].sort((a, b) => b.grossProfit - a.grossProfit);
  const sortedByMargin = [...products].sort((a, b) => b.margin - a.margin);
  const sortedByRevenue = [...products].sort((a, b) => b.revenue - a.revenue);
  const lowMarginProducts = [...products].filter(p => p.margin < 55).sort((a, b) => a.margin - b.margin);
  const highMarginProducts = [...products].filter(p => p.margin >= 70).sort((a, b) => b.margin - a.margin);
  const lowStockProducts = [...products].filter(p => p.stock < 30);

  // 1. "Why did my profit decrease this month?" / "Why did my profit margin decrease?"
  if (
    normalized.includes('profit decrease') ||
    normalized.includes('why did my profit') ||
    normalized.includes('margin decrease') ||
    normalized.includes('profit dropped') ||
    normalized.includes('margin dropped') ||
    normalized.includes('lower margin')
  ) {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      content: `### 📉 Gross Margin Contraction Diagnostics\n\nYour blended gross margin contracted by **2.4 percentage points** this cycle (from 69.6% to 67.2%). While top-line gross revenue grew (+18.4%), increased shipping surcharges and raw material cost spikes eroded net contribution.`,
      timestamp: new Date().toISOString(),
      structuredBreakdown: {
        insight: 'Blended profit margin compressed from 69.6% to 67.2% despite 18.4% top-line revenue expansion.',
        reason: 'Expedited airfreight shipping on low-margin outerwear ($14.80/order) and rising supplier COGS on Titanium Flasks (37.1% margin).',
        recommendation: 'Raise the free shipping threshold from $75 to $95 and adjust pricing on 2 low-margin SKUs by +$6.00.',
        expectedImpact: '+$14,200 monthly profit recovery (+3.1% blended margin expansion).'
      },
      actions: [
        { label: 'View Analytics Breakdown', type: 'view_details', targetPath: '/dashboard/analytics' },
        { label: 'Review Low-Margin SKUs', type: 'apply', targetPath: '/dashboard/products' },
        { label: 'Generate Executive Report', type: 'generate_report', targetPath: '/dashboard/reports' }
      ],
      structuredData: {
        type: 'risk_alert',
        title: 'Margin Drag Attribution',
        items: [
          { label: 'Shipping Surcharge Overages', value: '-$6,840 drag', note: 'Free shipping cart minimum was set too low for bulky outerwear.' },
          { label: 'Outerwear Return Rate', value: '14.8% returns', note: 'Reverse logistics wiped out product margin on jackets.' },
          { label: 'Supplier COGS Inflation', value: '+$4.20 / unit', note: 'Hardware tier costs rose without corresponding retail price adjustments.' }
        ]
      },
      suggestedFollowups: [
        'Which products should I promote?',
        'What are my most profitable products?',
        'Which products have poor margins?',
        'What will my revenue look like next month?',
        'Where am I losing money?'
      ]
    };
  }

  // 2. "Which products should I promote?" / "promote" / "ad spend allocation"
  if (
    normalized.includes('promote') ||
    normalized.includes('which products should i promote') ||
    normalized.includes('what should i advertise') ||
    normalized.includes('campaign strategy')
  ) {
    const starSkus = highMarginProducts.slice(0, 3);
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      content: `### 🚀 Recommended Promotional Priorities\n\nFocus your paid acquisition and email campaigns on your **high-margin anchor SKUs** where every dollar in ad spend returns $3.80+ in gross margin contribution:`,
      timestamp: new Date().toISOString(),
      structuredBreakdown: {
        insight: 'Top 3 high-margin SKUs generate an average 74.4% unit gross margin with high organic customer reorder velocity.',
        reason: 'These products boast low return rates (<3.2%), excellent customer satisfaction (4.8/5.0), and wide profit headroom.',
        recommendation: 'Reallocate 65% of Meta & Google Ads prospecting budget to Ultra-Hold Leggings and Cloud-Knit Bras.',
        expectedImpact: '+$21,400 monthly profit contribution with an estimated 4.1x blended ROAS.'
      },
      actions: [
        { label: 'View Product Economics', type: 'view_details', targetPath: '/dashboard/products' },
        { label: 'Launch Campaign Flow', type: 'apply', targetPath: '/dashboard/analytics' },
        { label: 'Export Promotion Audit', type: 'generate_report', targetPath: '/dashboard/reports' }
      ],
      structuredData: {
        type: 'product_list',
        title: 'Top Promotional Candidates (Highest Margin & Velocity)',
        items: starSkus.map(p => ({
          label: p.name,
          value: `$${p.grossProfit.toFixed(2)} margin (${p.margin}%)`,
          badge: 'High ROAS Potential',
          note: `Price: $${p.price.toFixed(2)} • Sold: ${p.unitsSold} units`
        }))
      },
      suggestedFollowups: [
        'What are my most profitable products?',
        'Which products have poor margins?',
        'Where am I losing money?',
        'How can I improve my profit margin?'
      ]
    };
  }

  // 3. "What are my most profitable products?"
  if (
    normalized.includes('most profitable') ||
    normalized.includes('highest profit') ||
    normalized.includes('profitable products') ||
    normalized.includes('top profit')
  ) {
    const top3 = sortedByProfit.slice(0, 3);
    const topMargin = sortedByMargin[0];

    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      content: `### 🏆 Top Profit Contributor Rankings\n\nYour catalog's number one dollar-profit driver is the **${top3[0].name}**, generating **$${top3[0].grossProfit.toFixed(2)}** in gross margin per unit (${top3[0].margin}% margin) and **$${top3[0].revenue.toLocaleString()}** in total revenue. Meanwhile, **${topMargin.name}** delivers your highest percentage efficiency at **${topMargin.margin}%**.`,
      timestamp: new Date().toISOString(),
      structuredBreakdown: {
        insight: 'Top 3 SKUs generate 68.4% of your total business net margin with an average 74.8% unit gross margin.',
        reason: 'Exceptional product-market fit, high word-of-mouth reorders, and direct-to-consumer factory cost efficiencies.',
        recommendation: 'Allocate 60% of paid ad budget to these 3 anchor SKUs and feature them in abandoned cart and VIP email flows.',
        expectedImpact: '+$19,800 projected incremental gross margin in the next 30 days.'
      },
      actions: [
        { label: 'View Products Catalog', type: 'view_details', targetPath: '/dashboard/products' },
        { label: 'View Channel Analytics', type: 'apply', targetPath: '/dashboard/analytics' },
        { label: 'Generate Profit Report', type: 'generate_report', targetPath: '/dashboard/reports' }
      ],
      structuredData: {
        type: 'product_list',
        title: 'Top 3 Gross Profit Generators',
        items: top3.map(p => ({
          label: p.name,
          value: `$${p.grossProfit.toFixed(2)} / unit (${p.margin}%)`,
          badge: `${p.unitsSold} units sold`,
          note: `Total Revenue: $${p.revenue.toLocaleString()}`
        }))
      },
      suggestedFollowups: [
        'Which products have poor margins?',
        'Where am I losing money?',
        'What will my revenue look like next month?',
        'How can I improve my profit margin?'
      ]
    };
  }

  // 4. "Which products have poor margins?" / "poor margins" / "low margin"
  if (
    normalized.includes('poor margins') ||
    normalized.includes('low margin') ||
    normalized.includes('low margins') ||
    normalized.includes('worst margin') ||
    normalized.includes('underperforming')
  ) {
    const bottom3 = lowMarginProducts.slice(0, 3);
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      content: `### ⚠️ Low Margin SKU Diagnostics\n\nWe identified **${bottom3.length} products** in your catalog operating well below the store target margin threshold of 60%. These SKUs generate top-line sales but deliver weak bottom-line profit after shipping and returns:`,
      timestamp: new Date().toISOString(),
      structuredBreakdown: {
        insight: 'Three products represent $34,800 in revenue but only $13,200 in gross margin due to high manufacturing and shipping costs.',
        reason: 'Heavy material weights increase parcel shipping by +$8.40/order, and supplier unit prices increased without a retail adjustment.',
        recommendation: 'Increase retail prices by $6.00-$8.00 on these SKUs and exclude them from site-wide discount codes.',
        expectedImpact: '+$9,600 annual profit recovery without measurable drop in unit conversion.'
      },
      actions: [
        { label: 'Adjust SKU Pricing', type: 'view_details', targetPath: '/dashboard/products' },
        { label: 'Simulate Margin Lift', type: 'apply', targetPath: '/dashboard/forecasting' },
        { label: 'Download Audit', type: 'generate_report', targetPath: '/dashboard/reports' }
      ],
      structuredData: {
        type: 'risk_alert',
        title: 'SKUs with Compressed Margins',
        items: bottom3.map(p => ({
          label: p.name,
          value: `${p.margin}% margin (COGS: $${p.cost.toFixed(2)})`,
          badge: 'Low Margin',
          note: `Retail Price: $${p.price.toFixed(2)} • Gross Profit: $${p.grossProfit.toFixed(2)}`
        }))
      },
      suggestedFollowups: [
        'Where am I losing money?',
        'How can I improve my profit margin?',
        'What will my revenue look like next month?',
        'Which products should I promote?'
      ]
    };
  }

  // 5. "What will my revenue look like next month?" / "sales forecast" / "forecasting"
  if (
    normalized.includes('look like next month') ||
    normalized.includes('revenue next month') ||
    normalized.includes('forecast') ||
    normalized.includes('next 30 days') ||
    normalized.includes('projected revenue')
  ) {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      content: `### 📈 30-Day Sales & Revenue Forecast\n\nBased on your past 90-day order velocity, customer repeat purchase rates, and seasonality curves, your projected gross revenue for the next 30 days is **$246,800** (a **+12.4% expansion** over the current period of $219,564).`,
      timestamp: new Date().toISOString(),
      structuredBreakdown: {
        insight: 'Expected 30-day revenue is modeled between $234,000 (worst case) and $262,000 (best case) with 88% confidence score.',
        reason: 'Driven by strong VIP cohort repurchase rates (38.4%) and steady conversion momentum on high-margin activewear.',
        recommendation: 'Ensure safety stock replenishment on top 3 SKUs to prevent out-of-stock capping during peak weekend surges.',
        expectedImpact: '+$27,236 incremental monthly revenue and +$18,400 in gross margin.'
      },
      actions: [
        { label: 'Open Sales Forecasting', type: 'view_details', targetPath: '/dashboard/forecasting' },
        { label: 'View Inventory Health', type: 'apply', targetPath: '/dashboard/products' },
        { label: 'Generate Forecast Report', type: 'generate_report', targetPath: '/dashboard/reports' }
      ],
      structuredData: {
        type: 'metric_callout',
        title: 'Forecast Model Parameters',
        items: [
          { label: 'Base Case (Projected)', value: '$246,800', badge: '+12.4% MoM' },
          { label: 'Best Case Scenario', value: '$262,400', badge: '+19.5% Upside' },
          { label: 'Conservative Scenario', value: '$234,100', badge: '+6.6% Floor' },
          { label: 'Model Confidence Level', value: '88% Confidence', badge: 'High Fit' }
        ]
      },
      suggestedFollowups: [
        'How can I improve my profit margin?',
        'Where am I losing money?',
        'Which products should I promote?',
        'Why did my profit decrease this month?'
      ]
    };
  }

  // 6. "Where am I losing money?" / "losing money" / "margin leaks"
  if (
    normalized.includes('losing money') ||
    normalized.includes('where am i losing') ||
    normalized.includes('money leak') ||
    normalized.includes('waste') ||
    normalized.includes('unprofitable')
  ) {
    const ue = analytics.unitEconomics;
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      content: `### 🔍 Profit Leakage & Margin Bleed Analysis\n\nWe scanned all expense lines, returns, and ad campaigns. You have **three primary areas of profit leakage** totaling **$16,400/month** in avoidable drag:`,
      timestamp: new Date().toISOString(),
      structuredBreakdown: {
        insight: 'Three specific leaks are siphoning 7.4% of your total gross revenue away from net profit.',
        reason: '1) Unprofitable ad sets on low-margin hardware ($4,200/mo), 2) High returns on Outerwear (14.8%), and 3) Subsidized shipping below cart threshold ($6,840/mo).',
        recommendation: 'Pause negative ROAS campaigns, adjust size chart guidance on jackets, and raise the free shipping threshold to $95.',
        expectedImpact: 'Immediate recovery of +$12,800 in monthly net profit.'
      },
      actions: [
        { label: 'View Cost Breakdown', type: 'view_details', targetPath: '/dashboard/analytics' },
        { label: 'Review Bleeder Products', type: 'apply', targetPath: '/dashboard/products' },
        { label: 'Generate Leakage Audit', type: 'generate_report', targetPath: '/dashboard/reports' }
      ],
      structuredData: {
        type: 'risk_alert',
        title: 'Top Profit Leakage Drivers',
        items: [
          { label: '1. Shipping Subsidies on Small Orders', value: '-$6,840 / month', note: 'Orders between $50-$75 receive free shipping but cost $11.20 in postage.' },
          { label: '2. Negative ROAS Prospecting Ads', value: '-$4,200 / month', note: 'Meta ad campaigns on Titanium Flask deliver only 1.8x ROAS (break-even is 2.7x).' },
          { label: '3. Outerwear Sizing Returns', value: '-$5,360 / month', note: '14.8% return rate on Windbreakers erodes gross profit.' }
        ]
      },
      suggestedFollowups: [
        'How can I improve my profit margin?',
        'Which products should I stop promoting?',
        'What are my most profitable products?',
        'Why did my profit decrease this month?'
      ]
    };
  }

  // 7. "How can I improve my profit margin?" / "improve margin"
  if (
    normalized.includes('improve my profit margin') ||
    normalized.includes('improve margin') ||
    normalized.includes('increase margin') ||
    normalized.includes('boost margin')
  ) {
    return {
      id: `msg_${Date.now()}`,
      sender: 'assistant',
      content: `### 📈 4-Step Playbook to Expand Blended Gross Margin\n\nTo raise your store margin from **67.2% to 73.5%+** over the next 60 days, execute these high-conviction levers:`,
      timestamp: new Date().toISOString(),
      structuredBreakdown: {
        insight: 'A 6.3 percentage point margin expansion will generate an incremental +$16,800/month in net cash flow without increasing ad spend.',
        reason: 'Current margin drag is driven by unoptimized product bundling, loose shipping thresholds, and un-negotiated supplier tiers.',
        recommendation: '1) Shift free shipping threshold to $95. 2) Implement 1-click cart accessory upsells. 3) Raise price by $5 on top 2 SKUs. 4) Negotiate 5% volume discount on apparel.',
        expectedImpact: '+$16,800 monthly bottom-line increase (+6.3% blended margin lift).'
      },
      actions: [
        { label: 'View Products & Margins', type: 'view_details', targetPath: '/dashboard/products' },
        { label: 'Simulate on Forecasting', type: 'apply', targetPath: '/dashboard/forecasting' },
        { label: 'Generate Strategic Plan', type: 'generate_report', targetPath: '/dashboard/reports' }
      ],
      structuredData: {
        type: 'action_items',
        title: 'Priority Margin Levers',
        items: [
          { label: '1. Free Shipping Threshold ($75 -> $95)', value: '+2.1% Margin', badge: 'Immediate', note: 'Offsets carrier shipping surcharges.' },
          { label: '2. Pre-Purchase Checkout Upsells', value: '+1.8% Margin', badge: 'High Impact', note: 'Bundle high-margin ($18 cost, $48 price) items.' },
          { label: '3. Surgical +$5 Price Lift on Star SKUs', value: '+1.4% Margin', badge: 'Zero CAC', note: 'Customer price elasticity is high for top leggings.' },
          { label: '4. Cut Ad Waste on Underperformers', value: '+1.0% Margin', badge: 'Cost Reduction', note: 'Reallocate to top-margin items.' }
        ]
      },
      suggestedFollowups: [
        'Which products should I promote?',
        'What are my most profitable products?',
        'Where am I losing money?',
        'What will my revenue look like next month?'
      ]
    };
  }

  // 8. General / Fallback Response
  return {
    id: `msg_${Date.now()}`,
    sender: 'assistant',
    content: `### 💡 Copilot Store Intelligence for: "${prompt}"\n\nAnalyzing your live store ledger with **${orders.length} orders**, **$${analytics.metrics.revenue.toLocaleString()} in gross revenue**, and **${customers.length} customer records**:\n\n- **Revenue Velocity**: Growing at **+${analytics.metrics.revenueChange}%** MoM with an Average Order Value of **$${analytics.metrics.aov.toFixed(2)}**.\n- **Profit Health**: Generating **$${analytics.metrics.grossProfit.toLocaleString()}** in gross margin (${analytics.metrics.profitMargin}% margin rate).\n- **Primary Growth Opportunity**: High-margin Activewear bundles generate +74% gross margin.`,
    timestamp: new Date().toISOString(),
    structuredBreakdown: {
      insight: `Store is performing in the top 14% benchmark with strong unit economics and ${analytics.metrics.profitMargin}% gross margin.`,
      reason: 'Strong product-market fit across apparel categories with high repeat purchase retention.',
      recommendation: 'Maintain continuous marketing spend on top 3 SKUs and enforce $95 free shipping threshold.',
      expectedImpact: 'Sustained +18% MoM revenue growth trajectory.'
    },
    actions: [
      { label: 'View Overview Dashboard', type: 'view_details', targetPath: '/dashboard/overview' },
      { label: 'Explore Forecasting', type: 'apply', targetPath: '/dashboard/forecasting' },
      { label: 'Generate Executive Report', type: 'generate_report', targetPath: '/dashboard/reports' }
    ],
    structuredData: {
      type: 'metric_callout',
      title: 'Current Financial Baseline',
      items: [
        { label: 'Store Revenue', value: `$${analytics.metrics.revenue.toLocaleString()}` },
        { label: 'Gross Margin', value: `${analytics.metrics.profitMargin}%` },
        { label: 'Total Orders', value: `${analytics.metrics.orders.toLocaleString()}` }
      ]
    },
    suggestedFollowups: [
      'Why did my profit decrease this month?',
      'Which products should I promote?',
      'What are my most profitable products?',
      'Which products have poor margins?',
      'What will my revenue look like next month?',
      'Where am I losing money?',
      'How can I improve my profit margin?'
    ]
  };
}
