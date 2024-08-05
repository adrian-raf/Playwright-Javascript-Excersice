import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.inputEmail = page.locator(`[placeholder="E-Mail"]`);
    this.inputPassword = page.locator(`[placeholder="Password"]`);
    this.loginButton = page.getByRole('button', { name: /Login/i });
    this.registerButton = page.locator(`[data-qa="go-to-signup-button"]`);
    this.errorMessage = page.locator(`[data-qa="error-message"]`);
  }
  fillWithWrongData = async () => {
    await this.inputEmail.waitFor();
    await this.inputEmail.fill('testing@gmail.com');
    await this.inputPassword.fill('playwright123');
    await this.loginButton.click();
    expect(this.errorMessage).toHaveText('user does not exist');
  };

  fillWithCorrectData = async () => {
    await this.inputEmail.fill('admin');
    await this.inputPassword.fill('Admin123');
    await this.loginButton.click();
    await this.page.waitForURL(/delivery-details/i);
  };

  clickButtonRegister = async () => {
    await this.registerButton.waitFor();
    await this.registerButton.click();
  };
}
