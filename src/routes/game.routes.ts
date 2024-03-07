import express from 'express';
import GameController from '../controllers/game.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const routes = express.Router();

routes.route('/create').post(isAuthenticated, GameController.createGame);
routes.route('/join/:gameId').get(isAuthenticated, GameController.joinGame);

export default routes;