import { site } from "@/data/site";

export default function Loading() {
  return <main className="loading-page" role="status"><span className="wordmark">{site.initials}<span>.</span></span><span className="loading-line" /><p>{site.ui.loading}</p></main>;
}
