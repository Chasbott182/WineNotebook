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

export type WineFormData = Omit<Wine, 'id'> & { id?: number };
