// Memberi tahu client apakah mode AI aktif. Hanya boolean; isi env tidak pernah dikirim.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ai: Boolean(process.env.GEMINI_API_KEY) }, { headers: { "Cache-Control": "no-store" } });
}
