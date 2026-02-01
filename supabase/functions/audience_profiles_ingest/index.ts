import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// NOTE: Trigger logic (rule matching, cooldowns, trigger creation) is now
// handled by the evaluate_rules_and_trigger RPC function called from cvWorker.js
// This function only saves audience profiles and faces to avoid duplicate trigger creation

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json();
  const {
    screen_id,
    camera_id,
    people_count,
    male_count,
    female_count,
    avg_age,
    min_age,
    max_age,
    dwell_time_sec,
    faces = [],
  } = body;
  
  if (!screen_id || !camera_id) {
    return new Response(
      JSON.stringify({ error: "screen_id and camera_id are required" }),
      { status: 400 }
    );
  }

  // 🔧 Normalize face IDs
  const normalizedFaces = faces.map((f: any) => ({
    ...f,
    face_external_id: f.face_external_id ?? f.face_id ?? null,
  }));

  // 1. Save audience profile
  const { data: profile, error: pErr } = await supabase
    .from("audience_profiles")
    .insert({
      screen_id,
      camera_id,
      people_count,
      male_count,
      female_count,
      avg_age,
      min_age,
      max_age,
      dwell_time_sec,
      raw_payload: body,
    })
    .select("id")
    .single();

  if (pErr) return new Response(pErr.message, { status: 500 });

  // save faces updarted (normalized)

  if (normalizedFaces.length) {
    await supabase.from("audience_faces").insert(
      normalizedFaces
        .filter(f => f.face_external_id)
        .map((f: any) => ({
          profile_id: profile.id,
          face_external_id: f.face_external_id,
          age: f.age,
          gender: f.gender,
          dwell_time_sec: f.dwell_time_sec,
          is_new: f.is_new ?? false,
        }))
    );
  }


  // NOTE: Trigger logic (rule matching, cooldowns, trigger creation) is now
  // handled by the evaluate_rules_and_trigger RPC function called from cvWorker.js
  // This function only saves audience profiles and faces to avoid duplicate trigger creation

  return new Response(
    JSON.stringify({ 
      status: "profile_saved", 
      profile_id: profile.id,
      faces_count: normalizedFaces.length 
    }),
    { status: 200 }
  );
});
