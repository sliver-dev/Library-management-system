import dotenv from 'dotenv';

dotenv.config();

// Use memory database for demonstration
const useMemoryDB = process.env.USE_MEMORY_DB === 'true' || !process.env.DB_HOST;

if (useMemoryDB) {
  console.log('🗄️  Using in-memory database for demonstration');
  const memoryDB = await import('./memory-db');
  module.exports = {
    query: memoryDB.query,
    getClient: memoryDB.getClient,
  };
} else {
  console.log('🗄️  Using PostgreSQL database');
  // PostgreSQL implementation would go here
}

// Re-export for compatibility
export { query, getClient } from (useMemoryDB ? './memory-db' : './postgres-db');