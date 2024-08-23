import { expect } from '@playwright/test';
const jsonData = JSON.parse(JSON.stringify(require("../test-data/DemoBlaze_Data.json")));

exports.CartPage = class CartPage {
    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.delete = "//a[text()='Delete']";
        this.cart = page.locator("#cartur");
        this.cartBody = page.locator("//tbody[@id='tbodyid']//img[@src]");
        this.pageText = page.getByText("Products");
        this.cartProducts = page.locator("#tbodyid td");
        this.deleteButton = page.locator(this.delete);
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
        this.cartTotalAmount = page.locator('#totalp');
    }

    async placeOrder() {
        await this.testInfo.attach("PlaceOrderPage", { body: await this.page.screenshot(), contentType: 'image/png' });
        await this.placeOrderButton.click();
        await this.page.waitForSelector("#name");
        await this.testInfo.attach("OrderPage", { body: await this.page.screenshot(), contentType: 'image/png' });
    }

    async getCartAmount() {
        return await this.cartTotalAmount.textContent();
    }

    async deleteAllItemFromCart() {
        let count = await this.deleteButton.count();
        await console.log(`delete count size is ${count}`);

        for (let del = 1; await del <= count; del++) {
            await this.deleteButton.first().click();
            await this.page.waitForEvent("load");
        }
        await this.testInfo.attach("CartPageAfterRemovingProducts", { body: await this.page.screenshot(), contentType: 'image/png' });
    }

    async selectCart() {
        await this.page.pause();

        await Promise.all([
            this.cart.click(),
            this.page.waitForEvent('load'),
            this.page.waitForSelector("//tbody[@id='tbodyid']//img[@src]")
        ]);
        await this.testInfo.attach('CartPage', { body: await this.page.screenshot(), contentType: 'image/png' });
    }

    async validateProductInCart() {
        for (let product of await jsonData.ProductToBeSelected) {
            await expect(await this.page.getByRole('cell', { name: product })).toBeVisible();
        }
    }
}