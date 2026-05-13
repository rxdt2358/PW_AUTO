export const signupLocators = {

    entry: {
        name: '[data-qa="signup-name"]',
        email: '[data-qa="signup-email"]',
        signupButton: '[data-qa="signup-button"]'
    },

    form: {
        titleMr: '#id_gender1',
        titleMrs: '#id_gender2',

        password: '#password',

        days: '[data-qa="days"]',
        months: '[data-qa="months"]',
        years: '[data-qa="years"]',

        newsletter: '#newsletter',
        offers: '#optin',

        firstName: '[data-qa="first_name"]',
        lastName: '[data-qa="last_name"]',
        company: '[data-qa="company"]',

        address: '[data-qa="address"]',
        address2: '[data-qa="address2"]',

        country: '[data-qa="country"]',

        state: '[data-qa="state"]',
        city: '[data-qa="city"]',
        zipcode: '[data-qa="zipcode"]',
        mobile: '[data-qa="mobile_number"]',

        createAccountBtn: '[data-qa="create-account"]'
    },
    success: {
        accountCreatedText: 'b:has-text("ACCOUNT CREATED!")',
        continueButton: '[data-qa="continue-button"]'
    }

} as const;