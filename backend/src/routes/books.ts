import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const bookController = new BookController();

// All routes require authentication
router.use(authenticate);

// Public routes (for authenticated users)
router.get('/', bookController.getBooks);
router.get('/stats', bookController.getBookStats);
router.get('/:bookId', bookController.getBookById);

// Admin-only routes
router.post('/', requireAdmin, bookController.createBook);
router.put('/:bookId', requireAdmin, bookController.updateBook);
router.delete('/:bookId', requireAdmin, bookController.deleteBook);
router.patch('/:bookId/availability', requireAdmin, bookController.updateBookAvailability);
router.post('/bulk-import', requireAdmin, bookController.bulkImportBooks);

export default router;