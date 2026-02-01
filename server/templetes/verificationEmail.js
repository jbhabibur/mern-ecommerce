export const verificationTemplate = (name, otp, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9f9f9;">
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #000000; padding: 25px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px;">BEMAN</h1>
        </div>
        <div style="padding: 40px; color: #333333; line-height: 1.6;">
          <h2 style="margin-top: 0; color: #000000;">Hello ${name},</h2>
          <p style="font-size: 16px;">Welcome to BEMAN! Please use the One-Time Password (OTP) below to verify your email address and complete your registration.</p>
          
          <div style="background-color: #f4f4f4; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0; border: 1px dashed #764ba2;">
            <div style="font-size: 32px; font-weight: bold; color: #764ba2; letter-spacing: 8px;">${otp}</div>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${verificationUrl}" style="background-color: #000000; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
              Verify Your Account
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666666;">This code is valid for <strong>10 minutes</strong>. If the button above doesn't work, you can ignore this email or contact support.</p>
          
          <p style="font-size: 12px; color: #999999; margin-top: 20px; word-break: break-all;">
            Link not working? Copy this URL: <br>
            <span style="color: #764ba2;">${verificationUrl}</span>
          </p>

          <p style="margin-bottom: 0; margin-top: 30px;">Best regards,<br><strong>The BEMAN Team</strong></p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
          <p style="margin: 0;">&copy; 2026 BEMAN Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
