import { useState } from "react";
import { createRoot } from "react-dom/client";
import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";
import { money, type Investigation } from "./billing";
import type { LedgerLensState } from "./server";
import "./styles.css";

function InvestigationPanel({ state }: { state: LedgerLensState | undefined }) {
  const investigation = state?.investigation as Investigation | undefined;
  if (!state || state.status === "idle") {
    return <aside className="panel"><h2>Investigation</h2><p>Ask why Northstar Analytics’ September invoice changed.</p></aside>;
  }
  if (state.status === "investigating") {
    return <aside className="panel"><h2>Investigation</h2><p className="status">Finding account-scoped evidence…</p></aside>;
  }
  if (state.status === "failed") {
    return <aside className="panel"><h2>Investigation</h2><p className="error">{state.error}</p></aside>;
  }
  if (!investigation) return null;
  return (
    <aside className="panel">
      <h2>Evidence-backed result</h2>
      <p className="variance">{money(investigation.currentInvoiceCents)} <span>vs.</span> {money(investigation.priorInvoiceCents)}</p>
      <p>Difference: <strong>{money(investigation.changeCents)}</strong></p>
      <h3>Evidence</h3>
      <ul>{investigation.evidence.map((item) => <li key={item.id}><code>{item.id}</code><strong>{item.label}</strong><span>{item.note}</span></li>)}</ul>
      <h3>Customer-ready draft</h3>
      <p className="draft">{state.customerDraft}</p>
      <p className="review">Human review required before sending.</p>
    </aside>
  );
}

function App() {
  const agent = useAgent<LedgerLensState>({ agent: "LedgerLensAgent", name: "northstar-support" });
  const { messages, sendMessage, status } = useAgentChat({ agent });
  const [input, setInput] = useState("Why is the September invoice higher than August? Draft a reply I can send.");
  const busy = status !== "ready";

  return (
    <main>
      <section className="chat">
        <header><p className="eyebrow">Northstar Analytics · fictional demo</p><h1>LedgerLens</h1><p>Evidence-backed billing explanations for support teams.</p></header>
        <div className="messages" aria-live="polite">
          {messages.length === 0 && <p className="empty">Ask a billing question to begin a read-only investigation.</p>}
          {messages.map((message) => <article key={message.id} className={`message ${message.role}`}>
            <span>{message.role === "user" ? "Support agent" : "LedgerLens"}</span>
            {message.parts.map((part, index) => part.type === "text" ? <p key={index}>{part.text}</p> : null)}
          </article>)}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); if (!input.trim() || busy) return; sendMessage({ text: input }); setInput(""); }}>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="Billing question" rows={3} />
          <button disabled={busy}>{busy ? "Investigating…" : "Investigate"}</button>
        </form>
      </section>
      <InvestigationPanel state={agent.state} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
