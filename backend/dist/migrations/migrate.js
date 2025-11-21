"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../config/database"));
const migrate = async () => {
    try {
        console.log('Starting database migration...');
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);
        const migrationsDir = path_1.default.join(__dirname);
        const migrationFiles = fs_1.default.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
        const executedResult = await database_1.default.query('SELECT filename FROM migrations');
        const executedMigrations = new Set(executedResult.rows.map(row => row.filename));
        for (const file of migrationFiles) {
            if (!executedMigrations.has(file)) {
                console.log(`Running migration: ${file}`);
                const filePath = path_1.default.join(migrationsDir, file);
                const migrationSQL = fs_1.default.readFileSync(filePath, 'utf8');
                const client = await database_1.default.connect();
                try {
                    await client.query('BEGIN');
                    await client.query(migrationSQL);
                    await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
                    await client.query('COMMIT');
                    console.log(`Migration ${file} completed successfully`);
                }
                catch (error) {
                    await client.query('ROLLBACK');
                    console.error(`Migration ${file} failed:`, error);
                    throw error;
                }
                finally {
                    client.release();
                }
            }
        }
        console.log('All migrations completed successfully!');
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
    finally {
        await database_1.default.end();
    }
};
if (require.main === module) {
    migrate();
}
exports.default = migrate;
//# sourceMappingURL=migrate.js.map