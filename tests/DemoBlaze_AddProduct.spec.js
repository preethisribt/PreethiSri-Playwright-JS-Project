import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { HomPage } from '../Pages/HomePage';
import { CartPage } from '../Pages/CartPage';

const jsonData = JSON.parse(JSON.stringify(require("../test-data/DemoBlaze_Data.json")));

test('Add any two laptop and check whether the selected product appears in the cart', async ({ page }, testInfo) => {
    const loginPage = await new LoginPage(page, testInfo);

    await loginPage.launchApplication(process.env.DemoBlaze_URL);
    await loginPage.loginApplication();

    const homePage = await new HomPage(page, testInfo);
    await homePage.selectMoreProducts();

    const cartPage = await new CartPage(page, testInfo);
    await cartPage.selectCart();
    await cartPage.validateProductInCart();


    await page.close();
});


test('Remove all the product from Cart', async ({ page }, testInfo) => {
    const loginPage = await new LoginPage(page, testInfo);

    await loginPage.launchApplication(process.env.DemoBlaze_URL);
    await loginPage.loginApplication();

    const cartPage = await new CartPage(page, testInfo);
    await cartPage.selectCart();
    await cartPage.deleteAllItemFromCart();

    await page.close();
});