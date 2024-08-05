import { expect } from '@playwright/test';

export class CheckOut {
  constructor(page) {
    this.page = page;

    this.basketCards = page.locator(`[data-qa="basket-card"]`);
    this.basketItemPrice = page.locator(`[data-qa="basket-item-price"]`);
    this.basketItemRemoveButton = page.locator(`[data-qa="basket-card-remove-item"]`);
    this.TotalPrice = page.locator(`span.font-bold`);
    this.continueToCheckoutButton = page.locator(`[data-qa="continue-to-checkout"]`);
  }

  removeCheapestProduct = async () => {
    await this.basketCards.first().waitFor();
    const itemBeforeRemoval = await this.basketCards.count();
    await this.basketItemPrice.first().waitFor();
    // get all price value using allInnerTexts
    const allPriceTexts = await this.basketItemPrice.allInnerTexts();
    const justNumbers = allPriceTexts.map((e) => {
      // remove dollar sign
      const withoutDollarSign = e.replace('$', '');
      //   convert string into number
      return parseInt(withoutDollarSign);
    });
    const smallestPrice = Math.min(...justNumbers);
    const smallestPriceIndex = justNumbers.indexOf(smallestPrice);
    const spesificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIndex);
    await spesificRemoveButton.waitFor();
    await spesificRemoveButton.click();
    await this.page.waitForTimeout(3000);
    await expect(this.basketCards).toHaveCount(itemBeforeRemoval - 1);
  };

  totalHarga = async () => {
    const allPriceTextsAfterRemoval = await this.basketItemPrice.allInnerTexts();
    const justNumbersAfter = allPriceTextsAfterRemoval.map((e) => {
      const withoutDollarSign = e.replace('$', '');
      return parseInt(withoutDollarSign);
    });

    const sum = justNumbersAfter.reduce((a, b) => a + b, 0);

    const totalPriceText = await this.TotalPrice.textContent();
    // cara 1
    const total = totalPriceText.replace(/[^0-9]/g, '');
    const TotalInNumber = parseInt(total);
    // cara 2
    // const harga = totalPriceText.slice(-1) === '$' ? totalPriceText.slice(0, -1) : totalPrice;
    expect(sum).toEqual(TotalInNumber);
    return sum;
  };

  continueToCheckout = async () => {
    await this.continueToCheckoutButton.waitFor();
    await this.continueToCheckoutButton.click();
    // using regex
    await this.page.waitForURL(/\/login/);
  };
}
