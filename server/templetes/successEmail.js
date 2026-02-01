export const successTemplate = (name) => {
  // Use the env variable if it exists, otherwise default to localhost
  const loginUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/account/login`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background-color: #22c55e; padding: 30px; text-align: center; color: white; }
        .body { padding: 40px; background-color: #ffffff; color: #333; line-height: 1.6; text-align: center; }
        .success-icon { font-size: 50px; color: #22c55e; margin-bottom: 20px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
        .button { display: inline-block; padding: 12px 25px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Account Verified!</h1>
        </div>
        <div class="body">
          <div class="success-icon">✔</div>
          <h2>Congratulations, ${name}!</h2>
          <p>Your email address has been successfully verified. Your <strong>BEMAN</strong> account is now fully active.</p>
          <p>You can now explore our collections, manage your profile, and start shopping.</p>
          
          <a href="${loginUrl}" class="button">Go to Login</a>
          
          <p style="margin-top: 30px;">Welcome to the family!<br>The BEMAN Team</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 BEMAN Ecommerce. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
