CREATE TABLE "writers" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "writer_id" text;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_writer_id_writers_id_fk" FOREIGN KEY ("writer_id") REFERENCES "public"."writers"("id") ON DELETE no action ON UPDATE no action;