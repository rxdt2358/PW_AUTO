import nodemailer from 'nodemailer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export async function sendReport() {

    console.log('EMAIL PROCESS STARTED');
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

    cloudinary.config({
        cloud_name: 'dznhtzayt',
        api_key: '288882873984235',
        api_secret: 'ddiLqCKjfMCZ1zGB7cvfNSYoDj8'
    });

    console.log('Uploading report to Cloudinary...');

    const uploadResult =
        await cloudinary.uploader.upload(
            './playwright-report/index.html',
            {
                resource_type: 'raw',

                folder: 'playwright-reports',

                public_id:
                    `playwright-report-${Date.now()}`
            }
        );

    console.log('UPLOAD SUCCESSFUL');

    const reportUrl = cloudinary.utils.private_download_url(
        uploadResult.public_id,
        'html',
        {
            resource_type: 'raw',
            type: 'upload',
            attachment: true
        }
    );

    console.log(reportUrl);

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
        },

        debug: true,
        logger: true
    });

    await transporter.verify();

    console.log('SMTP Connected');


    await transporter.sendMail({

        from: 'testphp@mailtest.radixweb.net',

        to: 'diya.pandya@radixweb.com',

        subject: 'Playwright Automation Report',
        html: `
        <div
            style="
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f4f6f8;
            "
        >

            <div
                style="
                    background: white;
                    padding: 25px;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                "
            >

                <h1
                    style="
                        color: #2c3e50;
                        margin-bottom: 10px;
                    "
                >
                    Playwright Automation Report
                </h1>

                <p>
                    Latest automation execution summary
                </p>

                <hr/>

                <table
                    style="
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    "
                >
                    <tr>
                        <td
                            style="
                                background: #3498db;
                                color: white;
                                padding: 15px;
                                text-align: center;
                                border-radius: 8px;
                            "
                        >
                            <h2>${total}</h2>
                            <p>Total</p>
                        </td>

                        <td width="10"></td>
                        <td
                            style="
                                background: #2ecc71;
                                color: white;
                                padding: 15px;
                                text-align: center;
                                border-radius: 8px;
                            "
                        >
                            <h2>${passed}</h2>
                            <p>Passed</p>
                        </td>

                        <td width="10"></td>

                        <td
                            style="
                                background: #e74c3c;
                                color: white;
                                padding: 15px;
                                text-align: center;
                                border-radius: 8px;
                            "
                        >
                            <h2>${failed}</h2>
                            <p>Failed</p>
                        </td>

                        <td width="10"></td>

                        <td
                            style="
                                background: #f39c12;
                                color: white;
                                padding: 15px;
                                text-align: center;
                                border-radius: 8px;
                            "
                        >
                            <h2>${skipped}</h2>
                            <p>Skipped</p>
                        </td>

                    </tr>

                </table>

                <br/>

                <table
                    style="
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    "
                >

                    <tr>
                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                            "
                        >
                            <b>Execution Time</b>
                        </td>

                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                            "
                        >
                            ${new Date().toLocaleString()}
                        </td>
                    </tr>

                    <tr>
                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                            "
                        >
                            <b>Environment</b>
                        </td>

                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                            "
                        >
                            QA
                        </td>
                    </tr>

                    <tr>
                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                            "
                        >
                            <b>Status</b>
                        </td>

                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                                color: ${failed > 0
                ? 'red'
                : 'green'
            };
                                font-weight: bold;
                            "
                        >
                            ${failed > 0
                ? 'FAILED'
                : 'PASSED'
            }
                        </td>
                    </tr>

                    <tr>
                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                            "
                        >
                            <b>Pass Percentage</b>
                        </td>

                        <td
                            style="
                                padding: 10px;
                                border: 1px solid #ddd;
                            "
                        >
                            ${(
                (passed / total) *
                100
            ).toFixed(2)}%
                        </td>
                    </tr>

                </table>

                <br/>

                <h3
                    style="
                        color: #e74c3c;
                    "
                >
                    Failed Tests
                </h3>

                <ul>
                    ${failedTestsHtml}
                </ul>

                <br/>

                <a
                    href="${reportUrl}"

                    target="_blank"
                    style="
                    color: #3498db;
                    text-decoration: underline;
                    font-weight: bold;
                    font-size: 16px;
                "
                >
                    Download HTML Report
                </a>

                <br/><br/>

                <p
                    style="
                        color: #7f8c8d;
                        font-size: 12px;
                    "
                >
                    This is an automated email generated by Playwright Automation Framework.
                </p>

            </div>

        </div>
        `
    });

    console.log(
        'EMAIL SENT SUCCESSFULLY'
    );
}