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

    const { messages, stream = false } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build messages with a helpful system prompt
    const baseMessages = [
      { role: "system", content: "You are a helpful study assistant for past papers and subjects. You help students with their academic questions, provide explanations, and guide them through learning materials." },
      ...messages
    ];

    // Prefer user's requested models first, but fallback to widely available ones
    const preferredModels = [
      "gpt-5-mini-2025-08-07", // may not be available on all projects
      "gpt-5-mini",            // alternate alias
      "gpt-4.1-2025-04-14",    // newer API surface (uses max_completion_tokens)
      "o4-mini-2025-04-16",    // newer API surface
      "gpt-4o-mini",           // legacy but broadly available
      "gpt-4o"                 // legacy more capable
    ];

    const buildBody = (model: string) => {
      // Newer models require max_completion_tokens and do not support temperature
      const usesNewerParams = /^(gpt-5|o[34]|gpt-4\.1)/.test(model);
      const common = {
        model,
        messages: baseMessages,
        stream: stream
      } as any;

      if (usesNewerParams) {
        common.max_completion_tokens = 500;
      } else {
        // Legacy models use max_tokens
        common.max_tokens = 500;
        // Intentionally omit temperature here to keep behavior consistent
      }
      return common;
    };

    let response: Response | null = null;
    let chosenModel = "";
    let lastErrorText = "";

    for (const model of preferredModels) {
      const body = buildBody(model);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        response = res;
        chosenModel = model;
        break;
      }

      const errText = await res.text();
      lastErrorText = errText;
      console.error(`OpenAI error with model ${model}:`, errText);

      // Retry with next model only for model-related errors
      try {
        const parsed = JSON.parse(errText);
        const msg = parsed?.error?.message || "";
        const code = parsed?.error?.code || "";
        if (!(code === "model_not_found" || /model/i.test(msg))) {
          // Not a model availability issue; break and surface error
          break;
        }
      } catch (_) {
        // If we can't parse, attempt next model once
      }
    }

    if (!response) {
      return new Response(JSON.stringify({ error: "OpenAI request failed", details: lastErrorText?.slice(0, 500) }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (stream) {
      // Handle streaming response (SSE from OpenAI) and relay as a simple text stream
      const readableStream = new ReadableStream({
        async start(controller) {
          const reader = response!.body?.getReader();
          if (!reader) return;

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = new TextDecoder().decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    controller.close();
                    return;
                  }
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(new TextEncoder().encode(content));
                    }
                  } catch (_) {
                    // ignore non-JSON keep-alives
                  }
                }
              }
            }
          } catch (error) {
            console.error("Streaming error:", error);
            controller.error(error);
          }
        },
      });

      return new Response(readableStream, {
        headers: { 
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "X-Model-Used": chosenModel
        },
      });
    } else {
      // Handle non-streaming response
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content ?? "I couldn't generate a response.";

      return new Response(JSON.stringify({ reply, model: chosenModel }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("ai-chat function error:", error);
    return new Response(JSON.stringify({ error: error?.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
