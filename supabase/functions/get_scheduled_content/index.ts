import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const screenId = url.searchParams.get("screen_id");

    if (!screenId) {
      return new Response(
        JSON.stringify({ error: "screen_id is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const now = new Date();

    /* 1️ TRIGGER HAS ABSOLUTE PRIORITY */
    const { data: trigger } = await supabase
      .from("triggers")
      .select("media_id, expires_at, active")
      .eq("screen_id", Number(screenId))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (trigger?.media_id && trigger.active === true) {
      const expiresAt = trigger.expires_at
        ? new Date(trigger.expires_at)
        : null;

      const stillValid = !expiresAt || expiresAt > now;

      if (stillValid) {
        return new Response(
          JSON.stringify({
            mode: "trigger",
            media_id: trigger.media_id,
            expires_at: trigger.expires_at ?? null,
            reason: "Active CV trigger has precedence",
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }


    /*2️ SCHEDULED CONTENT*/
    const { data: scheduled } = await supabase
      .from("screens_media")
      .select("media_id, display_order")
      .eq("screen_id", Number(screenId))
      .order("display_order", { ascending: true });

    if (scheduled && scheduled.length > 0) {
      return new Response(
        JSON.stringify({
          mode: "scheduled",
          playlist: scheduled,
          reason: "No valid trigger, serving scheduled content",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    /*3️ FALLBACK */
    return new Response(
      JSON.stringify({
        mode: "fallback",
        playlist: [],
        reason: "No trigger and no scheduled content",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
