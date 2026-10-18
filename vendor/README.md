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
