export function getSampleVariables(
  templateName: string
): Record<string, string> {
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
        verificationUrl: `${baseUrl}/auth/el-pasto-patvirtinimas?token=example-token`,
      };
    case "Password Reset":
      return {
        ...common,
        resetUrl: `${baseUrl}/auth/atstatyti-slaptazodi?token=example-token`,
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

export function getAvailableVariables(templateName: string): string[] {
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
