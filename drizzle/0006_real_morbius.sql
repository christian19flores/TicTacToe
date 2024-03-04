DO $$ BEGIN
 CREATE TYPE "status_enum" AS ENUM('pending', 'in_progress', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "status_enum" "status_enum" DEFAULT 'pending';