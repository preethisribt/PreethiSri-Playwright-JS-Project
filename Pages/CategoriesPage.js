import { test, expect } from '@playwright/test';

exports.Categories = class Categories {
    
    constructor(page) {
        this.page = page;
        this.phonesCategory = page.getByRole('link', { name: 'Phones' });
        this.laptopsCategory = page.getByRole('link', { name: 'Laptops' });
        this.monitorsCategory = page.getByRole('link', { name: 'Monitors' });
    }

    async selectCategory(category) {
        switch (category) {
            case 'Phones': {
                await this.phonesCategory.click();
                break;
            }
            case 'Laptops': {
                await this.laptopsCategory.click();
                break;
            }
            case 'Laptops': {
                await this.monitorsCategory.click();
                break;
            }
        }
    }

}