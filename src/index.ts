import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import http from 'http';

import routes from './routes';

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/v1', routes);

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});