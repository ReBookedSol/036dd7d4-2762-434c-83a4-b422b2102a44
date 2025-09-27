import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

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
  const [streamingMessage, setStreamingMessage] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage, open]);

  const sendMessage = async (useStreaming = true) => {
    const text = input.trim();
    if (!text) return;

    const newUserMessage: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, newUserMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setStreamingMessage("");

    try {
      if (useStreaming) {
        // Streaming response with timeout + abort for reliability
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort("timeout"), 20000);

        const response = await fetch(`https://kwzezhgyhtysrnvldins.supabase.co/functions/v1/chatbot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((msg) => ({ role: msg.role, content: msg.content })),
            stream: true,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Streaming request failed");
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          setStreamingMessage(accumulatedText);
        }

        // Add the complete message to chat history
        if (accumulatedText) {
          setMessages((prev) => [...prev, { role: "assistant", content: accumulatedText }]);
        }
        setStreamingMessage("");
      } else {
        // Fallback to non-streaming
        const { data, error } = await supabase.functions.invoke("chatbot", {
          body: { messages: updatedMessages.map(msg => ({ role: msg.role, content: msg.content })) },
        });

        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }

        const reply = data?.reply ?? "Sorry, I couldn't generate a response.";
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      }
    } catch (err: any) {
      console.error("Chatbot error:", err);
      
      // Fallback to non-streaming if streaming fails
      if (useStreaming) {
        console.log("Streaming failed, trying non-streaming...");
        await sendMessage(false);
        return;
      }

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
        <Button 
          onClick={() => setOpen(true)} 
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200" 
          aria-label="Open AI study assistant"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          Ask AI
        </Button>
      )}

      {open && (
        <Card className="w-[min(92vw,400px)] h-[500px] shadow-xl border-2">
          <CardHeader className="flex flex-row items-center justify-between py-3 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Study Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chatbot">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[400px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 text-sm">
                {messages.length === 0 && (
                  <div className="text-muted-foreground text-center py-8">
                    <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Ask me about past papers, subjects, or study tips!</p>
                  </div>
                )}
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-2 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "user" ? "bg-primary" : "bg-secondary"
                      }`}>
                        {msg.role === "user" ? (
                          <User className="h-3 w-3 text-primary-foreground" />
                        ) : (
                          <Bot className="h-3 w-3 text-secondary-foreground" />
                        )}
                      </div>
                      <div className={`rounded-lg px-3 py-2 ${
                        msg.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                {streamingMessage && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary">
                        <Bot className="h-3 w-3 text-secondary-foreground" />
                      </div>
                      <div className="rounded-lg px-3 py-2 bg-muted">
                        {streamingMessage}
                        <span className="animate-pulse">|</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your question..."
                  disabled={loading}
                  aria-label="Chat input"
                  className="flex-1"
                />
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={loading || !input.trim()} 
                  aria-label="Send message"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;
