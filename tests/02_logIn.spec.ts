import { test, expect } from '../fixtures/fixture';
import { loginLocators } from '../locators/loginLocators';
import { loginTestData } from '../test-data/loginData';
import { getUser, getUsers } from '../utils/usersExcelService';

test('Invalid email and valid password', async ({ login, page }) => {

    const users: any[] = getUsers();
    const validUser = users[users.length - 1];
    const invalidEmail = loginTestData.invalidEmail.email;

    await login.login(
        invalidEmail,
        validUser.password
    );

    await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
});


test('Valid email and invalid password', async ({ login, page }) => {

    // valid user from excel
    const users: any[] = getUsers();
    const validUser = users[users.length - 1];

    // invalid password from test data
    const invalidPassword =
        loginTestData.invalidPassword.password;

    await login.login(
        validUser.email,
        invalidPassword
    );

    await expect(
        page.locator(
            'text=Your email or password is incorrect!'
        )
    ).toBeVisible();
});


test('Invalid email and invalid password', async ({ login, page }) => {

    const data =
        loginTestData.invalidCredentials;

    await login.login(
        data.email,
        data.password
    );

    await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
});


test('Login with empty email', async ({ login, page }) => {

    // valid password from excel
    const users: any[] = getUsers();
    const validUser = users[users.length - 1];

    // empty email from loginData
    const emptyEmail =
        loginTestData.emptyEmail.email;

    await login.login(
        emptyEmail,
        validUser.password
    );

    const message = await page.locator(loginLocators.email).evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(message).toBe('Please fill in this field.');
});



test('Login with empty password', async ({ login, page }) => {

    const users: any[] = getUsers();
    const validUser = users[users.length - 1];

    const emptyPassword = loginTestData.emptyPassword.password;

    await login.login(
        validUser.email,
        emptyPassword
    );

    const message = await page.locator(loginLocators.password).evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(message).toBe('Please fill in this field.');
});



test('Login with empty email and password', async ({ login, page }) => {

    const data =
        loginTestData.emptyCredentials;

    await login.login(
        data.email,
        data.password
    );

    const message = await page.locator(loginLocators.email).evaluate((el: HTMLInputElement) => el.validationMessage);
    expect(message).toBe('Please fill in this field.');
});


test('Password case sensitivity validation', async ({ login, page }) => {

    const users: any[] = getUsers();
    const validUser = users[users.length - 1];

    const wrongCasePassword = validUser.password.toUpperCase();

    await login.login(
        validUser.email,
        wrongCasePassword
    );

    await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
});

test('Login with latest user credentials', async ({ login, page }) => {

    const users: any[] = getUsers();

    const user = users[users.length - 1];
    await login.login(
        user.email,
        user.password
    );
    await expect(page).toHaveURL('https://automationexercise.com/');
    const username = user.email.split('@')[0];
    await expect(page.locator(`a:has-text("Logged in as ${username}")`)).toBeVisible();
});


test('Login with perticular user', async ({ login, page }) => {

    const user = getUser('user_1778682143096@mail.com');

    await login.login(
        user.email,
        user.password
    );
    await expect(page).toHaveURL('https://automationexercise.com/');
    const username = user.email.split('@')[0];
    await expect(page.locator(`a:has-text("Logged in as ${username}")`)).toBeVisible();
});

