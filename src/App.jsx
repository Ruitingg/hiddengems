import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import DiscoveryPage from './pages/DiscoveryPage'
import AuthPage from './components/AuthPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}

export default App