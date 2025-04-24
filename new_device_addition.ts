import { test, expect } from '@playwright/test';

test.describe('NetBox – Dodavanje uređaja u rack (grafički prikaz)', () => {

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://demo.netbox.dev/');
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dcim/);
  });

  test('Pozitivan scenario: uspešno dodavanje uređaja na slobodan U slot (front view)', async ({ page }) => {
    // 1. Ode na stranicu rack-a ID 39
    await page.goto('https://demo.netbox.dev/dcim/racks/39/');

    // 2. Klik na “Front” tab (ako je default Rear)
    await page.click('button[role="tab"]:has-text("Front")');

    // 3. Klik na slobodan U slot (npr. U42) – cell ima data-u-height ili slično
    await page.click('[data-u-height="42"]');

    // 4. U meniju izaberi “Add device”
    await page.click('text=Add device');

    // 5. Popuni formu koja se pojavi u dijalogu
    await page.fill('input[name="device"]', 'demo-switch');
    await page.click('.select2-results__option:has-text("demo-switch")');
    await page.selectOption('select[name="face"]', { label: 'Front' });
    await page.fill('input[name="position"]', '42');
    // opciono: konfiguriši druge atribute

    // 6. Sačuvaj
    await page.click('button[type="submit"]:has-text("Create")');

    // 7. Proveri da li se novi uređaj pojavio u grafičkom prikazu na U42
    const cell = page.locator('[data-u-height="42"] .device-label');
    await expect(cell).toHaveText(/demo-switch/i);
  });

  test('Negativan scenario: dodavanje na već zauzet slot', async ({ page }) => {
    await page.goto('https://demo.netbox.dev/dcim/racks/39/');
    await page.click('button[role="tab"]:has-text("Front")');

    // Pretpostavimo da je U43 već zauzet
    await page.click('[data-u-height="43"]');
    await page.click('text=Add device');

    // U formi izaberi uređaj ali ostavi position = 43
    await page.fill('input[name="device"]', 'demo-switch');
    await page.click('.select2-results__option:has-text("demo-switch")');
    await page.selectOption('select[name="face"]', { label: 'Front' });
    await page.fill('input[name="position"]', '43');
    await page.click('button[type="submit"]:has-text("Create")');

    // Očekuj grešku o zauzetom prostoru
    const error = page.locator('.alert-danger, .help-block:has-text("occupied")');
    await expect(error).toBeVisible();
  });

  test('Dodavanje sa zadatkom “Rear” face', async ({ page }) => {
    await page.goto('https://demo.netbox.dev/dcim/racks/39/');
    // Prebaci na Rear prikaz
    await page.click('button[role="tab"]:has-text("Rear")');

    // Klik na slobodan slot Rear U45
    await page.click('[data-u-height="45"]');
    await page.click('text=Add device');

    // Popuni formu sa Rear face
    await page.fill('input[name="device"]', 'demo-router');
    await page.click('.select2-results__option:has-text("demo-router")');
    await page.selectOption('select[name="face"]', { label: 'Rear' });
    await page.fill('input[name="position"]', '45');
    await page.click('button[type="submit"]:has-text("Create")');

    // Validacija
    const cell = page.locator('[data-u-height="45"] .device-label');
    await expect(cell).toHaveText(/demo-router/i);
  });

});
