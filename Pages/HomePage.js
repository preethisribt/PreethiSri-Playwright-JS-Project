const { expect } = require("@playwright/test");
const { default: test } = require("node:test");
const jsonData = JSON.parse(JSON.stringify(require("../test-data/DemoBlaze_Data.json")));

exports.HomPage = class HomPage {

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.products = page.locator("#tbodyid h4 a");
        // this.products = page.locator("//h4[@class='card-title']//a");
        this.addCart = page.getByRole('link', { name: 'Add to cart' });
        this.home = page.getByRole('link', { name: 'Home' });
        this.allCategory = page.getByRole('link', { name: 'CATEGORIES' });
        this.laptopsCategory = page.locator("//a[text()='Laptops']");
        this.phonesCategory = page.getByRole('link', { name: 'Phones' });
        this.monitorsCategory = page.getByRole('link', { name: 'Monitors' });

    }

    async selectLaptopCategory() {
        await this.page.waitForSelector("#tbodyid h4 a");
        await this.page.waitForSelector("//a[text()='Laptops']");
        await this.laptopsCategory.click();
        await expect(this.page.getByRole('link', { name: 'MacBook Pro' })).toBeVisible({ timeout: 7000 });
        await this.testInfo.attach('CategoryPage', { body: await this.page.screenshot(), contentType: 'image/png' });

    }
    async selectCategory(category) {
        // let categoryPromise = this.page.waitForEvent('load');

        switch (await category) {
            case 'Phones': {
                await this.phonesCategory.click();
                break;
            }
            case 'Laptops': {
                await this.laptopsCategory.click();
                break;
            }
            case 'Monitors': {
                await this.monitorsCategory.click();
                break;
            }
            case 'All Category':
            default: {
                await this.allCategory.click();
                break;
            }
        }

        await Promise.all([expect(this.page.getByRole('link', { name: 'MacBook Pro' })).toBeVisible()]);
        // await Promise.all([this.page.waitForEvent('load'), expect(this.page.getByRole('link', { name: 'MacBook Pro' })).toBeVisible({ timeout: 7000 })]);
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

        await this.page.waitForSelector("#tbodyid h4 a");
        const products = await this.page.$$("#tbodyid h4 a");
        console.log("total product available ", await products.length);
        // await expect(await this.page.$$("#tbodyid h4 a").length).toBeGreaterThan(0);
        // await this.page.pause();
        for await (let element of await this.products.all()) {
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
            await this.selectLaptopCategory();
            await this.selectProduct(await jsonData.ProductToBeSelected[i]);
            await this.addToProduct();
            await this.home.click();
        }
    }
}