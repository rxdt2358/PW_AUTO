import fs from 'fs';
import archiver from 'archiver';

export async function zipReport(): Promise<void> {

    return new Promise((resolve, reject) => {

        console.log('Starting ZIP creation...');

        // Check report folder exists
        if (!fs.existsSync('./playwright-report')) {

            reject(
                new Error(
                    'playwright-report folder does not exist'
                )
            );

            return;
        }

        const output =
            fs.createWriteStream('./playwright-report.zip');

        const archive =
            archiver('zip', {
                zlib: { level: 9 }
            });

        archive.pipe(output);

        archive.directory('./playwright-report/', false);

        output.on('close', () => {

            console.log(
                `ZIP created successfully (${archive.pointer()} bytes)`
            );

            resolve();
        });

        output.on('error', (err) => {

            reject(err);
        });

        archive.on('error', (err) => {

            reject(err);
        });

        archive.finalize();
    });
}