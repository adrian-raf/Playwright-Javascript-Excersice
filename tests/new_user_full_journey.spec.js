// UNTUK MENJALANKAN PROGRAM, JANGAN LUPA RUNNING shopping-store-windows-386
//  YANG ADA PADA FOLDER UdemyPlaywright_Tutorials
// terlebih dahulu

import { expect, test } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';
import { ProductsPage } from '../page-objects/ProductsPage';
import { Navigation } from '../page-objects/Navigation';
import { CheckOut } from '../page-objects/CheckOut';
import { LoginPage } from '../page-objects/LoginPage';
import { RegisterPage } from '../page-objects/RegisterPage';
import { DeliveryDetails } from '../page-objects/DeliveryDetails';
import { deliveryDetails as userAddress } from '../data/deliveryDetails';
import { PaymentPage } from '../page-objects/PaymentPage';
import { paymentDetails } from '../data/paymentDetails';

test('New user full end to end test journey', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.visit();
  await productsPage.shortByCheapest();
  await productsPage.addProductToBasket(0);
  await productsPage.addProductToBasket(2);
  await productsPage.addProductToBasket(4);

  const navigation = new Navigation(page);
  await navigation.goToCheckout();

  const checkout = new CheckOut(page);
  await checkout.removeCheapestProduct();
  // SIMPAN KE DALAM VARIABLE AGAR DAPAT DIGUNAKAN PADA PAYMENTPAGE UNTUK MEMBANDINGKAN TOTAL HARGA
  const hargaCekout = await checkout.totalHarga();

  await checkout.continueToCheckout();

  const login = new LoginPage(page);
  await login.clickButtonRegister();

  const register = new RegisterPage(page);
  const email = uuidv4() + '@gmail.com';
  const password = uuidv4();
  await register.fillFieldRegister(email, password);

  const deliveryDetails = new DeliveryDetails(page);
  await deliveryDetails.fillDetails(userAddress);
  await deliveryDetails.saveDetails();
  await deliveryDetails.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.useDiscount();
  expect(await hargaCekout).toEqual(await paymentPage.totalHargaPayment());
  await paymentPage.fillPayment(paymentDetails);
  await paymentPage.completePayment();
  // await page.pause();
});
