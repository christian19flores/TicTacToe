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
```bash
PGDATABASE=''
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

### Running the Project
After installation, you can follow these steps

1. **Start the backend server**
```bash
npm run start
```
This will start the Node.js server on port 3000

2. **Start the frontend development server:
```bash
cd ./client
npm run dev
```