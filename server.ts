import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Wine {
  id: number;
  name: string;
  varietal: string;
  brand: string;
  place: string;
  alcohol: number;
  vintage: string;
  drysweet: string;
  imageUrl: string;
  palate: string;
  nose: string;
  body: string;
  tannin: string;
  acidity: string;
  price: number;
  priceRange: string;
  cellarLocation: string;
}

let cellarLocations: string[] = [
  "Main Cellar - Rack A1",
  "Wine Fridge (55°F)",
  "Aging Vault",
  "Dining Room Credenza"
];

let appSettings = {
  theme: 'dark' as 'dark' | 'light',
  profile: {
    fullName: 'Charles Bott',
    email: 'chasman182@gmail.com',
    title: 'Certified Sommelier & Collector',
    location: 'Napa Valley, CA',
    favoriteVarietal: 'Cabernet Sauvignon',
    bio: 'Curating structured reds and mineral-driven whites across temperature-controlled cellar zones.'
  },
  security: {
    twoFactorEnabled: true,
    sessionTimeoutMinutes: 30,
    requirePinForDelete: false,
    securityPin: '1820',
    biometricLogin: true,
    apiCorsRestricted: true,
    auditLogEnabled: true
  }
};

let wines: Wine[] = [
  {
    id: 1,
    name: "Reserve Cabernet Sauvignon",
    varietal: "Cabernet Sauvignon",
    brand: "Stags Leap District",
    place: "Napa Valley, California",
    alcohol: 14.5,
    vintage: "2019",
    drysweet: "Dry",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80",
    palate: "Ripe black currant, dark chocolate, tobacco leaf, and subtle French oak spices with velvety structure.",
    nose: "Blackberry compote, cassis, cedarwood, and graphite.",
    body: "Full",
    tannin: "Firm & Polished",
    acidity: "Medium+",
    price: 95.0,
    priceRange: "$$$$",
    cellarLocation: "Main Cellar - Rack A1"
  },
  {
    id: 2,
    name: "Dundee Hills Pinot Noir",
    varietal: "Pinot Noir",
    brand: "Domaine Serene",
    place: "Willamette Valley, Oregon",
    alcohol: 13.8,
    vintage: "2021",
    drysweet: "Dry",
    imageUrl: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&auto=format&fit=crop&q=80",
    palate: "Silky red cherries, cranberry, forest floor, and delicate baking spices.",
    nose: "Bing cherry, violets, damp earth, and tea leaf.",
    body: "Medium",
    tannin: "Silky",
    acidity: "Vibrant",
    price: 65.0,
    priceRange: "$$$",
    cellarLocation: "Wine Fridge (55°F)"
  },
  {
    id: 3,
    name: "Les Monts Damnés Sancerre",
    varietal: "Sauvignon Blanc",
    brand: "Henri Bourgeois",
    place: "Loire Valley, France",
    alcohol: 13.0,
    vintage: "2022",
    drysweet: "Crisp Dry",
    imageUrl: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=800&auto=format&fit=crop&q=80",
    palate: "Chalky limestone minerality, grapefruit zest, lemongrass, flinty precision.",
    nose: "Crushed stone, lime blossom, white peach, and wet slate.",
    body: "Medium-Light",
    tannin: "None",
    acidity: "High & Electric",
    price: 48.0,
    priceRange: "$$",
    cellarLocation: "Wine Fridge (55°F)"
  },
  {
    id: 4,
    name: "Tradizione Barolo",
    varietal: "Nebbiolo",
    brand: "Marchesi di Barolo",
    place: "Piedmont, Italy",
    alcohol: 14.0,
    vintage: "2018",
    drysweet: "Dry",
    imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop&q=80",
    palate: "Dried red cherry, tar, leather, savory herbs, and structured grippy finish.",
    nose: "Rose petals, tar, dried orange peel, and truffles.",
    body: "Full",
    tannin: "High & Grippy",
    acidity: "High",
    price: 80.0,
    priceRange: "$$$$",
    cellarLocation: "Aging Vault"
  }
];

let nextId = 5;

const app = express();
app.use(cors());
app.use(express.json());

// API Routes matching Spring Boot WineResource & SettingsController endpoints
app.get('/wine/all', (req, res) => {
  res.status(200).json(wines);
});

app.get('/wine/settings', (_req, res) => {
  res.status(200).json({
    ...appSettings,
    cellarLocations
  });
});

app.put('/wine/settings', (req, res) => {
  const { theme, profile, security } = req.body;
  if (theme === 'light' || theme === 'dark') {
    appSettings.theme = theme;
  }
  if (profile) {
    appSettings.profile = { ...appSettings.profile, ...profile };
  }
  if (security) {
    appSettings.security = { ...appSettings.security, ...security };
  }
  res.status(200).json({
    ...appSettings,
    cellarLocations
  });
});

app.get('/wine/cellar-locations', (_req, res) => {
  const fromWines = wines.map(w => w.cellarLocation).filter(Boolean);
  const merged = Array.from(new Set([...cellarLocations, ...fromWines]));
  res.status(200).json(merged);
});

app.post('/wine/cellar-locations', (req, res) => {
  const location = (req.body.location || '').trim();
  if (!location) {
    return res.status(400).json({ error: 'Cellar location name is required' });
  }
  if (!cellarLocations.some(l => l.toLowerCase() === location.toLowerCase())) {
    cellarLocations.push(location);
  }
  const fromWines = wines.map(w => w.cellarLocation).filter(Boolean);
  const merged = Array.from(new Set([...cellarLocations, ...fromWines]));
  res.status(201).json(merged);
});

app.delete('/wine/cellar-locations/:location', (req, res) => {
  const target = decodeURIComponent(req.params.location || '').trim();
  if (cellarLocations.length <= 1) {
    return res.status(400).json({ error: 'At least one cellar location must remain' });
  }
  cellarLocations = cellarLocations.filter(l => l.toLowerCase() !== target.toLowerCase());
  const fallback = cellarLocations[0] || 'Main Cellar - Rack A1';
  wines = wines.map(w =>
    (w.cellarLocation || '').toLowerCase() === target.toLowerCase()
      ? { ...w, cellarLocation: fallback }
      : w
  );
  res.status(200).json({
    cellarLocations,
    wines
  });
});

app.get('/wine/find/:id', (req, res) => {
  const id = Number(req.params.id);
  const wine = wines.find(w => w.id === id);
  if (!wine) {
    return res.status(404).json({ error: `Wine with ID ${id} was not found` });
  }
  res.status(200).json(wine);
});

app.post('/wine/add', (req, res) => {
  const location = (req.body.cellarLocation || '').trim() || 'Main Cellar - Rack A1';
  if (!cellarLocations.includes(location)) {
    cellarLocations.push(location);
  }
  const newWine: Wine = {
    ...req.body,
    id: req.body.id ? Number(req.body.id) : nextId++,
    alcohol: Number(req.body.alcohol) || 0,
    price: Number(req.body.price) || 0,
    cellarLocation: location,
  };
  if (newWine.id >= nextId) {
    nextId = newWine.id + 1;
  }
  wines.push(newWine);
  res.status(201).json(newWine);
});

app.put('/wine/update', (req, res) => {
  const updatedData = req.body;
  const index = wines.findIndex(w => w.id === Number(updatedData.id));
  if (index === -1) {
    return res.status(404).json({ error: `Wine with ID ${updatedData.id} was not found` });
  }
  const location = (updatedData.cellarLocation || wines[index].cellarLocation || '').trim() || 'Main Cellar - Rack A1';
  if (!cellarLocations.includes(location)) {
    cellarLocations.push(location);
  }
  wines[index] = {
    ...wines[index],
    ...updatedData,
    id: Number(updatedData.id),
    alcohol: Number(updatedData.alcohol) || 0,
    price: Number(updatedData.price) || 0,
    cellarLocation: location,
  };
  res.status(200).json(wines[index]);
});

app.delete('/wine/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  wines = wines.filter(w => w.id !== id);
  res.status(200).json({ message: `Wine ${id} deleted successfully` });
});

app.get('/wine/brand/:brand', (req, res) => {
  const brandQuery = req.params.brand.toLowerCase();
  const matched = wines.filter(w => w.brand.toLowerCase().includes(brandQuery));
  res.status(200).json(matched);
});

app.get('/wine/varietal/:varietal', (req, res) => {
  const varietalQuery = req.params.varietal.toLowerCase();
  const matched = wines.filter(w => w.varietal.toLowerCase().includes(varietalQuery));
  res.status(200).json(matched);
});

app.get('/wine/cellar/:location', (req, res) => {
  const locQuery = req.params.location.toLowerCase();
  const matched = wines.filter(w => (w.cellarLocation || '').toLowerCase().includes(locQuery));
  res.status(200).json(matched);
});

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍷 WineNotebook server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
