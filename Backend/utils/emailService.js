import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();
// Configure the email transporter using your .env variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Will be 'nwllabexp@gmail.com'
    pass: process.env.EMAIL_PASS, // Will be your App Password
  },
});


export const sendVerificationSuccessEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: `Land Registry <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '✅ Your Land Registry Account has been Verified!',
    html: `
      <h1>Verification Successful!</h1>
      <p>Hello ${userName},</p>
      <p>Congratulations! Your account on the Land Registry Platform has been approved by the Land Inspector.</p>
      <p><b>You are now ready to log in.</b> Please visit our site and log in with your MetaMask wallet to begin.</p>
      <br><p>Best Regards,<br>The Land Registry Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Approval email sent successfully to: ${userEmail}`);
};

  


export const sendVerificationRejectionEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: `Land Registry <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: '❌ Update on Your Land Registry Account',
    html: `
      <h1>Account Verification Update</h1>
      <p>Hello ${userName},</p>
      <p>We have reviewed your registration for the Land Registry Platform. Unfortunately, we were unable to verify your account with the document provided.</p>
      <p>Please contact support if you believe this is an error.</p>
      <br><p>Best Regards,<br>The Land Registry Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
  console.log(`Rejection email sent successfully to: ${userEmail}`);
};


