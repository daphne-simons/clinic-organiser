import pool from '../config/connection'
import { readFileSync } from 'fs'
import { join } from 'path'

const __dirname = new URL('.', import.meta.url).pathname

export async function seed(): Promise<void> {
  try {
    // Gets all table names: 
    // Retrieve all table names in the public schema
    const result = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    const tableNames = result.rows.map(row => `"${row.tablename}"`);

    if (tableNames.length === 0) {
      console.log('No tables found to seed.');
      // process.exit(0);
    }

    // Delete all records in clients table and reset automaticly generated colums e.g. ID : 
    const delRecords = `TRUNCATE TABLE ${tableNames.join(', ')} CASCADE;`

    await pool.query(delRecords);

    console.log('Database reset completed successfully!');

    // Seed
    console.log('Starting database seed...');

    const seedSQL = readFileSync(
      join(__dirname, '../seed.sql'),
      'utf8'
    );

    await pool.query(seedSQL);
    console.log('Database seed completed successfully!');

    // process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

await seed();