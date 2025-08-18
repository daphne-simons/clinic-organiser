import pool from "../config/connection.ts"
import { IClientName, IClient } from "../../../src/models.ts"

export async function getAllClientsNames(): Promise<IClientName[]> {
  const result = await pool.query(
    "SELECT id, first_name, last_name FROM clients"
  )
  return result.rows
}

export async function getClientById(id: string): Promise<IClient> {
  const result = await pool.query("SELECT * FROM clients WHERE id = $1", [id])
  return result.rows[0]
}
