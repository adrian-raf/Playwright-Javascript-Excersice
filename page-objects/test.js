import { expect } from '@playwright/test';

export class CheckOut {
  constructor(page) {
    this.page = page;

    this.basketCards = page.locator(`[data-qa="basket-card"]`);
    this.basketItemPrice = page.locator(`[data-qa="basket-item-price"]`);
    this.basketItemRemoveButton = page.locator(`[data-qa="basket-card-remove-item"]`);
    this.TotalPrice = page.locator(`span.font-bold`);
  }

  removeCheapestProduct = async () => {
    await this.basketCards.first().waitFor();
    const itemBeforeRemoval = await this.basketCards.count();
    await this.basketItemPrice.first().waitFor();
    // get all price value using allInnerTexts
    const allPriceTexts = await this.basketItemPrice.allInnerTexts();
    // console.log(allPriceTexts);
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
    await this.page.waitForTimeout(3000);

    let justNumbersAfter = allPriceTexts.map((e) => {
      // remove dollar sign
      const withoutDollarSign = e.replace('$', '');
      //   convert string into number
      return parseInt(withoutDollarSign);
    });
    console.log(justNumbersAfter);

    const sum = justNumbersAfter.reduce((a, b) => {
      return a + b;
    });
    console.log(sum);

    const totalPriceText = await this.TotalPrice.textContent();
    // cara 1
    const total = totalPriceText.replace(/[^0-9]/g, '');
    const TotalInNumber = parseInt(total);
    console.log(TotalInNumber);
    // cara 2
    // const harga = totalPriceText.slice(-1) === '$' ? totalPriceText.slice(0, -1) : totalPrice;

    // await expect(sum).toEqual(TotalInNumber);
  };
}
