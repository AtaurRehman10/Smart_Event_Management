import nodemailer from 'nodemailer';
import config from '../config/env.js';

// Create reusable transporter
const transporter = nodemailer.createTransport({
     host: config.emailHost,
     port: config.emailPort,
     secure: config.emailPort === 465,
     auth: {
          user: config.emailUser,
          pass: config.emailPass,
     },
});

/**
 * Send a welcome email to a newly registered user.
 */
export const sendWelcomeEmail = async (name, email) => {
     const loginUrl = `${config.clientUrl}/login`;

     const html = `
     <!DOCTYPE html>
     <html>
     <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     </head>
     <body style="margin:0; padding:0; background-color:#0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a; padding:40px 20px;">
               <tr>
                    <td align="center">
                         <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #1e1b4b 100%); border-radius:16px; overflow:hidden; border:1px solid rgba(139,92,246,0.2);">
                              <!-- Header -->
                              <tr>
                                   <td style="padding:40px 40px 20px; text-align:center;">
                                        <div style="display:inline-block; width:56px; height:56px; background:linear-gradient(135deg,#8b5cf6,#06b6d4); border-radius:14px; line-height:56px; font-size:28px; color:white;">⚡</div>
                                        <h1 style="margin:16px 0 0; font-size:28px; font-weight:700; background:linear-gradient(135deg,#8b5cf6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">DevCon</h1>
                                   </td>
                              </tr>
                              <!-- Body -->
                              <tr>
                                   <td style="padding:20px 40px 40px;">
                                        <h2 style="margin:0 0 16px; font-size:22px; color:#f1f5f9;">Welcome aboard, ${name}! 🎉</h2>
                                        <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:#94a3b8;">
                                             Your account has been successfully created. You're now part of the DevCon community — discover events, connect with professionals, and make the most of every conference.
                                        </p>
                                        <p style="margin:0 0 30px; font-size:15px; line-height:1.7; color:#94a3b8;">
                                             Here's what you can do next:
                                        </p>
                                        <ul style="margin:0 0 30px; padding-left:20px; font-size:14px; line-height:2; color:#cbd5e1;">
                                             <li>Browse and register for upcoming events</li>
                                             <li>Build your professional profile</li>
                                             <li>Network with attendees and speakers</li>
                                             <li>Join live sessions and polls</li>
                                        </ul>
                                        <!-- CTA Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                             <tr>
                                                  <td align="center">
                                                       <a href="${loginUrl}" style="display:inline-block; padding:14px 36px; background:linear-gradient(135deg,#8b5cf6,#06b6d4); color:#ffffff; font-size:15px; font-weight:600; text-decoration:none; border-radius:10px;">
                                                            Sign In to Your Account
                                                       </a>
                                                  </td>
                                             </tr>
                                        </table>
                                   </td>
                              </tr>
                              <!-- Footer -->
                              <tr>
                                   <td style="padding:20px 40px 30px; border-top:1px solid rgba(148,163,184,0.1); text-align:center;">
                                        <p style="margin:0; font-size:12px; color:#64748b;">
                                             &copy; ${new Date().getFullYear()} DevCon &mdash; Smart Event Management Platform
                                        </p>
                                   </td>
                              </tr>
                         </table>
                    </td>
               </tr>
          </table>
     </body>
     </html>`;

     await transporter.sendMail({
          from: `"DevCon" <${config.emailUser}>`,
          to: email,
          subject: `Welcome to DevCon, ${name}! 🎉`,
          html,
     });
};

export default { sendWelcomeEmail };
