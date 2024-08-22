import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { HomPage } from '../Pages/HomePage';
import { CartPage } from '../Pages/CartPage';
import { OrderPage } from '../Pages/OrderPage'

test('complete pruchase', async ({ page }, testInfo) => {
    const loginPage = await new LoginPage(page, testInfo);
    await loginPage.launchApplication(process.env.DemoBlaze_URL);
    await loginPage.loginApplication();

    const homePage = await new HomPage(page, testInfo);
    await homePage.selectMoreProducts();

    const cartPage = await new CartPage(page, testInfo);
    await cartPage.selectCart();
    await cartPage.validateProductInCart();
    const totalAmountInCart = await cartPage.placeOrderAndGetCartAmount();
    await console.log("totalAmountInCart ", totalAmountInCart);

    const orderPage = await new OrderPage();
    await orderPage.provideCheckoutDetails();

    //await cartPage.deleteAllItemFromCart();
    await page.close();
});