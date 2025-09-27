import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, X, Send } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const newUserMessage: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, newUserMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: updatedMessages },
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      const reply = data?.reply ?? "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("Chatbot error:", err);
      toast({
        title: "Chat error",
        description: err?.message ?? "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <Button onClick={() => setOpen(true)} className="rounded-full shadow-md" aria-label="Open study assistant">
          <MessageSquare className="h-5 w-5 mr-2" />
          Ask AI
        </Button>
      )}

      {open && (
        <Card className="w-[min(92vw,380px)] shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-base">Study Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chatbot">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-64 pr-3">
              <div className="space-y-3 text-sm">
                {messages.length === 0 && (
                  <p className="text-muted-foreground">Ask about past papers, subjects, or how to study smarter.</p>
                )}
                {messages.map((m, idx) => (
                  <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
                    <span
                      className={
                        m.role === "user"
                          ? "inline-block rounded-lg px-3 py-2 bg-primary text-primary-foreground"
                          : "inline-block rounded-lg px-3 py-2 bg-muted"
                      }
                    >
                      {m.content}
                    </span>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </ScrollArea>
            <div className="mt-3 flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type your question..."
                disabled={loading}
                aria-label="Chat input"
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()} aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;
