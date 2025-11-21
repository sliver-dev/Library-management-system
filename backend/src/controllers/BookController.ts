import { Request, Response } from 'express';
import { BookService } from '../services/BookService';
import { validate } from '../utils/validation';
import { bookSchema, bookSearchSchema } from '../utils/validationSchemas';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = validate(bookSchema, req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details,
        });
        return;
      }

      const book = await this.bookService.createBook(value);

      res.status(201).json({
        success: true,
        message: 'Book created successfully',
        data: { book },
      });
    } catch (error) {
      console.error('Create book error:', error);

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({
            success: false,
            error: error.message,
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create book',
      });
    }
  };

  getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = validate(bookSearchSchema, req.query);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Invalid search parameters',
          details: error.details,
        });
        return;
      }

      const { books, total } = await this.bookService.getBooks(value);

      res.json({
        success: true,
        data: {
          books,
          pagination: {
            page: value.page,
            limit: value.limit,
            total,
            totalPages: Math.ceil(total / value.limit),
          },
        },
      });
    } catch (error) {
      console.error('Get books error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve books',
      });
    }
  };

  getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      if (!bookId) {
        res.status(400).json({
          success: false,
          error: 'Book ID is required',
        });
        return;
      }

      const book = await this.bookService.getBookById(bookId);

      if (!book) {
        res.status(404).json({
          success: false,
          error: 'Book not found',
        });
        return;
      }

      res.json({
        success: true,
        data: { book },
      });
    } catch (error) {
      console.error('Get book by ID error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve book',
      });
    }
  };

  updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      if (!bookId) {
        res.status(400).json({
          success: false,
          error: 'Book ID is required',
        });
        return;
      }

      const { error, value } = validate(bookSchema.fork(['isbn', 'title', 'author', 'genre'], (schema) => schema.optional()), req.body);
      if (error) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.details,
        });
        return;
      }

      const book = await this.bookService.updateBook(bookId, value);

      if (!book) {
        res.status(404).json({
          success: false,
          error: 'Book not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Book updated successfully',
        data: { book },
      });
    } catch (error) {
      console.error('Update book error:', error);

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          res.status(409).json({
            success: false,
            error: error.message,
          });
          return;
        }

        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update book',
      });
    }
  };

  deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;

      if (!bookId) {
        res.status(400).json({
          success: false,
          error: 'Book ID is required',
        });
        return;
      }

      const deleted = await this.bookService.deleteBook(bookId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Book not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Book deleted successfully',
      });
    } catch (error) {
      console.error('Delete book error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to delete book',
      });
    }
  };

  updateBookAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookId } = req.params;
      const { availableCopies } = req.body;

      if (!bookId) {
        res.status(400).json({
          success: false,
          error: 'Book ID is required',
        });
        return;
      }

      if (typeof availableCopies !== 'number' || availableCopies < 0) {
        res.status(400).json({
          success: false,
          error: 'Available copies must be a non-negative number',
        });
        return;
      }

      const book = await this.bookService.updateBookAvailability(bookId, availableCopies);

      if (!book) {
        res.status(404).json({
          success: false,
          error: 'Book not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Book availability updated successfully',
        data: { book },
      });
    } catch (error) {
      console.error('Update book availability error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to update book availability',
      });
    }
  };

  getBookStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.bookService.getBookStats();

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      console.error('Get book stats error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve book statistics',
      });
    }
  };

  bulkImportBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { books } = req.body;

      if (!Array.isArray(books)) {
        res.status(400).json({
          success: false,
          error: 'Books data must be an array',
        });
        return;
      }

      if (books.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No books provided for import',
        });
        return;
      }

      if (books.length > 1000) {
        res.status(400).json({
          success: false,
          error: 'Cannot import more than 1000 books at once',
        });
        return;
      }

      const result = await this.bookService.bulkImportBooks(books);

      res.json({
        success: true,
        message: `Bulk import completed. ${result.successful} books imported successfully, ${result.failed} failed.`,
        data: {
          successful: result.successful,
          failed: result.failed,
          errors: result.errors.slice(0, 10), // Limit errors to prevent huge responses
        },
      });
    } catch (error) {
      console.error('Bulk import books error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to import books',
      });
    }
  };
}