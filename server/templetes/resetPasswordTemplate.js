export const resetPasswordTemplate = (name, resetUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #000; text-align: center;">Password Reset Request</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We received a request to reset your password for your BEMAN account. Click the button below to proceed:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Reset My Password
        </a>
      </div>
      <p>This link is valid for <strong>15 minutes</strong> only. If you did not request this, please ignore this email or contact support if you have concerns.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.8em; color: #777; text-align: center;">
        &copy; ${new Date().getFullYear()} BEMAN Inc. All rights reserved.
      </p>
    </div>
  `;
};
