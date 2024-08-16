import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { HomPage } from '../Pages/HomePage';
import { CartPage } from '../Pages/CartPage';

test('complete pruchase of monitor', async ({ page }) => {
    const loginPage = await new LoginPage(page, testInfo);

    await loginPage.launchApplication(process.env.DemoBlaze_URL);
    await loginPage.loginApplication();

    const homePage = await new HomPage(page, testInfo);
    await homePage.selectMoreProducts();

    const cartPage = await new CartPage(page, testInfo);
    await cartPage.selectCart();
    for (let i = 0; i < jsonData.ProductToBeSelected.length; i++) {
        await cartPage.validateProductInCart(jsonData.Product[i]);

    }
    await page.close();
});