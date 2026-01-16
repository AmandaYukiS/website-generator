import { Monitor, Tablet, Smartphone, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeviceView = "desktop" | "tablet" | "mobile";

interface PreviewToolbarProps {
  currentView: DeviceView;
  onViewChange: (view: DeviceView) => void;
  currentPath: string;
  onPathChange: (path: string) => void;
  onOpenExternal: () => void;
  onRefresh: () => void;
}

const PreviewToolbar = ({
  currentView,
  onViewChange,
  currentPath,
  onPathChange,
  onOpenExternal,
  onRefresh,
}: PreviewToolbarProps) => {
  const devices = [
    { id: "desktop" as DeviceView, icon: Monitor, label: "Desktop" },
    { id: "tablet" as DeviceView, icon: Tablet, label: "Tablet" },
    { id: "mobile" as DeviceView, icon: Smartphone, label: "Mobile" },
  ];

  return (
    <div className="flex items-center gap-2 flex-1">
      {/* Device Toggle */}
      <div className="flex items-center bg-secondary rounded-lg p-1">
        {devices.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={cn(
              "p-2 rounded-md transition-all",
              currentView === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* URL Bar */}
      <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <input
          type="text"
          value={currentPath}
          onChange={(e) => onPathChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
          placeholder="/"
        />
        <button
          onClick={onRefresh}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Open External */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenExternal}
        className="gap-2"
        title="Open in new tab"
      >
        <ExternalLink className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default PreviewToolbar;
