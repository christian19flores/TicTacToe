import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { serial, text, timestamp, integer, pgTable, pgEnum, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: text('id').primaryKey(),
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
    status: text('status').notNull().default('pending'),
    /**
     *  [
     *      {"move": 1, "position": 5, "player": "X"},
     *      {"move": 2, "position": 1, "player": "O"},
     *      ...
     *  ]
     */
    moves: jsonb('moves').notNull(),
    winner: text('winner'),

    playerX: text('player_x'),
    playerO: text('player_o'),
    created_at: timestamp('created_at').notNull(),
    updated_at: timestamp('updated_at').notNull(),
})

export const gameRelations = relations(games, ({ one }) => ({
    playerX: one(users, { fields: [games.playerX], references: [users.id] }),
    playerO: one(users, { fields: [games.playerO], references: [users.id] }),
}));

export type Game = InferSelectModel<typeof games>;
export type NewGame = InferInsertModel<typeof games>;

export type GameMove = {
    move: number,
    position: number,
    player: string
}