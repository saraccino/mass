"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ageRanges, difficultyLabels, equipment, filmTypes, frequency, initialAnswers, knowledge, photographyRelationships, problems, stages, type Answers } from "./survey-data";

const DRAFT_KEY = "thirtyfive-by-hand-draft";
const TOTAL = 11;

function Choice({ label, selected, multi, onClick }: { label: string; selected: boolean; multi?: boolean; onClick: () => void }) {
  return <button type="button" className={`choice ${selected ? "selected" : ""}`} aria-pressed={selected} onClick={onClick}><span className="choice-mark">{selected ? "●" : multi ? "＋" : "○"}</span><span>{label}</span></button>;
}

function MultiChoices({ options, values, onChange }: { options: string[]; values: string[]; onChange: (next: string[]) => void }) {
  return <div className="choices">{options.map((option) => <Choice key={option} label={option} multi selected={values.includes(option)} onClick={() => onChange(values.includes(option) ? values.filter((v) => v !== option) : [...values, option])} />)}</div>;
}

export function Survey() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) { try { const draft = JSON.parse(saved); setTimeout(() => { setAnswers({ ...initialAnswers, ...draft.answers }); setStep(draft.version === 2 ? draft.step ?? 0 : 0); }, 0); } catch { localStorage.removeItem(DRAFT_KEY); } }
  }, []);
  useEffect(() => { if (started && status !== "done") localStorage.setItem(DRAFT_KEY, JSON.stringify({ version: 2, answers, step })); }, [answers, step, started, status]);
  useEffect(() => { if (started) headingRef.current?.focus(); }, [step, started]);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((a) => ({ ...a, [key]: value }));
  const workspaceFt2 = Math.round(answers.workspaceAreaM2 * 10.764);
  const workspaceLabel = `${Number.isInteger(answers.workspaceAreaM2) ? answers.workspaceAreaM2 : answers.workspaceAreaM2.toFixed(1)} m² · ${workspaceFt2} ft²`;
  const setWorkspaceArea = (area: number) => setAnswers((a) => ({ ...a, workspaceAreaM2: area, workspaceSize: `${Number.isInteger(area) ? area : area.toFixed(1)} m² · ${Math.round(area * 10.764)} ft²` }));
  const scaleReferences = [
    { name: "Bicycle", area: 1.5, className: "bicycle" },
    { name: "Car", area: 10, className: "car" },
    { name: "Truck", area: 20, className: "truck" },
    { name: "Large truck", area: 45, className: "large-truck" },
    { name: "Blue whale", area: 105, className: "whale" },
  ];
  const activeScale = scaleReferences.reduce((best, reference) => Math.abs(reference.area - answers.workspaceAreaM2) < Math.abs(best.area - answers.workspaceAreaM2) ? reference : best, scaleReferences[0]);
  const validate = () => {
    const valid = [!!answers.ageRange, !!answers.photographyRelationship, true, !!answers.equipment && (answers.equipment !== "Other" || !!answers.equipmentOther.trim()), answers.filmTypes.length > 0 && (!answers.filmTypes.includes("Other") || !!answers.filmTypesOther.trim()), answers.knowledgeSources.length > 0 && (!answers.knowledgeSources.includes("Other") || !!answers.knowledgeOther.trim()), stages.every((s) => !!answers.difficulty[s]), !!answers.problemFrequency, answers.problems.length > 0 && (!answers.problems.includes("Other") || !!answers.problemsOther.trim()), !!answers.frustration.trim(), !!answers.workspaceSize][step];
    setError(valid ? "" : "Please answer this question before continuing.");
    return valid;
  };
  const next = () => { if (validate()) { setError(""); setStep((s) => Math.min(TOTAL - 1, s + 1)); } };
  const submit = async () => {
    if (!validate()) return;
    setStatus("sending"); setError("");
    try {
      const res = await fetch("/api/responses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answers) });
      if (!res.ok) throw new Error("Submission failed");
      localStorage.removeItem(DRAFT_KEY); setStatus("done");
    } catch { setStatus("idle"); setError("We couldn't save your response. Please check your connection and try again."); }
  };

  if (!started) return <main className="cover"><div className="grain" /><header className="mast"><span>PRIMARY RESEARCH / 2026</span><span>35MM PROCESS STUDY</span></header><figure className="cover-film" aria-hidden="true"><Image src="/film-strip.png" alt="" width={5000} height={1152} priority /></figure><section className="cover-copy"><h1>35mm,<br /><em>by hand.</em></h1><p className="intro">A short independent survey about the tools, spaces and everyday realities of developing film.</p><div className="start-row"><button className="primary" onClick={() => setStarted(true)}>Begin survey <span>↗</span></button><span className="time">About 6 minutes<br />14 questions</span></div></section></main>;
  if (status === "done") return <main className="thank-you"><div className="film-rule" /><p className="eyebrow">Response recorded</p><h1>Thank you.</h1><p>Your experience with film development will contribute to research into how the process could be made more consistent, accessible and intuitive.</p><button className="text-button" onClick={() => { setAnswers(initialAnswers); setStep(0); setStatus("idle"); setStarted(false); }}>Return to start</button></main>;

  const titles = ["What is your age range?", "How would you describe your relationship with photography?", "When did you start developing film?", "What do you currently use to develop film?", "Which film stocks, brands or types do you use?", "How do you decide on chemistry, time and agitation?", "How difficult is each stage?", "How often do you encounter problems?", "What problems have you experienced?", "Are there any parts of your film development process that you find frustrating?", "How large is your film-processing workspace?"];
  const isMultiSelect = [4, 5, 8].includes(step);
  return <main className="survey-shell"><header className="survey-header"><button className="wordmark" onClick={() => setStarted(false)}>35 / HAND</button><div className="progress-meta"><span>{String(step + 1).padStart(2, "0")} / {TOTAL}</span><span>{Math.round(((step + 1) / TOTAL) * 100)}%</span></div><div className="progress-track"><span style={{ width: `${((step + 1) / TOTAL) * 100}%` }} /></div></header><section className="question" key={step}><p className="question-index">QUESTION {String(step + 1).padStart(2, "0")} <i>Required</i></p><h2 ref={headingRef} tabIndex={-1} aria-describedby={isMultiSelect ? "multi-select-help" : undefined}>{titles[step]}</h2>{isMultiSelect && <p className="hint question-hint" id="multi-select-help">Select all that apply.</p>}<div className="answer-area">
    {step === 0 && <div className="choices">{ageRanges.map((o) => <Choice key={o} label={o} selected={answers.ageRange === o} onClick={() => set("ageRange", o)} />)}</div>}
    {step === 1 && <div className="choices relationship-choices">{photographyRelationships.map((o) => <Choice key={o} label={o} selected={answers.photographyRelationship === o} onClick={() => set("photographyRelationship", o)} />)}</div>}
    {step === 2 && <div className="year-picker"><div className="year-display"><strong>{answers.startYear}</strong><span>{Math.floor(answers.startYear / 10) * 10}s</span></div><input aria-label="Year you started developing film" type="range" min="1920" max="2026" value={answers.startYear} onChange={(e) => set("startYear", Number(e.target.value))} /><div className="range-labels"><span>1920</span><span>2026</span></div></div>}
    {step === 3 && <><div className="choices">{equipment.map((o) => <Choice key={o} label={o} selected={answers.equipment === o} onClick={() => set("equipment", o)} />)}</div>{answers.equipment === "Other" && <input className="other-input" placeholder="Tell us what you use" value={answers.equipmentOther} onChange={(e) => set("equipmentOther", e.target.value)} />}</>}
    {step === 4 && <><MultiChoices options={filmTypes} values={answers.filmTypes} onChange={(v) => set("filmTypes", v)} />{answers.filmTypes.includes("Other") && <input className="other-input" placeholder="Which other process?" value={answers.filmTypesOther} onChange={(e) => set("filmTypesOther", e.target.value)} />}</>}
    {step === 5 && <><MultiChoices options={knowledge} values={answers.knowledgeSources} onChange={(v) => set("knowledgeSources", v)} />{answers.knowledgeSources.includes("Other") && <input className="other-input" placeholder="Which other source?" value={answers.knowledgeOther} onChange={(e) => set("knowledgeOther", e.target.value)} />}</>}
    {step === 6 && <div className="matrix"><div className="matrix-key">1 — Very easy <span>5 — Very difficult</span></div>{stages.map((stage, idx) => <fieldset key={stage}><legend><span>{String(idx + 1).padStart(2, "0")}</span>{stage}</legend><div className="rating">{[1,2,3,4,5].map((n) => <label key={n} className={answers.difficulty[stage] === n ? "active" : ""}><input type="radio" name={stage} value={n} checked={answers.difficulty[stage] === n} onChange={() => set("difficulty", { ...answers.difficulty, [stage]: n })} /><b>{n}</b><small>{difficultyLabels[n - 1]}</small></label>)}</div></fieldset>)}</div>}
    {step === 7 && <div className="choices">{frequency.map((o) => <Choice key={o} label={o} selected={answers.problemFrequency === o} onClick={() => set("problemFrequency", o)} />)}</div>}
    {step === 8 && <><MultiChoices options={problems} values={answers.problems} onChange={(v) => set("problems", v)} />{answers.problems.includes("Other") && <input className="other-input" placeholder="Which other problem?" value={answers.problemsOther} onChange={(e) => set("problemsOther", e.target.value)} />}</>}
    {step === 9 && <><Choice label="Nothing in particular" selected={answers.frustration === "Nothing in particular"} onClick={() => set("frustration", "Nothing in particular")} /><textarea aria-label="Parts of the film development process you find frustrating" className="reflection" rows={6} maxLength={1500} placeholder="If anything comes to mind, describe it here…" value={answers.frustration === "Nothing in particular" ? "" : answers.frustration} onChange={(e) => set("frustration", e.target.value)} /><div className="char-count">{answers.frustration === "Nothing in particular" ? 0 : answers.frustration.length} / 1500</div></>}
    {step === 10 && <div className="workspace-picker"><div className="workspace-value" aria-live="polite"><strong>{Number.isInteger(answers.workspaceAreaM2) ? answers.workspaceAreaM2 : answers.workspaceAreaM2.toFixed(1)} <small>m²</small></strong><span>{workspaceFt2} ft²</span></div><p className="workspace-note" id="workspace-help">Estimate the total floor area you have available. The references below are approximate footprints.</p><div className="scale-scene" aria-hidden="true">{scaleReferences.map((reference) => <div key={reference.name} className={`scale-reference ${reference.className} ${activeScale.name === reference.name ? "active" : ""}`}><div className="silhouette"><i /><i /><i /></div><span>{reference.name}</span><small>~{reference.area} m²</small></div>)}</div><input className="workspace-range" aria-label="Available film-processing workspace area in square metres" aria-describedby="workspace-help" aria-valuemin={0.5} aria-valuemax={120} aria-valuenow={answers.workspaceAreaM2} aria-valuetext={workspaceLabel} type="range" min="0.5" max="120" step="0.5" value={answers.workspaceAreaM2} onChange={(e) => setWorkspaceArea(Number(e.target.value))} /><div className="range-labels"><span>0.5 m²</span><span>120 m²</span></div></div>}
  </div>{error && <p className="error" role="alert">{error}</p>}<div className="controls"><button className="back" onClick={() => step === 0 ? setStarted(false) : setStep((s) => s - 1)}>← Back</button><button className="primary" disabled={status === "sending"} onClick={step === TOTAL - 1 ? submit : next}>{step === TOTAL - 1 ? status === "sending" ? "Saving…" : "Submit response" : "Next question"} <span>→</span></button></div></section><aside className="side-note" aria-hidden="true"><span>35MM</span><span>PROCESS / EXPERIENCE</span></aside></main>;
}

