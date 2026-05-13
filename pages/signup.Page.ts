import { Page } from '@playwright/test';
import { signupLocators } from '../locators/signupLocators';

export class SignupPage {
    constructor(private page: Page) { }

    async fillForm(data: any) {

        if (data.title === 'Mr') {
            await this.page.check(signupLocators.form.titleMr);
        } else if (data.title === 'Mrs') {
            await this.page.check(signupLocators.form.titleMrs);
        }

        await this.page.fill(signupLocators.form.password, data.password);

        await this.page.selectOption(signupLocators.form.days, data.day);
        await this.page.selectOption(signupLocators.form.months, { value: String(data.month).trim() });
        await this.page.selectOption(signupLocators.form.years, { value: String(data.year).trim() });

        if (data.newsletter) {
            await this.page.check(signupLocators.form.newsletter);
        }

        if (data.offers) {
            await this.page.check(signupLocators.form.offers);
        }

        await this.page.fill(signupLocators.form.firstName, data.firstName);
        await this.page.fill(signupLocators.form.lastName, data.lastName);

        if (data.company) {
            await this.page.fill(signupLocators.form.company, data.company);
        }

        await this.page.fill(signupLocators.form.address, data.address);

        if (data.address2) {
            await this.page.fill(signupLocators.form.address2, data.address2);
        }

        await this.page.selectOption(signupLocators.form.country, data.country);

        await this.page.fill(signupLocators.form.state, data.state);
        await this.page.fill(signupLocators.form.city, data.city);
        await this.page.fill(signupLocators.form.zipcode, data.zipcode);
        await this.page.fill(signupLocators.form.mobile, data.mobile);
    }

    async submit() {
        await this.page.click(signupLocators.form.createAccountBtn);
    }

    async verifyAccountCreated() {

        await this.page.waitForSelector(signupLocators.success.accountCreatedText);
        const text = await this.page.textContent(
            signupLocators.success.accountCreatedText
        );
        if (!text?.includes('Account Created')) {
            throw new Error('Account Created text not found');
        }

        const isVisible = await this.page.isVisible(
            signupLocators.success.continueButton
        );
        if (!isVisible) {
            throw new Error('Continue button not visible');
        }
    }
}