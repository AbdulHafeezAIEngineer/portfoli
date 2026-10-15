import internals from "@prisma/internals";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// Pinned Prisma 6.19 compiler: generate the JS driver client using its WASM parser.
// This avoids downloading native query/schema tools just to generate a client.
const generators = await internals.getGenerators({
  schemaPath: "prisma/schema.prisma",
  skipDownload: true,
  registry: {
    "prisma-client-js": {
      type: "rpc",
      generatorPath: require.resolve("@prisma/client/generator-build"),
      isNode: true,
    },
  },
});
for (const generator of generators) {
  try {
    await generator.generate();
  } finally {
    generator.stop();
  }
}
console.log("Prisma JavaScript client generated.");
