import { Request, Response } from 'express';
export declare class BookController {
    private bookService;
    constructor();
    createBook: (req: Request, res: Response) => Promise<void>;
    getBooks: (req: Request, res: Response) => Promise<void>;
    getBookById: (req: Request, res: Response) => Promise<void>;
    updateBook: (req: Request, res: Response) => Promise<void>;
    deleteBook: (req: Request, res: Response) => Promise<void>;
    updateBookAvailability: (req: Request, res: Response) => Promise<void>;
    getBookStats: (req: Request, res: Response) => Promise<void>;
    bulkImportBooks: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=BookController.d.ts.map