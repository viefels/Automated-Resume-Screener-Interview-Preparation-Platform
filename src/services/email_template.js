const emailTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #1e1f24; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <!-- Main Container -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e1f24; padding: 40px 20px;">
      <tr>
        <td align="center">
          <!-- Email Wrapper -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #141416; border-radius: 8px; overflow: hidden; border: 1px solid #2a2b30;">
            
            <!-- Header -->
            <tr>
              <td style="padding: 32px 40px 20px 40px;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0; display: inline-flex; align-items: center; font-weight: 700; letter-spacing: -0.025em;">
                  <!-- Placeholder for your custom vettKazi SVG logo -->
                  <span style="display: inline-block; width: 24px; height: 24px; background-color: #ffffff; border-radius: 4px; margin-right: 12px;"></span>
                  vettKazi
                </h1>
              </td>
            </tr>

            <!-- Content Body -->
            <tr>
              <td style="padding: 8px 40px 32px 40px; color: #d1d5db; font-size: 15px; line-height: 1.6;">
                <p style="margin: 0 0 24px 0;">Hello,</p>
                
                <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">Verify email</h2>
                
                <p style="margin: 0 0 4px 0;">It looks like you're trying to verify your email on your vettKazi account.</p>
                <p style="margin: 0 0 4px 0;">To verify your account</p>
                <p style="margin: 0 0 24px 0;">and access dashboard, please use the one-time password (OTP) below;</p>

                <!-- OTP Box -->
                <div style="background-color: #24252a; padding: 20px; text-align: center; border-radius: 6px; margin-bottom: 24px;">
                  <span style="color: #ffffff; font-size: 28px; letter-spacing: 2px; font-weight: 500;">${otp}</span>
                </div>

                <p style="margin: 0 0 24px 0;">This code expires in 10 minutes.</p>

                <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                  If you didn't initiate this login attempt, please <a href="#" style="color: #8295e8; text-decoration: none;">change your password</a> or contact our support team immediately via email <a href="mailto:support@vettkazi.com" style="color: #8295e8; text-decoration: none;">support@vettkazi.com</a>
                </p>
              </td>
            </tr>

            <!-- Ad Banner -->
            <tr>
              <td style="padding: 0 40px 32px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border-radius: 8px;">
                  <tr>
                    <td style="padding: 24px 32px;">
                      <h3 style="color: #ffffff; margin: 0 0 12px 0; font-size: 18px; line-height: 1.4; font-weight: 500;">Automated resume screening &<br>interview preparation</h3>
                      
                      <p style="color: #888888; font-size: 14px; margin: 0 0 20px 0;">Designed for applicants and recruiters.</p>
                      
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <a href="#" style="border: 1px solid #333333; padding: 8px 16px; border-radius: 6px; color: #ffffff; font-size: 12px; display: inline-block; text-decoration: none;">Go to Dashboard</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px 40px 40px 40px; text-align: center; color: #888888; font-size: 12px;">
                
                <!-- Social Links Placeholder -->
                <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 0 10px;"><div style="width: 16px; height: 16px; background-color: #6b7280; border-radius: 2px;"></div></td>
                    <td style="padding: 0 10px;"><div style="width: 16px; height: 16px; background-color: #6b7280; border-radius: 2px;"></div></td>
                    <td style="padding: 0 10px;"><div style="width: 16px; height: 16px; background-color: #6b7280; border-radius: 2px;"></div></td>
                    <td style="padding: 0 10px;"><div style="width: 16px; height: 16px; background-color: #6b7280; border-radius: 2px;"></div></td>
                    <td style="padding: 0 10px;">
                      <span style="background-color: #2a2b30; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: 500; font-size: 11px;">vettKazi Blog</span>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 8px 0;">support@vettkazi.com</p>
                <p style="margin: 0;">&copy; 2026. vettKazi. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
}
export default emailTemplate;