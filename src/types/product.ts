import { Sex } from '@prisma/client';

export interface FragranceNotes {
  topNotes: string;
  middleNotes: string;
  baseNotes: string;
}

export interface Review {
  id: string;
  rating: number;
  reviewText: string;
  customerName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  sex: Sex;
  description: string;
  price: number;
  discountPrice?: number | null;
  isDiscounted: boolean;
  stock: number;
  bottleSize: number;
  bottleType: string;
  packaging: string;
  averageRating?: number | null;
  shippingWeight?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  imageUrls: string[];
  fragranceNotes?: FragranceNotes | null;
  reviews?: Review[] | null;
  createdAt: string;
  updatedAt: string;
}
