ALTER TABLE "games" RENAME COLUMN "status_enum" TO "status";--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;