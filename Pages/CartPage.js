const { expect, test } = require("@playwright/test");
const { setTimeout } = require("timers/promises");
const jsonData = JSON.parse(JSON.stringify(require("../test-data/DemoBlaze_Data.json")));

exports.CartPage = class CartPage {
    totalAmountInCart;

    constructor(page, testInfo) {
        this.delete = "//a[text()='Delete']";
        this.page = page;
        this.testInfo = testInfo;
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
    }

    async getCartAmount() {
        return this.totalAmountInCart = await this.cartTotalAmount.textContent();
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
        await Promise.all([
            this.cart.click(),
            this.page.waitForEvent('load'),
            this.page.waitForSelector("//tbody[@id='tbodyid']//img[@src]")
        ]);
        // await this.page.pause();
        // getByRole('row', { name: 'Dell i7 8gb 700 Delete' }).getByRole('img')
        await this.testInfo.attach('CartPage', { body: await this.page.screenshot(), contentType: 'image/png' });
        await expect(await this.cartBody.count()).toBeGreaterThan(0)
    }

    async validateProductInCart() {
        for (let product of await jsonData.ProductToBeSelected) {
            await expect(await this.page.getByRole('cell', { name: product })).toBeVisible();
        }
    }
}