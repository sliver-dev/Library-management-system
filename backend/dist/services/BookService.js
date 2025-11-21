"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const database_1 = require("../config/database");
class BookService {
    async createBook(bookData) {
        const { isbn, title, author, genre, publisher, edition, publication_year, description, cover_image_url, total_copies = 1, barcode, rfid_tag, location, acquisition_date, cost, } = bookData;
        try {
            const result = await (0, database_1.query)(`INSERT INTO books (
          isbn, title, author, genre, publisher, edition, publication_year,
          description, cover_image_url, total_copies, available_copies,
          barcode, rfid_tag, location, acquisition_date, cost
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $11, $12, $13, $14, $15)
        RETURNING *`, [
                isbn,
                title,
                author,
                genre,
                publisher,
                edition,
                publication_year,
                description,
                cover_image_url,
                total_copies,
                barcode,
                rfid_tag,
                location,
                acquisition_date,
                cost,
            ]);
            return result.rows[0];
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('duplicate key')) {
                if (error.message.includes('books_isbn_key')) {
                    throw new Error('Book with this ISBN already exists');
                }
                if (error.message.includes('books_barcode_key')) {
                    throw new Error('Book with this barcode already exists');
                }
                if (error.message.includes('books_rfid_tag_key')) {
                    throw new Error('Book with this RFID tag already exists');
                }
            }
            throw new Error('Failed to create book');
        }
    }
    async getBooks(filters) {
        const { title, author, genre, available, publication_year, page = 1, limit = 10, sort_by = 'title', sort_order = 'asc', } = filters;
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE is_active = TRUE';
        const queryParams = [];
        let paramIndex = 1;
        if (title) {
            whereClause += ` AND LOWER(title) LIKE LOWER($${paramIndex})`;
            queryParams.push(`%${title}%`);
            paramIndex++;
        }
        if (author) {
            whereClause += ` AND LOWER(author) LIKE LOWER($${paramIndex})`;
            queryParams.push(`%${author}%`);
            paramIndex++;
        }
        if (genre) {
            whereClause += ` AND LOWER(genre) = LOWER($${paramIndex})`;
            queryParams.push(genre);
            paramIndex++;
        }
        if (available !== undefined) {
            whereClause += ` AND available_copies > 0`;
        }
        if (publication_year) {
            whereClause += ` AND publication_year = $${paramIndex}`;
            queryParams.push(publication_year);
            paramIndex++;
        }
        const validSortColumns = ['title', 'author', 'publication_year', 'created_at'];
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'title';
        const sortDirection = sort_order === 'desc' ? 'DESC' : 'ASC';
        try {
            const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM books ${whereClause}`, queryParams);
            const total = parseInt(countResult.rows[0].count);
            const booksResult = await (0, database_1.query)(`SELECT * FROM books
         ${whereClause}
         ORDER BY ${sortColumn} ${sortDirection}
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, [...queryParams, limit, offset]);
            return {
                books: booksResult.rows,
                total,
            };
        }
        catch (error) {
            console.error('Error getting books:', error);
            throw new Error('Failed to retrieve books');
        }
    }
    async getBookById(bookId) {
        try {
            const result = await (0, database_1.query)('SELECT * FROM books WHERE id = $1 AND is_active = TRUE', [bookId]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            console.error('Error getting book by ID:', error);
            throw new Error('Failed to retrieve book');
        }
    }
    async updateBook(bookId, updateData) {
        const { isbn, title, author, genre, publisher, edition, publication_year, description, cover_image_url, total_copies, barcode, rfid_tag, location, acquisition_date, cost, is_active, } = updateData;
        try {
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;
            if (isbn !== undefined) {
                updateFields.push(`isbn = $${paramIndex}`);
                updateValues.push(isbn);
                paramIndex++;
            }
            if (title !== undefined) {
                updateFields.push(`title = $${paramIndex}`);
                updateValues.push(title);
                paramIndex++;
            }
            if (author !== undefined) {
                updateFields.push(`author = $${paramIndex}`);
                updateValues.push(author);
                paramIndex++;
            }
            if (genre !== undefined) {
                updateFields.push(`genre = $${paramIndex}`);
                updateValues.push(genre);
                paramIndex++;
            }
            if (publisher !== undefined) {
                updateFields.push(`publisher = $${paramIndex}`);
                updateValues.push(publisher);
                paramIndex++;
            }
            if (edition !== undefined) {
                updateFields.push(`edition = $${paramIndex}`);
                updateValues.push(edition);
                paramIndex++;
            }
            if (publication_year !== undefined) {
                updateFields.push(`publication_year = $${paramIndex}`);
                updateValues.push(publication_year);
                paramIndex++;
            }
            if (description !== undefined) {
                updateFields.push(`description = $${paramIndex}`);
                updateValues.push(description);
                paramIndex++;
            }
            if (cover_image_url !== undefined) {
                updateFields.push(`cover_image_url = $${paramIndex}`);
                updateValues.push(cover_image_url);
                paramIndex++;
            }
            if (total_copies !== undefined) {
                updateFields.push(`total_copies = $${paramIndex}`);
                updateValues.push(total_copies);
                paramIndex++;
            }
            if (barcode !== undefined) {
                updateFields.push(`barcode = $${paramIndex}`);
                updateValues.push(barcode);
                paramIndex++;
            }
            if (rfid_tag !== undefined) {
                updateFields.push(`rfid_tag = $${paramIndex}`);
                updateValues.push(rfid_tag);
                paramIndex++;
            }
            if (location !== undefined) {
                updateFields.push(`location = $${paramIndex}`);
                updateValues.push(location);
                paramIndex++;
            }
            if (acquisition_date !== undefined) {
                updateFields.push(`acquisition_date = $${paramIndex}`);
                updateValues.push(acquisition_date);
                paramIndex++;
            }
            if (cost !== undefined) {
                updateFields.push(`cost = $${paramIndex}`);
                updateValues.push(cost);
                paramIndex++;
            }
            if (is_active !== undefined) {
                updateFields.push(`is_active = $${paramIndex}`);
                updateValues.push(is_active);
                paramIndex++;
            }
            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }
            updateFields.push(`updated_at = NOW()`);
            const result = await (0, database_1.query)(`UPDATE books
         SET ${updateFields.join(', ')}
         WHERE id = $${paramIndex}
         RETURNING *`, [...updateValues, bookId]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('duplicate key')) {
                if (error.message.includes('books_isbn_key')) {
                    throw new Error('Book with this ISBN already exists');
                }
                if (error.message.includes('books_barcode_key')) {
                    throw new Error('Book with this barcode already exists');
                }
                if (error.message.includes('books_rfid_tag_key')) {
                    throw new Error('Book with this RFID tag already exists');
                }
            }
            throw new Error('Failed to update book');
        }
    }
    async deleteBook(bookId) {
        try {
            const result = await (0, database_1.query)('UPDATE books SET is_active = FALSE, updated_at = NOW() WHERE id = $1', [bookId]);
            return result.rowCount !== null && result.rowCount > 0;
        }
        catch (error) {
            console.error('Error deleting book:', error);
            throw new Error('Failed to delete book');
        }
    }
    async updateBookAvailability(bookId, availableCopies) {
        try {
            const result = await (0, database_1.query)(`UPDATE books
         SET available_copies = $1, updated_at = NOW()
         WHERE id = $2 AND is_active = TRUE
         RETURNING *`, [availableCopies, bookId]);
            return result.rows.length > 0 ? result.rows[0] : null;
        }
        catch (error) {
            console.error('Error updating book availability:', error);
            throw new Error('Failed to update book availability');
        }
    }
    async getBookStats() {
        try {
            const result = await (0, database_1.query)(`
        SELECT
          COUNT(*) as total_books,
          COUNT(CASE WHEN available_copies > 0 THEN 1 END) as available_books,
          COUNT(CASE WHEN available_copies = 0 THEN 1 END) as borrowed_books,
          SUM(total_copies) as total_copies,
          SUM(available_copies) as available_copies
        FROM books
        WHERE is_active = TRUE
      `);
            const stats = result.rows[0];
            return {
                totalBooks: parseInt(stats.total_books),
                availableBooks: parseInt(stats.available_books),
                borrowedBooks: parseInt(stats.borrowed_books),
                totalCopies: parseInt(stats.total_copies),
                availableCopies: parseInt(stats.available_copies),
            };
        }
        catch (error) {
            console.error('Error getting book stats:', error);
            throw new Error('Failed to retrieve book statistics');
        }
    }
    async bulkImportBooks(books) {
        const client = await (0, database_1.query)('SELECT 1');
        let successful = 0;
        let failed = 0;
        const errors = [];
        try {
            await client.query('BEGIN');
            for (let i = 0; i < books.length; i++) {
                try {
                    const bookData = books[i];
                    await client.query(`INSERT INTO books (
              isbn, title, author, genre, publisher, edition, publication_year,
              description, cover_image_url, total_copies, available_copies,
              barcode, rfid_tag, location, acquisition_date, cost
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $11, $12, $13, $14, $15)`, [
                        bookData.isbn,
                        bookData.title,
                        bookData.author,
                        bookData.genre,
                        bookData.publisher,
                        bookData.edition,
                        bookData.publication_year,
                        bookData.description,
                        bookData.cover_image_url,
                        bookData.total_copies || 1,
                        bookData.barcode,
                        bookData.rfid_tag,
                        bookData.location,
                        bookData.acquisition_date,
                        bookData.cost,
                    ]);
                    successful++;
                }
                catch (error) {
                    failed++;
                    errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
            await client.query('COMMIT');
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw new Error('Bulk import transaction failed');
        }
        return { successful, failed, errors };
    }
}
exports.BookService = BookService;
//# sourceMappingURL=BookService.js.map