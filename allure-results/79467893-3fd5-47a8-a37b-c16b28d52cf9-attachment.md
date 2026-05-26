# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01_signUp.spec.ts >> Signup with empty name
- Location: tests\01_signUp.spec.ts:8:5

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
        - textbox "Email Address" [ref=e44]
        - textbox "Password" [ref=e45]
        - button "Login" [ref=e46] [cursor=pointer]
    - heading "OR" [level=2] [ref=e48]
    - generic [ref=e50]:
      - heading "New User Signup!" [level=2] [ref=e51]
      - generic [ref=e52]:
        - textbox "Name" [active] [ref=e53]
        - textbox "Email Address" [ref=e54]: validuser@mail.com
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
  1  | import { test, expect } from '../fixtures/fixture';
  2  | import { signupLocators } from '../locators/signupLocators';
  3  | import { SignupPage } from '../pages/signup.Page';
  4  | import { signupTestData } from '../test-data/signupData';
  5  | import { getSignupUsers } from '../utils/signupDataMapper';
  6  | import { saveUser } from '../utils/usersExcelService';
  7  | 
  8  | test('Signup with empty name', async ({ login, page }) => {
  9  | 
  10 |     const data = signupTestData.emptyName;
  11 |     await login.signup(data.name, data.email);
  12 | 
  13 |     const message = await page.locator(signupLocators.entry.name).evaluate((el: HTMLInputElement) => el.validationMessage);
  14 | 
> 15 |     expect(message).toBe('Please fill in this field.');
     |                     ^ Error: expect(received).toBe(expected) // Object.is equality
  16 | });
  17 | 
  18 | 
  19 | test('Signup with empty email', async ({ login, page }) => {
  20 |     const data = signupTestData.emptyEmail;
  21 |     await login.signup(data.name, data.email);
  22 | 
  23 |     const message = await page.locator(signupLocators.entry.email).evaluate((el: HTMLInputElement) => el.validationMessage);
  24 |     expect(message).toBe('Please fill in this field.');
  25 | });
  26 | 
  27 | 
  28 | test.describe('Invalid email validations', () => {
  29 | 
  30 |     signupTestData.invalidEmails.forEach((data, index) => {
  31 |         test(`Invalid email test #${index + 1} - ${data.email}`, async ({ login, page }) => {
  32 |             await login.signup(data.name, data.email);
  33 | 
  34 |             const message = await page.locator(signupLocators.entry.email).evaluate((el: HTMLInputElement) => el.validationMessage);
  35 |             expect(message).toBe(data.expectedMessage);
  36 |         });
  37 |     });
  38 | });
  39 | 
  40 | const users = getSignupUsers();
  41 | 
  42 | test.describe('Signup with Excel Data', () => {
  43 | 
  44 |     users.forEach((user, index) => {
  45 | 
  46 |         test(`Signup Test #${index + 1}`, async ({ login, page }) => {
  47 | 
  48 |             await login.signup(user.name, user.email);
  49 |             await expect(page).toHaveURL('https://automationexercise.com/signup');
  50 |             const signupPage = new SignupPage(page);
  51 | 
  52 |             await signupPage.fillForm(user.registration);
  53 |             await signupPage.submit();
  54 |             await signupPage.verifyAccountCreated();
  55 | 
  56 |             saveUser({
  57 |                 name: user.name,
  58 |                 email: user.email,
  59 |                 password: user.registration.password
  60 |             });
  61 |         });
  62 |     });
  63 | });
```