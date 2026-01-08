import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FACE_COOLDOWN_MS = 30_000;
const TRIGGER_TTL_MS = 30_000;


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

  // Pick a candidate face for triggering
  // Prefer a new face if available
  const triggeringFace =
  normalizedFaces.find((f: any) => f.is_new === true && f.face_external_id)
  || normalizedFaces.find((f: any) => f.face_external_id)
  || null;


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


  // 3. Load rules
  const { data: rules } = await supabase
    .from("rules")
    .select("*")
    .eq("screen_id", screen_id)
    .eq("is_active", true)
    .order("priority", { ascending: false });
;

  let matchedRule = null;
  for (const r of rules ?? []) {
    if (
      (r.min_people == null || people_count >= r.min_people) &&
      (r.min_females == null || female_count >= r.min_females) &&
      (r.min_males == null || male_count >= r.min_males)
    ) {
      matchedRule = r;
      break;
    }
  }

  if (!matchedRule) {
    return new Response(JSON.stringify({ status: "no_match" }), { status: 200 });
  }


    // 2.5 Face cooldown enforcement (Milestone 2)
  if (triggeringFace?.face_external_id) {
    const now = new Date();

    const { data: lastTrigger } = await supabase
      .from("face_trigger_history")
      .select("expires_at")
      .eq("face_external_id", triggeringFace.face_external_id)
      .eq("screen_id", screen_id)
      .eq("rule_id", matchedRule.id)
      .order("triggered_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastTrigger?.expires_at) {
      const expiresAt = new Date(lastTrigger.expires_at);

      if (expiresAt > now) {
        // ⛔ Face is still in cooldown
        return new Response(
          JSON.stringify({
            status: "cooldown_active",
            face_external_id: triggeringFace.face_external_id,
            cooldown_until: expiresAt.toISOString(),
          }),
          { status: 200 }
        );
      }
    }
  }


  // 4. Trigger creation updated
  const expires = new Date(Date.now() + TRIGGER_TTL_MS);

  await supabase.from("triggers").insert({
    screen_id,
    media_id: matchedRule.output_media_id,
    rule_id: matchedRule.id,
    expires_at: expires.toISOString(),
    trigger_profile: body,
  });

  // Record face trigger history for cooldown tracking
  if (triggeringFace?.face_external_id) {
    await supabase.from("face_trigger_history").insert({
      face_external_id: triggeringFace.face_external_id,
      screen_id,
      rule_id: matchedRule.id,
      media_id: matchedRule.output_media_id,
      triggered_at: new Date().toISOString(),
      expires_at: expires.toISOString(),
    });
  }


  return new Response(
    JSON.stringify({ status: "trigger_created", rule_id: matchedRule.id }),
    { status: 200 }
  );
});
