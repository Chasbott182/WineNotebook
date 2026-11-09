import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterWines,
  getUniqueVarietals,
  getUniqueCellarLocations,
  addCellarLocationToList,
  removeCellarLocationFromList,
  calculateSecurityScore,
  calculateCellarStats,
} from './wineUtils';
import { Wine } from '../types';

const SAMPLE_WINES: Wine[] = [
  {
    id: 1,
    name: 'Reserve Cabernet Sauvignon',
    varietal: 'Cabernet Sauvignon',
    brand: 'Stags Leap District',
    place: 'Napa Valley, California',
    alcohol: 14.5,
    vintage: '2019',
    drysweet: 'Dry',
    imageUrl: '',
    palate: 'Ripe black currant',
    nose: 'Blackberry',
    body: 'Full',
    tannin: 'Firm',
    acidity: 'Medium+',
    price: 95,
    priceRange: '$$$$',
    cellarLocation: 'Main Cellar - Rack A1',
  },
  {
    id: 2,
    name: 'Dundee Hills Pinot Noir',
    varietal: 'Pinot Noir',
    brand: 'Domaine Serene',
    place: 'Willamette Valley, Oregon',
    alcohol: 13.5,
    vintage: '2021',
    drysweet: 'Dry',
    imageUrl: '',
    palate: 'Red cherries',
    nose: 'Violets',
    body: 'Medium',
    tannin: 'Silky',
    acidity: 'Vibrant',
    price: 65,
    priceRange: '$$$',
    cellarLocation: 'Wine Fridge (55°F)',
  },
];

test('filterWines filters by search term, varietal, and cellar location accurately', () => {
  assert.equal(filterWines(SAMPLE_WINES, '', 'All', 'All').length, 2);
  assert.equal(filterWines(SAMPLE_WINES, 'napa', 'All', 'All').length, 1);
  assert.equal(filterWines(SAMPLE_WINES, '', 'Pinot Noir', 'All').length, 1);
  assert.equal(filterWines(SAMPLE_WINES, '', 'All', 'Wine Fridge (55°F)').length, 1);
  assert.equal(filterWines(SAMPLE_WINES, '', 'Cabernet Sauvignon', 'Wine Fridge (55°F)').length, 0);
  assert.equal(filterWines(SAMPLE_WINES, 'rack a1', 'All', 'All').length, 1);
});

test('getUniqueVarietals returns All plus distinct varietals', () => {
  assert.deepEqual(getUniqueVarietals(SAMPLE_WINES), [
    'All',
    'Cabernet Sauvignon',
    'Pinot Noir',
  ]);
});

test('getUniqueCellarLocations, addCellarLocationToList, and removeCellarLocationFromList manage cellar locations properly', () => {
  const custom = ['Main Cellar - Rack A1', 'Basement Vault'];
  const locations = getUniqueCellarLocations(SAMPLE_WINES, custom);
  assert.deepEqual(locations, [
    'All',
    'Main Cellar - Rack A1',
    'Basement Vault',
    'Wine Fridge (55°F)',
  ]);

  const updated = addCellarLocationToList(custom, 'Tasting Room Rack');
  assert.equal(updated.length, 3);
  assert.equal(updated[2], 'Tasting Room Rack');

  // Case-insensitive duplicate prevention
  const duplicateAttempt = addCellarLocationToList(updated, 'tasting room rack');
  assert.equal(duplicateAttempt.length, 3);

  // Removing a location reassigns wines in that location to the fallback location
  const removalResult = removeCellarLocationFromList(
    ['Main Cellar - Rack A1', 'Wine Fridge (55°F)'],
    'Wine Fridge (55°F)',
    SAMPLE_WINES
  );
  assert.deepEqual(removalResult.locations, ['Main Cellar - Rack A1']);
  assert.equal(removalResult.updatedWines[1].cellarLocation, 'Main Cellar - Rack A1');
});

test('calculateSecurityScore computes security score and rating accurately', () => {
  const highSec = calculateSecurityScore({
    twoFactorEnabled: true,
    sessionTimeoutMinutes: 30,
    requirePinForDelete: true,
    securityPin: '1820',
    biometricLogin: true,
    apiCorsRestricted: true,
    auditLogEnabled: true,
  });
  assert.equal(highSec.score, 100);
  assert.equal(highSec.level, 'High');

  const lowSec = calculateSecurityScore({
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
    requirePinForDelete: false,
    securityPin: '',
    biometricLogin: false,
    apiCorsRestricted: false,
    auditLogEnabled: false,
  });
  assert.equal(lowSec.score, 20);
  assert.equal(lowSec.level, 'Low');
});

test('calculateCellarStats computes count, totalValue, avgAbv, varietalCount, and cellarLocationCount', () => {
  const stats = calculateCellarStats(SAMPLE_WINES);
  assert.equal(stats.count, 2);
  assert.equal(stats.totalValue, 160);
  assert.equal(stats.avgAbv, '14.0');
  assert.equal(stats.varietalCount, 2);
  assert.equal(stats.cellarLocationCount, 2);
});
