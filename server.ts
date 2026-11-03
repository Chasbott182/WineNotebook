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
}

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
    priceRange: "$$$$"
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
    priceRange: "$$$"
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
    priceRange: "$$"
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
    priceRange: "$$$$"
  }
];

let nextId = 5;

const app = express();
app.use(cors());
app.use(express.json());

// API Routes matching Spring Boot WineResource endpoints
app.get('/wine/all', (req, res) => {
  res.status(200).json(wines);
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
  const newWine: Wine = {
    ...req.body,
    id: req.body.id ? Number(req.body.id) : nextId++,
    alcohol: Number(req.body.alcohol) || 0,
    price: Number(req.body.price) || 0,
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
  wines[index] = {
    ...wines[index],
    ...updatedData,
    id: Number(updatedData.id),
    alcohol: Number(updatedData.alcohol) || 0,
    price: Number(updatedData.price) || 0,
  };
  res.status(200).json(wines[index]);
});

app.delete('/wine/delete/:id', (req, res) => {
  const id = Number(req.params.id);
  wines = wines.filter(w => w.id !== id);
  res.status(200).json({ message: `Wine ${id} deleted successfully` });
});

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
