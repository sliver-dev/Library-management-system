// In-memory database for demonstration
export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  is_banned: boolean;
  registration_date: Date;
  last_login?: Date;
  profile_image_url?: string;
  created_at: Date;
  updated_at: Date;
}

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
  acquisition_date?: Date;
  cost?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// In-memory storage with demo accounts
let users: User[] = [
  {
    id: '1',
    email: 'admin@library.com',
    password_hash: 'Admin123_hash', // Simplified for demo
    first_name: 'System',
    last_name: 'Administrator',
    role: 'admin',
    phone: '123-456-7890',
    address: '123 Library St',
    is_banned: false,
    registration_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    email: 'user@library.com',
    password_hash: 'User123_hash', // Simplified for demo
    first_name: 'Demo',
    last_name: 'User',
    role: 'user',
    is_banned: false,
    registration_date: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  }
];

let books: Book[] = [
  {
    id: '1',
    isbn: '978-0-06-112008-4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Fiction',
    publisher: 'J.B. Lippincott & Co.',
    publication_year: 1960,
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    total_copies: 5,
    available_copies: 3,
    location: 'Aisle 1, Shelf A',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '2',
    isbn: '978-0-452-28423-4',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian Fiction',
    publisher: 'Secker & Warburg',
    publication_year: 1949,
    description: 'A dystopian social science fiction novel and cautionary tale.',
    total_copies: 3,
    available_copies: 2,
    location: 'Aisle 2, Shelf B',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: '3',
    isbn: '978-0-7432-7356-5',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Fiction',
    publisher: 'Charles Scribner\'s Sons',
    publication_year: 1925,
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.',
    total_copies: 4,
    available_copies: 4,
    location: 'Aisle 1, Shelf C',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  }
];

// Query function that mimics PostgreSQL queries
export const query = async (text: string, params?: any[]) => {
  console.log('Mock query:', text, params);

  // Simple query parser for demonstration
  if (text.includes('SELECT') && text.includes('users')) {
    if (text.includes('WHERE email')) {
      const email = params?.[0];
      const user = users.find(u => u.email === email);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }

    if (text.includes('WHERE id')) {
      const id = params?.[0];
      const user = users.find(u => u.id === id);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }

    return {
      rows: users,
      rowCount: users.length
    };
  }

  if (text.includes('SELECT') && text.includes('books')) {
    if (text.includes('WHERE id')) {
      const id = params?.[0];
      const book = books.find(b => b.id === id);
      return {
        rows: book ? [book] : [],
        rowCount: book ? 1 : 0
      };
    }

    return {
      rows: books,
      rowCount: books.length
    };
  }

  if (text.includes('INSERT') && text.includes('users')) {
    const newUser = {
      id: Date.now().toString(),
      email: params?.[0],
      password_hash: params?.[1],
      first_name: params?.[2],
      last_name: params?.[3],
      role: params?.[4] || 'user',
      phone: params?.[5],
      address: params?.[6],
      is_banned: false,
      registration_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Check if email already exists
    if (users.find(u => u.email === newUser.email)) {
      throw new Error('User with this email already exists');
    }

    users.push(newUser);

    const { password_hash, ...userWithoutPassword } = newUser;
    return {
      rows: [userWithoutPassword],
      rowCount: 1
    };
  }

  if (text.includes('INSERT') && text.includes('books')) {
    const newBook = {
      id: Date.now().toString(),
      isbn: params?.[0],
      title: params?.[1],
      author: params?.[2],
      genre: params?.[3],
      publisher: params?.[4],
      edition: params?.[5],
      publication_year: params?.[6],
      description: params?.[7],
      cover_image_url: params?.[8],
      total_copies: params?.[9] || 1,
      available_copies: params?.[9] || 1,
      barcode: params?.[10],
      rfid_tag: params?.[11],
      location: params?.[12],
      acquisition_date: params?.[13],
      cost: params?.[14],
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    books.push(newBook);
    return {
      rows: [newBook],
      rowCount: 1
    };
  }

  if (text.includes('UPDATE')) {
    // Basic UPDATE implementation
    return { rows: [], rowCount: 1 };
  }

  // Default response
  return {
    rows: [],
    rowCount: 0
  };
};

export const getClient = () => {
  return {
    query: query,
    release: () => {},
  };
};

// Mock transaction methods
export const beginTransaction = () => {
  return Promise.resolve();
};

export const commitTransaction = () => {
  return Promise.resolve();
};

export const rollbackTransaction = () => {
  return Promise.resolve();
};