import { Page } from '@playwright/test';
import { loginLocators } from '../locators/loginLocators';
import { signupLocators } from '../locators/signupLocators';

export class LoginPage {
    constructor(private page: Page) { }

    async open() {
        await this.page.goto('https://automationexercise.com/login');
    }

    async signup(name: string, email: string) {
        await this.page.locator(signupLocators.entry.name).fill(name);
        await this.page.locator(signupLocators.entry.email).fill(email);
        await this.page.locator(signupLocators.entry.signupButton).click();
    }

    async login(email: string, password: string) {
        await this.page.fill(loginLocators.email, email);
        await this.page.fill(loginLocators.password, password);
        await this.page.click(loginLocators.loginBtn);
    }
}