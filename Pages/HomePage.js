const { expect } = require("@playwright/test");
const { default: test } = require("node:test");
const jsonData = JSON.parse(JSON.stringify(require("../test-data/DemoBlaze_Data.json")));

exports.HomPage = class HomPage {

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.products = page.locator("#tbodyid h4").getByRole('link');
        // this.products = page.locator("//h4[@class='card-title']//a");
        this.addCart = page.getByRole('link', { name: 'Add to cart' });
        this.home = page.getByRole('link', { name: 'Home' });
        this.allCategory = page.getByRole('link', { name: 'CATEGORIES' });
        this.laptopsCategory = page.getByRole('link', { name: 'Laptops' });
        this.phonesCategory = page.getByRole('link', { name: 'Phones' });
        this.monitorsCategory = page.getByRole('link', { name: 'Monitors' });

    }

    async selectCategory(category) {

        switch (category) {
            case 'Phones': {
                category = this.phonesCategory;
                break;
            }
            case 'Laptops': {
                category = this.laptopsCategory;
                break;
            }
            case 'Monitors': {
                category = this.monitorsCategory;
                break;
            }
            case 'All Category':
            default: {
                category = this.allCategory;
                break;
            }
        }
        // await console.log("category is ", category);
        await Promise.all([this.page.waitForEvent('load'), category.click(), expect(this.page.getByRole('link', { name: 'MacBook Pro' })).toBeVisible()]);
        await this.testInfo.attach('CategoryPage', { body: await this.page.screenshot(), contentType: 'image/png' });

    }

    async addToProduct() {
        const dialogPromise = this.page.waitForEvent("dialog");
        await expect(await this.addCart).toBeVisible({ timeout: 7000 });

        await this.page.once('dialog', async dialog => {
            await console.log("Dialog type is " + await dialog.type());
            await expect(await dialog.message()).toEqual("Product added.");
            await dialog.accept();
        });


        await this.addCart.click();
        await dialogPromise;
    }

    async selectProduct(product) {
        await this.testInfo.attach('HomePage', { body: await this.page.screenshot(), contentType: 'image/png' });

        for (let element of await this.products.all()) {
            if (await element.textContent() === product) {
                await element.click();
                await expect(await this.page.getByRole('heading', { name: product })).toBeVisible();
                break;
            }
        }
    }

    async selectMoreProducts() {
        let totalProductRequired = await jsonData.ProductToBeSelected.length;

        for (let i = 0; i < totalProductRequired; i++) {
            await this.selectCategory(await jsonData.Categories);
            await this.selectProduct(await jsonData.ProductToBeSelected[i]);
            await this.addToProduct();
            await this.home.click();
        }
    }
}