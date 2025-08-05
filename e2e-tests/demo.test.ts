import puppeteer from "puppeteer"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

let browser
let page

beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
})

afterAll(async () => {
  await browser.close()
})

describe("Calendar Button", async () => {
  it("exists in Nav", async () => {

    await page.goto("http://localhost:5173/")

    await page.setViewport({ width: 1080, height: 1024 })

    const calendarButtonSelector = "button"
    const calendarButtonRes = await page.waitForSelector(calendarButtonSelector)
    const calendarTitle = await calendarButtonRes?.evaluate((el) => el.textContent)
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
    const calendarTitle = await calendarTitleRes?.evaluate((el) => el.textContent)
    expect(calendarTitle).toBe("Appointments")
  })
})
