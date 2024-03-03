ALTER TABLE "games" ADD COLUMN "game_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_game_id_unique" UNIQUE("game_id");