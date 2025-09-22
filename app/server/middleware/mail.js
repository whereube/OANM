import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

/**
 * Send a password reset email
 * @param {string} toEmail - Recipient email
 * @param {string} token - Unique password reset token
 */

export async function sendPasswordResetEmail(toEmail, token) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?/${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'Återställning av lösenord',
    html: `
      <p>Hej,</p>
      <p>Du har begärt en länk för att återställa ditt lösenord. Klicka på länken nedan och följ instruktionerna :</p>
      <a href="${resetLink}">Återställ lösenord</a>
      <p>Om du inte har begärt en länk för att återställa ditt lösenord kan du ignorera detta medelande</p>
    `
  };

  await transporter.sendMail(mailOptions);
}