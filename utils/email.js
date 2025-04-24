import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

async function sendVerifyEmail(usermail, name, link) {
  await transporter.sendMail({
    from: '"Shivam Sahni 🥺🥺" <shivamsahni507@gmail.com>',
    to: usermail,
    subject: 'Welcome to this application',
    html: `<!DOCTYPE html><html> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <title>Email Notification</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { background: #007bff; color: white; padding: 15px; text-align: center; font-size: 22px; border-radius: 8px 8px 0 0; } .content { padding: 20px; font-size: 16px; color: #333; line-height: 1.5; } .button { display: block; width: 200px; margin: 20px auto; padding: 12px; text-align: center; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; } .footer { text-align: center; font-size: 14px; color: #777; padding: 10px; } </style> </head> <body> <div class="container"> <div class="header">🚀 Notification from c&b freelancers. </div> <div class="content"> <p>Hello <b>${name}.</b>,</p> <p> We wanted to inform you about an important update regarding your account. </p> <p>Please click the button below to verify your account:</p> <a href=${link} class="button">Take Action</a> <p> If you have any questions, feel free to reach out to our support team. </p> </div> <div class="footer">© 2025 C&B Freelancers. All rights reserved.</div> </div> </body></html>`,
  });
}

async function sendForgotPasswordMail(usermail, name, link) {
  await transporter.sendMail({
    from: '"Shivam Sahni 🥺🥺" <shivamsahni507@gmail.com>',
    to: usermail,
    subject: 'Welcome to this application',
    html: `<!DOCTYPE html><html> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <title>Email Notification</title> <style> body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { background: #007bff; color: white; padding: 15px; text-align: center; font-size: 22px; border-radius: 8px 8px 0 0; } .content { padding: 20px; font-size: 16px; color: #333; line-height: 1.5; } .button { display: block; width: 200px; margin: 20px auto; padding: 12px; text-align: center; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px; } .footer { text-align: center; font-size: 14px; color: #777; padding: 10px; } </style> </head> <body> <div class="container"> <div class="header">🚀 Notification from c&b freelancers. </div> <div class="content"> <p>Hello <b>${name}.</b>,</p> <p> We wanted to inform you about an important update regarding your account. </p> <p>Please click the button below to reset your password:</p> <a href=${link} class="button">Take Action</a> <p> If you have any questions, feel free to reach out to our support team. </p> </div> <div class="footer">© 2025 C&B Freelancers. All rights reserved.</div> </div> </body></html>`,
  });
}

// Function to send emails with the original token
const sendBulkVerificationEmails = async (req, res, users, tokensMap) => {
  try {
    const emailPromises = users.map((user) => {
      const token = tokensMap[user.email];
      const verificationLink = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/user/verify/${token}`;

      return sendVerifyEmail(user.email, user.name, verificationLink);
    });

    await Promise.all(emailPromises);
    console.log('All verification emails sent successfully');
  } catch (error) {
    console.error('Error sending bulk verification emails:', error);
  }
};

export { sendVerifyEmail, sendForgotPasswordMail, sendBulkVerificationEmails };
