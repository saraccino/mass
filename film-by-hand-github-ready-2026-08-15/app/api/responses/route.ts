import { stages, type Answers } from "../../survey-data";

const corslessHeaders = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const env = () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_PUBLISHABLE_KEY,
});

function configured() { const { url, key } = env(); return !!url && !!key; }
function supabaseHeaders() { const { key } = env(); return { apikey: key!, Authorization: `Bearer ${key}`, "Content-Type": "application/json" }; }

function flatten(row: Record<string, unknown>) {
  const a = row.answers as Answers;
  return {
    response_id: row.id, submitted_at: row.created_at,
    name: a.name ?? "", country: a.country ?? "", city: a.city ?? "",
    age_range: a.ageRange ?? "", photography_relationship: a.photographyRelationship ?? "",
    started_developing_year: a.startYear,
    current_equipment: a.equipment === "Other" ? a.equipmentOther : a.equipment,
    film_types: a.filmTypes.map((v) => v === "Other" ? a.filmTypesOther : v).join(" | "),
    knowledge_sources: a.knowledgeSources.map((v) => v === "Other" ? a.knowledgeOther : v).join(" | "),
    problem_frequency: a.problemFrequency,
    experienced_problems: a.problems.map((v) => v === "Other" ? a.problemsOther : v).join(" | "),
    most_frustrating_part: a.frustration, workspace_size: a.workspaceSize,
    workspace_area_m2: a.workspaceAreaM2 ?? "",
    workspace_area_ft2: a.workspaceAreaM2 ? Math.round(a.workspaceAreaM2 * 10.764) : "",
    ...Object.fromEntries(stages.map((stage) => [`difficulty_${stage.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`, a.difficulty[stage]])),
  };
}
function csvCell(value: unknown) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }
function asCsv(rows: Record<string, unknown>[]) { if (!rows.length) return ""; const keys = Object.keys(rows[0]); return [keys.map(csvCell).join(","), ...rows.map((r) => keys.map((k) => csvCell(r[k])).join(","))].join("\r\n"); }
function xmlCell(value: unknown) { return String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function asExcel(rows: Record<string, unknown>[]) { const keys = rows[0] ? Object.keys(rows[0]) : []; const rowXml = [keys, ...rows.map((r) => keys.map((k) => r[k]))].map((row) => `<Row>${row.map((v) => `<Cell><Data ss:Type="String">${xmlCell(v)}</Data></Cell>`).join("")}</Row>`).join(""); return `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Responses"><Table>${rowXml}</Table></Worksheet></Workbook>`; }

export async function POST(request: Request) {
  if (!configured()) return Response.json({ error: "Survey database is not configured." }, { status: 503, headers: corslessHeaders });
  try {
    const answers = await request.json() as Answers;
    if (!answers || !answers.ageRange || !answers.photographyRelationship || !answers.equipment || !answers.frustration || !answers.workspaceSize) return Response.json({ error: "Incomplete response." }, { status: 400, headers: corslessHeaders });
    const id = crypto.randomUUID();
    const response = await fetch(`${env().url}/rest/v1/survey_responses`, { method: "POST", headers: { ...supabaseHeaders(), Prefer: "return=minimal" }, body: JSON.stringify({ id, answers, survey_version: 1 }) });
    if (!response.ok) throw new Error(await response.text());
    return Response.json({ id }, { status: 201, headers: corslessHeaders });
  } catch (error) { console.error("Submission error", error); return Response.json({ error: "Unable to save response." }, { status: 500, headers: corslessHeaders }); }
}

export async function GET(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  if (!adminKey) return Response.json({ error: "Not authorized." }, { status: 401, headers: corslessHeaders });
  if (!configured()) return Response.json({ error: "Survey database is not configured." }, { status: 503, headers: corslessHeaders });
  const response = await fetch(`${env().url}/rest/v1/rpc/export_survey_responses`, { method: "POST", headers: supabaseHeaders(), body: JSON.stringify({ admin_key: adminKey }) });
  if (!response.ok) return Response.json({ error: response.status === 403 ? "Not authorized." : "Unable to retrieve responses." }, { status: response.status === 403 ? 401 : 502, headers: corslessHeaders });
  const rawRows = (await response.json()) as Record<string, unknown>[];
  const rows = rawRows.map(flatten);
  const excel = new URL(request.url).searchParams.get("format") === "excel";
  const body = excel ? asExcel(rows) : asCsv(rows);
  return new Response(body, { headers: { "Content-Type": excel ? "application/vnd.ms-excel; charset=utf-8" : "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="35mm-survey-responses.${excel ? "xls" : "csv"}"`, "Cache-Control": "no-store" } });
}

