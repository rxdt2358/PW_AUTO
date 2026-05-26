import nodemailer from "nodemailer";
import fs from "fs";

export async function sendAllureReport(reportUrl: string) {

    console.log("EMAIL STARTED");

    // OPTIONAL: if you have allure-results summary later you can replace this
    const reportPath = './playwright-report/report.json';
    if (!fs.existsSync(reportPath)) {
        throw new Error('report.json not found');
    }
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    const stats = reportData.stats;

    const total =
        stats.expected +
        stats.unexpected +
        stats.skipped;

    const passed = stats.expected;
    const failed = stats.unexpected;
    const skipped = stats.skipped;

    const failedTests: string[] = [];

    function extractFailedTests(
        suites: any[]
    ) {

        for (const suite of suites) {

            if (suite.specs) {

                for (const spec of suite.specs) {

                    for (const test of spec.tests) {

                        if (
                            test.results?.some(
                                (r: any) =>
                                    r.status ===
                                    'failed'
                            )
                        ) {

                            failedTests.push(
                                spec.title
                            );
                        }
                    }
                }
            }

            if (suite.suites) {

                extractFailedTests(
                    suite.suites
                );
            }
        }
    }

    extractFailedTests(
        reportData.suites
    );

    const failedTestsHtml =
        failedTests.length > 0
            ? failedTests
                .map(
                    (test) =>
                        `<li>${test}</li>`
                )
                .join('')
            : '<li>No Failed Tests</li>';

    const transporter = nodemailer.createTransport({
        host: "mail.mailtest.radixweb.net",
        port: 587,
        secure: false,
        auth: {
            user: "testphp@mailtest.radixweb.net",
            pass: "R@dix@web$24"
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    await transporter.verify();
    console.log("SMTP CONNECTED");

    const passPercentage = total > 0
        ? ((passed / total) * 100).toFixed(2)
        : "0";

    await transporter.sendMail({
        from: "testphp@mailtest.radixweb.net",
        to: "diya.pandya@radixweb.com",
        subject: "Playwright Automation Report",

        html: `
        <div style="font-family: Arial; background:#f4f6f8; padding:20px;">

            <div style="max-width:800px;margin:auto;background:white;padding:25px;border-radius:10px;">

                <h2 style="color:#2c3e50;">Automation Execution Report</h2>

                <p style="color:#555;">
                    Latest Playwright + Allure execution summary
                </p>

                <!-- STATUS -->
                <div style="margin:15px 0;">
                    <span style="
                        padding:8px 15px;
                        border-radius:20px;
                        color:white;
                        background:${failed > 0 ? '#e74c3c' : '#2ecc71'};
                        font-weight:bold;
                    ">
                        ${failed > 0 ? "FAILED" : "PASSED"}
                    </span>
                </div>

                <!-- STATS -->
                <table style="width: 100%;border-collapse: collapse;margin-top: 20px;">
                    <tr>
                        <td width="200"
                        style="background:#3498db;color:white;padding:15px;text-align:center;border-radius:10px;display:inline-block;box-sizing:border-box;">
                            <h2>${total}</h2>
                            <p>Total</p>
                        </td>
                        <td width="10"></td>
                        <td  width="200"
                        style="background:#2ecc71;color:white;padding:15px;text-align:center;border-radius:10px;display:inline-block;box-sizing:border-box;">
                            <h2>${passed}</h2>
                            <p>Passed</p>
                        </td>
                        <td width="10"></td>
                        <td  width="200"
                        style="background:#e74c3c;color:white;padding:15px;text-align:center;border-radius:10px;display:inline-block;box-sizing:border-box;">
                            <h2>${failed}</h2>
                            <p>Failed</p>
                        </td>
                        <td width="10"></td>
                        <td  width="200"
                        style="background:#f39c12;color:white;padding:15px;text-align:center;border-radius:10px;display:inline-block;box-sizing:border-box;">
                            <h2>${skipped}</h2>
                            <p>Skipped</p>
                        </td>
                    </tr>
                </table>
                <br/>
                <!-- DETAILS -->
                <table style="width:100%;margin-top:20px;border-collapse:collapse;">
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;"><b>Execution Time</b></td>
                        <td style="padding:10px;border:1px solid #ddd;">${new Date().toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;"><b>Environment</b></td>
                        <td style="padding:10px;border:1px solid #ddd;">QA</td>
                    </tr>
                    <tr>
                        <td style=" padding: 10px;border: 1px solid #ddd;"><b>Status</b></td>
                        <td style=" padding: 10px;border: 1px solid #ddd;color: ${failed > 0 ? 'red' : 'green'};font-weight: bold;">
                            ${failed > 0 ? 'FAILED' : 'PASSED'}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px;border:1px solid #ddd;"><b>Pass %</b></td>
                        <td style="padding:10px;border:1px solid #ddd;">${passPercentage}%</td>
                    </tr>
                </table>

                <!-- FAILED TESTS -->
                <h3 style="color:#e74c3c;margin-top:20px;">Failed Tests</h3>
                <ul>${failedTestsHtml}</ul>

                <!-- BUTTON -->
                <div style="margin-top:25px;">
                    <a href="${reportUrl}"
                        style="
                            background:#3498db;
                            color:white;
                            padding:12px 18px;
                            text-decoration:none;
                            border-radius:6px;
                            display:inline-block;
                            font-weight:bold;
                        ">
                        Open Full Allure Report
                    </a>
                </div>

                <p style="font-size:12px;color:gray;margin-top:20px;">
                    Automated email from Playwright Framework
                </p>

            </div>

        </div>
        `
    });

    console.log("EMAIL SENT SUCCESSFULLY");
}