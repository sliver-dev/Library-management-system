import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => api.post('/auth/register', userData),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
  }) => api.put('/auth/profile', userData),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    }),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: () => api.post('/auth/logout'),
};

// Books API
export const booksAPI = {
  getBooks: (params?: {
    page?: number;
    limit?: number;
    title?: string;
    author?: string;
    genre?: string;
    available?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) => api.get('/books', { params }),

  getBook: (bookId: string) => api.get(`/books/${bookId}`),

  createBook: (bookData: {
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
  }) => api.post('/books', bookData),

  updateBook: (bookId: string, bookData: Partial<{
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
  }>) => api.put(`/books/${bookId}`, bookData),

  deleteBook: (bookId: string) => api.delete(`/books/${bookId}`),

  updateBookAvailability: (bookId: string, availableCopies: number) =>
    api.patch(`/books/${bookId}/availability`, { availableCopies }),

  getBookStats: () => api.get('/books/stats'),

  bulkImportBooks: (books: any[]) =>
    api.post('/books/bulk-import', { books }),

  // Borrow/Return operations (will be expanded later)
  borrowBook: (bookId: string, dueDate: string, notes?: string) =>
    api.post(`/transactions/borrow`, { book_id: bookId, due_date: dueDate, notes }),

  returnBook: (transactionId: string, notes?: string) =>
    api.post(`/transactions/return`, { transaction_id: transactionId, notes }),
};

// Users API (admin only)
export const usersAPI = {
  getUsers: (params?: {
    page?: number;
    limit?: number;
    role?: 'admin' | 'user';
  }) => api.get('/users', { params }),

  getUser: (userId: string) => api.get(`/users/${userId}`),

  updateUser: (userId: string, userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    role?: 'admin' | 'user';
    is_banned?: boolean;
  }) => api.put(`/users/${userId}`, userData),

  deleteUser: (userId: string) => api.delete(`/users/${userId}`),

  banUser: (userId: string) => api.post(`/users/${userId}/ban`),

  unbanUser: (userId: string) => api.post(`/users/${userId}/unban`),

  getUserStats: () => api.get('/users/stats'),

  searchUsers: (query: string, page?: number, limit?: number) =>
    api.get('/users/search', { params: { query, page, limit } }),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),

  getPopularBooks: () => api.get('/analytics/books/popular'),

  getUserActivity: () => api.get('/analytics/users/activity'),

  getInventoryStatus: () => api.get('/analytics/inventory/status'),

  generateReport: (reportData: {
    type: string;
    dateRange: {
      start: string;
      end: string;
    };
    filters?: any;
  }) => api.post('/reports/generate', reportData),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: (userId: string) => api.get(`/notifications/${userId}`),

  markAsRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),

  sendNotification: (notificationData: {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
  }) => api.post('/notifications/send', notificationData),
};

export default api;