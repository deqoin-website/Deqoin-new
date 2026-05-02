import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const assetRoot = join(process.cwd(), "public/images/material-studio/generated");

function walkSvgFiles(root: string): string[] {
  const entries = readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) {
      return walkSvgFiles(fullPath);
    }
    return entry.name.endsWith(".svg") ? [fullPath] : [];
  });
}

describe("generated material SVG assets", () => {
  it("contains only text-free artwork and no UI copy", () => {
    const files = walkSvgFiles(assetRoot);
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = readFileSync(file, "utf8");
      expect(content).not.toMatch(/<text\b/i);
      expect(content).not.toMatch(/Numune İste|Bilgi Al|Teklif Al|Görünüm|Filtreler|Kart Dili|sade e-commerce/i);
    }
  });
});
