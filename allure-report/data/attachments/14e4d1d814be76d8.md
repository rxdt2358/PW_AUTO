# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 03_product.spec.ts >> Verify Women category products page
- Location: tests\03_product.spec.ts:41:5

# Error details

```
Error: expect.toHaveURL: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect } from '../fixtures/fixture';
  2   | import { ProductPage } from '../pages/product.Page';
  3   | import { productLocators } from '../locators/productLocators';
  4   | 
  5   | const productName = 'Blue Top';
  6   | test.use({ storageState: 'playwright/.auth/user.json' });
  7   | test.beforeEach(async ({ page }) => { await page.goto('/'); });
  8   | 
  9   | 
  10  | test('Verify All Products and product detail page', async ({ page }) => {
  11  |     const productPage = new ProductPage(page);
  12  |     await productPage.openProducts();
  13  | 
  14  |     await expect(page).toHaveURL('/products');
  15  |     await expect(page.locator(productLocators.productsList)).toBeVisible();
  16  | 
  17  |     await productPage.openFirstProduct();
  18  |     await expect(page).toHaveURL(/product_details/);
  19  |     await expect(page.locator(productLocators.productName)).toBeVisible();
  20  |     await expect(page.locator(productLocators.productCategory)).toBeVisible();
  21  |     await expect(page.locator(productLocators.productPrice)).toBeVisible();
  22  |     await expect(page.locator(productLocators.productAvailability)).toBeVisible();
  23  |     await expect(page.locator(productLocators.productCondition)).toBeVisible();
  24  |     await expect(page.locator(productLocators.productBrand)).toBeVisible();
  25  | }
  26  | );
  27  | 
  28  | 
  29  | test('Search Product', async ({ page }) => {
  30  | 
  31  |     const productPage = new ProductPage(page);
  32  |     await productPage.openProducts();
  33  | 
  34  |     await expect(page).toHaveURL('/products');
  35  |     await productPage.searchProduct(productName);
  36  |     await expect(page.locator(productLocators.searchedProducts)).toBeVisible();
  37  |     await expect(page.locator('p').filter({ hasText: productName }).first()).toBeVisible();
  38  | }
  39  | );
  40  | 
  41  | test('Verify Women category products page', async ({ page }) => {
  42  | 
  43  |     const productPage = new ProductPage(page);
  44  |     await productPage.openProducts();
  45  | 
> 46  |     await expect(page).toHaveURL('/products');
      |                        ^ Error: expect.toHaveURL: Target page, context or browser has been closed
  47  |     await expect(page.locator('.left-sidebar')).toBeVisible();
  48  | 
  49  |     await page.click(productLocators.womenCategory);
  50  |     const categoryText = await page.locator(productLocators.firstWomenSubCategory).textContent();
  51  |     await page.click(productLocators.firstWomenSubCategory);
  52  |     const products = page.locator('.productinfo p');
  53  | 
  54  |     const count = await products.count();
  55  |     for (let i = 0; i < count; i++) {
  56  |         await expect(products.nth(i)).toContainText(categoryText!.trim());
  57  |     }
  58  | });
  59  | 
  60  | test('Add products to Cart and verify Cart', async ({ page }) => {
  61  |     const productsToAdd = [
  62  |         'Blue Top',
  63  |         'Summer White Top',
  64  |         'Men Tshirt',
  65  |         'Summer White Top',
  66  |         'Sleeveless Dress',
  67  |     ];
  68  |     const productPage = new ProductPage(page);
  69  |     await productPage.openProducts();
  70  | 
  71  |     await expect(page).toHaveURL('/products');
  72  |     const addedProducts: any[] = [];
  73  |     const quantityMap: Record<string, number> = {};
  74  | 
  75  |     for (const productName of productsToAdd) {
  76  | 
  77  |         const product = page.locator('.product-image-wrapper', { has: page.locator(`.productinfo p:text-is("${productName}")`) });
  78  | 
  79  |         const price = await product.locator('.productinfo h2').textContent();
  80  |         await product.hover();
  81  |         await product.locator('.add-to-cart').first().click();
  82  |         await expect(page.locator('.modal-content')).toBeVisible();
  83  |         await expect(page.locator('.modal-title')).toContainText('Added!');
  84  |         quantityMap[productName] = (quantityMap[productName] || 0) + 1;
  85  | 
  86  |         const alreadyAdded = addedProducts.some(p => p.name === productName);
  87  | 
  88  |         if (!alreadyAdded) {
  89  | 
  90  |             addedProducts.push({
  91  |                 name: productName,
  92  |                 price: price?.trim()
  93  |             });
  94  |         }
  95  |         await page.click('button:has-text("Continue Shopping")');
  96  |     }
  97  | 
  98  |     await page.click(productLocators.cartBtn);
  99  |     await expect(page).toHaveURL(/view_cart/);
  100 | 
  101 |     for (const product of addedProducts) {
  102 |         const cartRow = page.locator(
  103 |             'tr',
  104 |             {
  105 |                 has: page.locator(
  106 |                     `a:text-is("${product.name}")`
  107 |                 )
  108 |             }
  109 |         );
  110 | 
  111 |         await expect(cartRow).toBeVisible();
  112 |         await expect(cartRow.locator('.cart_price')).toContainText(product.price!);
  113 |         await expect(cartRow.locator('.cart_quantity')).toContainText(String(quantityMap[product.name]));
  114 | 
  115 |         const numericPrice = Number(product.price!.replace('Rs. ', ''));
  116 |         const expectedTotal = numericPrice * quantityMap[product.name];
  117 | 
  118 |         await expect(cartRow.locator('.cart_total')).toContainText(`Rs. ${expectedTotal}`);
  119 |     }
  120 | }
  121 | );
  122 | 
  123 | test('Remove product from cart if exists', async ({ page }) => {
  124 | 
  125 |     await page.click(productLocators.cartBtn);
  126 |     await expect(page).toHaveURL(/view_cart/);
  127 | 
  128 |     const productName = 'Sleeveless Dress';
  129 |     const cartRow = page.locator('#cart_info_table tbody tr', { has: page.locator(`h4 a:text-is("${productName}")`) });
  130 | 
  131 |     const productExists = await cartRow.count();
  132 |     if (productExists > 0) {
  133 |         console.log(`${productName} exists in cart`);
  134 |         await cartRow.locator(productLocators.removeFromCart).click();
  135 | 
  136 |         await expect(cartRow).toHaveCount(0);
  137 |         console.log(`${productName} removed successfully`);
  138 | 
  139 |     } else {
  140 |         console.log(`${productName} product not available in cart`
  141 |         );
  142 |     }
  143 | }
  144 | );
  145 | 
  146 | test('Complete checkout and place order', async ({ page }) => {
```