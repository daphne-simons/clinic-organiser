import pool from '../config/connection';

export async function dropAllTables(): Promise<void> {
  try {
    console.log('Dropping all tables...');

    // Retrieve all table names in the public schema
    const result = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    const tableNames = result.rows.map(row => `"${row.tablename}"`);

    if (tableNames.length === 0) {
      console.log('No tables found to drop.');
    } else {

    // Generate DROP TABLE statement
    const dropQuery = `DROP TABLE IF EXISTS ${tableNames.join(', ')} CASCADE;`;

    await pool.query(dropQuery);
    console.log('All tables dropped successfully.');
    }
  } catch (error) {
    console.error('Error dropping tables:', error);
    process.exit(1);
  }
}

// Run the function
await dropAllTables();
