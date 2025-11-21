import dotenv from 'dotenv';

dotenv.config();

// Check if we should use memory database
const useMemoryDB = process.env.USE_MEMORY_DB === 'true';

if (useMemoryDB) {
  console.log('🗄️  Using in-memory database for demonstration');
  // Dynamic import for memory database
  const { query, getClient } = require('./memory-db');
  module.exports = { query, getClient };
} else {
  console.log('🗄️  PostgreSQL database not configured, falling back to memory database');
  const { query, getClient } = require('./memory-db');
  module.exports = { query, getClient };
}

// For compatibility with existing imports
export const query = async (text: string, params?: any[]) => {
  const db = require('./database');
  return await db.query(text, params);
};

export const getClient = () => {
  const db = require('./database');
  return db.getClient();
};