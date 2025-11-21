import { Pool } from 'pg';
declare const pool: Pool;
export default pool;
export declare const query: (text: string, params?: any[]) => Promise<import("pg").QueryResult<any>>;
export declare const getClient: () => Promise<import("pg").PoolClient>;
//# sourceMappingURL=database.d.ts.map