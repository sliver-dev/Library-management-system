"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookController_1 = require("../controllers/BookController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const bookController = new BookController_1.BookController();
router.use(auth_1.authenticate);
router.get('/', bookController.getBooks);
router.get('/stats', bookController.getBookStats);
router.get('/:bookId', bookController.getBookById);
router.post('/', auth_1.requireAdmin, bookController.createBook);
router.put('/:bookId', auth_1.requireAdmin, bookController.updateBook);
router.delete('/:bookId', auth_1.requireAdmin, bookController.deleteBook);
router.patch('/:bookId/availability', auth_1.requireAdmin, bookController.updateBookAvailability);
router.post('/bulk-import', auth_1.requireAdmin, bookController.bulkImportBooks);
exports.default = router;
//# sourceMappingURL=books.js.map