import { readExcel } from './excelReader';

export function getSignupUsers() {
    const rawData: any[] = readExcel('test-data/signup.xlsx', 'Sheet1');

    return rawData.map(user => {
        const uniquename = `user_${Date.now()}`;
        const uniqueEmail = `user_${Date.now()}@mail.com`;

        const excelPassword = user.password;

        if (!excelPassword) {
            throw new Error('Password missing in Excel');
        }

        const finalPassword = `${uniquename}_${excelPassword}`;

        return {
            name: uniquename,
            email: uniqueEmail,

            registration: {
                title: user.title,
                password: finalPassword,

                day: String(user.day),
                month: String(user.month),
                year: String(user.year),

                newsletter: user.newsletter === true || user.newsletter === 'TRUE',
                offers: user.offers === true || user.offers === 'TRUE',

                firstName: user.firstName,
                lastName: user.lastName,
                company: user.company,

                address: user.address,
                address2: user.address2,

                country: user.country,

                state: user.state,
                city: user.city,
                zipcode: String(user.zipcode),
                mobile: String(user.mobile)
            }
        };
    });
}