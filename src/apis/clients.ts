import request from "superagent"
import type { IClient, IClientForDropdown } from "../models"

export async function getAllClientNames(token: string) {
  const data = await request
    .get("/api/v1/clients/")
    .set("Authorization", `Bearer ${token}`)
  return data.body.map((client: IClient) => {
    return {
      id: client.id,
      label: `${client.first_name} ${client.last_name}`,
    }
  }) as IClientForDropdown[]
}
export async function getClientById(id: number, token: string) {
  const data = await request
    .get(`/api/v1/clients/${id}`)
    .set("Authorization", `Bearer ${token}`)
  return data.body as IClient
}

export function addClient(client: unknown, token: string) {
  // TODO: POST to db
  console.log(client, token)
}

export function updateClient(client: unknown, token: string) {
  // TODO: PUT to db
  console.log(client, token)
}

export function deleteClient(client: unknown, token: string) {
  // TODO: DELETE to db
  console.log(client, token)
}
