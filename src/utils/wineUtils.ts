import { Wine } from '../types';

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
