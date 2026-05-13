import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.Page';

type MyFixtures = {
    login: LoginPage;
};

export const test = base.extend<MyFixtures>({
    login: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await use(loginPage);
    }
});

export { expect } from '@playwright/test';