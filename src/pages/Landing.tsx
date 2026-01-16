import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary text-primary-foreground flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-semibold tracking-tight">buildAI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Features
          </a>
          <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Pricing
          </a>
          <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            Docs
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-foreground/20 text-sm animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Zap className="w-4 h-4" />
            <span>AI-Powered Website Builder</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Build Websites
            <br />
            <span className="text-primary-foreground/60">by Chatting</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/60 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.3s" }}>
            Describe what you want to build and watch it come to life. Generate beautiful, 
            production-ready websites with just a conversation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button
              variant="panel-primary"
              size="xl"
              onClick={() => navigate("/workspace")}
              className="group"
            >
              Start Building
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="panel-outline"
              size="xl"
            >
              View Examples
            </Button>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-20 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          {["Real-time Preview", "Export Code", "Modern Stack", "No Coding Required"].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 text-sm"
            >
              <Code2 className="w-4 h-4 text-primary-foreground/60" />
              <span className="text-primary-foreground/80">{feature}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 text-center text-sm text-primary-foreground/40 animate-fade-in">
        <p>© 2024 buildAI. Built with intelligence.</p>
      </footer>
    </div>
  );
};

export default Landing;
