import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Set timezone for all connections in this pool
  options: '-c timezone=UTC'
};

const pool = new Pool(config);

pool.query('SELECT current_setting(\'timezone\') AS timezone', (error, result) => {
  if (error) {
    console.error('Error fetching timezone:', error)
    return
  }
  const timezone = result.rows[0].timezone
  console.log('Database connection timezone:', timezone)
});

export default pool;
