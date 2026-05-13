
const nodemailer = require("nodemailer");

export async function sendAllureReport(reportUrl: string) {

    console.log("EMAIL STARTED");

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

    await transporter.sendMail({
        from: "testphp@mailtest.radixweb.net",
        to: "diya.pandya@radixweb.com",
        subject: "Playwright Allure Report",

        html: `
        <div style="font-family: Arial; padding: 20px;">
            <h2>Automation Execution Completed</h2>

            <p>Your latest Playwright + Allure execution is ready.</p>

            <a href="${reportUrl}"
               style="
                    background:#3498db;
                    color:white;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
               ">
                Open Allure Report
            </a>

            <p style="margin-top:20px;font-size:12px;color:gray;">
                This report was generated after manual test execution.
            </p>
        </div>
        `
    });


    console.log("EMAIL SENT SUCCESSFULLY");
}

