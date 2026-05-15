import { test, expect } from '@playwright/test'
import { RadarPage } from './pages/RadarPage'

test.describe('Radar B2B - Flujo de Navegación', () => {
  let radarPage: RadarPage

  test.beforeEach(async ({ page }) => {
    radarPage = new RadarPage(page)
    await radarPage.goto()
    await radarPage.waitForTableLoad()
  })

  test('debe cargar la página con título correcto', async ({ page }) => {
    await expect(page.locator('h1:has-text("Radar B2B")')).toBeVisible()
    await expect(page.locator('text=Detecta empresas')).toBeVisible()
  })

  test('debe mostrar tabla de empresas', async () => {
    const rowCount = await radarPage.getTableRowCount()
    expect(rowCount).toBeGreaterThan(0)
  })

  test('debe mostrar estado vacío cuando no hay resultados', async ({ page }) => {
    // Aquí se podría agregar un filtro que retorne sin resultados
    // Por ahora, solo verificamos la estructura
    const table = radarPage.companiesTable
    await expect(table).toBeVisible()
  })

  test('debe abrir drawer al hacer click en fila', async ({ page }) => {
    const firstName = await radarPage.getFirstCompanyName()
    expect(firstName).toBeTruthy()

    await radarPage.clickFirstCompany()
    await radarPage.waitForDrawerOpen()

    const drawerTitle = await radarPage.getDrawerTitle()
    expect(drawerTitle).toBe(firstName)
  })

  test('debe mostrar información en drawer', async () => {
    await radarPage.clickFirstCompany()
    await radarPage.waitForDrawerOpen()

    // Verificar que el drawer tiene contenido
    const drawerContent = radarPage.companyDrawer
    await expect(drawerContent.locator('[role="tablist"]')).toBeVisible()
  })

  test('debe cerrar drawer con tecla Escape', async ({ page }) => {
    await radarPage.clickFirstCompany()
    await radarPage.waitForDrawerOpen()

    await page.keyboard.press('Escape')
    await expect(radarPage.companyDrawer).not.toBeVisible({ timeout: 5000 })
  })

  test('debe sincronizar URL con drawer', async ({ page }) => {
    await radarPage.clickFirstCompany()
    await radarPage.waitForDrawerOpen()

    const url = page.url()
    expect(url).toContain('company=')
  })

  test('debe abrir drawer desde URL con parámetro', async ({ page }) => {
    // Primero obtenemos una empresa
    const firstName = await radarPage.getFirstCompanyName()
    await radarPage.clickFirstCompany()
    await radarPage.waitForDrawerOpen()

    // Obtenemos el ID de la URL
    const urlParams = new URL(page.url())
    const companyId = urlParams.searchParams.get('company')
    expect(companyId).toBeTruthy()

    // Navegamos nuevamente con el parámetro
    await page.goto(`/?company=${companyId}`)
    await radarPage.waitForDrawerOpen()

    const drawerTitle = await radarPage.getDrawerTitle()
    expect(drawerTitle).toBe(firstName)
  })

  test('debe mostrar ayuda con HelpButton', async ({ page }) => {
    const helpButton = page.locator('button[aria-label*="Ayuda"]').first()
    await expect(helpButton).toBeVisible()

    // Al hacer hover, debería mostrar tooltip
    await helpButton.hover()
    await expect(page.locator('text=Panel de Radar')).toBeVisible()
  })
})
