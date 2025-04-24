import { test, expect } from '@playwright/test';

test.describe('NetBox – Kreiranje Device Type', () => {

  test.beforeEach(async ({ page }) => {
    // Login helper (može se izdvojiti u fixture)
    await page.goto('https://demo.netbox.dev/');
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dcim/);
  });

  test('Pozitivan scenario: uspešno kreiranje novog Device Type-a', async ({ page }) => {
    await page.goto('https://demo.netbox.dev/dcim/device-types/add/');

    // 1. Popuni obavezna polja
    await page.selectOption('select[name="manufacturer"]', { label: 'Manufacturer X' });
    await page.fill('input[name="model"]', 'Model Y');
    await page.fill('input[name="slug"]', 'model-y');
    await page.selectOption('select[name="default_platform"]', { label: 'Platform Z' });

    // 2. Visina u U (validna vrednost npr. 4)
    await page.fill('input[name="u_height"]', '4');

    // 3. Opciono: opis i tagovi
    await page.fill('textarea[name="description"]', 'Automatski testirani Device Type');
    await page.fill('input[aria-label="Tags"]', 'test,playwright');
    await page.keyboard.press('Enter'); // potvrdi tag

    // 4. Submit forme
    await page.click('button[type="submit"]');

    // 5. Provera: nakon uspeha URL vraća na listu i pojavljuje se novi red
    await expect(page).toHaveURL('https://demo.netbox.dev/dcim/device-types/');
    const row = page.locator('table tr', { hasText: 'Model Y' });
    await expect(row).toBeVisible();
    await expect(row).toContainText('4 U');
  });

  test('Negativan scenario: bez obaveznog polja “Model”', async ({ page }) => {
    await page.goto('https://demo.netbox.dev/dcim/device-types/add/');

    // Popuni sve osim “model”
    await page.selectOption('select[name="manufacturer"]', { label: 'Manufacturer X' });
    await page.fill('input[name="slug"]', 'no-model');
    await page.selectOption('select[name="default_platform"]', { label: 'Platform Z' });
    await page.fill('input[name="u_height"]', '2');

    // Submit
    await page.click('button[type="submit"]');

    // Provera da je validation error vidljiv pored “Model” polja
    const modelError = page.locator('input[name="model"] + .help-block, input[name="model"][aria-invalid="true"]');
    await expect(modelError).toBeVisible();
  });

  test('Negativan scenario: nevalidna visina U (npr. 0 ili -1)', async ({ page }) => {
    await page.goto('https://demo.netbox.dev/dcim/device-types/add/');

    await page.selectOption('select[name="manufacturer"]', { label: 'Manufacturer X' });
    await page.fill('input[name="model"]', 'Bad Height');
    await page.fill('input[name="slug"]', 'bad-height');
    await page.selectOption('select[name="default_platform"]', { label: 'Platform Z' });
    // Unesi nevalidnu visinu
    await page.fill('input[name="u_height"]', '0');
    await page.click('button[type="submit"]');

    const heightError = page.locator('input[name="u_height"] + .help-block');
    await expect(heightError).toBeVisible();
    await expect(heightError).toContainText(/must be at least 1/i);
  });

});
