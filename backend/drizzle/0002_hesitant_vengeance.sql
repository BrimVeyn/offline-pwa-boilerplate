ALTER TABLE "notes" DROP CONSTRAINT "notes_writer_id_writers_id_fk";
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_writer_id_writers_id_fk" FOREIGN KEY ("writer_id") REFERENCES "public"."writers"("id") ON DELETE cascade ON UPDATE no action;