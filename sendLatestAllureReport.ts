import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { sendAllureReport } from "./utils/sendAllureReport";

async function run() {

    console.log("POST PROCESS STARTED");

    try {

        const reportPath = path.join(process.cwd(), "allure-report");

        execSync(
            'cmd /c rmdir /s /q allure-report',
            { stdio: 'ignore' }
        );

        console.log("Old allure-report deleted");

        console.log("Generating Allure report...");

        execSync(
            "npx allure generate allure-results --clean -o allure-report",
            { stdio: "inherit" }
        );

        console.log("REPORT GENERATED");
        fs.writeFileSync(
            path.join(reportPath, ".nojekyll"),
            ""
        );
        console.log("Deploying report...");
        execSync("npx gh-pages -d allure-report --dotfiles", { stdio: "inherit" });
        console.log("DEPLOY COMPLETED");
        const reportUrl = "https://rxdt2358.github.io/playwright-allure-reports/";

        await sendAllureReport(reportUrl);
        console.log("PROCESS COMPLETED");

    } catch (err) {
        console.error("POST PROCESS FAILED:", err);
    }
}

run();