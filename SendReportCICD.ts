import { sendAllureReport } from "./utils/sendAllureReport";

async function run() {
    console.log("POST PROCESS STARTED");

    try {
        const reportUrl = "https://rxdt2358.github.io/PW_AUTO/";

        await sendAllureReport(reportUrl);

        console.log("PROCESS COMPLETED");

    } catch (err) {
        console.error("POST PROCESS FAILED:", err);
        process.exit(1);
    }
}

run();