const { expect } = require("@playwright/test");

exports.SignupPage = class SignupPage {
    constructor(page, testInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.signupLink = page.getByRole('link', { name: 'Sign up' });
        this.signupUserName = page.locator('#sign-username');
        this.signupPassword = page.locator('#sign-password');
        this.signupButton = page.getByRole('button', { name: 'Sign up' });
    }

    async launchApplication(url) {
        await Promise.all([this.page.goto(url), this.page.waitForEvent('load')]);
    }

    async selectSignup(username, password) {
        await this.signupLink.click();
        await this.signupUserName.fill(username);
        await this.signupPassword.fill(password);

        this.page.on('dialog', async (dialog) => {
            await console.info(dialog.type());
            await expect(dialog.message()).toEqual("This user already exist.");
            await dialog.accept();
        });
        await this.testInfo.attach("signupUsingExistingEmail", { body: await this.page.screenshot(), contentType: 'image/png' });
        await this.signupButton.click();
        await this.page.waitForEvent('dialog');
    }
}