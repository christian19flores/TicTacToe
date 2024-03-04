import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import SocketManager from './sockets/SocketManager';
import 'dotenv/config';

import routes from './routes';
import { verifyToken } from './utils/auth';

const app = express();

app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api/v1', routes);

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
      return next(new Error('Authentication error'));
  }

  console.log('Socket JWT:', token);
  verifyToken(token)
      .then((user) => {
          // @ts-ignore
          socket.user = user;
          next();
      })
      .catch((error) => {
          next(new Error('Authentication error'));
      });
});

const socketManager = new SocketManager(io);
socketManager.init();

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});