import Head from 'next/head';
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [task, setTask] = useState("summary");
  const [loading, setLoading] = useState(false);

  const prompts = {
    summary: "Fasse den folgenden Text kurz und prägnant zusammen:",
    translate: "Übersetze den folgenden Text ins Englische, wenn er auf Deutsch ist, sonst übersetze ihn ins Deutsche:",
    simplify: "Schreibe den folgenden Text verständlicher um:"
  };

const handleClick = async () => {
  setLoading(true);
  const prompt = `${prompts[task]}\n\n${input}`;
  const res = await fetch('/api/gpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();

  if (!res.ok) {
    setOutput(`Fehler: ${data.error || 'Unbekannt'}`);
  } else {
    setOutput(data.result);
  }

  setLoading(false);
}; // <–– Diese schließende Klammer hat gefehlt

const handleCopy = () => {
  navigator.clipboard.writeText(output);
};

  return (
    <Head>
      <title>woffis KI-Texttool</title>
      <meta name="description" content="Ein Tool zum Zusammenfassen, Übersetzen und Vereinfachen von Texten." />
    </Head>
    <div style={{ padding: 20, backgroundColor: "#002b40", minHeight: "100vh", fontFamily: "Futura, sans-serif" }}>
      <h1 style={{ color: "#66CDAA" }}>woffis KI-TextTool</h1>

      <div style={{ marginBottom: 10 }}>
        <select value={task} onChange={(e) => setTask(e.target.value)}>
          <option value="summary">Zusammenfassen</option>
          <option value="translate">ÜbersetzenX</option>
          <option value="simplify">Vereinfachen</option>
        </select>
        <button onClick={handleClick} style={{ marginLeft: 10 }}>Start</button>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* Linke Spalte */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column", height: 700 }}>
          <div style={{ height: 40 }}></div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, backgroundColor: "white" }}
            placeholder="Originaltext"
          />
        </div>

        {/* Rechte Spalte */}
        <div style={{ width: "50%", display: "flex", flexDirection: "column", height: 700 }}>
          <div style={{ height: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              color: "red",
              fontWeight: "bold",
              fontFamily: "Futura, sans-serif",
              visibility: loading ? "visible" : "hidden",
              animation: loading ? "blink 1s step-start 0s infinite" : "none"
            }}>
              Bitte warten
            </span>
            <button onClick={handleCopy}>Copy</button>
          </div>
          <textarea
            value={output}
            readOnly
            style={{ flex: 1, backgroundColor: "#f0f0f0" }}
            placeholder="Ergebnis"
          />
        </div>
      </div>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}