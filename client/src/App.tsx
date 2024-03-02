import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import MainContainer from './components/MainContainer'
import Register from './components/Registration'
import { UserProvider } from './providers/UserProvider'
import Login from './components/Login'
import GameBoard from './components/GameBoard'
import Leaderboard from './components/Leaderboard'

function App() {

  return (
    <Router>
      <UserProvider>
        <MainContainer>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game" element={<GameBoard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </MainContainer>
      </UserProvider>
    </Router>
  )
}

export default App
