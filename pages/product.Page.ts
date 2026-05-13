import { Page } from '@playwright/test';
import { productLocators } from '../locators/productLocators';
import { paymentData } from '../test-data/paymentData';

export class ProductPage {

    constructor(private page: Page) { }

    async openProducts() {
        await this.page.click(productLocators.productsBtn);
    }

    async openFirstProduct() {
        await this.page.click(productLocators.firstViewProduct);
    }

    async searchProduct(product: string) {
        await this.page.fill(
            productLocators.searchInput,
            product
        );
        await this.page.click(productLocators.searchBtn);
    }

    async addFirstProductToCart() {
        await this.page
            .locator(productLocators.addToCart)
            .first()
            .click();
    }

    async fillCardDetails() {
        const card = paymentData.validCard;
        await this.page.fill(productLocators.nameOnCard, card.nameOnCard);
        await this.page.fill(productLocators.cardNumber, card.cardNumber);
        await this.page.fill(productLocators.cvc, card.cvc);
        await this.page.fill(productLocators.expiryMonth, card.expiryMonth);
        await this.page.fill(productLocators.expiryYear, card.expiryYear);
    }
}