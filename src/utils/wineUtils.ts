import { Wine, SecuritySettings } from '../types';

export const DEFAULT_CELLAR_LOCATIONS = [
  'Main Cellar - Rack A1',
  'Wine Fridge (55°F)',
  'Aging Vault',
  'Dining Room Credenza',
];

export function filterWines(
  wines: Wine[],
  searchTerm: string,
  selectedVarietal: string,
  selectedCellar: string = 'All'
): Wine[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  return wines.filter(wine => {
    const matchesSearch =
      !normalizedSearch ||
      wine.name.toLowerCase().includes(normalizedSearch) ||
      wine.brand.toLowerCase().includes(normalizedSearch) ||
      wine.place.toLowerCase().includes(normalizedSearch) ||
      wine.varietal.toLowerCase().includes(normalizedSearch) ||
      (wine.cellarLocation || '').toLowerCase().includes(normalizedSearch);
    const matchesVarietal =
      selectedVarietal === 'All' || wine.varietal === selectedVarietal;
    const matchesCellar =
      selectedCellar === 'All' ||
      (wine.cellarLocation || 'Main Cellar - Rack A1') === selectedCellar;
    return matchesSearch && matchesVarietal && matchesCellar;
  });
}

export function getUniqueVarietals(wines: Wine[]): string[] {
  return ['All', ...Array.from(new Set(wines.map(w => w.varietal).filter(Boolean)))];
}

export function getUniqueCellarLocations(
  wines: Wine[],
  customLocations: string[] = DEFAULT_CELLAR_LOCATIONS
): string[] {
  const wineLocations = wines
    .map(w => (w.cellarLocation || '').trim())
    .filter(Boolean);
  const customCleaned = customLocations.map(l => l.trim()).filter(Boolean);
  return ['All', ...Array.from(new Set([...customCleaned, ...wineLocations]))];
}

export function addCellarLocationToList(
  existingLocations: string[],
  newLocation: string
): string[] {
  const cleaned = newLocation.trim();
  if (!cleaned) return existingLocations;
  const exists = existingLocations.some(
    loc => loc.toLowerCase() === cleaned.toLowerCase()
  );
  if (exists) return existingLocations;
  return [...existingLocations, cleaned];
}

export function removeCellarLocationFromList(
  existingLocations: string[],
  locationToRemove: string,
  wines: Wine[] = []
): { locations: string[]; updatedWines: Wine[] } {
  const cleanedTarget = locationToRemove.trim().toLowerCase();
  if (!cleanedTarget || existingLocations.length <= 1) {
    return { locations: existingLocations, updatedWines: wines };
  }
  const locations = existingLocations.filter(
    loc => loc.trim().toLowerCase() !== cleanedTarget
  );
  const fallback = locations[0] || DEFAULT_CELLAR_LOCATIONS[0];
  const updatedWines = wines.map(wine =>
    (wine.cellarLocation || '').trim().toLowerCase() === cleanedTarget
      ? { ...wine, cellarLocation: fallback }
      : wine
  );
  return { locations, updatedWines };
}

export function calculateSecurityScore(security: SecuritySettings): {
  score: number;
  level: 'High' | 'Moderate' | 'Low';
} {
  let score = 20;
  if (security.twoFactorEnabled) score += 25;
  if (security.requirePinForDelete && security.securityPin.trim().length >= 4) score += 20;
  if (security.biometricLogin) score += 15;
  if (security.apiCorsRestricted) score += 10;
  if (security.auditLogEnabled) score += 10;

  const level = score >= 80 ? 'High' : score >= 50 ? 'Moderate' : 'Low';
  return { score, level };
}

export function calculateCellarStats(wines: Wine[]) {
  const count = wines.length;
  const totalValue = wines.reduce((sum, w) => sum + (Number(w.price) || 0), 0);
  const avgAbv = count
    ? (wines.reduce((sum, w) => sum + (Number(w.alcohol) || 0), 0) / count).toFixed(1)
    : '0.0';
  const varietalCount = Math.max(0, getUniqueVarietals(wines).length - 1);
  const cellarLocationCount = new Set(
    wines.map(w => (w.cellarLocation || '').trim()).filter(Boolean)
  ).size;

  return {
    count,
    totalValue,
    avgAbv,
    varietalCount,
    cellarLocationCount,
  };
}
