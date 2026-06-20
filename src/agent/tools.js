import experiments from '../data/experiments.json'

export const toolDefinitions = [
  {
    name: 'web_search',
    description: 'Search the web for competitor signals, market news, pricing changes, and growth benchmarks.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query string' },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_app_reviews',
    description: 'Get app store sentiment data for a specific app and market. Returns rating, top complaints, top positives, and sentiment trend.',
    input_schema: {
      type: 'object',
      properties: {
        app: { type: 'string', description: 'App name, e.g. "Glovo", "Uber Eats", "Bolt Food"' },
        market: { type: 'string', description: 'City or market, e.g. "Madrid", "Barcelona"' },
      },
      required: ['app', 'market'],
    },
  },
  {
    name: 'get_past_experiments',
    description: "Retrieve analogous past growth experiments from Glovo's knowledge base. Filter by market, lever, or metric.",
    input_schema: {
      type: 'object',
      properties: {
        market: { type: 'string', description: 'Filter by market/city (optional). Use "Global" for globally run experiments.' },
        lever: {
          type: 'string',
          description: 'Filter by growth lever (optional): pricing, promotions, crm, loyalty, product',
        },
        metric: {
          type: 'string',
          description: 'Filter by metric (optional): retention, conversion, activation, order_frequency',
        },
      },
      required: [],
    },
  },
  {
    name: 'apply_rice_framework',
    description: 'Score and rank experiment candidates using the RICE framework: RICE = (Reach × Impact × Confidence%) ÷ Effort.',
    input_schema: {
      type: 'object',
      properties: {
        candidates: {
          type: 'array',
          description: 'Experiment candidates to score',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Experiment name' },
              reach: { type: 'number', description: 'Users affected per quarter (thousands)' },
              impact: { type: 'number', description: 'Impact on metric: 1=minimal, 2=low, 3=medium, 4=high, 5=massive' },
              confidence: { type: 'number', description: 'Confidence percentage 0–100' },
              effort: { type: 'number', description: 'Estimated effort in person-weeks' },
            },
            required: ['name', 'reach', 'impact', 'confidence', 'effort'],
          },
        },
      },
      required: ['candidates'],
    },
  },
]

function mockWebSearch({ query }) {
  const q = query.toLowerCase()

  if (
    q.includes('madrid') &&
    (q.includes('competitor') || q.includes('pricing') || q.includes('uber') || q.includes('bolt') || q.includes('delivery fee'))
  ) {
    return {
      results: [
        {
          title: 'Uber Eats Madrid aggressive promotion push Q1 2025',
          snippet:
            'Uber Eats running 40% off first 3 orders in Madrid since February. Marketing spend up 60% YoY in Spain. App downloads +18% WoW. Targeting Glovo\'s core 25–35 age segment.',
        },
        {
          title: 'Bolt Food expands flat-fee delivery in Spain',
          snippet:
            'Bolt Food launched €0.99 flat delivery fee in Madrid and Barcelona. Positioning directly against Glovo\'s dynamic pricing. Estimated 12% Glovo user overlap based on panel data.',
        },
        {
          title: 'Q-commerce Spain market intelligence — March 2025',
          snippet:
            'Madrid q-commerce grew 23% YoY. Average 30-day churn rate: 41%. Delivery fee cited as top churn driver in 38% of cancellation surveys. Price sensitivity highest in 18–35 demographic.',
        },
      ],
      query,
      source: 'web_search_mock',
    }
  }

  if (q.includes('cashback') || q.includes('loyalty') || q.includes('reward') || q.includes('retention')) {
    return {
      results: [
        {
          title: 'Delivery app loyalty program benchmarks Europe 2024',
          snippet:
            'Cashback programs yield 15–22% retention lift in 30-day cohorts across European markets. Optimal cashback rate: 10–20% to remain unit-economic positive. Time-limited offers outperform evergreen by 2.4x.',
        },
        {
          title: 'Subscription models in Q-commerce: Prime effect analysis',
          snippet:
            'Subscription subscribers order 3.2x more frequently than non-subscribers. 30-day free trials convert at 34% to paid. Churn among subscribers: 8% vs 41% for standard users.',
        },
      ],
      query,
      source: 'web_search_mock',
    }
  }

  if (q.includes('crm') || q.includes('push notification') || q.includes('email') || q.includes('win-back') || q.includes('reactivation')) {
    return {
      results: [
        {
          title: 'Mobile CRM benchmarks — food delivery 2024',
          snippet:
            'Win-back push notifications: 8–14% open rate, 3–6% conversion for day-7 churned users. Day-14 email outperforms push for high-value lapsed users (+40% conversion). Personalised subject lines: +22% open rate.',
        },
        {
          title: 'Re-engagement campaign ROI vs paid acquisition',
          snippet:
            'Cost per reactivated user via CRM: €2.10 vs €18.40 for paid acquisition. CRM highest ROI growth lever in mature Q-commerce markets. Best performing segment: users with 3+ past orders.',
        },
      ],
      query,
      source: 'web_search_mock',
    }
  }

  if (q.includes('pricing') || q.includes('delivery fee') || q.includes('dynamic')) {
    return {
      results: [
        {
          title: 'Dynamic pricing in food delivery — elasticity benchmarks',
          snippet:
            'Price elasticity of demand in Q-commerce: −1.4 on average. Every 10% delivery fee reduction yields ~14% order volume lift. Off-peak discounting most effective 14:00–17:00 and pre-dinner 16:00–18:00.',
        },
        {
          title: 'Basket threshold discounts: European delivery platforms 2024',
          snippet:
            'Basket threshold promotions (e.g. €2 off orders >€25) increase average order value 12–18%. Highest adoption in price-sensitive urban markets. Margin neutral at >8% AOV lift.',
        },
      ],
      query,
      source: 'web_search_mock',
    }
  }

  return {
    results: [
      {
        title: 'Q-commerce growth strategies 2025',
        snippet:
          'Leading delivery platforms shifting focus from acquisition to retention as markets mature. Pricing personalisation and CRM automation emerging as the top two growth levers across European cities.',
      },
      {
        title: 'Food delivery competitive dynamics — Europe Q1 2025',
        snippet:
          'Glovo, Uber Eats, and Deliveroo competing intensely on delivery fees and promotions. Retention remains the key battleground; average industry churn at 38% in the first 30 days post-acquisition.',
      },
    ],
    query,
    source: 'web_search_mock',
  }
}

function mockSearchAppReviews({ app, market }) {
  const appLower = app.toLowerCase()
  const marketLower = market.toLowerCase()

  if (appLower.includes('glovo')) {
    const marketSpecific = {
      madrid: {
        rating: 3.6,
        total_reviews: 4820,
        top_complaints: [
          { theme: 'delivery fees too high', percentage: 41 },
          { theme: 'late or missing deliveries', percentage: 29 },
          { theme: 'customer support unresponsive', percentage: 18 },
        ],
        top_positives: [
          { theme: 'wide restaurant selection', percentage: 72 },
          { theme: 'fast delivery when it works', percentage: 45 },
        ],
        recent_trend:
          'Rating declined from 3.9 to 3.6 in past 30 days. Delivery fee complaints up 34% vs prior month. Several 1-star reviews mention switching to Uber Eats for pricing.',
        sentiment_score: 36,
      },
      barcelona: {
        rating: 4.0,
        total_reviews: 6340,
        top_complaints: [
          { theme: 'app crashes at checkout', percentage: 22 },
          { theme: 'delivery fee variability', percentage: 28 },
        ],
        top_positives: [
          { theme: 'Glovo Prime value', percentage: 61 },
          { theme: 'restaurant variety', percentage: 79 },
        ],
        recent_trend: 'Stable. Prime subscribers driving positive sentiment. App stability issues noted in recent update.',
        sentiment_score: 54,
      },
    }

    const data = marketSpecific[marketLower] || {
      rating: 3.8,
      total_reviews: 2100,
      top_complaints: [
        { theme: 'delivery fees', percentage: 35 },
        { theme: 'app performance', percentage: 22 },
      ],
      top_positives: [{ theme: 'restaurant selection', percentage: 68 }],
      recent_trend: 'Stable sentiment. Delivery cost remains primary friction.',
      sentiment_score: 45,
    }

    return { app, market, ...data, source: 'app_store_mock' }
  }

  if (appLower.includes('uber')) {
    return {
      app,
      market,
      rating: 4.1,
      total_reviews: 3200,
      top_complaints: [{ theme: 'surge pricing', percentage: 28 }],
      top_positives: [
        { theme: 'reliability and tracking', percentage: 74 },
        { theme: 'driver communication', percentage: 61 },
      ],
      recent_trend: `Gaining ground in ${market}. Aggressive promotions driving downloads. +18% reviews in last 30 days.`,
      sentiment_score: 62,
      source: 'app_store_mock',
    }
  }

  if (appLower.includes('bolt')) {
    return {
      app,
      market,
      rating: 3.9,
      total_reviews: 980,
      top_complaints: [{ theme: 'limited restaurant selection', percentage: 48 }],
      top_positives: [
        { theme: 'flat delivery fee', percentage: 81 },
        { theme: 'simple UI', percentage: 57 },
      ],
      recent_trend: `New entrant in ${market}. Growing fast on price differentiation. Restaurant catalogue still limited.`,
      sentiment_score: 55,
      source: 'app_store_mock',
    }
  }

  return {
    app,
    market,
    rating: 3.9,
    total_reviews: 1500,
    top_complaints: [{ theme: 'delivery fees', percentage: 33 }],
    top_positives: [{ theme: 'ease of use', percentage: 65 }],
    recent_trend: 'No significant recent sentiment changes.',
    sentiment_score: 50,
    source: 'app_store_mock',
  }
}

function mockGetPastExperiments({ market, lever, metric } = {}) {
  let filtered = [...experiments]

  if (market) {
    filtered = filtered.filter(
      (e) =>
        e.market.toLowerCase() === market.toLowerCase() ||
        e.market.toLowerCase() === 'global'
    )
  }

  if (lever) {
    filtered = filtered.filter((e) => e.lever.toLowerCase() === lever.toLowerCase())
  }

  if (metric) {
    filtered = filtered.filter((e) => e.metric.toLowerCase() === metric.toLowerCase())
  }

  if (filtered.length === 0) {
    filtered = experiments.slice(0, 5)
  }

  return {
    experiments: filtered,
    total_found: filtered.length,
    filters_applied: { market: market || null, lever: lever || null, metric: metric || null },
    source: 'knowledge_base_mock',
  }
}

function mockApplyRiceFramework({ candidates }) {
  const scored = candidates.map((c) => {
    const rice_score = Math.round((c.reach * c.impact * (c.confidence / 100)) / c.effort * 10) / 10
    return { ...c, rice_score }
  })

  const ranked = scored
    .sort((a, b) => b.rice_score - a.rice_score)
    .map((e, i) => ({ ...e, rank: i + 1 }))

  return {
    ranked_candidates: ranked,
    top_pick: ranked[0]?.name || null,
    scoring_formula: 'RICE = (Reach × Impact × Confidence%) ÷ Effort',
    source: 'rice_framework',
  }
}

export const toolImplementations = {
  web_search: mockWebSearch,
  search_app_reviews: mockSearchAppReviews,
  get_past_experiments: mockGetPastExperiments,
  apply_rice_framework: mockApplyRiceFramework,
}
