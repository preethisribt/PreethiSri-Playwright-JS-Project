import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { HomPage } from '../Pages/HomePage';
import { CartPage } from '../Pages/CartPage';
import { Categories } from '../Pages/CategoriesPage';

test('Add Product To cart', async ({ page },testInfo)=> {
    const loginPage = await new LoginPage(page,testInfo);

    await page.goto("https://demoblaze.com/index.html");
    await loginPage.loginApplication();


    const categories = await new Categories(page);
    await categories.selectCategory('Laptops');

    const homePage = await new HomPage(page);
    await homePage.selectProduct('Sony vaio i5');
    await homePage.addToProduct();

    const cartPage = await new CartPage(page);
    await cartPage.selectCart();
    await cartPage.validateProductInCart('Sony vaio i5');


    await page.close();
});


test('Remove Product from Cart', async ({ page }) => {
    const loginPage = await new LoginPage(page);

    await page.goto("https://demoblaze.com/index.html");
    await loginPage.loginApplication();

    const cartPage = await new CartPage(page);
    await cartPage.selectCart();
    await cartPage.deleteAllItemFromCart();

    await page.close();
});