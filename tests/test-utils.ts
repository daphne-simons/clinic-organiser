import { dropAllTables } from "../server/database/scripts/dropAllTables"
import { migrate } from "../server/database/scripts/migrate"
import { seed } from "../server/database/scripts/seed"

export async function resetTestDatabase() {
  await dropAllTables()
  await migrate()
  await seed()
}

export const reseedTestDatabase = seed

export async function waitForServer(url, timeout = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await fetch(url)
      console.log("Server is up!")
      return
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      await new Promise((res) => setTimeout(res, 500))
    }
  }
  throw new Error("Server did not start in time")
}

export async function retryOperation(operation, retries, delay = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          return await operation();
        } catch (error) {
          if (i === retries - 1) {
            throw error; // Re-throw the error if all retries fail
          }
          await new Promise(res => setTimeout(res, delay)); // Wait before retrying
        }
      }
    }