"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [key, setKey] = useState(""); const [message, setMessage] = useState("");
  const download = async (format: "csv" | "excel") => {
    setMessage("Preparing export…");
    const response = await fetch(`/api/responses?format=${format}`, { headers: { "x-admin-key": key } });
    if (!response.ok) { setMessage(response.status === 401 ? "That export key is not valid." : "The export could not be prepared."); return; }
    const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `35mm-survey-responses.${format === "excel" ? "xls" : "csv"}`; anchor.click(); URL.revokeObjectURL(url); setMessage("Export downloaded.");
  };
  return <main className="admin"><Link href="/" className="wordmark">35 / HAND</Link><section><p className="eyebrow">Research data / private access</p><h1>Export responses.</h1><p>Enter the private export key from your environment settings. It is sent only to the protected server route and is never stored in this browser.</p><label>Admin export key<input type="password" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" /></label><div className="export-buttons"><button className="primary" onClick={() => download("csv")} disabled={!key}>Download CSV <span>↓</span></button><button className="primary" onClick={() => download("excel")} disabled={!key}>Download Excel <span>↓</span></button></div>{message && <p className="admin-message" role="status">{message}</p>}</section></main>;
}
