import { Testimonials } from "@/components/testimonials";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getTestimonials } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("testimonials");

export default async function Page() {
  const testimonials = await getTestimonials();
  return (
    <SiteShell page="testimonials">
      <Testimonials testimonials={testimonials} />
    </SiteShell>
  );
}
