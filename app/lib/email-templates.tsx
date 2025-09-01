import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type EmailTemplateType =
  | "verification_email"
  | "password_reset"
  | "welcome_email";

const templateNames: Record<EmailTemplateType, string> = {
  verification_email: "Email Verification",
  password_reset: "Password Reset",
  welcome_email: "Welcome Email",
};

const defaultTemplates: Record<
  EmailTemplateType,
  { subject: string; htmlContent: string; textContent?: string }
> = {
  verification_email: {
    subject: "Patvirtinkite savo el. paštą - LazyFit",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #60988E; text-align: center;">LazyFit</h1>
        <h2 style="color: #333;">Sveiki, {{name}}!</h2>
        <p>Dėkojame už registraciją LazyFit platformoje. Norėdami patvirtinti savo el. paštą, spauskite žemiau esančią nuorodą:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{verificationUrl}}" style="background-color: #60988E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Patvirtinti el. paštą</a>
        </div>
        <p>Jei jūs neregistravotės LazyFit platformoje, ignoruokite šį laišką.</p>
        <p>Nuoroda galioja 24 valandas.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">© {{year}} LazyFit. Visos teisės saugomos.</p>
      </div>
    `,
    textContent: `
      Sveiki, {{name}}!
      
      Dėkojame už registraciją LazyFit platformoje. Norėdami patvirtinti savo el. paštą, apsilankykite šiuo adresu:
      
      {{verificationUrl}}
      
      Jei jūs neregistravotės LazyFit platformoje, ignoruokite šį laišką.
      
      Nuoroda galioja 24 valandas.
      
      © {{year}} LazyFit. Visos teisės saugomos.
    `,
  },
  password_reset: {
    subject: "Slaptažodžio atkūrimas - LazyFit",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #60988E; text-align: center;">LazyFit</h1>
        <h2 style="color: #333;">Sveiki, {{name}}!</h2>
        <p>Gavome prašymą atkurti jūsų slaptažodį. Norėdami nustatyti naują slaptažodį, spauskite žemiau esančią nuorodą:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{resetUrl}}" style="background-color: #60988E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Atkurti slaptažodį</a>
        </div>
        <p>Jei jūs neprašėte atkurti slaptažodžio, ignoruokite šį laišką.</p>
        <p>Nuoroda galioja 1 valandą.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">© {{year}} LazyFit. Visos teisės saugomos.</p>
      </div>
    `,
    textContent: `
      Sveiki, {{name}}!
      
      Gavome prašymą atkurti jūsų slaptažodį. Norėdami nustatyti naują slaptažodį, apsilankykite šiuo adresu:
      
      {{resetUrl}}
      
      Jei jūs neprašėte atkurti slaptažodžio, ignoruokite šį laišką.
      
      Nuoroda galioja 1 valandą.
      
      © {{year}} LazyFit. Visos teisės saugomos.
    `,
  },
  welcome_email: {
    subject: "Sveiki atvykę į LazyFit!",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #60988E; text-align: center;">LazyFit</h1>
        <h2 style="color: #333;">Sveiki, {{name}}!</h2>
        <p>Sveikiname prisijungus prie LazyFit bendruomenės! Esame labai laimingi, kad nusprendėte pradėti savo kelionę link sveikesnio gyvenimo būdo kartu su mumis.</p>
        <p>Štai keletas dalykų, kuriuos galite padaryti jau dabar:</p>
        <ul>
          <li>Užpildykite savo profilį</li>
          <li>Peržiūrėkite mūsų treniruočių katalogą</li>
          <li>Susipažinkite su mitybos planais</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{loginUrl}}" style="background-color: #60988E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Prisijungti prie paskyros</a>
        </div>
        <p>Jei turite klausimų, nedvejodami susisiekite su mumis atsakydami į šį laišką.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">© {{year}} LazyFit. Visos teisės saugomos.</p>
      </div>
    `,
    textContent: `
      Sveiki, {{name}}!
      
      Sveikiname prisijungus prie LazyFit bendruomenės! Esame labai laimingi, kad nusprendėte pradėti savo kelionę link sveikesnio gyvenimo būdo kartu su mumis.
      
      Štai keletas dalykų, kuriuos galite padaryti jau dabar:
      - Užpildykite savo profilį
      - Peržiūrėkite mūsų treniruočių katalogą
      - Susipažinkite su mitybos planais
      
      Prisijungti prie paskyros galite čia: {{loginUrl}}
      
      Jei turite klausimų, nedvejodami susisiekite su mumis atsakydami į šį laišką.
      
      © {{year}} LazyFit. Visos teisės saugomos.
    `,
  },
};

export async function getEmailTemplate(type: EmailTemplateType) {
  try {
    const templateName = templateNames[type];
    let template = await prisma.emailTemplate.findUnique({
      where: {
        name: templateName,
        isActive: true,
      },
    });

    if (!template) {
      const defaultTemplate = defaultTemplates[type];
      template = await prisma.emailTemplate.create({
        data: {
          name: templateName,
          subject: defaultTemplate.subject,
          htmlContent: defaultTemplate.htmlContent,
          textContent: defaultTemplate.textContent,
          isActive: true,
        },
      });
    }

    return template;
  } catch (error) {
    console.error(`Error getting email template ${type}:`, error);
    return {
      subject: defaultTemplates[type].subject,
      htmlContent: defaultTemplates[type].htmlContent,
      textContent: defaultTemplates[type].textContent,
    };
  } finally {
    await prisma.$disconnect();
  }
}

export function replaceTemplateVariables(
  content: string,
  variables: Record<string, string>
): string {
  return Object.entries(variables).reduce((result, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    return result.replace(regex, value);
  }, content);
}

export async function getAllEmailTemplates() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (templates.length < Object.keys(templateNames).length) {
      for (const [type, name] of Object.entries(templateNames)) {
        const exists = templates.some((t) => t.name === name);
        if (!exists) {
          const defaultTemplate = defaultTemplates[type as EmailTemplateType];
          await prisma.emailTemplate.create({
            data: {
              name,
              subject: defaultTemplate.subject,
              htmlContent: defaultTemplate.htmlContent,
              textContent: defaultTemplate.textContent,
              isActive: true,
            },
          });
        }
      }

      return await prisma.emailTemplate.findMany({
        orderBy: {
          name: "asc",
        },
      });
    }

    return templates;
  } catch (error) {
    console.error("Error getting all email templates:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateEmailTemplate(
  id: string,
  data: {
    subject?: string;
    htmlContent?: string;
    textContent?: string;
    isActive?: boolean;
  }
) {
  try {
    return await prisma.emailTemplate.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error(`Error updating email template ${id}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
