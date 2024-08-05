import { expect } from '@playwright/test';

export class PaymentPage {
  constructor(page) {
    this.page = page;
    this.creditCardOwnerInput = page.locator(`[data-qa="credit-card-owner"]`);
    this.creditCardNumberInput = page.getByPlaceholder('Credit card number');
    this.creditCardValidUntilInput = page.getByPlaceholder('Valid until');
    this.creditCardCVCInput = page.getByPlaceholder('Credit card CVC');
    this.payButton = page.locator(`[data-qa="pay-button"]`);
    this.submitDiscountButton = page.locator(`[data-qa="submit-discount-button"]`);
    this.discountCodeInput = page.getByPlaceholder('Discount code');
    this.totalValue = page.locator(`[data-qa="total-value"]`);
    this.discountCode = page
      .frameLocator(`[class="active-discount-container"]`)
      .locator(`[data-qa="discount-code"]`);
    this.discountedValue = page.locator(`[ data-qa="total-with-discount-value"]`);
    this.discountActivatedMessage = page.locator(`[data-qa="discount-active-message"]`);
  }

  fillPayment = async (paymentDetails) => {
    await this.creditCardCVCInput.waitFor();
    await this.creditCardOwnerInput.fill(paymentDetails.owner);
    await this.creditCardNumberInput.fill(paymentDetails.number);
    await this.creditCardValidUntilInput.fill(paymentDetails.validUntil);
    await this.creditCardCVCInput.fill(paymentDetails.cvc);
  };

  useDiscount = async () => {
    const discount = await this.discountCode.innerText();

    // Option 1 for laggy inputs: using .fill() with await expect()
    await this.discountCodeInput.fill(discount);
    await expect(this.discountCodeInput).toHaveValue(discount);

    // Option 2 for laggy inputs: slow typing
    // await this.discountCodeInput.focus();
    // await this.page.keyboard.type(discount, { delay: 1000 });
    // expect(await this.discountCodeInput.inputValue()).toBe(discount);

    expect(await this.discountedValue.isVisible()).toBe(false);
    expect(await this.discountActivatedMessage.isVisible()).toBe(false);
    await this.submitDiscountButton.click();
    const discountValueText = await this.discountedValue.innerText();
    const discountValueOnlyStringNumber = discountValueText.replace('$', '');
    const discountValueNumber = parseInt(discountValueOnlyStringNumber);
    // penulisan dalam satu baris

    await this.totalValue.waitFor();
    const totalValueText = await this.totalValue.innerText();
    const totalValueOnlyStringNumber = totalValueText.replace('$', '');
    const totalValueNumber = parseInt(totalValueOnlyStringNumber);
    // const totalBeforeDiscount = parseInt(await this.totalValue.innerText())

    // check that the discounted price total is smaller than the regular one
    expect(discountValueNumber).toBeLessThan(totalValueNumber);
  };

  totalHargaPayment = async () => {
    const totalPriceText = await this.totalValue.textContent();
    const total = totalPriceText.replace(/[^0-9]/g, '');
    const TotalInNumber = parseInt(total);
    return TotalInNumber;
  };

  completePayment = async () => {
    await this.payButton.click();
    await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
  };
}
