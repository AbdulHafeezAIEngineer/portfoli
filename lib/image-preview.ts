import { imagePreviews } from "@/data/image-previews";

export function imagePreview(src: string) {
  const blurDataURL = imagePreviews[src];
  return blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {};
}
