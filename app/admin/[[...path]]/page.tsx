import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { AdminApp } from "@/components/admin-app";
import { adminContent } from "@/data/admin";
import "../admin.css";
export const metadata: Metadata = {
  title: "Elvora Studio — Private administration",
  robots: { index: false, follow: false },
};
export default async function AdminPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const section = (await params).path?.[0] || "dashboard";
  if (
    ((await params).path?.length || 0) > 1 ||
    ![
      "dashboard",
      "login",
      "security",
      ...adminContent.resources.map((resource) => resource.id),
    ].includes(section)
  )
    notFound();
  if (section !== "login") {
    try {
      await requireAdmin();
    } catch {
      redirect("/admin/login");
    }
  }
  return <AdminApp section={section} />;
}
