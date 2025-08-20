import request from "superagent"
import type { ICategory, ICategoryDraft } from "../models"

export async function getCategories(token: string) {
  const data = await request
    .get("/api/v1/categories/")
    .set("Authorization", `Bearer ${token}`)
  return data.body as ICategory[]
}

export async function addCategory(category: ICategoryDraft, token: string) {
  await request
    .post("/api/v1/categories/")
    .send(category)
    .set("Authorization", `Bearer ${token}`)
}

export async function deleteCategory(id: number, token: string) {
  await request
    .delete(`/api/v1/categories/${id}`)
    .set("Authorization", `Bearer ${token}`)
}
