import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Configure the transporter once
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // Use TLS for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using NodeMailer
 * @param options - Email options (to, subject, text, html)
 */
export async function sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error("Failed to send email");
  }
}

/**
 * Sends an OTP email to the user
 * @param to - User's email address
 * @param name - User's name
 * @param otp - One-Time Password
 */
export async function sendOtpEmail(to: string, name: string, otp: string): Promise<void> {
  const subject = "Your OTP for Verification";
  const text = `Hello ${name},\n\nYour OTP is: ${otp}\n\nIt expires in 10 minutes.\n\nBest,\nYour App Team`;
  const html = `
    <h1>Welcome, ${name}!</h1>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>It expires in 10 minutes.</p>
    <p>Best,<br>Your COURSE-MATE Team</p>
  `;

  await sendEmail({ to, subject, text, html });
}

export async function sendVerificationEmail(to: string, name: string): Promise<void> {
    const subject = "Account Verified";
    const text = `Hello ${name},\n\nYour account has been successfully verified!\n\nBest,\nYour COURSE-MATE Team`;
    const html = `<h1>Congratulations, ${name}!</h1><p>Your account is now verified.</p><p>Best,<br>Your COURSE-MATE Team</p>`;
    await sendEmail({ to, subject, text, html });
}
export async function sendVerificationEmailAdminAndCreator(to: string, name: string,role:string, password:string): Promise<void> {
    const subject = "Account Verified";
    const text = `Hello ${name},\n\nYou are regiter as new ${role}!\n\nBest,\nYour COURSE-MATE Team`;
    const html = `<h1>Congratulations, ${name}!</h1><p>Your account is now verified.</p><p>For login your is password is ${password}</p><p>Best,<br>Your COURSE-MATE Team</p>`;
    await sendEmail({ to, subject, text, html });
}
export async function forgetPasswordConfirmation(
  to: string,
  password: string
): Promise<void> {
  const subject = "Your Password Has Been Reset";
  const text = `
Hello ${name},

Your password for your COURSE-MATE account has been successfully reset. Below is your new password:

New Password: ${password}

Please use this password to log in to your account. For security, we recommend changing it to something memorable as soon as possible after logging in.

If you didn’t request this change, please contact our support team immediately at support@coursemate.com.

Best regards,
The COURSE-MATE Team
  `;
  const html = `
    <h1>Hello ${name},</h1>
    <p>Your password for your COURSE-MATE account has been successfully reset. Here are your updated login details:</p>
    <p><strong>New Password:</strong> ${password}</p>
    <p>Please use this password to <a href="http://localhost:3000/login">log in</a> to your account. For your security, we suggest updating it to a new, personal password in your account settings after logging in.</p>
    <p>If you didn’t initiate this password reset, please reach out to our support team immediately at <a href="mailto:support@coursemate.com">support@coursemate.com</a>.</p>
    <p>Best regards,<br>The COURSE-MATE Team</p>
  `;
  await sendEmail({ to, subject, text, html });
}
