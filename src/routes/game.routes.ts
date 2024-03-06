import express from 'express';
import GameController from '../controllers/game.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const routes = express.Router();

routes.route('/start').post(isAuthenticated, GameController.startGame);
routes.route('/join/:gameId').get(isAuthenticated, GameController.joinGame);

export default routes;