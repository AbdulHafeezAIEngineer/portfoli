"""Refresh the reviewable source snapshot without private/local runtime files."""
from pathlib import Path
import hashlib
import zipfile

ROOT = Path(__file__).resolve().parents[1]
EXCLUDE = {".git", ".next", "node_modules", "delivery", "coverage", "out", "__pycache__"}
files = []
for path in sorted(ROOT.rglob("*")):
    relative = path.relative_to(ROOT)
    if not path.is_file() or any(part in EXCLUDE for part in relative.parts):
        continue
    if path.name.startswith(".env") and path.name != ".env.example":
        continue
    if path.name == "next-env.d.ts" or path.name.endswith((".log", ".tsbuildinfo")):
        continue
    files.append(path)

delivery = ROOT / "delivery"
delivery.mkdir(exist_ok=True)
groups = [("root", [path for path in files if len(path.relative_to(ROOT).parts) == 1])]
groups += [(name, [path for path in files if path.relative_to(ROOT).parts[0] == name]) for name in sorted({path.relative_to(ROOT).parts[0] for path in files if len(path.relative_to(ROOT).parts) > 1})]
links = []
for number, (name, paths) in enumerate(groups, 1):
    destination = f"{number:02d}-{name}.md"
    chunks = []
    for path in paths:
        relative = path.relative_to(ROOT).as_posix()
        data = path.read_bytes()
        try:
            content = data.decode("utf-8")
        except UnicodeDecodeError:
            chunks.append(f"## {relative}\n\nBinary asset: {len(data)} bytes. SHA-256 `{hashlib.sha256(data).hexdigest()}`. Available in the repository and source ZIP.\n")
            continue
        extension = path.suffix.lstrip(".")
        language = {"tsx": "tsx", "ts": "ts", "mjs": "javascript", "py": "python", "svg": "xml"}.get(extension, extension or "text")
        chunks.append(f"## {relative}\n\n``````{language}\n{content.rstrip()}\n``````\n")
    (delivery / destination).write_text("\n".join(chunks))
    links.append(f"- [{name}]({destination})")

structure = "\n".join(path.relative_to(ROOT).as_posix() for path in files)
intro = f"""# Elvora — complete source review

Generated from the current checkout. Private environment values, Git metadata, dependencies and build artifacts are excluded. Binary assets remain in the repository/ZIP; text sections provide their hashes.

Next.js 15.5.28 is the owner-approved upgrade. Public content defaults to files; durable inquiries can be enabled separately. Run reviewed migrations and `npm run admin:bootstrap` with private settings to create the first administrator. `SEED_CONTENT=demo npm run db:seed` is development-only and refuses production. Genuine reviews require publication permission; no invented feedback is shown.

See [verification](../VERIFICATION.md), [deployment](../DEPLOYMENT.md), [security status](../SECURITY_STATUS.md) and [audit](../AGENCY_AUDIT.md). Production dependency audit is clean; an upstream development-tool finding remains. Local tests do not prove live provider/deployment success.

## Folder structure

```text
{structure}
```

## Database schema

``````prisma
{(ROOT / 'prisma/schema.prisma').read_text().rstrip()}
``````

## Source by folder

{chr(10).join(links)}
"""
(delivery / "README.md").write_text(intro)
combined = intro + "\n\n" + "\n\n".join((delivery / link.split("(")[1].split(")")[0]).read_text() for link in links)
(ROOT.parent / "elvora-complete-source.md").write_text(combined)
with zipfile.ZipFile(ROOT.parent / "elvora-complete.zip", "w", zipfile.ZIP_DEFLATED) as archive:
    for path in files:
        archive.write(path, "elvora/" + path.relative_to(ROOT).as_posix())
print(f"Source snapshot refreshed: {len(files)} files, {len(groups)} folder sections. No private runtime files included.")
