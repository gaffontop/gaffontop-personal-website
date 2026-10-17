import { readFileSync } from "node:fs";
import { join } from "node:path";

function readPageMarkup() {
  const source = readFileSync(join(process.cwd(), "index.htm"), "utf8");
  const bodyMatch = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error("Could not find the body markup in index.htm.");
  }

  return bodyMatch[1].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

export default function Home() {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: readPageMarkup() }}
      suppressHydrationWarning
    />
  );
}
