// Variables de entorno requeridas en .env:
// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_USER=tu-email@gmail.com
// EMAIL_PASS=tu-app-password  (para Gmail: contraseña de aplicación generada en Google Account > Seguridad)
// EMAIL_FROM="CalmateVibes <noreply@calmatevibes.com>"
// FRONTEND_URL=http://localhost:3000

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: parseInt(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendPasswordResetEmail(email, nombre, resetUrl) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"CalmateVibes" <noreply@calmatevibes.com>',
      to: email,
      subject: 'Restablecer contraseña - CalmateVibes',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecer contraseña</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f8f9fa;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#28a745 0%,#20c997 100%);padding:36px 40px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">
                        CalmateVibes
                      </h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 12px 0;color:#333333;font-size:22px;font-weight:600;">
                        Hola, ${nombre}
                      </h2>
                      <p style="margin:0 0 24px 0;color:#6c757d;font-size:15px;line-height:1.6;">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta en CalmateVibes.
                        Hacé clic en el botón de abajo para crear una nueva contraseña.
                      </p>

                      <!-- Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:8px 0 32px 0;">
                            <a href="${resetUrl}"
                               style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#28a745 0%,#20c997 100%);color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:8px;">
                              Restablecer contraseña
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Warning -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8e1;border-radius:8px;border-left:4px solid #ffc107;">
                        <tr>
                          <td style="padding:16px;">
                            <p style="margin:0;color:#856404;font-size:13px;line-height:1.5;">
                              ⏱ <strong>Este link expira en 10 minutos.</strong><br>
                              Si no solicitaste esto, podés ignorar este email. Tu contraseña actual seguirá siendo la misma.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Fallback URL -->
                      <p style="margin:24px 0 0 0;color:#adb5bd;font-size:12px;line-height:1.5;word-break:break-all;">
                        Si el botón no funciona, copiá y pegá este link en tu navegador:<br>
                        <a href="${resetUrl}" style="color:#28a745;">${resetUrl}</a>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #e9ecef;">
                      <p style="margin:0;color:#adb5bd;font-size:12px;">
                        &copy; 2026 CalmateVibes. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
