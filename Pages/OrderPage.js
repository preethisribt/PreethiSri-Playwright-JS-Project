import json from '../test-data/DemoBlaze_Data.json';
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

    async provideCheckoutDetails() {
        await this.name.fill(jsonData.Name);
        await this.country.fill(jsonData.Country);
        await this.city.fill(jsonData.City);
        await this.provideCardDetails();
        await this.purchase();

    }

    async provideCardDetails() {
        await this.card.fill(jsonData.CC_Card);
        await this.month.fill(jsonData.CC_Month);
        await this.year.fill(jsonData.CC_Year);
    }

    async purchase() {
        await this.testInfo.attach("PlaceOrderPage", { body: await this.page.screenshot(), contentType: 'image/png' });
        await this.purchaseButton.click();
        await this.page.pause();
    }
}