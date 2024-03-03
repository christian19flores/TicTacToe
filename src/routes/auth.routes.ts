import express from 'express';
import * as controller from '../controllers/auth.controller';

const routes = express.Router();

routes.route('/refresh-user').post(controller.refreshUser);
routes.route('/check-session').get(controller.checkSession);
routes.route('/register').post(controller.register);
routes.route('/login').post(controller.login);

export default routes;