import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Animals from './pages/Animals'
import AnimalDetail from './pages/AnimalDetail'
import Shelters from './pages/Shelters'
import ReportStray from './pages/ReportStray'
import ShelterDashboard from './pages/ShelterDashboard'
import MyAdoptions from './pages/MyAdoptions'
import AdminPanel from './pages/AdminPanel'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/animals" element={<Animals />} />
        <Route path="/animals/:id" element={<AnimalDetail />} />
        <Route path="/shelters" element={<Shelters />} />

        <Route path="/report" element={
          <ProtectedRoute>
            <ReportStray />
          </ProtectedRoute>
        } />

        <Route path="/my-adoptions" element={
          <ProtectedRoute roles={['visitor']}>
            <MyAdoptions />
          </ProtectedRoute>
        } />

        <Route path="/shelter" element={
          <ProtectedRoute roles={['shelter']}>
            <ShelterDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App