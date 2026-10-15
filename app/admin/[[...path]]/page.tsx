import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminApp } from "@/components/admin-app";
import { adminContent } from "@/data/admin";
import "../admin.css";
export const metadata: Metadata = {
  title: "Elvora Studio — Private administration",
  robots: { index: false, follow: false },
};
export default function AdminPage({ params }: { params: { path?: string[] } }) {
  const section = params.path?.[0] || "dashboard";
  if (
    (params.path?.length || 0) > 1 ||
    ![
      "dashboard",
      "login",
      "security",
      ...adminContent.resources.map((resource) => resource.id),
    ].includes(section)
  )
    notFound();
  return <AdminApp section={section} />;
}
