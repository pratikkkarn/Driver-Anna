import { PriceBreakdown } from '../types';

export const MANDATORY_PRICE_LABEL =
  'System-generated reference estimate — not an official government tariff.';

export interface PriceCalculationParams {
  distanceKm: number;
  weightTons: number;
  offeredPrice: number;
  brokerCommission?: number;
}

export function calculateTransparentPrice(params: PriceCalculationParams): PriceBreakdown {
  const { distanceKm, weightTons, offeredPrice, brokerCommission } = params;

  // Real-world benchmark logistics model for Hubballi corridor (NH-48):
  // Average diesel consumption: 3.8 km/litre for 16T truck
  // Diesel rate: ~₹88/litre in Karnataka
  // Tolls on Hubballi - Bengaluru (410 km): ~₹3,900 - ₹4,200
  // Driver allowance: ₹6/km
  // Vehicle wear & tear/maintenance depreciation: ₹10/km
  
  const fuelCost = Math.round((distanceKm / 3.8) * 88 * (1 + (weightTons - 10) * 0.02));
  const tolls = Math.round(distanceKm * 9.8);
  const driverAllowance = Math.round(distanceKm * 6.1);
  const vehicleCost = Math.round(distanceKm * 10.5);

  const baseOperatingCost = fuelCost + tolls + driverAllowance + vehicleCost;
  
  // Fair margin bandwidth: 12% to 22%
  const suggestedMin = Math.round(baseOperatingCost * 1.10 / 100) * 100;
  const suggestedMax = Math.round(baseOperatingCost * 1.25 / 100) * 100;

  const estimatedMargin = offeredPrice - baseOperatingCost - (brokerCommission || 0);
  const difference = offeredPrice - suggestedMin;

  return {
    suggestedMin,
    suggestedMax,
    offeredPrice,
    difference,
    fuelCost,
    tolls,
    driverAllowance,
    vehicleCost,
    estimatedMargin,
    brokerCommission,
    mandatoryLabel: MANDATORY_PRICE_LABEL,
  };
}
