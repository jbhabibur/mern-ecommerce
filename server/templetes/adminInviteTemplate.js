/**
 * @desc Professional HTML template for Admin Invitations
 * @param {string} name - Recipient Name
 * @param {string} role - Assigned Role (super-admin, admin, etc.)
 * @param {string} setupUrl - URL with token for account setup
 */
export const adminInviteTemplate = (name, role, setupUrl) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .footer { font-size: 12px; color: #6b7280; margin-top: 20px; text-align: center; }
        .role-badge { background: #f3f4f6; padding: 4px 10px; border-radius: 4px; font-size: 14px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>Admin Invitation</h1></div>
        <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            <p>You have been invited to join the platform as a <span class="role-badge">${role}</span>.</p>
            <p>To set up your account and password, please click the button below:</p>
            <div style="text-align: center;">
                <a href="${setupUrl}" class="button">Set Up Account</a>
            </div>
            <p>This link is secure and will expire in 24 hours.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p class="footer">If you did not expect this invitation, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
`;
