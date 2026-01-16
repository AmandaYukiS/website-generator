import { useState } from "react";
import { Monitor, Code2, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutputPanelProps {
  previewContent: React.ReactNode;
  codeContent: string;
}

const OutputPanel = ({ previewContent, codeContent }: OutputPanelProps) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting
  const highlightCode = (code: string) => {
    const lines = code.split("\n");
    return lines.map((line, index) => {
      let highlighted = line
        // Keywords
        .replace(
          /\b(const|let|var|function|return|import|export|from|default|if|else|for|while|class|extends|new|this|async|await)\b/g,
          '<span class="code-keyword">$1</span>'
        )
        // Strings
        .replace(
          /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
          '<span class="code-string">$&</span>'
        )
        // Comments
        .replace(
          /(\/\/.*$)/gm,
          '<span class="code-comment">$1</span>'
        );

      return (
        <div key={index} className="flex">
          <span className="code-line-number w-12 text-right pr-4 select-none">
            {index + 1}
          </span>
          <span
            dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }}
            className="flex-1"
          />
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Tab Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "code"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="w-4 h-4" />
            Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "code" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Open
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" ? (
          <div className="h-full p-6 overflow-auto custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl border border-border shadow-lg overflow-hidden bg-background">
                {previewContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto custom-scrollbar code-editor p-4">
            <pre className="text-panel-dark-foreground leading-relaxed">
              {highlightCode(codeContent)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
