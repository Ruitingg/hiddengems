import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import DiscoveryPage from './pages/DiscoveryPage'
import AuthPage from './components/AuthPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'
import SetupPage from './pages/SetupPage'
import ProtectedRoute from './components/ProtectedRoute'
import RootRedirect from './components/RootRedirect'
import { AuthProvider } from './lib/AuthContext'
import CalendarManagementPage from './pages/CalendarManagementPage'
import OrderFormPage from './pages/OrderFormPage'
import OrderStatusPage from './pages/OrderStatusPage'
import OrderDashboardPage from './pages/OrderDashboardPage'
import PaymentPage from './pages/PaymentPage'
import ReviewPage from './pages/ReviewPage'
import ManageBusinessPage from './pages/ManageBusinessPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import FavouritesPage from './pages/FavouritesPage'
import NotificationsPage from './pages/NotificationsPage'

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
          <Route path="/setup" element={
            <ProtectedRoute>
              <SetupPage />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/order/:hbbId" element={
            <ProtectedRoute>
              <OrderFormPage />
            </ProtectedRoute>
          } />
          <Route path="/order-status/:orderId" element={
            <ProtectedRoute>
              <OrderStatusPage />
            </ProtectedRoute>
          } />
          <Route path="/order-dashboard" element={
            <ProtectedRoute>
              <OrderDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/payment/:orderId" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          } />
          <Route path="/review/:orderId" element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          } />
          <Route path="/manage-business" element={
            <ProtectedRoute>
              <ManageBusinessPage />
            </ProtectedRoute>
          } />
          <Route path="/announcements" element={
            <ProtectedRoute>
              <AnnouncementsPage />
            </ProtectedRoute>
          } />
          <Route path="/favourites" element={
            <ProtectedRoute>
              <FavouritesPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App