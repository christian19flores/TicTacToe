# Tic Tac Toe

## Overview

This project is a real-time Tic Tac Toe game that allows two players to compete against each other over the internet. It uses websockets for real-time communication between the client and the server. The backend is built on Node.js, leveraging the `socket.io` package for managing websocket connections. The frontend is developed with React and bundled using Vite, providing a fast and modern development experience.

### Tech Stack
 - Node.js
 - Drizzle ORM
 - Socket.io
 - React frontend(Vite)

### Features

- User can create a new game board
- Allow two (and only two) players to connect to a game board
- Persist game state on the server
- Follow standard rules for tic-tac-toe (or noughts and crosses)
- Display the game result and persist in the database at the end of the game
- Display a ranking of the top five players and allow players to start a new game
- Custom JWT for authentication
- Note: User authentication is minimal, and lacks features that would belong in a production app.

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Environment Setup
You must give the node server a `PGDATABASE` variable and a `SECRET_KEY` in a .env file in the root of the project.
 1. Use  A pooled postgreSQL connection url
 2. The secret key can be any random string with no special characters
 3. For convenvience I used https://neon.tech/ for my database
```bash
PGDATABASE='postgresql://user:pass@server-database/db-name?sslmode=require'
SECRET_KEY=''
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/christian19flores/TicTacToe.git
cd TicTacToe
```

1. **Install backend**
```bash
npm install # Must run this command from the root of the project
```

2. **Install frontend**
```bash
cd ./client
npm install
```

### Database Migration/Seed
1. **Migrate the schema to the database**
    - Must be from root of project
```bash
npm run migrate # Must run this command from the root of the project
```
2. **Seed the database**
    - Sample Seed Data - (john@gmail.com, john123) (jill@gmail.com, jill123) (josh@gmail.com, josh123) etc
```bash
npm run seed # Must run this command from the root of the project
```

### Running the Project
After installation, you can follow these steps

1. **Start the backend server**
```bash
npm run start  # Must run this command from the root of the project
```
This will start the Node.js server on port 3000

2. **In a separate terminal start the vite frontend development server:**
```bash
cd ./client
npm run dev
```