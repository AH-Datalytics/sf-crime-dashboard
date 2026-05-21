import { readFileSync } from "fs";
import path from "path";

export async function GET() {
  try {
    const buf = readFileSync(path.join(process.cwd(), "data/generated/map-data.json.gz"));
    return new Response(buf, {
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Data not available" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}
