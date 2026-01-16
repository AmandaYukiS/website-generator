import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading?: boolean;
}

const ChatPanel = ({ onSendMessage, messages, isLoading }: ChatPanelProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="h-full flex flex-col panel-dark">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-panel-dark-border">
        <div className="w-8 h-8 rounded-lg bg-panel-dark-foreground flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-panel-dark" />
        </div>
        <div>
          <h2 className="font-semibold text-panel-dark-foreground">AI Assistant</h2>
          <p className="text-xs text-panel-dark-muted">Describe what you want to build</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-panel-dark-border/30 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-panel-dark-muted" />
            </div>
            <h3 className="text-lg font-medium text-panel-dark-foreground mb-2">
              Start a Conversation
            </h3>
            <p className="text-sm text-panel-dark-muted max-w-xs">
              Tell me what kind of website you want to build and I'll generate it for you.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-slide-up ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-panel-dark-border flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-panel-dark-foreground" />
              </div>
            )}
            <div
              className={`max-w-[80%] ${
                message.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-panel-dark-foreground flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-panel-dark" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-panel-dark-border flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-panel-dark-foreground animate-pulse" />
            </div>
            <div className="chat-bubble-assistant">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-panel-dark-muted animate-pulse" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 rounded-full bg-panel-dark-muted animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 rounded-full bg-panel-dark-muted animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-panel-dark-border">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            className="w-full bg-panel-dark-border/30 text-panel-dark-foreground placeholder:text-panel-dark-muted rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-panel-dark-foreground/20 transition-all text-sm"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="panel-ghost"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-panel-dark-muted text-center mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
