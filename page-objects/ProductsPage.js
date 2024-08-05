import { expect } from '@playwright/test';
import { Navigation } from './Navigation';
import { isDesktopViewport } from '../utils/isDesktopViewport';

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.addButtons = page.locator(`[data-qa="product-button"]`);
    this.sortDropdown = page.locator(`[data-qa="sort-dropdown"]`);
    this.productTitle = page.locator(`[data-qa="product-title"]`);
  }
  visit = async () => {
    await this.page.goto('/');
  };

  addProductToBasket = async (index) => {
    const spesificAddButton = this.addButtons.nth(index);
    await spesificAddButton.waitFor();
    await expect(spesificAddButton).toHaveText('Add to Basket');
    const navigation = new Navigation(this.page);

    let basketBeforeAdding;
    // only desktop viewport
    if (isDesktopViewport(this.page)) {
      basketBeforeAdding = await navigation.getBasketCount();
    }
    await spesificAddButton.click();
    await expect(spesificAddButton).toHaveText('Remove from Basket');
    // only desktop viewport
    if (isDesktopViewport(this.page)) {
      const basketAfterAdding = await navigation.getBasketCount();
      expect(basketAfterAdding).toBeGreaterThan(basketBeforeAdding);
    }
  };

  shortByCheapest = async () => {
    this.sortDropdown.waitFor();
    const productTitlesBeforeSorting = await this.productTitle.allInnerTexts();
    await this.sortDropdown.selectOption('price-asc');
    const productTitlesAfterSorting = await this.productTitle.allInnerTexts();
    expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting);
  };
}

// class Bajingan {
//   constructor(nama, umur) {
//     this.nama = nama;
//     this.umur = umur;
//   }
// }

// let fak = new Bajingan('Budi', 19);
// console.log(fak.nama);
