import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { booksAPI } from '../../services/api';

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
  acquisition_date?: string;
  cost?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalCopies: number;
  availableCopies: number;
}

export interface BooksState {
  books: Book[];
  currentBook: Book | null;
  stats: BookStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: BooksState = {
  books: [],
  currentBook: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async thunks
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (params?: {
    page?: number;
    limit?: number;
    title?: string;
    author?: string;
    genre?: string;
    available?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBooks(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch books');
    }
  }
);

export const fetchBook = createAsyncThunk(
  'books/fetchBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBook(bookId);
      return response.data.data.book;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch book');
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (bookData: {
    title: string;
    author: string;
    genre: string;
    isbn?: string;
    publisher?: string;
    edition?: string;
    publication_year?: number;
    description?: string;
    cover_image_url?: string;
    total_copies?: number;
    barcode?: string;
    rfid_tag?: string;
    location?: string;
    acquisition_date?: string;
    cost?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await booksAPI.createBook(bookData);
      return response.data.data.book;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create book');
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ bookId, bookData }: {
    bookId: string;
    bookData: Partial<{
      title: string;
      author: string;
      genre: string;
      isbn?: string;
      publisher?: string;
      edition?: string;
      publication_year?: number;
      description?: string;
      cover_image_url?: string;
      total_copies?: number;
      barcode?: string;
      rfid_tag?: string;
      location?: string;
      acquisition_date?: string;
      cost?: number;
      is_active?: boolean;
    }>;
  }, { rejectWithValue }) => {
    try {
      const response = await booksAPI.updateBook(bookId, bookData);
      return response.data.data.book;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update book');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (bookId: string, { rejectWithValue }) => {
    try {
      await booksAPI.deleteBook(bookId);
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete book');
    }
  }
);

export const fetchBookStats = createAsyncThunk(
  'books/fetchBookStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBookStats();
      return response.data.data.stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch book statistics');
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
    setFilters: (state, action: PayloadAction<{
      title?: string;
      author?: string;
      genre?: string;
      available?: boolean;
    }>) => {
      // This would be used to maintain filter state
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Single Book
      .addCase(fetchBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
        state.error = null;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Book
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.unshift(action.payload);
        state.error = null;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.currentBook?.id === action.payload.id) {
          state.currentBook = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter(book => book.id !== action.payload);
        if (state.currentBook?.id === action.payload) {
          state.currentBook = null;
        }
        state.error = null;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Book Stats
      .addCase(fetchBookStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchBookStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBook, setFilters } = booksSlice.actions;
export default booksSlice.reducer;