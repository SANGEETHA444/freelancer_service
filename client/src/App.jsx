import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import FreelancerDashboard from './component/freelancerDashboard'
import Signup from './component/Signup'
import Login from './component/Login'
import FreeDashboard from './component/FreeDashboard'
import FreeViewProjects from './component/FreeViewProjects'
import FreeMyActivity from './component/FreeMyActivity'
import FreeReviewsFeedback from './component/FreeReviewsFeedback'
import FreeProfile from './component/FreeProfile'
import FreeLogout from './component/FreeLogout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<FreelancerDashboard />}>
          <Route index element={<Navigate to="freedash" replace />} />
          <Route path="freedash" element={<FreeDashboard />} />
          <Route path="freeviewprojects" element={<FreeViewProjects />} />
          <Route path="freemyactivity" element={<FreeMyActivity />} />
          <Route path="freereviews" element={<FreeReviewsFeedback />} />
          <Route path="freeprofile" element={<FreeProfile />} />
          <Route path="logout" element={<FreeLogout />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
