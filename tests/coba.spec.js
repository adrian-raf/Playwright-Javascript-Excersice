import { test, expect } from '@playwright/test';

test.skip('Test komponen pada youtube', async ({ page }) => {
  await page.goto('https://www.youtube.com/');

  const searchInput = page.getByPlaceholder('Search');

  await searchInput.pressSequentially('Learn sele', { delay: 1000 });
  //   await searchInput.fill('Learn sele');

  const option = page
    .getByRole('listbox')
    .locator('.sbqs_c')
    .getByText('learn selenium automation', { exact: true });
  await option.click();
  await page.waitForTimeout(3000);
});
