import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { HomPage } from '../Pages/HomePage';
import { CartPage } from '../Pages/CartPage';
import { OrderPage } from '../Pages/OrderPage'

test('complete pruchase', async ({ page }, testInfo) => {
    try {
        const loginPage = await new LoginPage(page, testInfo);
        await loginPage.launchApplication(process.env.DemoBlaze_URL);
        await loginPage.loginApplication();

        const homePage = await new HomPage(page, testInfo);
        await homePage.selectMoreProducts();

        const cartPage = await new CartPage(page, testInfo);
        await cartPage.selectCart();
        await cartPage.validateProductInCart();
        await cartPage.placeOrder();

        const orderPage = await new OrderPage(page, testInfo);
        await orderPage.validateAmountDuringCheckout();
        await orderPage.provideCheckoutDetails();
        await orderPage.validationSuccessfullOrderMessage();
      
        await page.close();
    }
    catch (error) {
        const cartPage = await new CartPage(page, testInfo);
        await cartPage.deleteAllItemFromCart();
        await page.close()
    }
});