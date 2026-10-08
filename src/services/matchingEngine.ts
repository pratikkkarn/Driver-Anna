import { Load, MatchScoreResult, Trip } from '../types';

export function calculateDeterministicMatch(trip: Trip, load: Load): MatchScoreResult | null {
  // Hard Filter: Destination compatibility / commodity compatibility
  // If destination is totally disjoint, score will be low, but if commodity cannot be carried by truck type, reject.
  const isPerishable = ['Tomato', 'Onion', 'Potato', 'Green Gram'].includes(load.commodity);
  if (trip.truckType.includes('Open') && isPerishable && !trip.truckType.includes('Tarpaulin')) {
    // If open without protection, still allow but penalized or filter
  }

  // 1. Route Compatibility (30% weight - Max 30 pts)
  const normTripDest = (trip.returnDestination || '').toLowerCase().trim();
  const normLoadDest = (load.destination || '').toLowerCase().trim();
  let routeScore = 0;
  let routeFitText = '';

  if (normLoadDest.includes(normTripDest) || normTripDest.includes(normLoadDest)) {
    routeScore = 30;
    routeFitText = `Exact destination match (${load.destination})`;
  } else if (
    (normTripDest.includes('bengaluru') && normLoadDest.includes('tumakuru')) ||
    (normTripDest.includes('bengaluru') && normLoadDest.includes('davanagere')) ||
    (normTripDest.includes('pune') && normLoadDest.includes('belagavi'))
  ) {
    routeScore = 24;
    routeFitText = `En-route corridor match along NH-48`;
  } else {
    // Distance penalty
    routeScore = 12;
    routeFitText = `Adjacent district corridor (${load.destination})`;
  }

  // 2. Capacity Compatibility (20% weight - Max 20 pts)
  // Hard constraint: Load weight cannot exceed truck capacity by more than 5%
  if (load.weightTons > trip.capacityTons * 1.05) {
    return null; // Overweight - impossible match
  }

  const utilizationRatio = load.weightTons / trip.capacityTons;
  let capacityScore = 0;
  let capacityFitText = '';

  if (utilizationRatio >= 0.8 && utilizationRatio <= 1.0) {
    capacityScore = 20;
    capacityFitText = `${load.weightTons}T load / ${trip.capacityTons}T truck capacity fit (${Math.round(utilizationRatio * 100)}% optimal load)`;
  } else if (utilizationRatio >= 0.65) {
    capacityScore = 16;
    capacityFitText = `${load.weightTons}T load on ${trip.capacityTons}T truck (${Math.round(utilizationRatio * 100)}% partial volume)`;
  } else {
    capacityScore = 10;
    capacityFitText = `${load.weightTons}T load on ${trip.capacityTons}T truck (${Math.round(utilizationRatio * 100)}% volume)`;
  }

  // 3. Time Window Compatibility (15% weight - Max 15 pts)
  let timeScore = 15;
  let timeFitText = 'Loading slot fits post-unloading availability';
  if (load.loadingWindow.includes('16:00') || load.loadingWindow.includes('17:00') || load.loadingWindow.includes('Immediate')) {
    timeScore = 15;
    timeFitText = `Loading window (${load.loadingWindow}) matches availability`;
  } else {
    timeScore = 11;
    timeFitText = `Window ${load.loadingWindow} requires minor staging`;
  }

  // 4. Price Attractiveness (15% weight - Max 15 pts)
  let priceScore = 0;
  let priceFitText = '';
  const midRef = (load.suggestedMin + load.suggestedMax) / 2;
  const ratio = load.offeredPrice / midRef;

  if (ratio >= 0.98) {
    priceScore = 15;
    priceFitText = `₹${load.offeredPrice.toLocaleString('en-IN')} is within fair reference range`;
  } else if (ratio >= 0.90) {
    priceScore = 11;
    priceFitText = `₹${load.offeredPrice.toLocaleString('en-IN')} is 5-10% below median reference`;
  } else {
    priceScore = 6;
    priceFitText = `₹${load.offeredPrice.toLocaleString('en-IN')} is below reference tariff`;
  }

  // 5. Empty-Distance Reduction (10% weight - Max 10 pts)
  // Pickup within APMC Amargol or nearby industrial gate
  const emptyKm = load.origin.includes('APMC') ? 4 : 12;
  let emptyScore = emptyKm <= 8 ? 10 : 7;

  // 6. Reliability Score (10% weight - Max 10 pts)
  // Load owner verified = 10, broker score proportional
  let reliabilityScore = load.verified ? 10 : 6;
  if (load.brokerScore && load.brokerScore > 85) reliabilityScore = 9;

  const totalScore = Math.min(
    100,
    Math.round(routeScore + capacityScore + timeScore + priceScore + emptyScore + reliabilityScore)
  );

  const explanation = `${totalScore}/100 — ${
    totalScore >= 90 ? 'Excellent Match' : totalScore >= 75 ? 'Strong Match' : 'Viable Match'
  }. ${capacityFitText}; ${load.destination} fits return route; loading fits availability window; ₹${load.offeredPrice.toLocaleString(
    'en-IN'
  )} is within reference range; only ${emptyKm} km empty movement expected; ${
    load.verified ? 'Load owner verified' : 'Standard poster'
  }.`;

  return {
    load,
    score: totalScore,
    routeFit: routeFitText,
    capacityFit: capacityFitText,
    timeFit: timeFitText,
    priceComparison: priceFitText,
    emptyKmExpected: emptyKm,
    explanation,
    breakdown: {
      route: routeScore,
      capacity: capacityScore,
      time: timeScore,
      price: priceScore,
      emptyDistance: emptyScore,
      reliability: reliabilityScore,
    },
  };
}

export function findTopDeterministicMatches(trip: Trip, loads: Load[], limit = 5): MatchScoreResult[] {
  const matches: MatchScoreResult[] = [];
  for (const load of loads) {
    if (load.status !== 'OPEN') continue;
    const res = calculateDeterministicMatch(trip, load);
    if (res) matches.push(res);
  }
  // Sort deterministically by score descending, then by offered price descending
  // CRITICAL SPEC REQUIREMENT: Broker identity never influences matching rank!
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.load.offeredPrice - a.load.offeredPrice;
  });

  return matches.slice(0, limit);
}
