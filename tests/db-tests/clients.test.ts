import { beforeAll, beforeEach, describe, expect, it } from "vitest"

import {
  getAllClientsNames,
  getClientById,
} from "../../server/database/dbFunctions/clients"

import { resetTestDatabase, reseedTestDatabase } from "../test-utils"

beforeAll(async () => {
  await resetTestDatabase()
})
beforeEach(async () => {
  await reseedTestDatabase()
})

describe("getAllClientsNames", async () => {
  it("returns the names of all entries in the clients table", async () => {
    const expected = [
      { id: 1, first_name: "Ron", last_name: "Zertnert" },
      { id: 2, first_name: "Destroy", last_name: "Orbison" },
      { id: 3, first_name: "Gertrude", last_name: "Diamond" },
      { id: 4, first_name: "Mary", last_name: "Jane" },
    ]
    const result = await getAllClientsNames()
    expect(result).toEqual(expected)
  })
})

describe("getClientById", async () => {
  it("returns the names of all entries in the clients table", async () => {
    const expected = {
      id: 1,
      first_name: "Ron",
      last_name: "Zertnert",
      dob: new Date("1989-12-31T11:00:00.000Z"),
      mobile: "123-456-7890",
      email: "1M9jg@example.com",
      custom_fields: {},
    } // note: created_at and updated_at are not included because the values change whenever the seeds are run

    const result = await getClientById('1')
    expect(result).toMatchObject(expected)
  })
})
