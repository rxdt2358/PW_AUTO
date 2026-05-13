import { writeToExcel } from './excelWriter';
import { readExcel } from '../utils/excelReader';
const FILE_PATH = 'test-data/createdUsers.xlsx';
const SHEET_NAME = 'Users';


export function saveUser(user: any) {
    writeToExcel(FILE_PATH, SHEET_NAME, {
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: new Date().toISOString()
    });
}
export function getUsers() {
    return readExcel(FILE_PATH, SHEET_NAME);
}


export function getUser(username: string) {
    const users: any[] = readExcel(
        FILE_PATH,
        SHEET_NAME
    );

    const user = users.find(
        user => user.email === username
    );

    if (!user) {
        throw new Error(
            `User "${username}" not found`
        );
    }

    return user;
}