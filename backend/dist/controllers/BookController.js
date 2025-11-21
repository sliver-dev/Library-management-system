"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const BookService_1 = require("../services/BookService");
const validation_1 = require("../utils/validation");
const validationSchemas_1 = require("../utils/validationSchemas");
class BookController {
    constructor() {
        this.createBook = async (req, res) => {
            try {
                const { error, value } = (0, validation_1.validate)(validationSchemas_1.bookSchema, req.body);
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
            }
            catch (error) {
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
        this.getBooks = async (req, res) => {
            try {
                const { error, value } = (0, validation_1.validate)(validationSchemas_1.bookSearchSchema, req.query);
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
            }
            catch (error) {
                console.error('Get books error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve books',
                });
            }
        };
        this.getBookById = async (req, res) => {
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
            }
            catch (error) {
                console.error('Get book by ID error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve book',
                });
            }
        };
        this.updateBook = async (req, res) => {
            try {
                const { bookId } = req.params;
                if (!bookId) {
                    res.status(400).json({
                        success: false,
                        error: 'Book ID is required',
                    });
                    return;
                }
                const { error, value } = (0, validation_1.validate)(validationSchemas_1.bookSchema.fork(['isbn', 'title', 'author', 'genre'], (schema) => schema.optional()), req.body);
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
            }
            catch (error) {
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
        this.deleteBook = async (req, res) => {
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
            }
            catch (error) {
                console.error('Delete book error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to delete book',
                });
            }
        };
        this.updateBookAvailability = async (req, res) => {
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
            }
            catch (error) {
                console.error('Update book availability error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to update book availability',
                });
            }
        };
        this.getBookStats = async (req, res) => {
            try {
                const stats = await this.bookService.getBookStats();
                res.json({
                    success: true,
                    data: { stats },
                });
            }
            catch (error) {
                console.error('Get book stats error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to retrieve book statistics',
                });
            }
        };
        this.bulkImportBooks = async (req, res) => {
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
                        errors: result.errors.slice(0, 10),
                    },
                });
            }
            catch (error) {
                console.error('Bulk import books error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to import books',
                });
            }
        };
        this.bookService = new BookService_1.BookService();
    }
}
exports.BookController = BookController;
//# sourceMappingURL=BookController.js.map