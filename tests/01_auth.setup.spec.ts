import { test, expect } from '../fixtures/fixture';
import { getUsers } from '../utils/usersExcelService';

test('Login and save auth session', async ({ login, page }) => {

    await page.goto('https://automationexercise.com/login');

    const users: any[] = getUsers();
    const user = users[users.length - 1];
    await login.login(
        user.email,
        user.password
    );

    // Save auth session
    await page.context().storageState({ path: 'playwright/.auth/user.json' });
});