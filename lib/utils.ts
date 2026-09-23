import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Not Available';
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toLocaleString('en-IN', { maximumFractionDigits: 1 })} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatCostRange(min: number, max: number, costType: string): string {
  if (min <= 0 && max <= 0) return 'Not Available / Free in Govt Scheme';
  if (costType === 'FIXED_GOVT_RATE') {
    return `Govt Rate: ${formatINR(min)}`;
  }
  if (min === max || max <= min) {
    return formatINR(min);
  }
  return `${formatINR(min)} – ${formatINR(max)}`;
}

// Haversine formula for exact distance between two coordinates in km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

export function generateMemberId(stateCode: string = 'PB'): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `CM-${stateCode.toUpperCase()}-${randomNum}`;
}
