import { test, expect } from '@playwright/test';

exports.Categories = class Categories {

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.allCategory = page.getByRole('link', { name: 'CATEGORIES' });
        this.laptopsCategory = page.getByRole('link', { name: 'Laptops' });
        this.phonesCategory = page.getByRole('link', { name: 'Phones' });
        this.monitorsCategory = page.getByRole('link', { name: 'Monitors' });
    }

    async selectCategory(category) {
        switch (category) {
            case 'Phones':
                {
                    this.page.waitForEvent("load");
                    await this.phonesCategory.click();
                    break;
                }
            case 'Laptops': {
                let promise  = this.page.waitForEvent("load");
                await this.laptopsCategory.click();
                await promise;
                break;
            }
            case 'Monitors': {
                this.page.waitForEvent("load");
                await this.monitorsCategory.click();
                break;
            }
            case 'All Category':
            default: {
                this.page.waitForEvent("load");
                await this.allCategory.click();
                break;
            }
        }
        await this.testInfo.attach('CategoryPage', { body: await this.page.screenshot(), contentType: 'image/png' });

    }

}