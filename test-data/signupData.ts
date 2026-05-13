export const signupTestData = {
    emptyName: {
        name: '',
        email: 'validuser@mail.com'
    },

    emptyEmail: {
        name: 'Test User',
        email: ''
    },

    invalidEmails: [
        {
            name: 'Test User',
            email: 'abc.com',
            expectedMessage: "Please include an '@' in the email address. 'abc.com' is missing an '@'."
        },
        {
            name: 'Test User',
            email: 'test@',
            expectedMessage: "Please enter a part following '@'. 'test@' is incomplete."
        },
    ],

    validUser:
    {
        name: 'Valid User',
        email: `test${Date.now()}@mail.com`
    }
};