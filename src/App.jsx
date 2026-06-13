import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import Home from './Components/Home'
import SignIn from './Components/SignIn'
import SignUp from './Components/SignUp'
import Dashboard from './Components/Dashboard'
import AdminProfile from './Components/AdminProfile'
import ResumeOverview from './Components/ResumeOverview'
import ScoreMeter from './Components/ScoreMeter'
import TrashBin from './Components/TrashBin'

function PrivateRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore()
  const isAuthed = isAuthenticated || token
  return isAuthed ? children : <Navigate to="/signin" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore()
  const isAuthed = isAuthenticated || token
  return !isAuthed ? children : <Navigate to="/dashboard" replace />
}

function App() {
  const { fetchProfile, token } = useAuthStore()

  useEffect(() => {
    if (token) {
      fetchProfile()
    }
  }, [token])

  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <ResumeOverview />
            </PrivateRoute>
          }
        />
        <Route
          path="/scores"
          element={
            <PrivateRoute>
              <ScoreMeter />
            </PrivateRoute>
          }
        />
        <Route
          path="/trash"
          element={
            <PrivateRoute>
              <TrashBin />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
