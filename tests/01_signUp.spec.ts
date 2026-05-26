import { test, expect } from '../fixtures/fixture';
import { signupLocators } from '../locators/signupLocators';
import { SignupPage } from '../pages/signup.Page';
import { signupTestData } from '../test-data/signupData';
import { getSignupUsers } from '../utils/signupDataMapper';
import { saveUser } from '../utils/usersExcelService';

test('Signup with empty name', async ({ login, page }) => {

    const data = signupTestData.emptyName;
    await login.signup(data.name, data.email);

    const message = await page.locator(signupLocators.entry.name).evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(message.toLowerCase()).toContain("please fill");
});


test('Signup with empty email', async ({ login, page }) => {
    const data = signupTestData.emptyEmail;
    await login.signup(data.name, data.email);

    const message = await page.locator(signupLocators.entry.email).evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(message.toLowerCase()).toContain("please fill");
});


test.describe('Invalid email validations', () => {

    signupTestData.invalidEmails.forEach((data, index) => {
        test(`Invalid email test #${index + 1} - ${data.email}`, async ({ login, page }) => {
            await login.signup(data.name, data.email);

            const message = await page.locator(signupLocators.entry.email).evaluate((el: HTMLInputElement) => el.validationMessage);
            expect(message).toBe(data.expectedMessage);
        });
    });
});

const users = getSignupUsers();

test.describe('Signup with Excel Data', () => {

    users.forEach((user, index) => {

        test(`Signup Test #${index + 1}`, async ({ login, page }) => {

            await login.signup(user.name, user.email);
            await expect(page).toHaveURL('https://automationexercise.com/signup');
            const signupPage = new SignupPage(page);

            await signupPage.fillForm(user.registration);
            await signupPage.submit();
            await signupPage.verifyAccountCreated();

            saveUser({
                name: user.name,
                email: user.email,
                password: user.registration.password
            });
        });
    });
});