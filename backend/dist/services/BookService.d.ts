import { Book, CreateBookData, UpdateBookData, BookSearchFilters } from '../models/Book';
export declare class BookService {
    createBook(bookData: CreateBookData): Promise<Book>;
    getBooks(filters: BookSearchFilters): Promise<{
        books: Book[];
        total: number;
    }>;
    getBookById(bookId: string): Promise<Book | null>;
    updateBook(bookId: string, updateData: UpdateBookData): Promise<Book | null>;
    deleteBook(bookId: string): Promise<boolean>;
    updateBookAvailability(bookId: string, availableCopies: number): Promise<Book | null>;
    getBookStats(): Promise<{
        totalBooks: number;
        availableBooks: number;
        borrowedBooks: number;
        totalCopies: number;
        availableCopies: number;
    }>;
    bulkImportBooks(books: CreateBookData[]): Promise<{
        successful: number;
        failed: number;
        errors: string[];
    }>;
}
//# sourceMappingURL=BookService.d.ts.map