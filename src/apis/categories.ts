import request from "superagent"
import type { ICategory, ICategoryDraft } from "../models"

export async function getCategories() {
  const data = await request.get("http://localhost:3000/api/v1/categories/")
  return data.body as ICategory[]
}

export async function addCategory(category: ICategoryDraft) {
  await request.post("http://localhost:3000/api/v1/categories/").send(category)
}

export async function deleteCategory(id: number) {
  await request.delete(`http://localhost:3000/api/v1/categories/${id}`)
}
