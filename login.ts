import { test, expect } from '@playwright/test';

test.describe('NetBox login functionality', () => {

  // Pozitivan scenario: ispravan username + password
  test('should log in with valid credentials', async ({ page }) => {
    // 1. Otvori home/login stranicu
    await page.goto('https://demo.netbox.dev/');

    // 2. Upisi korisnicke podatke
    await page.fill('input[name="username"]', 'demo');       // prilagodi username
    await page.fill('input[name="password"]', 'demo');       // prilagodi lozinku

    // 3. Klikni Sign in
    await page.click('button[type="submit"]');

    // 4. Cekaj da URL promeni na dashboard ili da se pojavi neki log-out element
    await expect(page).toHaveURL(/.*dcim/);
    // ili
    await expect(page.locator('text=Sign out')).toBeVisible();
  });

  // Negativan scenario: nepostojeći nalog ili pogrešne kredencijale
  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('https://demo.netbox.dev/');

    await page.fill('input[name="username"]', 'wrong');
    await page.fill('input[name="password"]', 'credentials');
    await page.click('button[type="submit"]');

    // Provera da li je prikazana odgovarajuća greska
    const errorBanner = page.locator('.alert-danger, .alert-error');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(/invalid|error/i);
  });

  // Scenario: prvi put – registracija nije podržana, pa se vrši ponovni login ili prikaz poruke
  // (uvek prilagodite prema stvarnoj aplikaciji)
});

