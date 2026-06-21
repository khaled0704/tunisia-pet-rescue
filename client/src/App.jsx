import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Animals from './pages/Animals'
import AnimalDetail from './pages/AnimalDetail'
import Shelters from './pages/Shelters'
import ReportStray from './pages/ReportStray'
import ShelterDashboard from './pages/ShelterDashboard'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/animals/:id" element={<AnimalDetail />} />
          <Route path="/shelters" element={<Shelters />} />
          <Route path="/report" element={<ReportStray />} />
          <Route path="/shelter" element={<ShelterDashboard />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App