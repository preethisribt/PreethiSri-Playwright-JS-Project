import { test, expect } from '@playwright/test';
const path = require("path");

exports.LoginPage = class LoginPage {

    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.login = page.locator('a', { hasText: 'Log in' });
        this.userNameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
    }

    async launchApplication(url) {
        await this.page.goto(url);
    }

    async closeBrowser() {
        await this.page.close();
    }

    async loginApplication() {
        await this.login.click();
        await this.userNameInput.fill(process.env.DemoBlaze_UserName);
        await this.passwordInput.fill(process.env.DemoBlaze_Password);
        await this.loginButton.click();
        // await this.page.screenshot({ path: 'test-screenshots/' + Date.now() + ' DemoBlazeLoginApplication.png' });
        await this.testInfo.attach('DemoBlazeLogin', { body: await this.page.screenshot(), contentType: 'image/png' });
    }
}