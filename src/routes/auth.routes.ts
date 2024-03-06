import express from 'express';
import AuthRoutes from '../controllers/auth.controller';

const routes = express.Router();

routes.route('/refresh-user').post(AuthRoutes.refreshUser);
routes.route('/check-session').get(AuthRoutes.checkSession);
routes.route('/register').post(AuthRoutes.register);
routes.route('/login').post(AuthRoutes.login);

export default routes;