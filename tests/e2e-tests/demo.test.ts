import puppeteer from "puppeteer"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import {
  resetTestDatabase,
  reseedTestDatabase,
  retryOperation,
  waitForServer,
} from "../test-utils"
import { spawn } from "child_process"

let browser
let page

let serverProcess

beforeAll(async () => {
  await resetTestDatabase()

  // Start your dev server process (adjust command as needed)
  serverProcess = spawn("npm", ["run", "dev"], { stdio: "inherit" })

  // Wait for server to be ready
  await waitForServer("http://localhost:5173/", 30000)
  await resetTestDatabase()
  browser = await puppeteer.launch()
  page = await browser.newPage()
})

beforeEach(async () => {
  await reseedTestDatabase()
})

afterAll(async () => {
  await browser.close()
  if (serverProcess) {
    serverProcess.kill()
  }
})

describe("Calendar Button", async () => {
  it("exists in Nav", async () => {
    const url = "http://localhost:5173/"
    await retryOperation(() => page.goto(url), 10)
    await page.setViewport({ width: 1080, height: 1024 })

    const calendarButtonSelector = "button"
    const calendarButtonRes = await page.waitForSelector(calendarButtonSelector)
    const calendarTitle = await calendarButtonRes?.evaluate(
      (el) => el.textContent
    )
    expect(calendarTitle).toBe("Calendar")
  })

  it("navigates to Calendar Tab", async () => {
    await page.goto("http://localhost:5173/")

    await page.setViewport({ width: 1080, height: 1024 })

    const headerSelector = "H1"
    const headerRes = await page.waitForSelector(headerSelector)
    const fullTitle = await headerRes?.evaluate((el) => el.textContent)
    expect(fullTitle).toBe("Acupuncture Clinic Management")

    const calendarButtonSelector = "button"
    const calendarButtonRes = await page.waitForSelector(calendarButtonSelector)
    await calendarButtonRes?.click()

    const calendarTitleSelector = ".MuiCardHeader-root"
    const calendarTitleRes = await page.waitForSelector(calendarTitleSelector)
    const calendarTitle = await calendarTitleRes?.evaluate(
      (el) => el.textContent
    )
    expect(calendarTitle).toBe("Appointments")
  })
}, 50000)
