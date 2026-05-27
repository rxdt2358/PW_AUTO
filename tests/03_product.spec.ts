import { test, expect } from '../fixtures/fixture';
import { ProductPage } from '../pages/product.Page';
import { productLocators } from '../locators/productLocators';

const productName = 'Blue Top';
test.use({ storageState: 'playwright/.auth/user.json' });

test.beforeEach(async ({ page }) => {
    await page.route('**/*', route => {
        const url = route.request().url();
        if (
            url.includes('google_vignette') ||
            url.includes('adsbygoogle') ||
            url.includes('aswift')
        ) {
            route.abort();
        } else {
            route.continue();
        }
    });

    await page.goto('/');
});


test('Verify All Products and product detail page', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.openProducts();

    await expect(page).toHaveURL('/products', { timeout: 20000 });
    // const currentUrl = page.url();
    // console.log(currentUrl);

    await expect(page.locator(productLocators.productsList)).toBeVisible();

    await productPage.openFirstProduct();
    await expect(page).toHaveURL(/product_details/);
    await expect(page.locator(productLocators.productName)).toBeVisible();
    await expect(page.locator(productLocators.productCategory)).toBeVisible();
    await expect(page.locator(productLocators.productPrice)).toBeVisible();
    await expect(page.locator(productLocators.productAvailability)).toBeVisible();
    await expect(page.locator(productLocators.productCondition)).toBeVisible();
    await expect(page.locator(productLocators.productBrand)).toBeVisible();
}
);


test('Search Product', async ({ page }) => {

    const productPage = new ProductPage(page);
    await productPage.openProducts();

    await expect(page).toHaveURL('/products');
    await productPage.searchProduct(productName);
    await expect(page.locator(productLocators.searchedProducts)).toBeVisible();
    await expect(page.locator('p').filter({ hasText: productName }).first()).toBeVisible();
}
);

test('Verify Women category products page', async ({ page }) => {

    const productPage = new ProductPage(page);
    await productPage.openProducts();

    await expect(page).toHaveURL('/products');
    await expect(page.locator('.left-sidebar')).toBeVisible();

    await page.click(productLocators.womenCategory);
    const categoryText = await page.locator(productLocators.firstWomenSubCategory).textContent();
    await page.click(productLocators.firstWomenSubCategory);
    const products = page.locator('.productinfo p');

    const count = await products.count();
    for (let i = 0; i < count; i++) {
        await expect(products.nth(i)).toContainText(categoryText!.trim());
    }
});

test('Add products to Cart and verify Cart', async ({ page }) => {
    const productsToAdd = [
        'Blue Top',
        'Summer White Top',
        'Men Tshirt',
        'Summer White Top',
        'Sleeveless Dress',
    ];
    const productPage = new ProductPage(page);
    await productPage.openProducts();

    await expect(page).toHaveURL('/products');
    const addedProducts: any[] = [];
    const quantityMap: Record<string, number> = {};

    for (const productName of productsToAdd) {

        const product = page.locator('.product-image-wrapper', { has: page.locator(`.productinfo p:text-is("${productName}")`) });

        const price = await product.locator('.productinfo h2').textContent();
        await product.hover();
        await product.locator('.add-to-cart').first().click();
        await expect(page.locator('.modal-content')).toBeVisible();
        await expect(page.locator('.modal-title')).toContainText('Added!');
        quantityMap[productName] = (quantityMap[productName] || 0) + 1;

        const alreadyAdded = addedProducts.some(p => p.name === productName);

        if (!alreadyAdded) {

            addedProducts.push({
                name: productName,
                price: price?.trim()
            });
        }
        await page.click('button:has-text("Continue Shopping")');
    }

    await page.click(productLocators.cartBtn);
    await expect(page).toHaveURL(/view_cart/);

    for (const product of addedProducts) {
        const cartRow = page.locator(
            'tr',
            {
                has: page.locator(`a:text-is("${product.name}")`)
            }
        );

        await expect(cartRow).toBeVisible();
        await expect(cartRow.locator('.cart_price')).toContainText(product.price!);
        await expect(cartRow.locator('.cart_quantity')).toContainText(String(quantityMap[product.name]));

        const numericPrice = Number(product.price!.replace('Rs. ', ''));
        const expectedTotal = numericPrice * quantityMap[product.name];

        await expect(cartRow.locator('.cart_total')).toContainText(`Rs. ${expectedTotal}`);
    }
}
);

test('Remove product from cart if exists', async ({ page }) => {

    await page.click(productLocators.cartBtn);
    await expect(page).toHaveURL(/view_cart/);

    const productName = 'Sleeveless Dress';
    const cartRow = page.locator('#cart_info_table tbody tr', { has: page.locator(`h4 a:text-is("${productName}")`) });

    const productExists = await cartRow.count();
    if (productExists > 0) {
        console.log(`${productName} exists in cart`);
        await cartRow.locator(productLocators.removeFromCart).click();

        await expect(cartRow).toHaveCount(0);
        console.log(`${productName} removed successfully`);

    } else {
        console.log(`${productName} product not available in cart`
        );
    }
}
);

test('Complete checkout and place order', async ({ page }) => {

    const productPage = new ProductPage(page);

    const productsToAdd = [
        'Blue Top',
        'Summer White Top',
        'Sleeveless Dress'
    ];

    await productPage.openProducts();

    for (const productName of productsToAdd) {

        const product = page.locator('.product-image-wrapper', { has: page.locator(`.productinfo p:text-is("${productName}")`) });

        await product.hover();
        await product.locator('.add-to-cart').first().click();
        await expect(page.locator('.modal-content')).toBeVisible();
        await page.click('button:has-text("Continue Shopping")');
    }

    await page.click(productLocators.cartBtn);
    await expect(page).toHaveURL(/view_cart/);
    await page.click(productLocators.checkOutBtn);

    await expect(page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your delivery address' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your billing address' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();

    for (const productName of productsToAdd) {
        await expect(page.locator(`a:text-is("${productName}")`)).toBeVisible();
    }

    await page.fill(productLocators.commentTxtarea, 'Automation order comment');
    await page.click(productLocators.placeOrderBtn);
    await expect(page).toHaveURL(/payment/);

    await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();
    await productPage.fillCardDetails();

    await page.click(productLocators.submitOrder);
    await expect(page.locator('text=Order Placed!')).toBeVisible();
    await expect(page.getByText('Congratulations! Your order has been confirmed!', { exact: true })).toBeVisible();


    const downloadPromise = page.waitForEvent('download');

    await page.click(productLocators.downloadInvoiceBtn);
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.txt');

    await page.click(productLocators.continueBtn);
    await expect(page).toHaveURL('/');
}
);

