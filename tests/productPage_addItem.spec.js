import { test, expect } from '@playwright/test';

test.skip('Click item to add to chart', async ({ page }) => {
  await page.goto('/');

  //   await page.locator(`//div[@data-qa="product-card"][1]//div[@class="mx-6"]`).click();
  const astroDabbAddButton = page.locator(`[data-qa="product-button"]`).first();
  const chartCount = page.locator(`[data-qa="header-basket-count"]`);
  await astroDabbAddButton.waitFor();

  await expect(chartCount).toHaveText('0');
  await expect(astroDabbAddButton).toHaveText('Add to Basket');
  await astroDabbAddButton.click();
  await expect(astroDabbAddButton).toHaveText('Remove from Basket');
  await expect(chartCount).toHaveText('1');

  // cara 1
  // const checkoutLink = page.locator(`//p[@data-qa="desktop-nav-link"]`).getByText('Checkout');
  // cara 2
  const checkoutLink = page.getByRole('link', { name: 'Checkout' });

  await checkoutLink.waitFor();
  await checkoutLink.click();

  await page.waitForURL('/basket');
});

// const mountainLandButton = page
//   .locator('div')
//   .filter({ hasText: /^599\$Add to Basket$/ })
//   .getByRole('button');
