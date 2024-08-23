import { expect } from '@playwright/test';
import json from '../test-data/DemoBlaze_Data.json';
import { CartPage } from './CartPage';
// import { CartPage } from './CartPage';

const jsonData = JSON.parse(JSON.stringify(json));

exports.OrderPage = class OrderPage {

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.name = page.locator('#name');
        this.country = page.locator('#country')
        this.totalAmountInCheckout = page.locator('#totalm');
        this.city = page.locator('#city');
        this.card = page.locator('#card');
        this.month = page.locator('#month');
        this.year = page.locator('#year');
        this.purchaseButton = page.getByRole('button', { name: 'Purchase' });
    }

    async validationSuccessfullOrderMessage() {
        await this.testInfo.attach("OrderPage", { body: await this.page.screenshot(), contentType: 'image/png' });
        await expect(this.page.getByRole('heading', { name: 'Thank you for your purchase!' })).toBeVisible();
        const orderMessage = await this.page.locator("//p[@class='lead text-muted ']").textContent();
        console.log("Order Message = ", await orderMessage);

        const cartPage = await new CartPage();
        await expect(await orderMessage).toContainText(await cartPage.getCartAmount());
    }

    async provideCheckoutDetails() {
        await this.name.fill(jsonData.Name);
        await this.country.fill(jsonData.Country);
        await this.city.fill(jsonData.City);
        await this.provideCardDetails();
        await this.proceedToPurchase();
    }

    async provideCardDetails() {
        await this.card.fill(jsonData.CC_Card);
        await this.month.fill(jsonData.CC_Month);
        await this.year.fill(jsonData.CC_Year);
    }

    async proceedToPurchase() {
        await this.testInfo.attach("PlaceOrderPage", { body: await this.page.screenshot(), contentType: 'image/png' });
        await this.purchaseButton.click();
    }

    async validateAmountDuringCheckout() {
        const cartPage = await new CartPage();
        await this.page.waitForSelector("#totalm");
        await expect(await cartPage.getCartAmount()).toHaveText(await this.totalAmountInCheckout.textContent());
    }
}