import { Page, Locator } from '@playwright/test'

export class RadarPage {
  readonly page: Page
  readonly pageTitle: Locator
  readonly filterPanel: Locator
  readonly companiesTable: Locator
  readonly tableRows: Locator
  readonly emptyState: Locator
  readonly companyDrawer: Locator

  constructor(page: Page) {
    this.page = page
    this.pageTitle = page.locator('h1:has-text("Radar B2B")')
    this.filterPanel = page.locator('aside')
    this.companiesTable = page.locator('table')
    this.tableRows = page.locator('tbody tr')
    this.emptyState = page.locator('text=No hay empresas')
    this.companyDrawer = page.locator('[role="dialog"]')
  }

  async goto() {
    await this.page.goto('/')
  }

  async waitForTableLoad() {
    await this.companiesTable.waitFor({ state: 'visible' })
  }

  async getFirstCompanyName(): Promise<string | null> {
    const firstRow = this.tableRows.first()
    return firstRow.locator('td:first-child').textContent()
  }

  async clickFirstCompany() {
    const firstRow = this.tableRows.first()
    await firstRow.click()
  }

  async waitForDrawerOpen() {
    await this.companyDrawer.waitFor({ state: 'visible' })
  }

  async closeDrawer() {
    const closeButton = this.page.locator('[role="dialog"] button:has-text("Close")')
    if (await closeButton.isVisible()) {
      await closeButton.click()
    } else {
      await this.page.keyboard.press('Escape')
    }
  }

  async getDrawerTitle(): Promise<string | null> {
    return this.companyDrawer.locator('[role="heading"]').first().textContent()
  }

  async filterByIndustry(industry: string) {
    const industryFilter = this.filterPanel.locator(`text=${industry}`)
    await industryFilter.click()
  }

  async filterByCity(city: string) {
    const cityInput = this.filterPanel.locator('input[placeholder*="Ciudad"]')
    await cityInput.fill(city)
    await cityInput.press('Enter')
  }

  async getTableRowCount(): Promise<number> {
    return this.tableRows.count()
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return this.emptyState.isVisible()
  }
}
