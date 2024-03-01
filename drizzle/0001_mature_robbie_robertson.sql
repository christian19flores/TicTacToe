CREATE TABLE IF NOT EXISTS "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"state" text NOT NULL,
	"moves" jsonb NOT NULL,
	"winner" text,
	"player_x" text NOT NULL,
	"player_o" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
