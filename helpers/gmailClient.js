const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");

const gmailConfigs = async () => {
  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
  });

  const accessTokenObject = await oAuth2Client.getAccessToken();
  const accessToken = accessTokenObject?.token;

  return {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.ADMIN_EMAIL_ADDRESS,
      clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
      clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  };
};

const sendMail = async (mailOptions) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporterConfig = await gmailConfigs();

      const transporter = nodemailer.createTransport(transporterConfig);

      await transporter.sendMail(mailOptions);

      resolve();
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
};

async function sendVerificationEmail(email, verificationCode) {
  return new Promise(async (resolve, reject) => {
    try {
      // Tạo nội dung email
      const mailOptions = {
        from: process.env.ADMIN_EMAIL_ADDRESS,
        to: email,
        subject: "Xác nhận tài khoản",
        html: `<h3>Mã xác nhận của bạn là: <strong>${verificationCode}</strong></h3>`,
      };

      await sendMail(mailOptions);

      resolve(true);
    } catch (error) {
      reject({ code: 88888, error });
    }
  });
}

module.exports = {
  sendMail,
  sendVerificationEmail,
};
