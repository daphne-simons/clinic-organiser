import { dropAllTables } from "../server/database/scripts/dropAllTables"
import { migrate } from "../server/database/scripts/migrate"
import { seed } from "../server/database/scripts/seed"

export async function resetTestDatabase () {
  await dropAllTables()
  await migrate()
  await seed()
}

export const reseedTestDatabase = seed