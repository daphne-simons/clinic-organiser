import pool from "../config/connection.ts"
import { ICategory } from "../../../src/models.ts"

export async function getAllCategories(): Promise<ICategory[]> {
  const result = await pool.query(
    "SELECT id AS _id, title, color FROM categories"
  )
  return result.rows
}

export async function addCategory(title: string, color: string): Promise<void> {
  await pool.query("INSERT INTO categories (title, color) VALUES ($1, $2)", [
    title,
    color,
  ])
}

export async function deleteCategory(id: number): Promise<void> {
  await pool.query("DELETE FROM categories WHERE id = ($1)", [id])
}
