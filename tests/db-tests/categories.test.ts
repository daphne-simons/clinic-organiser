import { beforeAll, beforeEach, describe, expect, it } from "vitest"

import {
  addCategory,
  getAllCategories,
  deleteCategory,
} from "../../server/database/dbFunctions/categories"
import { resetTestDatabase, reseedTestDatabase } from "../test-utils"

beforeAll(async () => {
  await resetTestDatabase()
})
beforeEach(async () => {
  await reseedTestDatabase()
})

describe("getAllCategories", async () => {
  it("returns all entries in the categories table", async () => {
    const expected = [
      { _id: 1, color: "blue", title: "ACC" },
      { _id: 2, color: "green", title: "Private" },
    ]

    const result = await getAllCategories()
    expect(result).toEqual(expected)
  })
})

describe("addCategory", async () => {
  it("creates an entry in the categories table when provided with a title and color", async () => {
    const expected = [
      { _id: 1, color: "blue", title: "ACC" },
      { _id: 2, color: "green", title: "Private" },
      { _id: 3, color: "red", title: "Free Trial" },
    ]
    await addCategory("Free Trial", "red")
    const result = await getAllCategories()
    expect(result).toEqual(expected)
  })
})

describe("deleteCategory", async () => {
  it("deletes an entry in the categories table when provided with an id", async () => {
    const expected = [{ _id: 1, color: "blue", title: "ACC" }]
    await deleteCategory(2)
    const result = await getAllCategories()
    expect(result).toEqual(expected)
  })
  it("fails if id is not a number", async () => {
    expect.assertions(1) // set the number of expected assertions - in this case the test can only pass if the catch block is triggered
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await deleteCategory("bad id" as any)
    } catch (error) {
          expect(error).toBeTruthy()
    }
  })
})
