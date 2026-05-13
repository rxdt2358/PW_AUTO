export const productLocators = {

    // navigation
    productsBtn: 'a[href="/products"]',

    // products
    productsList: '.features_items',
    firstViewProduct: 'a[href="/product_details/1"]',

    // product details
    productName: '.product-information h2',
    productCategory: 'p:has-text("Category")',
    productPrice: '.product-information span span',
    productAvailability: 'text=Availability:',
    productCondition: 'text=Condition:',
    productBrand: 'text=Brand:',

    // search
    searchInput: '#search_product',
    searchBtn: '#submit_search',
    searchedProducts: 'text=Searched Products',
    womenCategory: 'a[href="#Women"]',
    firstWomenSubCategory: 'a[href="/category_products/1"]',

    // cart
    addToCart: '.add-to-cart',
    cartBtn: 'a[href="/view_cart"]',
    removeFromCart: '.cart_quantity_delete',
    checkOutBtn: 'a:has-text("Proceed To Checkout")',
    commentTxtarea: 'textarea[name="message"]',
    placeOrderBtn: 'a:has-text("Place Order")',
    submitOrder: '#submit',
    downloadInvoiceBtn: 'a:has-text("Download Invoice")',
    continueBtn: 'a:has-text("Continue")',

    //card
    nameOnCard: 'input[name="name_on_card"]',
    cardNumber: 'input[name="card_number"]',
    cvc: 'input[name="cvc"]',
    expiryMonth: 'input[name="expiry_month"]',
    expiryYear: 'input[name="expiry_year"]'

} as const;