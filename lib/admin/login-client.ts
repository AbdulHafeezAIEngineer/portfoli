import { adminContent as copy } from "@/data/admin";

export function adminLoginError(code: string | null) {
  if (code === "CredentialsSignin") return copy.loginError;
  if (code === "AdminRateLimited") return copy.loginLimited;
  if (code === "SessionUnavailable") return copy.loginSessionError;
  return copy.loginUnavailable;
}

/** Keep Auth.js CSRF and cookies, while retaining errors instead of navigating away. */
export async function submitAdminLogin(
  fields: { email: string; password: string; code: string },
  request: typeof fetch = fetch,
) {
  const options: RequestInit = {
    credentials: "same-origin",
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(20000),
  };
  const csrfResponse = await request("/api/auth/csrf", options);
  if (!csrfResponse.ok) throw new Error(copy.loginUnavailable);
  const csrf: unknown = await csrfResponse.json();
  if (
    !csrf ||
    typeof csrf !== "object" ||
    !("csrfToken" in csrf) ||
    typeof csrf.csrfToken !== "string"
  )
    throw new Error(copy.loginUnavailable);
  const response = await request("/api/auth/callback/credentials", {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      ...fields,
      csrfToken: csrf.csrfToken,
      json: "true",
      callbackUrl: "/admin",
    }),
  });
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("url" in result) ||
    typeof result.url !== "string"
  )
    throw new Error(copy.loginUnavailable);
  let destination: URL;
  try {
    destination = new URL(result.url, "https://local.invalid");
  } catch {
    throw new Error(copy.loginUnavailable);
  }
  const code = destination.searchParams.get("error");
  if (code) throw new Error(adminLoginError(code));
  if (!response.ok) throw new Error(copy.loginUnavailable);
  // A successful callback response alone does not prove that the browser kept its cookie.
  const session = await request("/api/admin/dashboard", options);
  if (!session.ok)
    throw new Error(
      session.status === 401 ? copy.loginSessionError : copy.loginUnavailable,
    );
}
