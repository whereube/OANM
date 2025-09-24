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
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'Återställning av lösenord',
    html: `
      <p>Hej,</p>
      <p>Du har begärt en länk för att återställa ditt lösenord. Klicka på länken nedan och följ instruktionerna:</p>
      <a href="${resetLink}">Återställ lösenord</a>
      <p>Observera att denna länk endast är giltig till slutet av dagen.</p>
      <p>Om du inte har begärt en länk för att återställa ditt lösenord kan du ignorera detta medelande</p>
    `
  };

  await transporter.sendMail(mailOptions);
}


export async function sendInterestNotification(toEmail, offerName, emailsToInterested) {

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'Nytt intresse för ditt erbjudande ' + offerName,
    html: `
      <div style="text-align: center;">
        <img src="cid:bannerimg" alt="Banner" style="max-width: 100%; height: auto;" />
      </div>
      <p>Hej,</p>
      <p>En annan användare har visat intresse för erbjudandet du har skapat. Nedan står mailadresserna till alla som har markerat sig som intresserade, så att ni kan ta kontakt med varandra och komma igång med att göra det till verklighet</p>
      <p>${emailsToInterested.join('; ')}</p>
      <p>Lycka till!</p>
    `,
    attachments: [
      {
        filename: 'Ecubuntu_logo_resize.png',
        path: './assets/Ecubuntu_logo_resize.png', 
        cid: 'bannerimg' // same cid as in HTML
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}