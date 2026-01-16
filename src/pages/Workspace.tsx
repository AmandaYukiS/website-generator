import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import OutputPanel from "@/components/OutputPanel";
import PreviewContent from "@/components/PreviewContent";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

type PreviewType = "landing" | "pricing" | "dashboard" | "empty";

const sampleCode = `import React from 'react';

// Modern Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="font-bold text-lg">Startup</div>
        <nav className="flex gap-6 text-sm text-gray-600">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">About</a>
        </nav>
        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16 text-center">
        <div className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-sm mb-6">
          ✨ Now in Beta
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Build Something Amazing Today
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto mb-8">
          The fastest way to turn your ideas into reality.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-black text-white rounded-lg">
            Start Free
          </button>
          <button className="px-6 py-3 border rounded-lg">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;`;

const Workspace = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewType, setPreviewType] = useState<PreviewType>("empty");
  const [currentCode, setCurrentCode] = useState(sampleCode);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerContent = content.toLowerCase();
    let responseText = "";
    let newPreviewType: PreviewType = previewType;

    if (lowerContent.includes("landing") || lowerContent.includes("homepage") || lowerContent.includes("website")) {
      responseText = "I've generated a modern landing page for you! It includes a clean navigation bar, a compelling hero section with call-to-action buttons, and a features section. You can view the live preview or check out the code.";
      newPreviewType = "landing";
    } else if (lowerContent.includes("pricing") || lowerContent.includes("plans")) {
      responseText = "Here's a clean pricing page with three tiers: Starter, Pro, and Enterprise. Each plan clearly shows its features and pricing. The Pro plan is highlighted as the recommended choice.";
      newPreviewType = "pricing";
    } else if (lowerContent.includes("dashboard") || lowerContent.includes("admin") || lowerContent.includes("analytics")) {
      responseText = "I've created a dashboard layout with a sidebar navigation, key metrics cards, and a chart area. This provides a solid foundation for your admin panel or analytics dashboard.";
      newPreviewType = "dashboard";
    } else {
      responseText = "I understand! Let me help you build that. Could you tell me more about what kind of page you'd like? For example:\n\n• A landing page for your product\n• A pricing page with different plans\n• A dashboard with analytics\n\nJust describe what you need and I'll generate it for you.";
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responseText,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setPreviewType(newPreviewType);
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">buildAI Workspace</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Save
          </Button>
          <Button size="sm">
            Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[380px] flex-shrink-0 border-r border-border animate-slide-in-left">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Output Panel */}
        <div className="flex-1 animate-slide-in-right">
          <OutputPanel
            previewContent={<PreviewContent type={previewType} />}
            codeContent={currentCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
