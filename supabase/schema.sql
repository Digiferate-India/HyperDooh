


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."bulk_assign_folder_to_screen"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
DECLARE
  media_record RECORD;
BEGIN
  FOR media_record IN
    SELECT id FROM public.media WHERE folder_id = p_folder_id
  LOOP
    INSERT INTO public.screens_media (
      screen_id, media_id, duration, scheduled_time, gender, age_group
    ) VALUES (
      p_screen_id, media_record.id, p_duration_sec, 
      p_scheduled_time, p_gender_text, p_age_group_text
    )
    ON CONFLICT (screen_id, media_id)
    DO UPDATE SET
      duration = p_duration_sec,
      scheduled_time = p_scheduled_time,
      gender = p_gender_text,
      age_group = p_age_group_text;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."bulk_assign_folder_to_screen"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  media_record RECORD;
BEGIN
  -- Loop through all media items in the specified folder
  FOR media_record IN
    SELECT id FROM public.media WHERE folder_id = p_folder_id
  LOOP
    -- Create a new assignment or update an existing one
    INSERT INTO public.screens_media (
      screen_id,
      media_id,
      duration,
      scheduled_time,
      gender,
      age_group
    )
    VALUES (
      p_screen_id,
      media_record.id,
      p_duration_sec,
      p_scheduled_time,
      p_gender_text,
      p_age_group_text
    )
    ON CONFLICT (screen_id, media_id)
    DO UPDATE SET
      duration = p_duration_sec,
      scheduled_time = p_scheduled_time,
      gender = p_gender_text,
      age_group = p_age_group_text;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  media_record RECORD;
BEGIN
  FOR media_record IN
    SELECT id FROM public.media WHERE folder_id = p_folder_id
  LOOP
    INSERT INTO public.screens_media (
      screen_id,
      media_id,
      duration,
      scheduled_time,
      gender,
      age_group,
      orientation -- ✅ ADDED
    )
    VALUES (
      p_screen_id,
      media_record.id,
      p_duration_sec,
      p_scheduled_time,
      p_gender_text,
      p_age_group_text,
      p_orientation_text -- ✅ ADDED
    )
    ON CONFLICT (screen_id, media_id)
    DO UPDATE SET
      duration = p_duration_sec,
      scheduled_time = p_scheduled_time,
      gender = p_gender_text,
      age_group = p_age_group_text,
      orientation = p_orientation_text; -- ✅ ADDED
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Insert or update assignments for all media in the given folder
    INSERT INTO public.screens_media (
        screen_id,
        media_id,
        duration,
        scheduled_time, -- This column is now a timestamp
        gender,
        age_group,
        orientation
    )
    -- Select all media items from the specified folder
    SELECT
        p_screen_id,
        id, -- This is the media_id from the media table
        p_duration_sec,
        p_scheduled_time,
        p_gender_text,
        p_age_group_text,
        p_orientation_text
    FROM
        public.media
    WHERE
        folder_id = p_folder_id
    
    -- On conflict (if the assignment already exists), update it
    ON CONFLICT (screen_id, media_id)
    DO UPDATE SET
        duration = EXCLUDED.duration,
        scheduled_time = EXCLUDED.scheduled_time,
        gender = EXCLUDED.gender,
        age_group = EXCLUDED.age_group,
        orientation = EXCLUDED.orientation;
        
END;
$$;


ALTER FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.screens_media (
        screen_id,
        media_id,
        duration,
        start_time, -- ✅ UPDATED
        end_time,   -- ✅ ADDED
        gender,
        age_group,
        orientation
    )
    SELECT
        p_screen_id,
        id, 
        p_duration_sec,
        p_start_time,
        p_end_time,
        p_gender_text,
        p_age_group_text,
        p_orientation_text
    FROM
        public.media
    WHERE
        folder_id = p_folder_id
    
    ON CONFLICT (screen_id, media_id)
    DO UPDATE SET
        duration = EXCLUDED.duration,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        gender = EXCLUDED.gender,
        age_group = EXCLUDED.age_group,
        orientation = EXCLUDED.orientation;
        
END;
$$;


ALTER FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_schedule_start_date" "date", "p_schedule_end_date" "date", "p_daily_start_time" time without time zone, "p_daily_end_time" time without time zone, "p_days_of_week" "text", "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.screens_media (
        screen_id,
        media_id,
        duration,
        start_time,
        end_time,
        schedule_start_date, -- ✅
        schedule_end_date,   -- ✅
        daily_start_time,    -- ✅
        daily_end_time,      -- ✅
        days_of_week,        -- ✅
        gender,
        age_group,
        orientation
    )
    SELECT
        p_screen_id,
        id, 
        p_duration_sec,
        p_start_time,
        p_end_time,
        p_schedule_start_date,
        p_schedule_end_date,
        p_daily_start_time,
        p_daily_end_time,
        p_days_of_week,
        p_gender_text,
        p_age_group_text,
        p_orientation_text
    FROM
        public.media
    WHERE
        folder_id = p_folder_id
    
    ON CONFLICT (screen_id, media_id)
    DO UPDATE SET
        duration = EXCLUDED.duration,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        schedule_start_date = EXCLUDED.schedule_start_date,
        schedule_end_date = EXCLUDED.schedule_end_date,
        daily_start_time = EXCLUDED.daily_start_time,
        daily_end_time = EXCLUDED.daily_end_time,
        days_of_week = EXCLUDED.days_of_week,
        gender = EXCLUDED.gender,
        age_group = EXCLUDED.age_group,
        orientation = EXCLUDED.orientation;
END;
$$;


ALTER FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_schedule_start_date" "date", "p_schedule_end_date" "date", "p_daily_start_time" time without time zone, "p_daily_end_time" time without time zone, "p_days_of_week" "text", "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_folder_and_unassign_media"("p_folder_id" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- 1. Unassign all media items from this folder
  UPDATE public.media
  SET folder_id = NULL
  WHERE folder_id = p_folder_id;

  -- 2. Delete the folder itself
  DELETE FROM public.folders
  WHERE id = p_folder_id
  AND user_id = auth.uid(); -- Double-check ownership
END;
$$;


ALTER FUNCTION "public"."delete_folder_and_unassign_media"("p_folder_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_playlist_for_screen"("screen_id_to_check" bigint) RETURNS TABLE("item_id" bigint, "duration" integer, "start_time" timestamp without time zone, "end_time" timestamp without time zone, "schedule_start_date" "date", "schedule_end_date" "date", "daily_start_time" time without time zone, "daily_end_time" time without time zone, "days_of_week" "text", "file_name" "text", "file_path" "text", "file_type" "text", "orientation" "text")
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT 
    sm.id as item_id,
    sm.duration,
    sm.start_time,
    sm.end_time,
    -- ✅ Return new columns
    sm.schedule_start_date,
    sm.schedule_end_date,
    sm.daily_start_time,
    sm.daily_end_time,
    sm.days_of_week,
    
    m.file_name,
    m.file_path,
    m.file_type,
    sm.orientation
  FROM 
    public.screens_media sm
  JOIN 
    public.media m ON sm.media_id = m.id
  WHERE 
    sm.screen_id = screen_id_to_check;
$$;


ALTER FUNCTION "public"."get_playlist_for_screen"("screen_id_to_check" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_screen_status"("screen_id_to_check" bigint) RETURNS "text"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT status
  FROM public.screens
  WHERE id = screen_id_to_check;
$$;


ALTER FUNCTION "public"."get_screen_status"("screen_id_to_check" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."pair_screen"("code_to_check" "text") RETURNS TABLE("id" bigint, "custom_name" "text", "area" "text", "city" "text", "user_id" "uuid")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  screen_row screens%ROWTYPE;
BEGIN
  -- Find the screen that matches the code AND is pending
  SELECT *
  INTO screen_row
  FROM public.screens
  WHERE pairing_code = code_to_check
    AND status = 'pending'
  LIMIT 1;

  -- If we found a matching screen...
  IF FOUND THEN
    -- Update its status to 'paired'
    UPDATE public.screens
    SET 
      status = 'paired',
      paired_at = NOW()
    WHERE public.screens.id = screen_row.id;

    -- Return the details of the paired screen
    RETURN QUERY
    SELECT 
      screen_row.id, 
      screen_row.custom_name, 
      screen_row.area, 
      screen_row.city, 
      screen_row.user_id;
  END IF;
END;
$$;


ALTER FUNCTION "public"."pair_screen"("code_to_check" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."unpair_screen"("screen_id_to_unpair" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- Update the screen's status back to 'pending'
  UPDATE public.screens
  SET 
    status = 'pending',
    paired_at = NULL
  WHERE id = screen_id_to_unpair;
END;
$$;


ALTER FUNCTION "public"."unpair_screen"("screen_id_to_unpair" bigint) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."age_distribution" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "age_range" "text",
    "count" bigint
);


ALTER TABLE "public"."age_distribution" OWNER TO "postgres";


ALTER TABLE "public"."age_distribution" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."age_distribution_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."audience_faces" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" bigint,
    "face_external_id" "text",
    "age" numeric,
    "gender" "text",
    "dwell_time_sec" integer,
    "is_new" boolean DEFAULT false
);


ALTER TABLE "public"."audience_faces" OWNER TO "postgres";


ALTER TABLE "public"."audience_faces" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."audience_faces_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."audience_profiles" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "screen_id" bigint,
    "camera_id" bigint,
    "people_count" integer,
    "male_count" integer,
    "female_count" integer,
    "avg_age" numeric,
    "min_age" numeric,
    "max_age" numeric,
    "dwell_time_sec" integer,
    "raw_payload" "jsonb"
);


ALTER TABLE "public"."audience_profiles" OWNER TO "postgres";


ALTER TABLE "public"."audience_profiles" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."audience_profiles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."cameras" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "screen_id" bigint,
    "name" "text",
    "location" "text",
    "aws_camera_identifier" "text",
    "is_active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."cameras" OWNER TO "postgres";


ALTER TABLE "public"."cameras" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."cameras_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."cv_configs" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "camera_id" bigint,
    "frame_interval_ms" integer DEFAULT 2000,
    "enable_age" boolean DEFAULT true NOT NULL,
    "enable_gender" boolean DEFAULT true NOT NULL,
    "min_people_for_detection" integer,
    "min_dwell_to_trigger_sec" integer DEFAULT 5,
    "rearm_cooldown_sec" integer DEFAULT 600,
    "extra_config" "jsonb"
);


ALTER TABLE "public"."cv_configs" OWNER TO "postgres";


ALTER TABLE "public"."cv_configs" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."cv_configs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."daily_users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_count" bigint,
    "date" "date"
);


ALTER TABLE "public"."daily_users" OWNER TO "postgres";


ALTER TABLE "public"."daily_users" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."daily_users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."folders" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."folders" OWNER TO "postgres";


ALTER TABLE "public"."folders" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."folders_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."gender_distribution" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "gender" "text",
    "count" bigint
);


ALTER TABLE "public"."gender_distribution" OWNER TO "postgres";


ALTER TABLE "public"."gender_distribution" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."gender_distribution_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."media" (
    "id" bigint NOT NULL,
    "file_name" "text" NOT NULL,
    "file_path" "text" NOT NULL,
    "file_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "folder_id" bigint,
    "thumbnail_path" "text"
);


ALTER TABLE "public"."media" OWNER TO "postgres";


ALTER TABLE "public"."media" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."media_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."rules" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid",
    "screen_id" bigint,
    "name" "text" NOT NULL,
    "description" "text",
    "priority" integer DEFAULT 100 NOT NULL,
    "min_people" integer,
    "max_people" integer,
    "min_males" integer,
    "max_males" integer,
    "min_females" integer,
    "max_females" integer,
    "min_avg_age" integer,
    "max_avg_age" integer,
    "min_dwell_sec" integer,
    "max_dwell_sec" integer,
    "output_media_id" bigint,
    "is_active" boolean DEFAULT true NOT NULL,
    "conditions_json" "jsonb"
);


ALTER TABLE "public"."rules" OWNER TO "postgres";


ALTER TABLE "public"."rules" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."rules_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."screens" (
    "id" bigint NOT NULL,
    "custom_name" "text" NOT NULL,
    "pairing_code" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "area" "text",
    "city" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "paired_at" timestamp with time zone,
    "user_id" "uuid"
);


ALTER TABLE "public"."screens" OWNER TO "postgres";


ALTER TABLE "public"."screens" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."screens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."screens_media" (
    "id" bigint NOT NULL,
    "screen_id" bigint,
    "media_id" bigint,
    "display_order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "duration" integer DEFAULT 10,
    "user_id" "uuid",
    "gender" "text",
    "age_group" "text",
    "orientation" "text" DEFAULT 'any'::"text",
    "start_time" timestamp without time zone,
    "end_time" timestamp without time zone,
    "schedule_start_date" "date",
    "schedule_end_date" "date",
    "daily_start_time" time without time zone,
    "daily_end_time" time without time zone,
    "days_of_week" "text"
);


ALTER TABLE "public"."screens_media" OWNER TO "postgres";


ALTER TABLE "public"."screens_media" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."screens_media_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."triggers" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "screen_id" bigint NOT NULL,
    "media_id" bigint,
    "rule_id" bigint,
    "active" boolean DEFAULT true NOT NULL,
    "expires_at" timestamp with time zone,
    "trigger_profile" "jsonb"
);


ALTER TABLE "public"."triggers" OWNER TO "postgres";


ALTER TABLE "public"."triggers" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."triggers_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."age_distribution"
    ADD CONSTRAINT "age_distribution_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audience_faces"
    ADD CONSTRAINT "audience_faces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audience_faces"
    ADD CONSTRAINT "audience_faces_profile_id_face_external_id_key" UNIQUE ("profile_id", "face_external_id");



ALTER TABLE ONLY "public"."audience_profiles"
    ADD CONSTRAINT "audience_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cameras"
    ADD CONSTRAINT "cameras_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cv_configs"
    ADD CONSTRAINT "cv_configs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."daily_users"
    ADD CONSTRAINT "daily_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."folders"
    ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gender_distribution"
    ADD CONSTRAINT "gender_distribution_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."screens_media"
    ADD CONSTRAINT "screens_media_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."screens_media"
    ADD CONSTRAINT "screens_media_unique_assignment" UNIQUE ("screen_id", "media_id");



ALTER TABLE ONLY "public"."screens"
    ADD CONSTRAINT "screens_pairing_code_key" UNIQUE ("pairing_code");



ALTER TABLE ONLY "public"."screens"
    ADD CONSTRAINT "screens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."triggers"
    ADD CONSTRAINT "triggers_pkey" PRIMARY KEY ("id");



CREATE INDEX "audience_faces_profile_id_idx" ON "public"."audience_faces" USING "btree" ("profile_id");



CREATE INDEX "audience_profiles_created_at_idx" ON "public"."audience_profiles" USING "btree" ("created_at");



CREATE INDEX "audience_profiles_screen_id_idx" ON "public"."audience_profiles" USING "btree" ("screen_id");



CREATE INDEX "cameras_screen_id_idx" ON "public"."cameras" USING "btree" ("screen_id");



CREATE INDEX "cv_configs_camera_id_idx" ON "public"."cv_configs" USING "btree" ("camera_id");



CREATE INDEX "rules_priority_idx" ON "public"."rules" USING "btree" ("priority" DESC);



CREATE INDEX "rules_screen_id_idx" ON "public"."rules" USING "btree" ("screen_id");



CREATE INDEX "triggers_expires_at_idx" ON "public"."triggers" USING "btree" ("expires_at");



CREATE UNIQUE INDEX "triggers_one_active_per_screen" ON "public"."triggers" USING "btree" ("screen_id") WHERE ("active" = true);



ALTER TABLE ONLY "public"."audience_faces"
    ADD CONSTRAINT "audience_faces_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."audience_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."audience_profiles"
    ADD CONSTRAINT "audience_profiles_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "public"."cameras"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."audience_profiles"
    ADD CONSTRAINT "audience_profiles_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cameras"
    ADD CONSTRAINT "cameras_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cv_configs"
    ADD CONSTRAINT "cv_configs_camera_id_fkey" FOREIGN KEY ("camera_id") REFERENCES "public"."cameras"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."folders"
    ADD CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."media"
    ADD CONSTRAINT "media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_output_media_id_fkey" FOREIGN KEY ("output_media_id") REFERENCES "public"."media"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rules"
    ADD CONSTRAINT "rules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."screens_media"
    ADD CONSTRAINT "screens_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."screens_media"
    ADD CONSTRAINT "screens_media_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."screens_media"
    ADD CONSTRAINT "screens_media_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."screens"
    ADD CONSTRAINT "screens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."triggers"
    ADD CONSTRAINT "triggers_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."triggers"
    ADD CONSTRAINT "triggers_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "public"."rules"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."triggers"
    ADD CONSTRAINT "triggers_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "public"."screens"("id") ON DELETE CASCADE;



CREATE POLICY "Enable delete for users based on user_id" ON "public"."screens" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."screens_media" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."age_distribution" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."daily_users" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."gender_distribution" FOR SELECT USING (true);



CREATE POLICY "Users can create assignments for their own screens" ON "public"."screens_media" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."screens"
  WHERE (("screens"."id" = "screens_media"."screen_id") AND ("screens"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create their own folders" ON "public"."folders" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own screens" ON "public"."screens" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their media" ON "public"."media" FOR DELETE TO "authenticated" USING ((("auth"."uid"() = "user_id") OR (("folder_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."folders" "f"
  WHERE (("f"."id" = "media"."folder_id") AND ("f"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can delete their own folders" ON "public"."folders" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update assignments for their own screens" ON "public"."screens_media" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."screens"
  WHERE (("screens"."id" = "screens_media"."screen_id") AND ("screens"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."screens"
  WHERE (("screens"."id" = "screens_media"."screen_id") AND ("screens"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update their media" ON "public"."media" FOR UPDATE TO "authenticated" USING ((("auth"."uid"() = "user_id") OR (("folder_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."folders" "f"
  WHERE (("f"."id" = "media"."folder_id") AND ("f"."user_id" = "auth"."uid"()))))))) WITH CHECK ((("auth"."uid"() = "user_id") OR (("folder_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."folders" "f"
  WHERE (("f"."id" = "media"."folder_id") AND ("f"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can update their own folders" ON "public"."folders" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own screens" ON "public"."screens" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can upload their own media" ON "public"."media" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their media" ON "public"."media" FOR SELECT TO "authenticated" USING ((("auth"."uid"() = "user_id") OR (("folder_id" IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM "public"."folders" "f"
  WHERE (("f"."id" = "media"."folder_id") AND ("f"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Users can view their own folders" ON "public"."folders" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own playlist items" ON "public"."screens_media" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own screens" ON "public"."screens" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."age_distribution" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."daily_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."folders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gender_distribution" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."media" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."screens" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."screens";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."screens_media";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."bulk_assign_folder_to_screen"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_to_screen"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_to_screen"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") TO "authenticated";



GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" time without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_scheduled_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_schedule_start_date" "date", "p_schedule_end_date" "date", "p_daily_start_time" time without time zone, "p_daily_end_time" time without time zone, "p_days_of_week" "text", "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_schedule_start_date" "date", "p_schedule_end_date" "date", "p_daily_start_time" time without time zone, "p_daily_end_time" time without time zone, "p_days_of_week" "text", "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."bulk_assign_folder_v2"("p_screen_id" bigint, "p_folder_id" bigint, "p_duration_sec" integer, "p_start_time" timestamp without time zone, "p_end_time" timestamp without time zone, "p_schedule_start_date" "date", "p_schedule_end_date" "date", "p_daily_start_time" time without time zone, "p_daily_end_time" time without time zone, "p_days_of_week" "text", "p_gender_text" "text", "p_age_group_text" "text", "p_orientation_text" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_folder_and_unassign_media"("p_folder_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_folder_and_unassign_media"("p_folder_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_folder_and_unassign_media"("p_folder_id" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_playlist_for_screen"("screen_id_to_check" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_playlist_for_screen"("screen_id_to_check" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_playlist_for_screen"("screen_id_to_check" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_screen_status"("screen_id_to_check" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_screen_status"("screen_id_to_check" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_screen_status"("screen_id_to_check" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."pair_screen"("code_to_check" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."pair_screen"("code_to_check" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."pair_screen"("code_to_check" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."unpair_screen"("screen_id_to_unpair" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."unpair_screen"("screen_id_to_unpair" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."unpair_screen"("screen_id_to_unpair" bigint) TO "service_role";


















GRANT ALL ON TABLE "public"."age_distribution" TO "anon";
GRANT ALL ON TABLE "public"."age_distribution" TO "authenticated";
GRANT ALL ON TABLE "public"."age_distribution" TO "service_role";



GRANT ALL ON SEQUENCE "public"."age_distribution_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."age_distribution_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."age_distribution_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."audience_faces" TO "anon";
GRANT ALL ON TABLE "public"."audience_faces" TO "authenticated";
GRANT ALL ON TABLE "public"."audience_faces" TO "service_role";



GRANT ALL ON SEQUENCE "public"."audience_faces_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."audience_faces_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."audience_faces_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."audience_profiles" TO "anon";
GRANT ALL ON TABLE "public"."audience_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."audience_profiles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."audience_profiles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."audience_profiles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."audience_profiles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cameras" TO "anon";
GRANT ALL ON TABLE "public"."cameras" TO "authenticated";
GRANT ALL ON TABLE "public"."cameras" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cameras_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cameras_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cameras_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cv_configs" TO "anon";
GRANT ALL ON TABLE "public"."cv_configs" TO "authenticated";
GRANT ALL ON TABLE "public"."cv_configs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."cv_configs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."cv_configs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."cv_configs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."daily_users" TO "anon";
GRANT ALL ON TABLE "public"."daily_users" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."daily_users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."daily_users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."daily_users_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."folders" TO "anon";
GRANT ALL ON TABLE "public"."folders" TO "authenticated";
GRANT ALL ON TABLE "public"."folders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."folders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."folders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."folders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."gender_distribution" TO "anon";
GRANT ALL ON TABLE "public"."gender_distribution" TO "authenticated";
GRANT ALL ON TABLE "public"."gender_distribution" TO "service_role";



GRANT ALL ON SEQUENCE "public"."gender_distribution_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."gender_distribution_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."gender_distribution_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."media" TO "anon";
GRANT ALL ON TABLE "public"."media" TO "authenticated";
GRANT ALL ON TABLE "public"."media" TO "service_role";



GRANT ALL ON SEQUENCE "public"."media_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."media_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."media_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."rules" TO "anon";
GRANT ALL ON TABLE "public"."rules" TO "authenticated";
GRANT ALL ON TABLE "public"."rules" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rules_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rules_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rules_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."screens" TO "anon";
GRANT ALL ON TABLE "public"."screens" TO "authenticated";
GRANT ALL ON TABLE "public"."screens" TO "service_role";



GRANT ALL ON SEQUENCE "public"."screens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."screens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."screens_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."screens_media" TO "anon";
GRANT ALL ON TABLE "public"."screens_media" TO "authenticated";
GRANT ALL ON TABLE "public"."screens_media" TO "service_role";



GRANT ALL ON SEQUENCE "public"."screens_media_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."screens_media_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."screens_media_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."triggers" TO "anon";
GRANT ALL ON TABLE "public"."triggers" TO "authenticated";
GRANT ALL ON TABLE "public"."triggers" TO "service_role";



GRANT ALL ON SEQUENCE "public"."triggers_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."triggers_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."triggers_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































