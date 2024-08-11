const { expect } = require("@playwright/test");
const { default: test } = require("node:test");

exports.HomPage = class HomPage {

    constructor(page) {
        this.page = page;
        this.products = page.locator("//h4[@class='card-title']//a");
        this.firstProducts = page.locator("(//h4[@class='card-title']//a)[1]");
        // this.addCart = page.locator('a', { hasText: 'Add to cart' });
        this.addCart = page.getByRole('link', { name: 'Add to cart' });
    
    }

    async selectProduct(product) {
        await expect(await this.firstProducts).toBeVisible();
        console.log("Size is" + await this.products.count());

        for (const element of await this.products.all()) {
            if ((await element.textContent()).includes(product)) {
                await element.click();
                break;
            }
        }
        await expect(await this.page.getByRole('heading', { name: product })).toBeVisible();
    }

    
    async addToProduct() {
        await expect(await this.addCart).toBeVisible({ timeout: 7000 });
        
        await this.page.on('dialog', async dialog => {
            await console.log("Dialog type is " + await dialog.type());
            await expect(await dialog.message()).toEqual("Product added.");
            await dialog.accept();
        });
       
        await this.addCart.click();
        await this.page.waitForEvent("dialog");
    }
}