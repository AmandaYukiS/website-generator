import { useState, useRef, useEffect } from "react";

const API_URL = "http://localhost:8000";

const STYLE_OPTIONS = [
  { value: "modern", label: "✨ Modern", desc: "Vibrant & glassmorphism" },
  { value: "minimalist", label: "🤍 Minimalist", desc: "Clean & elegant" },
  { value: "corporate", label: "💼 Corporate", desc: "Professional & serious" },
  { value: "creative", label: "🎨 Creative", desc: "Bold & experimental" },
  { value: "dark", label: "🌑 Dark", desc: "Cyberpunk & neon" },
];

const EXAMPLE_PROMPTS = [
  "Landing page for a meditation app called 'ZenFlow'",
  "Portfolio site for a wedding photographer",
  "Sales page for a Python programming course",
  "Homepage for an artisan coffee shop in New York",
  "Site for a fintech startup called 'PayFast'",
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [language, setLanguage] = useState("en-US");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [refineText, setRefineText] = useState("");
  const [refining, setRefining] = useState(false);
  const [view, setView] = useState("split"); // split | code | preview
  const [tokensUsed, setTokensUsed] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (html && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = html;
    }
  }, [html]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setHtml("");
    setTokensUsed(null);

    try {
      setStreaming(true);
      let fullHtml = "";

      const res = await fetch(`${API_URL}/generate/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, language }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                fullHtml += data.chunk;
                setHtml(fullHtml);
              }
              if (data.done) {
                setStreaming(false);
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      setError(`Error: ${err.message}. Make sure the backend is running.`);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const refine = async () => {
    if (!refineText.trim() || !html) return;
    setRefining(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_html: html, instructions: refineText }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setHtml(data.html);
      setTokensUsed(data.tokens_used);
      setRefineText("");
    } catch (err) {
      setError(`Refine error: ${err.message}`);
    } finally {
      setRefining(false);
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-site.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        padding: "20px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>⚡</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>
              SiteGen AI
            </h1>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.5 }}>
              Build websites with Artificial Intelligence
            </p>
          </div>
        </div>
        {html && (
          <div style={{ display: "flex", gap: 8 }}>
            {["split", "code", "preview"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: view === v ? "rgba(139,92,246,0.5)" : "transparent",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  transition: "all 0.2s",
                }}
              >
                {v === "split" ? "⫶ Split" : v === "code" ? "< > Code" : "👁 Preview"}
              </button>
            ))}
          </div>
        )}
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <aside style={{
          width: 360,
          padding: 24,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}>
          {/* Prompt Input */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>
              📝 Describe your website
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Landing page for a healthy food delivery startup focused on wellness..."
              rows={5}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: 14,
                color: "#fff",
                fontSize: 14,
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) generate();
              }}
            />
            <p style={{ margin: "4px 0 0", fontSize: 11, opacity: 0.4 }}>
              Ctrl+Enter to generate
            </p>
          </div>

          {/* Style Selector */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 10, opacity: 0.7 }}>
              🎨 Visual Style
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStyle(opt.value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: `1px solid ${style === opt.value ? "rgba(139,92,246,0.8)" : "rgba(255,255,255,0.1)"}`,
                    background: style === opt.value ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.03)",
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</span>
                  <span style={{ fontSize: 11, opacity: 0.5 }}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>
              🌐 Content Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="en-US">🇺🇸 English</option>
              <option value="pt-BR">🇧🇷 Portuguese (BR)</option>
              <option value="es">🇪🇸 Spanish</option>
              <option value="fr">🇫🇷 French</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: loading
                ? "rgba(139,92,246,0.3)"
                : "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: loading ? "none" : "0 4px 20px rgba(139,92,246,0.4)",
            }}
          >
            {loading ? (streaming ? "⚡ Generating..." : "⏳ Please wait...") : "⚡ Generate Site"}
          </button>

          {/* Examples */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 10, opacity: 0.5 }}>
              💡 Quick examples
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.02)",
                    color: "rgba(255,255,255,0.6)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 12,
                    lineHeight: 1.4,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.02)"}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Refine Section */}
          {html && (
            <div style={{
              padding: 16,
              background: "rgba(99,102,241,0.1)",
              borderRadius: 12,
              border: "1px solid rgba(99,102,241,0.3)",
            }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                ✏️ Refine Site
              </label>
              <textarea
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="e.g. Add an FAQ section, change the primary color to green..."
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8,
                  padding: 10,
                  color: "#fff",
                  fontSize: 13,
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={refine}
                disabled={refining || !refineText.trim()}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "10px",
                  borderRadius: 8,
                  border: "none",
                  background: refining ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.8)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: refining ? "not-allowed" : "pointer",
                  fontSize: 13,
                }}
              >
                {refining ? "⏳ Refining..." : "✨ Apply Changes"}
              </button>
            </div>
          )}

          {/* Tokens info */}
          {tokensUsed && (
            <p style={{ fontSize: 11, opacity: 0.4, textAlign: "center", margin: 0 }}>
              🔢 {tokensUsed.toLocaleString()} tokens used
            </p>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: 12,
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              fontSize: 13,
              color: "#fca5a5",
            }}>
              ⚠️ {error}
            </div>
          )}
        </aside>

        {/* Main Area */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {!html ? (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.3,
              gap: 16,
            }}>
              <span style={{ fontSize: 64 }}>🌐</span>
              <p style={{ fontSize: 18, fontWeight: 600 }}>
                Describe your site and click Generate
              </p>
              <p style={{ fontSize: 14, maxWidth: 400, textAlign: "center", lineHeight: 1.6 }}>
                The AI will create a complete website with HTML, CSS and JS in seconds.
              </p>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Code Panel */}
              {(view === "split" || view === "code") && (
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRight: view === "split" ? "1px solid rgba(255,255,255,0.08)" : "none",
                  overflow: "hidden",
                }}>
                  <div style={{
                    padding: "10px 16px",
                    background: "rgba(0,0,0,0.2)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <span style={{ fontSize: 13, opacity: 0.6 }}>
                      📄 HTML ({html.length.toLocaleString()} chars)
                      {streaming && <span style={{ color: "#8b5cf6", marginLeft: 8 }}>● live</span>}
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={copyHtml} style={smallBtn}>📋 Copy</button>
                      <button onClick={downloadHtml} style={smallBtn}>⬇️ Download</button>
                    </div>
                  </div>
                  <pre style={{
                    flex: 1,
                    margin: 0,
                    padding: 20,
                    overflowY: "auto",
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "#a5b4fc",
                    background: "rgba(0,0,0,0.3)",
                    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}>
                    {html}
                  </pre>
                </div>
              )}

              {/* Preview Panel */}
              {(view === "split" || view === "preview") && (
                <div style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}>
                  <div style={{
                    padding: "10px 16px",
                    background: "rgba(0,0,0,0.2)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                    <span style={{ fontSize: 12, opacity: 0.4, marginLeft: 8 }}>Live Preview</span>
                  </div>
                  <iframe
                    ref={iframeRef}
                    style={{
                      flex: 1,
                      border: "none",
                      background: "#fff",
                    }}
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const smallBtn = {
  padding: "5px 10px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(255,255,255,0.7)",
  cursor: "pointer",
  fontSize: 12,
};
