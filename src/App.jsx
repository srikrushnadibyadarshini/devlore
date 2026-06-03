import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import QuizSetup from './pages/QuizSetup'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/"element={<Home />} />
        <Route path="/setup"element={<QuizSetup />} />
        <Route path="/quiz"element={<Quiz />} />
        <Route path="/results"element={<Results />} />
        <Route path="/dashboard"element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App