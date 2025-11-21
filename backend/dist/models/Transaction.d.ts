export type TransactionStatus = 'issued' | 'returned' | 'overdue' | 'lost';
export interface BorrowingTransaction {
    id: string;
    user_id: string;
    book_id: string;
    issue_date: Date;
    due_date: Date;
    return_date?: Date;
    actual_return_date?: Date;
    status: TransactionStatus;
    fine_amount: number;
    fine_paid: boolean;
    notes?: string;
    issued_by?: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateTransactionData {
    user_id: string;
    book_id: string;
    due_date: Date;
    notes?: string;
    issued_by?: string;
}
export interface UpdateTransactionData {
    return_date?: Date;
    actual_return_date?: Date;
    status?: TransactionStatus;
    fine_amount?: number;
    fine_paid?: boolean;
    notes?: string;
}
export type ReservationStatus = 'active' | 'fulfilled' | 'expired' | 'cancelled';
export interface Reservation {
    id: string;
    user_id: string;
    book_id: string;
    reservation_date: Date;
    expiry_date: Date;
    status: ReservationStatus;
    priority: number;
    notification_sent: boolean;
    created_at: Date;
}
export interface CreateReservationData {
    user_id: string;
    book_id: string;
    expiry_date: Date;
    priority?: number;
}
export interface UserReadingHistory {
    id: string;
    user_id: string;
    book_id: string;
    started_reading_date?: Date;
    completed_reading_date?: Date;
    rating?: number;
    review?: string;
    pages_read?: number;
    reading_time_minutes?: number;
    created_at: Date;
}
export interface CreateReadingHistoryData {
    user_id: string;
    book_id: string;
    started_reading_date?: Date;
    completed_reading_date?: Date;
    rating?: number;
    review?: string;
    pages_read?: number;
    reading_time_minutes?: number;
}
//# sourceMappingURL=Transaction.d.ts.map