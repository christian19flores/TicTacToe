import express from 'express';
import * as controller from '../controllers/game.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const routes = express.Router();

routes.route('/start').post(isAuthenticated, controller.startGame);
routes.route('/join/:gameId').get(isAuthenticated, controller.joinGame);

export default routes;