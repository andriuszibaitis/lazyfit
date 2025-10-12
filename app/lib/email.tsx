// @ts-ignore
import nodemailer from "nodemailer";
import {
  getEmailTemplate,
  replaceTemplateVariables,
  type EmailTemplateType,
} from "./email-templates";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  logger: process.env.NODE_ENV === "development",
  debug: process.env.NODE_ENV === "development",
});

export async function verifyEmailConnection() {
  try {
    const verification = await transporter.verify();
    console.log("El. pašto serverio ryšys veikia:", verification);
    return verification;
  } catch (error) {
    console.error("El. pašto serverio ryšio klaida:", error);
    return false;
  }
}

export async function sendVerificationEmail(
  to: string,
  verificationUrl: string,
  name = ""
) {
  console.log(`Bandoma siųsti patvirtinimo laišką į: ${to}`);
  console.log(`Patvirtinimo URL: ${verificationUrl}`);

  try {
    const template = await getEmailTemplate("verification_email");

    const variables = {
      name: name || "vartotojau",
      verificationUrl,
      year: new Date().getFullYear().toString(),
    };

    const htmlContent = replaceTemplateVariables(
      template.htmlContent,
      variables
    );
    const textContent = template.textContent
      ? replaceTemplateVariables(template.textContent, variables)
      : undefined;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: template.subject,
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("El. laiškas išsiųstas:", info.messageId);
    return info;
  } catch (error) {
    console.error("El. laiško siuntimo klaida:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  name = ""
) {
  try {
    const template = await getEmailTemplate("password_reset");

    const variables = {
      name: name || "vartotojau",
      resetUrl,
      year: new Date().getFullYear().toString(),
    };

    const htmlContent = replaceTemplateVariables(
      template.htmlContent,
      variables
    );
    const textContent = template.textContent
      ? replaceTemplateVariables(template.textContent, variables)
      : undefined;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: template.subject,
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Slaptažodžio atkūrimo laiškas išsiųstas:", info.messageId);
    return info;
  } catch (error) {
    console.error("Slaptažodžio atkūrimo laiško siuntimo klaida:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(to: string, name = "") {
  try {
    const template = await getEmailTemplate("welcome_email");

    const variables = {
      name: name || "vartotojau",
      loginUrl: `${process.env.NEXTAUTH_URL}/auth/prisijungti`,
      year: new Date().getFullYear().toString(),
    };

    const htmlContent = replaceTemplateVariables(
      template.htmlContent,
      variables
    );
    const textContent = template.textContent
      ? replaceTemplateVariables(template.textContent, variables)
      : undefined;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: template.subject,
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Pasveikinimo laiškas išsiųstas:", info.messageId);
    return info;
  } catch (error) {
    console.error("Pasveikinimo laiško siuntimo klaida:", error);
    throw error;
  }
}

export async function sendNewUserEmail(
  to: string,
  name = "",
  password: string
) {
  try {
    const subject = "Jūsų LazyFit paskyra sukurta";
    const loginUrl = `${process.env.NEXTAUTH_URL}/auth/prisijungti`;
    const year = new Date().getFullYear().toString();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #60988E; text-align: center;">LazyFit</h1>
        <h2 style="color: #333;">Sveiki, ${name || "vartotojau"}!</h2>
        <p>Jums buvo sukurta paskyra LazyFit platformoje. Štai jūsų prisijungimo duomenys:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>El. paštas:</strong> ${to}</p>
          <p><strong>Laikinas slaptažodis:</strong> ${password}</p>
        </div>
        <p>Rekomenduojame prisijungus iš karto pasikeisti slaptažodį.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #60988E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Prisijungti</a>
        </div>
        <p>Jei turite klausimų, nedvejodami susisiekite su mumis.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">© ${year} LazyFit. Visos teisės saugomos.</p>
      </div>
    `;

    const textContent = `
      Sveiki, ${name || "vartotojau"}!
      
      Jums buvo sukurta paskyra LazyFit platformoje. Štai jūsų prisijungimo duomenys:
      
      El. paštas: ${to}
      Laikinas slaptažodis: ${password}
      
      Rekomenduojame prisijungus iš karto pasikeisti slaptažodį.
      
      Prisijungti galite čia: ${loginUrl}
      
      Jei turite klausimų, nedvejodami susisiekite su mumis.
      
      © ${year} LazyFit. Visos teisės saugomos.
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Naujo vartotojo laiškas išsiųstas:", info.messageId);
    return info;
  } catch (error) {
    console.error("Naujo vartotojo laiško siuntimo klaida:", error);
    throw error;
  }
}

export async function sendEmail(
  to: string,
  templateType: EmailTemplateType,
  variables: Record<string, string>
) {
  try {
    const template = await getEmailTemplate(templateType);

    if (!variables.year) {
      variables.year = new Date().getFullYear().toString();
    }

    const htmlContent = replaceTemplateVariables(
      template.htmlContent,
      variables
    );
    const textContent = template.textContent
      ? replaceTemplateVariables(template.textContent, variables)
      : undefined;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: template.subject,
      html: htmlContent,
      text: textContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`El. laiškas (${templateType}) išsiųstas:`, info.messageId);
    return info;
  } catch (error) {
    console.error(`El. laiško (${templateType}) siuntimo klaida:`, error);
    throw error;
  }
}

export async function sendDeleteVerificationCode(email: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'LazyFit - Paskyros trynimo patvirtinimas',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Paskyros trynimo patvirtinimas</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #60988E;">LazyFit - Paskyros trynimo patvirtinimas</h2>

            <p>Sveiki,</p>

            <p>Gavome prašymą ištrinti jūsų LazyFit paskyrą. Jei tai tikrai jūs, naudokite žemiau pateiktą patvirtinimo kodą:</p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h3 style="margin: 0; font-size: 24px; color: #60988E; letter-spacing: 2px;">${code}</h3>
            </div>

            <p><strong>Svarbu:</strong> Šis kodas galioja 15 minučių.</p>

            <p>Jei tai ne jūs prašėte ištrinti paskyrą, ignoruokite šį laišką. Jūsų paskyra liks saugi.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <p style="color: #666; font-size: 14px;">
              Su pagarba,<br>
              LazyFit komanda
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      LazyFit - Paskyros trynimo patvirtinimas

      Sveiki,

      Gavome prašymą ištrinti jūsų LazyFit paskyrą. Jei tai tikrai jūs, naudokite patvirtinimo kodą: ${code}

      Šis kodas galioja 15 minučių.

      Jei tai ne jūs prašėte ištrinti paskyrą, ignoruokite šį laišką.

      Su pagarba,
      LazyFit komanda
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification code sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
