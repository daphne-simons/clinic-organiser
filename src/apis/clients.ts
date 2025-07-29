import request from 'superagent'
import type { IClient, IClientForDropdown } from '../models';

export async function getAllClientNames() {
  // TODO: GET from db

  const data = await request.get('http://localhost:3000/api/v1/clients/')

  return data.body.map((client: IClient) => {
    return {
      id: client.id,
      label: `${client.first_name} ${client.last_name}`,
    }
  }) as IClientForDropdown[]

  //   [
  //     {
  //       id: 1,
  //       label: "Jared Pinfold",
  //     },
  //     { id: 2, label: "Daph Simons" },
  //     { id: 3, label: "Destroy Orbison" },
  //   ];
}
export function getClientById(id: number) {
  // TODO: GET from db
  console.log(id);
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
