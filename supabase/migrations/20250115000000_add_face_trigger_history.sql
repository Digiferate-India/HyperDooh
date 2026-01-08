-- Migration: Add face_trigger_history table for unique face tracking
-- This table tracks when each unique face triggers a rule to prevent duplicate triggers

CREATE TABLE IF NOT EXISTS "public"."face_trigger_history" (
    "id" BIGSERIAL PRIMARY KEY,
    "face_external_id" TEXT NOT NULL,
    "screen_id" BIGINT NOT NULL,
    "rule_id" BIGINT,
    "media_id" BIGINT,
    "triggered_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "expires_at" TIMESTAMP WITH TIME ZONE,
    CONSTRAINT "face_trigger_history_screen_id_fkey" FOREIGN KEY ("screen_id") 
        REFERENCES "public"."screens"("id") ON DELETE CASCADE,
    CONSTRAINT "face_trigger_history_rule_id_fkey" FOREIGN KEY ("rule_id") 
        REFERENCES "public"."rules"("id") ON DELETE SET NULL,
    CONSTRAINT "face_trigger_history_media_id_fkey" FOREIGN KEY ("media_id") 
        REFERENCES "public"."media"("id") ON DELETE SET NULL
);

-- Create unique index to prevent duplicate triggers for same face+screen+rule
CREATE UNIQUE INDEX IF NOT EXISTS "face_trigger_history_unique_trigger" 
ON "public"."face_trigger_history"("face_external_id", "screen_id", "rule_id");

-- Create index for fast cooldown lookups
CREATE INDEX IF NOT EXISTS "idx_face_trigger_history_lookup" 
ON "public"."face_trigger_history"("face_external_id", "screen_id", "triggered_at");

-- Create index for cleanup of expired records
CREATE INDEX IF NOT EXISTS "idx_face_trigger_history_expires" 
ON "public"."face_trigger_history"("expires_at");

-- Enable RLS
ALTER TABLE "public"."face_trigger_history" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own screen's trigger history
CREATE POLICY "Users can view their own screen trigger history" 
ON "public"."face_trigger_history" FOR SELECT 
TO "authenticated" 
USING (
    EXISTS (
        SELECT 1 FROM "public"."screens" 
        WHERE "screens"."id" = "face_trigger_history"."screen_id" 
        AND "screens"."user_id" = auth.uid()
    )
);

-- Grant permissions
GRANT ALL ON TABLE "public"."face_trigger_history" TO "anon";
GRANT ALL ON TABLE "public"."face_trigger_history" TO "authenticated";
GRANT ALL ON TABLE "public"."face_trigger_history" TO "service_role";

GRANT ALL ON SEQUENCE "public"."face_trigger_history_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."face_trigger_history_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."face_trigger_history_id_seq" TO "service_role";

