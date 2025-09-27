import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPEN_AI_KEY") || Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("Missing OPENAI API Key: set OPEN_AI_KEY in Supabase secrets");
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, messages } = await req.json();

    const body = messages && Array.isArray(messages)
      ? { 
          model: "gpt-5-mini-2025-08-07", 
          messages,
          max_completion_tokens: 500
        }
      : {
          model: "gpt-5-mini-2025-08-07",
          messages: [
            { role: "system", content: "You are a helpful study assistant for past papers and subjects. You help students with their academic questions, provide explanations, and guide them through learning materials." },
            { role: "user", content: String(prompt ?? "Say hello") },
          ],
          max_completion_tokens: 500
        };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return new Response(JSON.stringify({ error: "OpenAI request failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-chat function error:", error);
    return new Response(JSON.stringify({ error: error?.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
