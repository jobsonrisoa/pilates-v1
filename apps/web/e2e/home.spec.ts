import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the home page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Pilates System/i);
    await expect(page.getByRole('heading', { name: /pilates system/i })).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /login/i });
    await expect(loginLink).toBeVisible();
  });
});

