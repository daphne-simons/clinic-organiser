import request from 'superagent'
import type { IClient, IClientForDropdown } from '../models';

export async function getAllClientNames() {
  const data = await request.get('http://localhost:3000/api/v1/clients/')
  return data.body.map((client: IClient) => {
    return {
      id: client.id,
      label: `${client.first_name} ${client.last_name}`,
    }
  }) as IClientForDropdown[]
}
export async function getClientById(id: number) {
  const data = await request.get(`http://localhost:3000/api/v1/clients/${id}`)
  return data.body as IClient
}

export function addClient(client: unknown) {
  // TODO: POST to db
  console.log(client);
}

export function updateClient(client: unknown) {
  // TODO: PUT to db
  console.log(client);
}

export function deleteClient(client) {
  // TODO: DELETE to db
  console.log(client);
}
