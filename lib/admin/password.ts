export function strongPassword(password: string): boolean {
  return (
    password.length >= 14 &&
    Buffer.byteLength(password, "utf8") <= 72 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

/** Return requirements only, never the submitted password or its contents. */
export function passwordRequirements(password: string | undefined): string[] {
  if (!password) return ["a privately chosen ADMIN_PASSWORD"];
  return [
    password.length < 14 ? "at least 14 characters" : "",
    Buffer.byteLength(password, "utf8") > 72 ? "at most 72 UTF-8 bytes" : "",
    !/[a-z]/.test(password) ? "a lowercase letter" : "",
    !/[A-Z]/.test(password) ? "an uppercase letter" : "",
    !/\d/.test(password) ? "a number" : "",
    !/[^A-Za-z0-9]/.test(password) ? "a symbol" : "",
  ].filter(Boolean);
}
