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
        // let loadPromise = this.page.waitForEvent("load");
        switch (category) {
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
        // await loadPromise;
        await this.page.waitForLoadState('load');
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
        await expect(await this.products.first()).toBeVisible();
        const productCountInCurrentPage = await this.products.count();
        await expect(productCountInCurrentPage).toBeGreaterThan(1);
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