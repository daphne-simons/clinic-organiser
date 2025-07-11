export function getAllClientNames() {
  // TODO: GET from db
  return [
    {
      id: 1,
      label: "Jared Pinfold",
    },
    { id: 2, label: "Daph Simons" },
    { id: 3, label: "Destroy Orbison" },
  ];
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
