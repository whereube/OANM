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


export async function sendInterestNotification(toEmail, offerName, emailsToInterested, offerId) {

  const offerLink = `${process.env.FRONTEND_URL}/showArticle/offer/${offerId}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'Nytt intresse för ditt erbjudande ' + offerName,
    html: `
        <div style="text-align: center;">
            <img src="cid:bannerimg" alt="Banner" style="width: auto; max-height: 5%; object-fit: contain;" />
        </div>
        <body style="background-color: #f0f0f0; padding: 20px;">
            <div style="text-align: center; max-width: 80%; margin: auto;">
                <p style="font-size: 26px;">Hej!</p>
                <p>En användare har visat intresse för ditt erbjudande: </p>
                <div>
                    <a 
                    href="${offerLink}" 
                    style="
                        display: inline-block;
                        padding: 16px 24px;
                        margin: 10px 0;
                        border: 2px solid rgb(15, 16, 16);
                        border-radius: 8px;
                        background-color: #f0f8ff;
                        color: rgb(0, 0, 0);
                        font-size: 18px;
                        font-weight: bold;
                        text-decoration: none;
                        font-family: Arial, sans-serif;
                        box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
                    "
                    >
                    ${offerName}
                    </a>
                </div>
                <p>Nedan står mailadresserna till alla som har markerat sig som intresserade, så att ni kan ta kontakt med varandra och komma igång med att göra det till verklighet</p>
                <p style="font-size: 16px;">${emailsToInterested};</p>
                <p>Lycka till!</p>
            </div>
        </body>
    `,
    attachments: [
      {
        filename: 'Ecubuntu_logo_resize.png',
        path: './assets/Ecubuntu_logo_resize_150px.png', 
        cid: 'bannerimg' // same cid as in HTML
      }
    ]
  };

  await transporter.sendMail(mailOptions);
}