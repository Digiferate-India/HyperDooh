// supabase/functions/cv_config_api/index.ts
// Public API for Android APK to get CV configuration

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


//helper function
function normalizeCvConfig(config: any | null) {
  return {
    frame_interval_ms: config?.frame_interval_ms ?? 2000,
    enable_age: config?.enable_age ?? true,
    enable_gender: config?.enable_gender ?? true,
    min_people_for_detection: config?.min_people_for_detection ?? 1,
    min_dwell_to_trigger_sec: config?.min_dwell_to_trigger_sec ?? 5,
    rearm_cooldown_sec: config?.rearm_cooldown_sec ?? 600,
    extra_config: config?.extra_config ?? {},
  };
}

serve(async (req) => {
  try {
    // CORS headers for public API access
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };

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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: screen, error: screenError } = await supabase
    .from("screens")
    .select("id")
    .eq("id", screenId)
    .single();

    if (screenError || !screen) {
      return new Response(
        JSON.stringify({ error: "Invalid screen_id" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 1. Get all cameras for this screen
    const { data: cameras, error: camerasError } = await supabase
      .from("cameras")
      .select("*, cv_configs(*)")
      .eq("screen_id", Number(screenId))
      .eq("is_active", true);

    if (camerasError) {
      console.error("camerasError", camerasError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch cameras" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Get all active rules for this screen
    const { data: rules, error: rulesError } = await supabase
      .from("rules")
      .select("id, name, priority, min_people, max_people, min_males, max_males, min_females, max_females, min_avg_age, max_avg_age, min_dwell_sec, max_dwell_sec, output_media_id, is_active, conditions_json")
      .eq("is_active", true)
      .or(`screen_id.is.null,screen_id.eq.${screenId}`)
      .order("priority", { ascending: false });

    if (rulesError) {
      console.error("rulesError", rulesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch rules" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 3. Format cameras with their configs
    const formattedCameras = cameras?.map((camera) => {
    const config = camera.cv_configs?.[0] ?? null;

    const cvEnabled = Boolean(config);

    return {
      id: camera.id,
      name: camera.name,
      location: camera.location,
      aws_camera_identifier: camera.aws_camera_identifier,
      is_active: camera.is_active,

      // explicit CV control
      cv_enabled: cvEnabled,

      // CV config is only meaningful if CV is enabled
      config: cvEnabled ? normalizeCvConfig(config) : null,
    };
  }) || [];


    // 4. Format rules
    // Add defaults so rules are predictable for the CV engine
    const formattedRules = rules?.map((rule) => ({
      id: rule.id,
      name: rule.name,
      priority: rule.priority ?? 100,

      min_people: rule.min_people ?? null,
      max_people: rule.max_people ?? null,

      min_males: rule.min_males ?? null,
      max_males: rule.max_males ?? null,

      min_females: rule.min_females ?? null,
      max_females: rule.max_females ?? null,

      min_avg_age: rule.min_avg_age ?? null,
      max_avg_age: rule.max_avg_age ?? null,

      min_dwell_sec: rule.min_dwell_sec ?? null,
      max_dwell_sec: rule.max_dwell_sec ?? null,

      output_media_id: rule.output_media_id,
      is_active: rule.is_active === true,

      conditions: rule.conditions_json ?? {},
    })) || [];

    const screenCvEnabled = formattedCameras.some((camera) => camera.cv_enabled === true);
    //Explicit, Future proof API contract
    return new Response(
      JSON.stringify({
        api_version: "cv_config_v1",
        screen: {
          id: parseInt(screenId),
          cv_enabled: screenCvEnabled
        },
        cameras: formattedCameras,
        rules: formattedRules,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: "server error", details: e.message }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
});

