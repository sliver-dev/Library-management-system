import { v4 as uuidv4 } from 'uuid';

export interface Book {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  genre: string;
  publisher?: string;
  edition?: string;
  publication_year?: number;
  description?: string;
  cover_image_url?: string;
  total_copies: number;
  available_copies: number;
  barcode?: string;
  rfid_tag?: string;
  location?: string;
  acquisition_date?: Date;
  cost?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateBookData {
  isbn?: string;
  title: string;
  author: string;
  genre: string;
  publisher?: string;
  edition?: string;
  publication_year?: number;
  description?: string;
  cover_image_url?: string;
  total_copies?: number;
  barcode?: string;
  rfid_tag?: string;
  location?: string;
  acquisition_date?: Date;
  cost?: number;
}

export interface UpdateBookData {
  isbn?: string;
  title?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  edition?: string;
  publication_year?: number;
  description?: string;
  cover_image_url?: string;
  total_copies?: number;
  barcode?: string;
  rfid_tag?: string;
  location?: string;
  acquisition_date?: Date;
  cost?: number;
  is_active?: boolean;
}

export interface BookSearchFilters {
  title?: string;
  author?: string;
  genre?: string;
  available?: boolean;
  publication_year?: number;
  page?: number;
  limit?: number;
  sort_by?: 'title' | 'author' | 'publication_year' | 'created_at';
  sort_order?: 'asc' | 'desc';
}