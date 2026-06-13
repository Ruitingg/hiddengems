import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import DiscoveryPage from './pages/DiscoveryPage'
import AuthPage from './components/AuthPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import RootRedirect from './components/RootRedirect'
import { AuthProvider } from './lib/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/discover" element={<DiscoveryPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App