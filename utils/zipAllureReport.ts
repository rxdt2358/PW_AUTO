import fs from 'fs';
import archiver from 'archiver';

export async function zipAllureReport() {

    const output = fs.createWriteStream('allure-report.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.directory('allure-report/', false);

    await archive.finalize();
    console.log('Allure report zipped successfully');
}