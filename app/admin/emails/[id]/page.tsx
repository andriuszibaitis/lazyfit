import { Card } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import EmailTemplateForm from "../components/email-template-form";

const prisma = new PrismaClient();

async function getEmailTemplate(id: string) {
  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    return template;
  } catch (error) {
    console.error("Error fetching email template:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function EditEmailTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const template = await getEmailTemplate(params.id);

  if (!template) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Redaguoti el. laiško šabloną
        </h1>
        <p className="text-gray-600 mt-2">Šablonas: {template.name}</p>
      </div>

      <Card className="p-6">
        <EmailTemplateForm template={template} />
      </Card>
    </div>
  );
}
