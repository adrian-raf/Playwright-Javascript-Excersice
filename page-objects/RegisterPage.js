export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.headingWordText = page.getByRole('heading', { name: 'Sign up to our platform!' });
    this.inputEmail = page.getByPlaceholder('E-Mail');
    this.inputPassword = page.getByPlaceholder('Password');
    this.buttonRegister = page.getByRole('button', { name: 'Register' });
  }

  fillFieldRegister = async (email, password) => {
    await this.headingWordText.waitFor();
    await this.inputEmail.fill(email);
    await this.inputPassword.fill(password);
    await this.buttonRegister.click();
    await this.page.waitForURL(/delivery-details/i);
  };
}
