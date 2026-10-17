/** Deployment diagnostics use fixed messages; never serialize driver errors or URLs. */
export function databaseSetupFailure(error: unknown): string {
  const codes = new Set<string>();
  const visit = (value: unknown, depth = 0) => {
    if (!value || typeof value !== "object" || depth > 5) return;
    const record = value as Record<string, unknown>;
    for (const key of ["code", "originalCode"])
      if (typeof record[key] === "string") codes.add(record[key]);
    for (const key of ["cause", "meta", "driverAdapterError", "error"])
      visit(record[key], depth + 1);
  };
  visit(error);
  if (["28P01", "28000", "P1000"].some((code) => codes.has(code)))
    return "DATABASE_URL authentication failed. After a Neon password reset, synchronize the integration connection values with the new password. DIRECT_URL migrations succeeding does not verify DATABASE_URL. No credentials were printed.";
  if (["42P01", "P2021"].some((code) => codes.has(code)))
    return "The application tables were not found through DATABASE_URL. DATABASE_URL and DIRECT_URL must point to the same Neon branch and database. No credentials were printed.";
  if (
    ["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED", "ETIMEDOUT", "P1001"].some(
      (code) => codes.has(code),
    )
  )
    return "DATABASE_URL could not reach PostgreSQL. Check the Neon endpoint, network access and connection settings. No credentials were printed.";
  return "Private owner setup could not query DATABASE_URL. Check its current credentials, TLS settings and that it targets the same database as DIRECT_URL. No credentials were printed.";
}

export function validPostgresConnection(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      ["postgres:", "postgresql:"].includes(url.protocol) &&
      Boolean(url.hostname && url.username && url.pathname.length > 1) &&
      !/^\*+$/.test(decodeURIComponent(url.password)) &&
      !value.includes("\n")
    );
  } catch {
    return false;
  }
}
