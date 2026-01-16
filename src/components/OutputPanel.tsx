import { useState } from "react";
import { Monitor, Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import PreviewToolbar from "./PreviewToolbar";
import { cn } from "@/lib/utils";

type DeviceView = "desktop" | "tablet" | "mobile";

interface OutputPanelProps {
  previewContent: React.ReactNode;
  codeContent: string;
}

const OutputPanel = ({ previewContent, codeContent }: OutputPanelProps) => {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const [currentPath, setCurrentPath] = useState("/");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenExternal = () => {
    // Open preview in a new tab
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview</title>
            <style>
              body { margin: 0; font-family: system-ui, sans-serif; }
            </style>
          </head>
          <body>
            <div id="preview-root"></div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getDeviceWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "max-w-[375px]";
      case "tablet":
        return "max-w-[768px]";
      default:
        return "max-w-full";
    }
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-border gap-4">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Monitor className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "code"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="w-4 h-4" />
            Code
          </button>
        </div>

        {activeTab === "preview" && (
          <PreviewToolbar
            currentView={deviceView}
            onViewChange={setDeviceView}
            currentPath={currentPath}
            onPathChange={setCurrentPath}
            onOpenExternal={handleOpenExternal}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === "code" && (
          <div className="flex items-center gap-2">
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
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-muted/30">
        {activeTab === "preview" ? (
          <div className="h-full p-6 overflow-auto custom-scrollbar flex justify-center">
            <div
              key={refreshKey}
              className={cn(
                "w-full transition-all duration-300",
                getDeviceWidth()
              )}
            >
              <div className="rounded-xl border border-border shadow-lg overflow-hidden bg-background">
                {previewContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto custom-scrollbar code-editor p-4">
            <pre className="leading-relaxed">
              {highlightCode(codeContent)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
