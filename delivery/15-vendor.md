## vendor/README.md

``````md
# Pinned LiquidGlass runtime

`liquidglass-1.0.3.tgz` is the npm-published `@ybouane/liquidglass@1.0.3`.
Source: https://github.com/ybouane/liquidglass (package declares MIT).
The npm artifact was fetched by npm with its normal integrity verification.
Upstream includes a broken `postinstall: patch-package`, but does not ship that
executable or declare it as a runtime dependency. An ordinary isolated install
fails with exit 127. The local tarball removes only that postinstall field from
package.json; every rendering/source/declaration/readme byte is unchanged.
No shaders, license metadata, dependency declarations or exports were altered.
The redundant installer is not replaced by a permissive global script setting.
Other packages’ install scripts and the project’s Prisma setup remain enabled.

The local dependency is locked to this committed tarball, so clean npm installs
and hosting builds do not depend on a modified node_modules directory or CDN.
`liquidglass-upstream-sha256.json` records every original package file. Reverse
the single package.json scripts-field removal to compare that one file.

Original npm tarball SHA-256: `0782673b73b0691198fc8eebf0da2fd78f4949f0eac6536778dbbe721dfa6d10`.

Original npm integrity: `sha512-Ro/Q3vaEduvj1yUp/TVz9AYmxY+cYhnBj76eJ/Y9VQoPlRA0DWrKPQufEzrDSYzAWXL3qxiFibi5XQVW/egTnA==`.

Local sanitized tarball SHA-256: `8bbd8a111db2df98535fa29f4c2598b8004cbb2c08e281e13d9da67ce194d903`.
``````

## vendor/liquidglass-1.0.3.tgz

Binary asset: 153358 bytes. SHA-256 `8bbd8a111db2df98535fa29f4c2598b8004cbb2c08e281e13d9da67ce194d903`. Available in the repository and source ZIP.

## vendor/liquidglass-upstream-sha256.json

``````json
{
  "package/dist/defaults.js": "a1cebef9f279ca772526c7a8641b44f47c9da46ffe957f6facedb183430febab",
  "package/dist/GlassRenderer.js": "8debd5477da9dcfc62eafa22cbdbfeb8e8b64cbd9ba91c49ca3c0f031f79af88",
  "package/dist/HtmlCapture.js": "1b5b9bf9d87bf5d7fe3d9450c55e354457e03ad7901f02c11463bd12b9291cca",
  "package/dist/index.js": "9630e5af0e9c27c3a88a2c4a7096a4f5e0f12e92afc6333f1552835dcc399bed",
  "package/dist/LiquidGlass.js": "d7e8fca64d077ae5e23ea7313d34671fe35dbae20fdf1a19ca83a51c31784f56",
  "package/dist/shaders.js": "e097348d4403b97e1331e8028ae5f731147aeac880fbbb6dc1dd269397129f09",
  "package/package.json": "8d72fec650118873c8bf5202482b668cac2c2151c5bdeed95d956a45364bfa05",
  "package/dist/defaults.d.ts.map": "662f698df4b8772789b27fbec30c31b170a9c271c52d92ceb0125d121b208aa0",
  "package/dist/defaults.js.map": "52f6446e52d5bc420cc8d2eed99a06a13d095343b45c8f0b1585c30a6ff96697",
  "package/dist/GlassRenderer.d.ts.map": "a36b8fa2e8e3c627a51dc60f25dacb41cd9e19e4515af43b405ce03e6609342e",
  "package/dist/GlassRenderer.js.map": "6cbcaaf7b046b2019e04872270886f66ac1b1e83b0a50e3db9a5e8d85b0bc69a",
  "package/dist/HtmlCapture.d.ts.map": "45eb7601c210a0db0bf1805fded36f4e263b59c29cbfca4d44afb7421791ced0",
  "package/dist/HtmlCapture.js.map": "1d6948d0e116269afa5263d7cd90bc4c4913b31dc25fac266e459eebd40a2dd3",
  "package/dist/index.d.ts.map": "bbeee5e0ea38e4c729ad05b1cde7bba1000d81197332b5ba4e5ed26edca6522a",
  "package/dist/index.js.map": "2f55413b91c17fc8723deaaedec5950e95891a43f0b9b9e3184089847ccb8089",
  "package/dist/LiquidGlass.d.ts.map": "0ee8214c62601e9afc4d57627888a9630ac028ab489a414a62fd456713df3e03",
  "package/dist/LiquidGlass.js.map": "85c0bd2332162d96e657c28d824769b27c733d5d1186c0c1b83ab21ae8164c99",
  "package/dist/shaders.d.ts.map": "cacc2b1714e12e9e9a191574f5af5f3f2192f2b7057698e91ca590d1d457a5f6",
  "package/dist/shaders.js.map": "bb1c199c153e2ca488dbb2851b9a4a6d0ca00d85690bf4e12d1869dbe69cb996",
  "package/README.md": "62ebc2666466743fbd0c80a3f9b700622ab6faa5e6f420d4cd3b51f7761659ec",
  "package/dist/defaults.d.ts": "b3340580f2f3e2939c11c98baa19413b4cd5f9ba23155a90844cb9ce2eda0559",
  "package/src/defaults.ts": "3ce5f1a113512ec9176fff6a377dbfdee4d40355ff5024cab5f9c8c4979b08d6",
  "package/dist/GlassRenderer.d.ts": "1186d11fd63a09aaafa6479f1f510f692e89ee217cef09888e88e53e8febec4a",
  "package/src/GlassRenderer.ts": "8a77b115249760bc9328fe12201722f2bd9302aaa5fbb2dbe1f9d341b6e63c2b",
  "package/dist/HtmlCapture.d.ts": "d143e49fa8492562466adf440381e7d017df01b7dc286c5969f820f8a0facb0c",
  "package/src/HtmlCapture.ts": "3106046dc3302715c330e9b1cae6d44918fe12d221bf76358726a28b19a60706",
  "package/dist/index.d.ts": "79e419c019f2663a02a661715e0628ef5b850a5089370741487a664df409457f",
  "package/src/index.ts": "e96a79a19e0d91ea1c48d60b78d894043b8dfe800bfbbfbcf2685c3ae44d7d45",
  "package/dist/LiquidGlass.d.ts": "dc90db211c8b04775e4bf296fa68f880c66d09b4ad02f474135c27ee1ecc1186",
  "package/src/LiquidGlass.ts": "006efc9687789a780e1f41437a320907034309b0207b0689e01d7d4971e3eee6",
  "package/dist/shaders.d.ts": "e5055624010455c364ac31bd76e9e1d3264c67cbe41ff9a24279e2c3711a0445",
  "package/src/shaders.ts": "af0e7034a2f038d7ec06a25fd203179da2a6cfef363e93e7918fa7a120802d5c"
}
``````
