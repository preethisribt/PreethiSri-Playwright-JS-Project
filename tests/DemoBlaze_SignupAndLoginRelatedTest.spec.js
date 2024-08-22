import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/LoginPage';
import { HomPage } from '../Pages/HomePage';
import { CartPage } from '../Pages/CartPage';
import { SignupPage } from '../Pages/SignupPage';
import { env } from 'process';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const csvData = parse(
    fs.readFileSync(path.join(__dirname, "../test-data/DemoBlaze_signup_existingEmail.csv")),
    {
        columns: true,
        skip_empty_lines: true
    });

for (let data of csvData) {
    test(`Signup using existing email id validation ${data.Test_ID}`, async ({ page }, testInfo) => {
        const signupPage = await new SignupPage(page, testInfo);
        await signupPage.launchApplication(process.env.DemoBlaze_URL);
        await signupPage.selectSignup(data.UserName, data.Password);
        await page.close();
    });
}