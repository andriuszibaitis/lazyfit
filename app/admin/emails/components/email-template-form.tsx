"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Save, Send, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailTemplateFormProps {
  template: {
    id: string;
    name: string;
    subject: string;
    htmlContent: string;
    textContent: string | null;
    isActive: boolean;
  };
}

export default function EmailTemplateForm({
  template,
}: EmailTemplateFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: template.subject,
    htmlContent: template.htmlContent,
    textContent: template.textContent || "",
    isActive: template.isActive,
  });
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const availableVariables = getAvailableVariables(template.name);

  useEffect(() => {
    updatePreview();
  }, [formData.htmlContent, formData.textContent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const updatePreview = async () => {
    try {
      const response = await fetch("/api/admin/email-templates/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent: formData.htmlContent,
          textContent: formData.textContent,
          variables: getSampleVariables(template.name),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewHtml(data.htmlContent);
        setPreviewText(data.textContent || "");
      }
    } catch (error) {
      console.error("Error updating preview:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/email-templates/${template.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Šablonas sėkmingai atnaujintas" });
        router.refresh();
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida atnaujinant šabloną: ${error}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Klaida atnaujinant šabloną: ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: "error", text: "Įveskite el. pašto adresą" });
      return;
    }

    setIsSending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/email-templates/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: testEmail,
          subject: formData.subject,
          htmlContent: formData.htmlContent,
          textContent: formData.textContent,
          variables: getSampleVariables(template.name),
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Bandomasis laiškas išsiųstas į ${testEmail}`,
        });
      } else {
        const error = await response.text();
        setMessage({
          type: "error",
          text: `Klaida siunčiant bandomąjį laišką: ${error}`,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Klaida siunčiant bandomąjį laišką: ${error}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <Link
          href="/admin/emails"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Grįžti į šablonų sąrašą
        </Link>
      </div>

      {message && (
        <Alert
          className={`mb-6 ${
            message.type === "success" ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <AlertCircle
            className={
              message.type === "success" ? "text-green-600" : "text-red-600"
            }
          />
          <AlertTitle>
            {message.type === "success" ? "Sėkmingai" : "Klaida"}
          </AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Šablono būsena</h3>
            <p className="text-sm text-gray-500">
              Aktyvus šablonas bus naudojamas siunčiant el. laiškus
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">
              {formData.isActive ? "Aktyvus" : "Neaktyvus"}
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Laiško tema</Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Laiško turinys</Label>
            <div className="text-sm text-gray-500">
              Galimi kintamieji:{" "}
              {availableVariables.map((v) => `{{${v}}}`).join(", ")}
            </div>
          </div>

          <Tabs defaultValue="html">
            <TabsList>
              <TabsTrigger value="html">HTML turinys</TabsTrigger>
              <TabsTrigger value="text">Tekstinis turinys</TabsTrigger>
              <TabsTrigger value="preview">Peržiūra</TabsTrigger>
              <TabsTrigger value="test">Testavimas</TabsTrigger>
            </TabsList>

            <TabsContent value="html">
              <Textarea
                id="htmlContent"
                name="htmlContent"
                value={formData.htmlContent}
                onChange={handleChange}
                className="min-h-[400px] font-mono text-sm"
                required
              />
            </TabsContent>

            <TabsContent value="text">
              <Textarea
                id="textContent"
                name="textContent"
                value={formData.textContent}
                onChange={handleChange}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Tekstinė laiško versija (neprivaloma)"
              />
            </TabsContent>

            <TabsContent value="preview">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">HTML peržiūra:</h3>
                  <div className="border p-4 rounded-md bg-white">
                    <iframe
                      srcDoc={previewHtml}
                      className="w-full min-h-[400px]"
                      title="Email Preview"
                    />
                  </div>
                </div>

                {previewText && (
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Tekstinė peržiūra:</h3>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm">
                      {previewText}
                    </pre>
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={updatePreview}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Atnaujinti peržiūrą
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="test">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testEmail">Bandomojo laiško gavėjas</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="testEmail"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="pavyzdys@gmail.com"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={sendTestEmail}
                      disabled={isSending || !testEmail}
                      className="flex items-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? "Siunčiama..." : "Siųsti bandomąjį laišką"}
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-2">Pastaba:</h3>
                  <p className="text-sm text-yellow-700">
                    Bandomasis laiškas bus išsiųstas su dabartiniais šablono
                    pakeitimais, net jei jie dar neišsaugoti. Laiško tema bus
                    pradėta su [TESTAS] prefiksu.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/emails")}
          >
            Atšaukti
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Išsaugoma..." : "Išsaugoti pakeitimus"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function getAvailableVariables(templateName: string): string[] {
  const commonVariables = ["name", "year"];

  switch (templateName) {
    case "Email Verification":
      return [...commonVariables, "verificationUrl"];
    case "Password Reset":
      return [...commonVariables, "resetUrl"];
    case "Welcome Email":
      return [...commonVariables, "loginUrl"];
    default:
      return commonVariables;
  }
}

function getSampleVariables(templateName: string): Record<string, string> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const currentYear = new Date().getFullYear().toString();

  const common = {
    name: "Jonas Jonaitis",
    year: currentYear,
  };

  switch (templateName) {
    case "Email Verification":
      return {
        ...common,
        verificationUrl: `${baseUrl}/auth/verify-email?token=example-token`,
      };
    case "Password Reset":
      return {
        ...common,
        resetUrl: `${baseUrl}/auth/reset-password?token=example-token`,
      };
    case "Welcome Email":
      return {
        ...common,
        loginUrl: `${baseUrl}/auth/prisijungti`,
      };
    default:
      return common;
  }
}
