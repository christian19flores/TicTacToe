import express from 'express';
import * as controller from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const routes = express.Router();

routes.route('/').get(isAuthenticated, controller.getAllUsers);

export default routes;