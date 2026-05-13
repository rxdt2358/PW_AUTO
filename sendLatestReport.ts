import { sendReport } from './utils/sendReport';

async function sendLatestReport() {

    try {
        await sendReport();
        console.log('EMAIL STEP COMPLETED');

    } catch (error) {

        console.error('FULL ERROR : ');
        console.error(error);
    }
}
sendLatestReport();

//npx ts-node sendLatestReport.ts