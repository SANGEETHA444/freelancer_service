import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import ProtectedRoute from './components/ProtectedRoute'
import FreelancerDashboard from './component/freelancerDashboard'
import UserDashboard from './component/UserDashboard'
import Signup from './component/Signup'
import Login from './component/Login'
import FreeDashboard from './component/FreeDashboard'
import FreeViewProjects from './component/FreeViewProjects'
import FreeMyActivity from './component/FreeMyActivity'
import FreeReviewsFeedback from './component/FreeReviewsFeedback'
import FreeProfile from './component/FreeProfile'
import FreeLogout from './component/FreeLogout'
import CustomerDashboard from './component/CustomerDashboard'
import CustomerNewProject from './component/CustomerNewProject'
import CustomerViewFreelancers from './component/CustomerViewFreelancers'
import CustomerMyActivity from './component/CustomerMyActivity'
import CustomerProfile from './component/CustomerProfile'
import CustomerLogout from './component/CustomerLogout'
import ProjectDetails from './component/ProjectDetails'

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Project Details - can be accessed from both sides */}
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/freelancer"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <FreelancerDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FreeDashboard />} />
            <Route path="view-projects" element={<FreeViewProjects />} />
            <Route path="my-activity" element={<FreeMyActivity />} />
            <Route path="reviews" element={<FreeReviewsFeedback />} />
            <Route path="profile" element={<FreeProfile />} />
            <Route path="logout" element={<FreeLogout />} />
          </Route>

          <Route
            path="/customer"
            element={
              <ProtectedRoute requiredRole="client">
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="new-project" element={<CustomerNewProject />} />
            <Route path="view-freelancers" element={<CustomerViewFreelancers />} />
            <Route path="my-activity" element={<CustomerMyActivity />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="logout" element={<CustomerLogout />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  )
}

export default App
