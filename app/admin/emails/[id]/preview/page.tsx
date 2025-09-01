import { Card } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSampleVariables } from "@/app/lib/email-templates-utils";
import { replaceTemplateVariables } from "@/app/lib/email-templates";

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

export default async function PreviewEmailTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const template = await getEmailTemplate(params.id);

  if (!template) {
    notFound();
  }

  const variables = getSampleVariables(template.name);

  const htmlContent = replaceTemplateVariables(template.htmlContent, variables);
  const textContent = template.textContent
    ? replaceTemplateVariables(template.textContent, variables)
    : undefined;

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/admin/emails/${params.id}`}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Grįžti į redagavimą
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          El. laiško peržiūra
        </h1>
        <p className="text-gray-600 mt-2">
          Šablonas: {template.name} | Tema: {template.subject}
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-medium mb-2">Laiško tema</h2>
            <p className="bg-gray-50 p-3 rounded-md">{template.subject}</p>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">HTML turinys</h2>
            <div className="border rounded-md overflow-hidden">
              <iframe
                srcDoc={htmlContent}
                className="w-full min-h-[500px]"
                title="Email Preview"
              />
            </div>
          </div>

          {textContent && (
            <div>
              <h2 className="text-lg font-medium mb-4">Tekstinis turinys</h2>
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm border">
                {textContent}
              </pre>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">
              Naudoti kintamieji:
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              {Object.entries(variables).map(([key, value]) => (
                <li key={key}>
                  <strong>{"{{" + key + "}}"}</strong>: {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
