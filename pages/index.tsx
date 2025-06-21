import Head from 'next/head';
import { useState, useEffect } from "react";

type PromptItem = {
  key: string;
  label: string;
  text: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);

  useEffect(() => {
    console.log("Fetching prompts...");  
    fetch("https://woffi.de/assets/prompts.json")
      .then(res => res.json())
      .then((data: PromptItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setPrompts(data);
          setTask(data[0].key);
        } else {
          console.error("Leere oder ungültige prompts.json");
        }
      })
      .catch(err => {
        console.error("Fehler beim Laden der prompts.json:", err);
        setPrompts([]);
      });
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const selected = prompts.find(p => p.key === task);
    const fullPrompt = `${selected?.text ?? ""}\n\n${input}`;

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`Fehler: ${data.error || 'Unbekannt'}`);
      } else {
        setOutput(data.result);
      }
    } catch (err: any) {
      setOutput(`Fehler: ${err.message || 'Unbekannter Fehler'}`);
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <>
      <Head>
        <title>woffis KI-Texttool</title>
        <meta name="description" content="Ein Tool zum Zusammenfassen, Übersetzen und Vereinfachen von Texten." />
      </Head>
      <div style={{ padding: 20, backgroundColor: "#002b40", minHeight: "100vh", fontFamily: "Futura, sans-serif" }}>
        <h1 style={{ color: "#FF7F50", fontWeight: "normal" }}>woffis KI-TextTool</h1>

        <div style={{ marginBottom: 10 }}>
          <select value={task} onChange={(e) => setTask(e.target.value)}>
            {prompts.map(p => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
          <button onClick={handleClick} style={{ marginLeft: 10 }}>Start</button>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          {/* Eingabe */}
          <div style={{ width: "50%", display: "flex", flexDirection: "column", height: 700 }}>
            <div style={{ height: 40 }}></div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, backgroundColor: "white" }}
              placeholder="Originaltext"
            />
          </div>

          {/* Ausgabe */}
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
    </>
  );
}