import pool from '../config/connection';
import { readFileSync } from 'fs';
import { join } from 'path';
// import path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname

async function migrate(): Promise<void> {
  try {
    console.log('Starting database migration...');

    const schemaSQL = readFileSync(
      join(__dirname, '../schema.sql'),
      'utf8'
    );

    await pool.query(schemaSQL);
    console.log('Database migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();