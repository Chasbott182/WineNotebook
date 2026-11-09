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

export type ThemeMode = 'dark' | 'light';

export interface PersonalProfile {
  fullName: string;
  email: string;
  title: string;
  location: string;
  favoriteVarietal: string;
  bio: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  requirePinForDelete: boolean;
  securityPin: string;
  biometricLogin: boolean;
  apiCorsRestricted: boolean;
  auditLogEnabled: boolean;
}

export interface AppSettings {
  theme: ThemeMode;
  profile: PersonalProfile;
  security: SecuritySettings;
}

