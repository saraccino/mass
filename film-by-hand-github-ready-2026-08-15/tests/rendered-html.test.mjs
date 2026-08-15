import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished survey landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /35mm, by hand/);
  assert.match(html, /Begin survey/);
  assert.doesNotMatch(html, /No names\. No accounts\. Just your experience\./);
  assert.doesNotMatch(html, /codex-preview/);
});

test("survey source contains the requested ranges, options and helper rules", async () => {
  const [survey, data, api] = await Promise.all([
    readFile(new URL("../app/survey.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/survey-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/responses/route.ts", import.meta.url), "utf8"),
  ]);

  assert.match(survey, /min="1920" max="2026"/);
  assert.match(survey, /const isMultiSelect = \[7, 8, 11\]\.includes\(step\)/);
  assert.match(survey, /Select all that apply\./);
  assert.match(survey, /Are there any parts of your film development process that you find frustrating\?/);
  assert.match(survey, /Nothing in particular/);
  assert.match(survey, /min="0\.5" max="120" step="0\.5"/);
  assert.match(survey, /10\.764/);

  for (const option of ["Ilford", "Agfa", "Adox", "Kentmere", "Kodak", "ECN-2 / Cinema Film", "Slide Film / E-6", "Fujifilm", "CineStill"]) {
    assert.ok(data.includes(`"${option}"`), `missing film option: ${option}`);
  }

  assert.match(api, /workspace_area_m2/);
  assert.match(api, /workspace_area_ft2/);
  for (const field of ["name", "country", "city", "age_range", "photography_relationship"]) assert.ok(api.includes(field), `missing export field: ${field}`);
  assert.match(survey, /What’s your name\?/);
  assert.match(survey, /What country are you based in\?/);
  assert.match(survey, /What city are you based in\?/);
  assert.match(survey, /What is your age range\?/);
  assert.match(data, /Both passion and profession/);
  assert.doesNotMatch(survey, /\bhobby\b/i);
  assert.match(survey, /film-strip\.png/);
  assert.doesNotMatch(survey, /frame frame-a|frame frame-b|frame frame-c/);
});

test("workspace area conversion is accurate at small, medium and large values", () => {
  const toSquareFeet = (squareMetres) => Math.round(squareMetres * 10.764);
  assert.equal(toSquareFeet(0.5), 5);
  assert.equal(toSquareFeet(12), 129);
  assert.equal(toSquareFeet(120), 1292);
});
