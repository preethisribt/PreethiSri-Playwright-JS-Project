exports.LoginPage = class LoginPage {

    constructor(page) {
        this.page = page;
        this.login = page.locator('a', { hasText: 'Log in' });
        this.userNameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
    }

    async launchApplication(url) {
        await this.page.goto(url);
    }

    async closeBrowser() {
        // await this.page.pause();
        await this.page.close();
    }

    async loginApplication() {
        await this.login.click();
        await this.userNameInput.fill(process.env.DemoBlaze_UserName);
        await this.passwordInput.fill(process.env.DemoBlaze_Password);
        await this.loginButton.click();
        // await this.page.waitForSelector("[href='prod.html?idp_=1']");
    }
}