export enum ArtworkCategory {
  HANDMADE = 'Handmade Paper',
  DIGITAL = 'Digital',
}

export interface Artwork {
  id: number;
  title: string;
  year: number;
  category: ArtworkCategory;
  medium: string;
  size: string;
  price?: number;
  imageUrl: string;
  description: string;
}

// FIX: Add CartItem interface for use in CartModal.tsx
export interface CartItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
