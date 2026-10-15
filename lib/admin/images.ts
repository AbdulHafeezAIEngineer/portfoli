import "server-only";
import sharp from "sharp";
import { ChatError } from "@/lib/chat/http";
export async function encodePortfolioImage(
  file: Pick<File, "type" | "size" | "arrayBuffer">,
): Promise<Buffer> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 3 * 1024 * 1024 ||
    file.size < 20
  )
    throw new ChatError(
      422,
      "Each image must be JPEG, PNG or WebP, up to 3 MB.",
    );
  try {
    const source = Buffer.from(await file.arrayBuffer());
    const image = sharp(source, {
      limitInputPixels: 24_000_000,
      failOn: "error",
    });
    const meta = await image.metadata();
    if (
      !meta.width ||
      !meta.height ||
      !meta.format ||
      !["jpeg", "png", "webp"].includes(meta.format) ||
      (meta.pages || 1) > 1 ||
      meta.width < 100 ||
      meta.height < 100
    )
      throw new Error();
    return await image
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 86 })
      .toBuffer();
  } catch {
    throw new ChatError(
      422,
      "One image could not be safely decoded. Use a static JPEG, PNG or WebP.",
    );
  }
}
