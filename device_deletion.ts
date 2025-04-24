import { test, expect } from '@playwright/test';

test.describe('NetBox – Brisanje uređaja i pripadajućeg tipa uređaja', () => {

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('https://demo.netbox.dev/');
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dcim/);
  });

  test('Pozitivan scenario: obriši pojedinačni device, pa obriši njegov Device Type', async ({ page }) => {
    const deviceName = 'demo-switch';
    const deviceTypeSlug = 'model-y'; // slug ili jedinstveni identifikator tipa uređaja

    // 1. Otiđi na stranicu detalja uređaja
    await page.goto(`https://demo.netbox.dev/dcim/devices/${deviceName}/`);
    // Napomena: URL ili selektor može biti ID umesto name; prilagodi po potrebi

    // 2. Klik na “Delete”
    await page.click('button:has-text("Delete")');
    // 3. Potvrdi dijalog
    await page.click('button:has-text("Confirm")');

    // 4. Provera: vraćeni smo na listu Devices i ime više ne postoji
    await expect(page).toHaveURL('https://demo.netbox.dev/dcim/devices/');
    const deleted = page.locator('table tr', { hasText: deviceName });
    await expect(deleted).toHaveCount(0);

    // 5. Sada brišemo Device Type
    await page.goto('https://demo.netbox.dev/dcim/device-types/');
    // 6. Pronađi liniju s našim slugom/imenom
    const row = page.locator('table tr', { hasText: deviceTypeSlug });
    await expect(row).toBeVisible();

    // 7. Klik na “Delete” dugme u toj liniji
    await row.locator('a:has-text("Delete")').click();

    // 8. Potvrdi brisanje
    await page.click('button:has-text("Confirm")');

    // 9. Provera: vraćeni na listu device-types i slug više ne postoji
    await expect(page).toHaveURL('https://demo.netbox.dev/dcim/device-types/');
    const deletedType = page.locator('table tr', { hasText: deviceTypeSlug });
    await expect(deletedType).toHaveCount(0);
  });

  test('Negativan scenario: pokušaj brisanja Device Type dok postoje pripadajući devices', async ({ page }) => {
    const deviceTypeSlug = 'platform-z-type';

    // Pretpostavimo da postoji bar jedan device tog tipa
    await page.goto('https://demo.netbox.dev/dcim/device-types/');
    const row = page.locator('table tr', { hasText: deviceTypeSlug });
    await expect(row).toBeVisible();

    // Klik na Delete
    await row.locator('a:has-text("Delete")').click();

    // Potvrdi
    await page.click('button:has-text("Confirm")');

    // Očekujemo grešku ili poruku da tip ne može da se obriše dok postoje uređaji
    const error = page.locator('.alert-danger, .help-block:has-text("cannot delete")');
    await expect(error).toBeVisible();
  });

});
