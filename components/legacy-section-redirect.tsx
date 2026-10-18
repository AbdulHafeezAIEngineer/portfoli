"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { legacySections } from "@/data/navigation";

/** Keep saved links to the former one-page portfolio useful. */
export function LegacySectionRedirect() {
  const router = useRouter();
  useEffect(() => {
    const sync = () => {
      const destination = legacySections[window.location.hash];
      if (destination) router.replace(destination);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [router]);
  return null;
}
