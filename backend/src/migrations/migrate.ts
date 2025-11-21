import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import pool from '../config/database';

const migrate = async () => {
  try {
    console.log('Starting database migration...');

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Get migration files
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get executed migrations
    const executedResult = await pool.query('SELECT filename FROM migrations');
    const executedMigrations = new Set(executedResult.rows.map(row => row.filename));

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedMigrations.has(file)) {
        console.log(`Running migration: ${file}`);

        const filePath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(filePath, 'utf8');

        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await client.query(migrationSQL);
          await client.query(
            'INSERT INTO migrations (filename) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          console.log(`Migration ${file} completed successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`Migration ${file} failed:`, error);
          throw error;
        } finally {
          client.release();
        }
      }
    }

    console.log('All migrations completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  migrate();
}

export default migrate;