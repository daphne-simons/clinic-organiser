import pool from "../config/connection.ts"
import { IClientName, IClient, CustomFields } from "../../../src/models.ts"

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

export async function addClientFromAppointment(
  firstName: string,
  lastName: string
): Promise<void> {
  await pool.query(
    "INSERT INTO clients (first_name, last_name) VALUES ($1, $2)",
    [firstName, lastName]
  )
}

export async function addClient(
  firstName: string,
  lastName: string,
  dob: string,
  mobile: string,
  email: string,
  customFields: CustomFields
): Promise<void> {
  await pool.query(
    "INSERT INTO clients (first_name, last_name, dob, mobile, email, custom_fields) VALUES ($1, $2, $3, $4, $5, $6)",
    [firstName, lastName, dob, mobile, email, customFields]
  )
}

export async function updateClient(
  clientId: number,
  firstName: string,
  lastName: string,
  dob: string,
  mobile: string,
  email: string,
  customFields: CustomFields
): Promise<void> {
  await pool.query(
    "UPDATE clients SET first_name = $1, last_name = $2, dob = $3, mobile = $4, email = $5, custom_fields = $6 WHERE id = $7",
    [firstName, lastName, dob, mobile, email, customFields, clientId]
  )
}
