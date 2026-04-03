ALTER TABLE "notes" ADD COLUMN "field_timestamps" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "writers" ADD COLUMN "field_timestamps" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
UPDATE "notes" SET "field_timestamps" = jsonb_build_object(
  'title', to_char("updated_at" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  'content', to_char("updated_at" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  'writerId', to_char("updated_at" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);--> statement-breakpoint
UPDATE "writers" SET "field_timestamps" = jsonb_build_object(
  'firstName', to_char("updated_at" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
  'lastName', to_char("updated_at" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
);