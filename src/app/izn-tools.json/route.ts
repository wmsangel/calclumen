import { calculators } from "@/lib/calculators/registry";

// Tool-name dictionary for the network beacon (izn.project.stats/beacon/README.md):
// slug → human name, so CRM shows "Mortgage Calculator" instead of a slug.
export const dynamic = "force-static";

export function GET() {
  const tools: Record<string, string> = {};
  for (const c of calculators) tools[c.slug] = c.heading;
  return Response.json(
    { site: "calclumen.com", tools },
    { headers: { "Cache-Control": "public, max-age=86400" } },
  );
}
