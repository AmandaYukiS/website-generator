import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between animate-fade-in border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            buildAI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </nav>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full border border-border"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm animate-slide-up bg-muted"
            style={{ animationDelay: "0.1s" }}
          >
            <Zap className="w-4 h-4" />
            <span>AI-Powered Website Builder</span>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Build Websites
            <br />
            <span className="text-muted-foreground">
              by Chatting
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            Describe what you want to build and watch it come to life.
            Generate beautiful, production-ready websites using
            conversational AI.
          </p>

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="xl"
              onClick={() => navigate("/workspace")}
              className="gap-2"
            >
              Start Building
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="xl"
            >
              View Examples
            </Button>
          </div>
        </div>

        {/* Feature Pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-20 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            "Real-time Preview",
            "Export Code",
            "Modern Stack",
            "No Coding Required",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-sm"
            >
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 text-center text-sm text-muted-foreground animate-fade-in border-t border-border">
        © 2024 buildAI. Built with intelligence.
      </footer>
    </div>
  );
};

export default Landing;
