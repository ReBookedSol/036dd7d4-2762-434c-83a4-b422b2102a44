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

    const { messages, stream = true } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // References provided by the user to be cited when relevant
    const references = [
      "https://platform.openai.com/docs/api-reference/chat",
      "https://help.openai.com/en/articles/6643167-how-to-use-the-openai-api-for-q-a-or-to-build-a-chatbot",
      "https://www.leanware.co/insights/integrate-chatgpt-to-web-app",
      "https://www.brihaspatitech.com/blog/build-a-chatbot-using-openai-rag-2025-guide/",
      "https://blog.hubspot.com/website/chatgpt-integration",
      "https://community.openai.com/t/creating-a-chatbot-with-openai-api/721246",
      "https://community.openai.com/t/integrating-data-from-chatgpt-to-a-website-app-via-predefined-prompts/840215",
    ];

    // Build messages with a helpful system prompt that requests citations
    const baseMessages = [
      {
        role: "system",
        content:
          "You are a helpful study assistant for past papers and subjects. Provide clear, step-by-step answers. When applicable, cite relevant sources from the provided reference list using their URLs as citations. If you don't know, say you don't know. Keep answers concise and useful.",
      },
      {
        role: "system",
        content: `Reference links you may cite when relevant (do not invent links):\n${references
          .map((r, i) => `${i + 1}. ${r}`)
          .join("\n")}`,
      },
      ...messages,
    ];

    // Prefer user's requested models first, but fallback to widely available ones
    const preferredModels = [
      "gpt-5-mini-2025-08-07",
      "gpt-5-mini",
      "gpt-4.1-2025-04-14",
      "o4-mini-2025-04-16",
      "gpt-4o-mini",
      "gpt-4o",
    ];

    const buildBody = (model: string) => {
      // Newer models require max_completion_tokens and do not support temperature
      const usesNewerParams = /^(gpt-5|o[34]|gpt-4\.1)/.test(model);
      const common: Record<string, unknown> = {
        model,
        messages: baseMessages,
        stream: stream === true,
      };

      if (usesNewerParams) {
        common.max_completion_tokens = 500;
      } else {
        common.max_tokens = 500;
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
      return new Response(
        JSON.stringify({ error: "OpenAI request failed", details: lastErrorText?.slice(0, 500) }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
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
              const lines = chunk.split("\n");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6);
                  if (data === "[DONE]") {
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
          "X-Model-Used": chosenModel,
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
    console.error("chatbot function error:", error);
    return new Response(JSON.stringify({ error: error?.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
