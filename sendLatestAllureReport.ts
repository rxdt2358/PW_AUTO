import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { sendAllureReport } from "./utils/sendAllureReport";

async function run() {

    console.log("POST PROCESS STARTED");

    try {

        console.log("Cleaning old allure-results...");

        const resultsPath = path.join(process.cwd(), "allure-results");

        if (fs.existsSync(resultsPath)) {
            fs.rmSync(resultsPath, { recursive: true, force: true });
            console.log("Old allure-results deleted");
        }

        fs.mkdirSync(resultsPath, { recursive: true });
        console.log("Generating Allure report...");

        execSync(
            "npx allure generate allure-results --clean -o allure-report",
            { stdio: "inherit" }
        );

        console.log("REPORT GENERATED");

        // STEP 2: Deploy report (GitHub Pages)
        console.log("Deploying report...");
        // execSync("npm run deploy-allure", { stdio: "inherit" });
        console.log("DEPLOY COMPLETED");

        // STEP 3: Send Email
        const reportUrl = "https://rxdt2358.github.io/playwright-allure-reports/";

        await sendAllureReport(reportUrl);

        console.log("PROCESS COMPLETED");

    } catch (err) {
        console.error("POST PROCESS FAILED:", err);
    }
}

run();