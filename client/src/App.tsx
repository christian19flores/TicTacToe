import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import MainContainer from './components/MainContainer'
import Register from './components/Registration'
import { UserProvider } from './providers/UserProvider'
import Login from './components/Login'
import GameBoard from './components/GameBoard'
import Leaderboard from './components/Leaderboard'
import CreateGame from './components/CreateGame'
import Navbar from './components/Navbar'
import ToastProvider from './contexts/ToastContext'
import Logout from './components/Logout'
import ErrorPage from './components/ErrorPage'

function App() {
  // get auth status

  return (
    <Router>
      <UserProvider>
        <ToastProvider>
          <MainContainer>
            <Navbar />
            <Routes>
              <Route path="/" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/game/:gameId" element={<GameBoard />} />
              <Route path="/create" element={<CreateGame />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/404" element={<ErrorPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </MainContainer>
        </ToastProvider>
      </UserProvider>
    </Router>
  )
}

export default App
