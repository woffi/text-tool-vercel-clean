
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [task, setTask] = useState("summary");
  const prompts = {
    summary: "Fasse den folgenden Text kurz und prägnant zusammen:",
    translate: "Übersetze den folgenden Text ins Englische, wenn er auf Deutsch ist, sonst auf Deutsch, wenn er Englisch ist",
    simplify: "Schreibe den folgenden Text verständlicher um:"
  };

  const handleClick = async () => {
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${prompts[task]}\n\n${input}` })
    });
    const data = await res.json();
    setOutput(data.result || "Fehler.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Text-Tool</h1>
      <select value={task} onChange={(e) => setTask(e.target.value)}>
        <option value="summary">Zusammenfassen</option>
        <option value="translate">Übersetzen DE<>ENG</option>
        <option value="simplify">Vereinfachen</option>
      </select>
      <button onClick={handleClick}>Start</button>
      <div style={{ display: "flex", marginTop: 10, gap: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "50%", height: 300 }}
          placeholder="Originaltext"
        />
        <textarea
          value={output}
          readOnly
          style={{ width: "50%", height: 300 }}
          placeholder="Ergebnis"
        />
      </div>
    </div>
  );
}
