import { Card } from "@/components/ui/card";
import { getAllEmailTemplates } from "@/app/lib/email-templates";
import Link from "next/link";
import { Mail, Edit, Eye } from "lucide-react";

export default async function EmailTemplatesPage() {
  const templates = await getAllEmailTemplates();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          El. laiškų šablonai
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-[#60988E]/10 p-3 rounded-full mr-3">
                  <Mail className="h-5 w-5 text-[#60988E]" />
                </div>
                <h2 className="text-lg font-semibold">{template.name}</h2>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  template.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {template.isActive ? "Aktyvus" : "Neaktyvus"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {template.subject}
            </p>

            <div className="flex justify-between mt-auto">
              <Link
                href={`/admin/emails/${template.id}`}
                className="flex items-center text-[#60988E] hover:underline"
              >
                <Edit className="h-4 w-4 mr-1" />
                Redaguoti
              </Link>
              <Link
                href={`/admin/emails/${template.id}/preview`}
                className="flex items-center text-gray-600 hover:underline"
              >
                <Eye className="h-4 w-4 mr-1" />
                Peržiūrėti
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nėra šablonų</h3>
          <p className="mt-1 text-sm text-gray-500">
            Šablonai bus sukurti automatiškai, kai pirmą kartą bus išsiųstas el.
            laiškas.
          </p>
        </div>
      )}
    </div>
  );
}
