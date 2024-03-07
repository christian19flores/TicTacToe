import express from 'express';
import { Socket, Server } from 'socket.io';
import { Game } from '../src/db/schema';

// Extend the Request interface
declare global {
  namespace express {
    interface Request {
      user?: any; // Use a more specific type if possible
    }
  }
}

export interface SocketEventHandler {
  (socket: Socket, io: Server): void;
}

interface GameWithMoves extends Game {
  moves: {
    move: number;
    player: string;
    position: number;
  }[];
}