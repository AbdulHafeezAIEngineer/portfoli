import Image from "next/image";
import { site } from "@/data/site";

export function BrandMark({ brand }: { brand: string }) {
  return (
    <>
      <Image
        className="brand-symbol"
        src={site.logo.src}
        alt=""
        width={44}
        height={44}
        aria-hidden="true"
      />
      {brand}
    </>
  );
}
