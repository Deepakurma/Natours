import nodemailer from "nodemailer";
import AppError from "./appError.js";

const sendEmail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // use SSL/TLS
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Defining email options
    const emailOptions = {
      from: `Deepak <${process.env.EMAIL_USERNAME}>`, // Use email from environment variables
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:
    };

    // Actually send email
    await transporter.sendMail(emailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    next(new AppError("Failed to send email. Please try again later.", 400));
  }
};

export default sendEmail;
