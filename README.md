# Tic Tac Toe Game with Websockets

## Overview

This project is a real-time Tic Tac Toe game that allows two players to compete against each other over the internet. It uses websockets for real-time communication between the client and the server. The backend is built on Node.js, leveraging the `socket.io` package for managing websocket connections. The frontend is developed with React and bundled using Vite, providing a fast and modern development experience.

### Features

- Real-time gameplay between two players.
- Responsive design for desktop and mobile browsers.
- Real-time connection status updates.

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Environment Setup
You must give the node server a `PGDATABASE` variable and a `SECRET_KEY` in a .env file in the root of the project.
 1. Use  A pooled postgreSQL connection url
 2. The secret key can be any random string with no special characters
```bash
PGDATABASE='postgresql://user:pass@server-database/db-name?sslmode=require'
SECRET_KEY=''
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/tic-tac-toe-websockets.git
cd tic-tac-toe-websockets
```

1. **Install backend**
```bash
npm install
```

2. **Install frontend**
```bash
cd ./client
npm install
```

### Database Migration/Seed
1. **Migrate the schema to the database**
```bash
npm run migrate
```
2. **Seed the database**
    - Sample Seed Data - (john@gmail.com, john123) (jill@gmail.com, jill123) (josh@gmail.com, josh123) etc
```bash
npm run seed
```

### Running the Project
After installation, you can follow these steps

1. **Start the backend server**
```bash
npm run start
```
This will start the Node.js server on port 3000

2. **In a separate terminal start the vite frontend development server:**
```bash
cd ./client
npm run dev
```