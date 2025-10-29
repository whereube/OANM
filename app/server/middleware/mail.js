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
  const resetLink = `https://oanm-ecubuntu-b3e74bbc7ba9.herokuapp.com/reset-password/${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: 'Återställning av lösenord',
    html: `
        <div style="text-align: center;">
            <img src="cid:bannerimg" alt="Banner" style="width: auto; max-height: 5%; object-fit: contain;" />
        </div>
        <body style="background-color: #f0f0f0; padding: 20px;">
            <div style="text-align: center; max-width: 80%; margin: auto;">
                <p style="font-size: 26px;">Hej!</p>
                <p>Du har begärt en länk för att återställa ditt lösenord. Klicka på länken nedan och följ instruktionerna:</p>
                <div>
                <a href="${resetLink}" 
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
                    Återställ lösenord
                    </a>
                </div>
                <p>Observera att denna länk endast är giltig till slutet av dagen.</p>
                <p>Om du inte har begärt en länk för att återställa ditt lösenord kan du ignorera detta medelande</p>
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


export async function sendInterestNotification(toEmail, offerName, emailsToInterested, offerId, sentToUserId) {

  const offerLink = `https://oanm-ecubuntu-b3e74bbc7ba9.herokuapp.com/showArticle/offer/${offerId}`;
  const deregisterLink = `https://oanm-ecubuntu-b3e74bbc7ba9.herokuapp.com/unsubscribe/${sentToUserId}`;

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
            <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;" />
            <div style="
                font-family: Arial, sans-serif;
                font-size: 12px;
                color: #777;
                text-align: center;
                line-height: 1.6;
                padding: 10px 20px;
            ">
                <p style="margin: 4px 0;">Om du inte längre vill ta emot dessa mejl, 
                <a href="${deregisterLink}" 
                    style="color: #007BFF; text-decoration: underline;">
                    klicka här för att avregistrera dig
                </a>.
                </p>
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