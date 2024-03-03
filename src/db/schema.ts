import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { jsonb } from "drizzle-orm/pg-core";
import { serial, text, timestamp, integer, pgTable } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),

    wins: integer('wins').notNull().default(0),
    losses: integer('losses').notNull().default(0),
    draws: integer('draws').notNull().default(0),
})

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// schema for storing tic-tac-toe game state
export const games = pgTable('games', {
    id: serial('id').primaryKey(),

    game_id: text('game_id').notNull().unique(),
    /**
     *  [
     *      {"move": 1, "position": 5, "player": "X"},
     *      {"move": 2, "position": 1, "player": "O"},
     *      ...
     *  ]
     */
    moves: jsonb('moves').notNull(),
    winner: text('winner'),
    // participants relationships
    
    player_x: text('player_x').references(() => users.id).notNull(),
    player_o: text('player_o').references(() => users.id).notNull(),
    created_at: timestamp('created_at').notNull(),
    updated_at: timestamp('updated_at').notNull(),
})

export type Game = InferSelectModel<typeof games>;
export type NewGame = InferInsertModel<typeof games>;