# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02_logIn.spec.ts >> Login with empty password
- Location: tests\02_logIn.spec.ts:79:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Please fill in this field."
Received: "Please fill out this field."
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e5]:
      - link "Website for automation practice" [ref=e8] [cursor=pointer]:
        - /url: /
        - img "Website for automation practice" [ref=e9]
      - list [ref=e12]:
        - listitem [ref=e13]:
          - link " Home" [ref=e14] [cursor=pointer]:
            - /url: /
            - generic [ref=e15]: 
            - text: Home
        - listitem [ref=e16]:
          - link " Products" [ref=e17] [cursor=pointer]:
            - /url: /products
            - generic [ref=e18]: 
            - text: Products
        - listitem [ref=e19]:
          - link " Cart" [ref=e20] [cursor=pointer]:
            - /url: /view_cart
            - generic [ref=e21]: 
            - text: Cart
        - listitem [ref=e22]:
          - link " Signup / Login" [ref=e23] [cursor=pointer]:
            - /url: /login
            - generic [ref=e24]: 
            - text: Signup / Login
        - listitem [ref=e25]:
          - link " Test Cases" [ref=e26] [cursor=pointer]:
            - /url: /test_cases
            - generic [ref=e27]: 
            - text: Test Cases
        - listitem [ref=e28]:
          - link " API Testing" [ref=e29] [cursor=pointer]:
            - /url: /api_list
            - generic [ref=e30]: 
            - text: API Testing
        - listitem [ref=e31]:
          - link " Video Tutorials" [ref=e32] [cursor=pointer]:
            - /url: https://www.youtube.com/c/AutomationExercise
            - generic [ref=e33]: 
            - text: Video Tutorials
        - listitem [ref=e34]:
          - link " Contact us" [ref=e35] [cursor=pointer]:
            - /url: /contact_us
            - generic [ref=e36]: 
            - text: Contact us
  - generic [ref=e39]:
    - generic [ref=e41]:
      - heading "Login to your account" [level=2] [ref=e42]
      - generic [ref=e43]:
        - textbox "Email Address" [ref=e44]: user_1779792293932@mail.com
        - textbox "Password" [active] [ref=e45]
        - button "Login" [ref=e46] [cursor=pointer]
    - heading "OR" [level=2] [ref=e48]
    - generic [ref=e50]:
      - heading "New User Signup!" [level=2] [ref=e51]
      - generic [ref=e52]:
        - textbox "Name" [ref=e53]
        - textbox "Email Address" [ref=e54]
        - button "Signup" [ref=e55] [cursor=pointer]
  - contentinfo [ref=e56]:
    - generic [ref=e61]:
      - heading "Subscription" [level=2] [ref=e62]
      - generic [ref=e63]:
        - textbox "Your email address" [ref=e64]
        - button "" [ref=e65] [cursor=pointer]:
          - generic [ref=e66]: 
        - paragraph [ref=e67]:
          - text: Get the most recent updates from
          - text: our site and be updated your self...
    - paragraph [ref=e71]: Copyright © 2021 All rights reserved
  - text: 
```

# Test source

```ts
  1   | import { test, expect } from '../fixtures/fixture';
  2   | import { loginLocators } from '../locators/loginLocators';
  3   | import { loginTestData } from '../test-data/loginData';
  4   | import { getUser, getUsers } from '../utils/usersExcelService';
  5   | 
  6   | test('Invalid email and valid password', async ({ login, page }) => {
  7   | 
  8   |     const users: any[] = getUsers();
  9   |     const validUser = users[users.length - 1];
  10  |     const invalidEmail = loginTestData.invalidEmail.email;
  11  | 
  12  |     await login.login(
  13  |         invalidEmail,
  14  |         validUser.password
  15  |     );
  16  | 
  17  |     await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
  18  | });
  19  | 
  20  | 
  21  | test('Valid email and invalid password', async ({ login, page }) => {
  22  | 
  23  |     // valid user from excel
  24  |     const users: any[] = getUsers();
  25  |     const validUser = users[users.length - 1];
  26  | 
  27  |     // invalid password from test data
  28  |     const invalidPassword =
  29  |         loginTestData.invalidPassword.password;
  30  | 
  31  |     await login.login(
  32  |         validUser.email,
  33  |         invalidPassword
  34  |     );
  35  | 
  36  |     await expect(
  37  |         page.locator(
  38  |             'text=Your email or password is incorrect!'
  39  |         )
  40  |     ).toBeVisible();
  41  | });
  42  | 
  43  | 
  44  | test('Invalid email and invalid password', async ({ login, page }) => {
  45  | 
  46  |     const data =
  47  |         loginTestData.invalidCredentials;
  48  | 
  49  |     await login.login(
  50  |         data.email,
  51  |         data.password
  52  |     );
  53  | 
  54  |     await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
  55  | });
  56  | 
  57  | 
  58  | test('Login with empty email', async ({ login, page }) => {
  59  | 
  60  |     // valid password from excel
  61  |     const users: any[] = getUsers();
  62  |     const validUser = users[users.length - 1];
  63  | 
  64  |     // empty email from loginData
  65  |     const emptyEmail =
  66  |         loginTestData.emptyEmail.email;
  67  | 
  68  |     await login.login(
  69  |         emptyEmail,
  70  |         validUser.password
  71  |     );
  72  | 
  73  |     const message = await page.locator(loginLocators.email).evaluate((el: HTMLInputElement) => el.validationMessage);
  74  |     expect(message).toBe('Please fill in this field.');
  75  | });
  76  | 
  77  | 
  78  | 
  79  | test('Login with empty password', async ({ login, page }) => {
  80  | 
  81  |     const users: any[] = getUsers();
  82  |     const validUser = users[users.length - 1];
  83  | 
  84  |     const emptyPassword = loginTestData.emptyPassword.password;
  85  | 
  86  |     await login.login(
  87  |         validUser.email,
  88  |         emptyPassword
  89  |     );
  90  | 
  91  |     const message = await page.locator(loginLocators.password).evaluate((el: HTMLInputElement) => el.validationMessage);
> 92  |     expect(message).toBe('Please fill in this field.');
      |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  93  | });
  94  | 
  95  | 
  96  | 
  97  | test('Login with empty email and password', async ({ login, page }) => {
  98  | 
  99  |     const data =
  100 |         loginTestData.emptyCredentials;
  101 | 
  102 |     await login.login(
  103 |         data.email,
  104 |         data.password
  105 |     );
  106 | 
  107 |     const message = await page.locator(loginLocators.email).evaluate((el: HTMLInputElement) => el.validationMessage);
  108 |     expect(message).toBe('Please fill in this field.');
  109 | });
  110 | 
  111 | 
  112 | test('Password case sensitivity validation', async ({ login, page }) => {
  113 | 
  114 |     const users: any[] = getUsers();
  115 |     const validUser = users[users.length - 1];
  116 | 
  117 |     const wrongCasePassword = validUser.password.toUpperCase();
  118 | 
  119 |     await login.login(
  120 |         validUser.email,
  121 |         wrongCasePassword
  122 |     );
  123 | 
  124 |     await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
  125 | });
  126 | 
  127 | test('Login with latest user credentials', async ({ login, page }) => {
  128 | 
  129 |     const users: any[] = getUsers();
  130 | 
  131 |     const user = users[users.length - 1];
  132 |     await login.login(
  133 |         user.email,
  134 |         user.password
  135 |     );
  136 |     await expect(page).toHaveURL('https://automationexercise.com/');
  137 |     const username = user.email.split('@')[0];
  138 |     await expect(page.locator(`a:has-text("Logged in as ${username}")`)).toBeVisible();
  139 | });
  140 | 
  141 | 
  142 | test('Login with perticular user', async ({ login, page }) => {
  143 | 
  144 |     const user = getUser('user_1778682143096@mail.com');
  145 | 
  146 |     await login.login(
  147 |         user.email,
  148 |         user.password
  149 |     );
  150 |     await expect(page).toHaveURL('https://automationexercise.com/');
  151 |     const username = user.email.split('@')[0];
  152 |     await expect(page.locator(`a:has-text("Logged in as ${username}")`)).toBeVisible();
  153 | });
  154 | 
  155 | 
```