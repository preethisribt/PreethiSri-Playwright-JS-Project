const { expect } = require("@playwright/test");
const { setTimeout } = require("timers/promises");

exports.CartPage = class CartPage {
    constructor(page, testInfo) {
        this.delete = "//a[text()='Delete']";
        this.page = page;
        this.testInfo = testInfo;
        this.cart = page.locator("#cartur");
        this.cartBody = page.locator("//tbody[@id='tbodyid']//img[@src]");
        this.pageText = page.getByText("Products");
        this.cartProducts = page.locator("#tbodyid td");
        this.deleteButton = page.locator(this.delete);
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
        await console.log("inside select cart");
        await this.cart.click();
        await this.page.waitForSelector("//tbody[@id='tbodyid']//img[@src]");
        expect(await this.cartBody.count()).toBeGreaterThan(0);
    }

    async validateProductInCart(product) {
        let flag = false;
        for (const cartProduct of await this.cartProducts.all()) {
            await console.log("Received cartProduct.textContent() " + await cartProduct.textContent());
            if ((await cartProduct.textContent()) === product) {
                flag = true;
            }
        }
        await expect(flag).toBeTruthy();
        await this.testInfo.attach("CartPage", { body: await this.page.screenshot(), contentType: 'image/png' });
    }
}