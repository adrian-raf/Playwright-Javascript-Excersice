import { expect } from '@playwright/test';

export class DeliveryDetails {
  constructor(page) {
    this.page = page;
    this.errorMassage = page.locator(`[data-qa="error-message"]`);
    this.inputFirstName = page.getByPlaceholder('First name');
    this.inputLastName = page.getByPlaceholder('Last name');
    this.inputStreet = page.getByPlaceholder('Street');
    this.inputPostCode = page.getByPlaceholder('Post code');
    this.inputCity = page.getByPlaceholder('City');
    this.CountryDropdown = page.locator(`[data-qa="country-dropdown"]`);
    this.saveAddressButton = page.locator(`[data-qa="save-address-button"]`);
    this.continueToPaymentButton = page.locator(`[data-qa="continue-to-payment-button"]`);

    this.saveAddressContainer = page.locator(`[data-qa="saved-address-container"]`);
    this.saveAddressFirstName = page.locator(`[data-qa="saved-address-firstName"]`);
    this.saveAddressLastName = page.locator(`[data-qa="saved-address-lastName"]`);
    this.saveAddressStreet = page.locator(`[data-qa="saved-address-street"]`);
    this.saveAddressPostCode = page.locator(`[data-qa="saved-address-postcode"]`);
    this.saveAddressCity = page.locator(`[data-qa="saved-address-city"]`);
    this.saveAddressCountry = page.locator(`[data-qa="saved-address-country"]`);
  }

  fillDetails = async (userAddress) => {
    await this.inputFirstName.waitFor();
    await this.inputFirstName.fill(userAddress.firstName);
    await this.inputLastName.fill(userAddress.lastName);
    await this.inputStreet.fill(userAddress.street);
    await this.inputPostCode.fill(userAddress.postCode);
    await this.inputCity.fill(userAddress.city);
    await this.CountryDropdown.selectOption(userAddress.country);
  };

  saveDetails = async () => {
    const addressCountBeforeSaving = await this.saveAddressContainer.count();
    await this.saveAddressButton.waitFor();
    await this.saveAddressButton.click();
    await this.saveAddressContainer.waitFor();
    await expect(this.saveAddressContainer).toHaveCount(addressCountBeforeSaving + 1);
    // first untuk mengambil elemen pertama nya, jadi jika ada dua container, maka yg diambil
    // this.saveAddressFirstName dari container pertama
    // untuk kasus ini, boleh pakai boleh tidak
    expect(await this.saveAddressFirstName.first().innerText()).toBe(
      await this.inputFirstName.inputValue()
    );
    expect(await this.saveAddressCountry.innerText()).toBe(await this.CountryDropdown.inputValue());
  };

  continueToPayment = async () => {
    await this.continueToPaymentButton.waitFor();
    await this.continueToPaymentButton.click();
    await this.page.waitForURL(/\/payment/);
  };
}
