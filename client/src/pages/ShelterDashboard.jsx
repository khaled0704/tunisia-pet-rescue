import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

function ShelterDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [shelter, setShelter] = useState(null)
  const [animals, setAnimals] = useState([])
  const [adoptions, setAdoptions] = useState([])
  const [reports, setReports] = useState([])
  const [tab, setTab] = useState('animals')
  const [loading, setLoading] = useState(true)
  const [showAddAnimal, setShowAddAnimal] = useState(false)
  const [animalForm, setAnimalForm] = useState({
    name: '', species: 'dog', age: '', gender: 'male',
    description: '', healthStatus: 'healthy', location: '', photos: []
  })
  const [formMsg, setFormMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [photoFiles, setPhotoFiles] = useState([])
  useEffect(() => {
    if (!user || user.role !== 'shelter') return navigate('/')
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const { data: shelterData } = await api.get('/shelters')
      const myShelter = shelterData.find(s => s.managedBy._id === user.id || s.managedBy === user.id)

      if (!myShelter) {
        setShelter(null)
        setLoading(false)
        return
      }

      setShelter(myShelter)

      const [animalsRes, adoptionsRes, reportsRes] = await Promise.all([
        api.get('/animals'),
        api.get(`/adoptions/shelter/${myShelter._id}`),
        api.get('/reports'),
      ])

      setAnimals(animalsRes.data.filter(a => a.shelter?._id === myShelter._id || a.shelter === myShelter._id))
      setAdoptions(adoptionsRes.data)
      setReports(reportsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAnimal = async (e) => {
    e.preventDefault()
    setFormMsg('')
    try {
      await api.post('/animals', { ...animalForm, shelter: shelter._id })
      setFormMsg('✅ Animal added!')
      setShowAddAnimal(false)
      setAnimalForm({ name: '', species: 'dog', age: '', gender: 'male', description: '', healthStatus: 'healthy', location: '' })
      fetchDashboard()
    } catch (err) {
      setFormMsg(`❌ ${err.response?.data?.message || 'Error adding animal'}`)
    }
  }
  const handlePhotoUpload = async (files) => {
  const formData = new FormData()
  Array.from(files).forEach(file => formData.append('photos', file))
    try {
        setUploading(true)
        const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
        })
        setAnimalForm(prev => ({ ...prev, photos: data.urls }))
    } catch (err) {
        console.error(err)
    } finally {
        setUploading(false)
    }
    }
  const handleReviewAdoption = async (id, status) => {
    try {
      await api.patch(`/adoptions/${id}/review`, { status })
      fetchDashboard()
    } catch (err) {
      console.error(err)
    }
  }

  const handleHandleReport = async (reportId) => {
    try {
      await api.patch(`/reports/${reportId}/handle`, { shelterId: shelter._id })
      fetchDashboard()
    } catch (err) {
      console.error(err)
    }
  }

  const handleResolveReport = async (reportId) => {
    try {
      await api.patch(`/reports/${reportId}/resolve`)
      fetchDashboard()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteAnimal = async (id) => {
    if (!window.confirm('Delete this animal?')) return
    try {
      await api.delete(`/animals/${id}`)
      fetchDashboard()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>

  if (!shelter) return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
      <h2>You don't have a shelter yet</h2>
      <p style={{ color: '#888' }}>Create your shelter profile to start posting animals.</p>
      <CreateShelterForm onCreated={fetchDashboard} userId={user.id} />
    </div>
  )

  const tabStyle = (t) => ({
    padding: '0.6rem 1.5rem',
    border: 'none',
    cursor: 'pointer',
    borderBottom: tab === t ? '3px solid #e63946' : '3px solid transparent',
    backgroundColor: 'transparent',
    fontWeight: tab === t ? 'bold' : 'normal',
    fontSize: '1rem',
  })

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>🏠 {shelter.name}</h1>
          <p style={{ color: '#888', margin: '0.3rem 0 0' }}>📍 {shelter.city} — {shelter.isVerified ? '✅ Verified' : '⏳ Pending verification'}</p>
        </div>
        <button
          onClick={() => setShowAddAnimal(!showAddAnimal)}
          style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Add Animal
        </button>
      </div>

      {showAddAnimal && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '10px', marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>Add New Animal</h3>
          {formMsg && <p>{formMsg}</p>}
          <form onSubmit={handleAddAnimal} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input placeholder="Name" value={animalForm.name} onChange={e => setAnimalForm({ ...animalForm, name: e.target.value })} required style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input placeholder="Location" value={animalForm.location} onChange={e => setAnimalForm({ ...animalForm, location: e.target.value })} required style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="number" placeholder="Age (years)" value={animalForm.age} onChange={e => setAnimalForm({ ...animalForm, age: e.target.value })} required style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            <select value={animalForm.species} onChange={e => setAnimalForm({ ...animalForm, species: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="rabbit">Rabbit</option>
              <option value="other">Other</option>
            </select>
            <select value={animalForm.gender} onChange={e => setAnimalForm({ ...animalForm, gender: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unknown">Unknown</option>
            </select>
            <select value={animalForm.healthStatus} onChange={e => setAnimalForm({ ...animalForm, healthStatus: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="healthy">Healthy</option>
              <option value="needs_care">Needs Care</option>
              <option value="under_treatment">Under Treatment</option>
            </select>
            <textarea placeholder="Description" value={animalForm.description} onChange={e => setAnimalForm({ ...animalForm, description: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', gridColumn: '1 / -1', resize: 'vertical' }} rows={3} />
            <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Photos</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                    style={{ width: '100%' }}
                />
                {uploading && <p style={{ color: '#888', margin: '0.3rem 0 0' }}>Uploading...</p>}
                {animalForm.photos?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {animalForm.photos.map((url, i) => (
                        <img key={i} src={url} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                    ))}
                    </div>
                )}
            </div>
            <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save Animal
            </button>
          </form>
        </div>
      )}

      <div style={{ borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
        <button style={tabStyle('animals')} onClick={() => setTab('animals')}>Animals ({animals.length})</button>
        <button style={tabStyle('adoptions')} onClick={() => setTab('adoptions')}>Adoptions ({adoptions.length})</button>
        <button style={tabStyle('reports')} onClick={() => setTab('reports')}>Reports ({reports.length})</button>
      </div>

      {tab === 'animals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {animals.length === 0 && <p style={{ color: '#888' }}>No animals yet.</p>}
          {animals.map(animal => (
            <div key={animal._id} style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{animal.name}</h3>
                <span style={{ backgroundColor: animal.status === 'available' ? '#2ecc71' : animal.status === 'pending' ? '#f39c12' : '#95a5a6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem' }}>
                  {animal.status}
                </span>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.9rem' }}>{animal.species} • {animal.age} yr • {animal.gender}</p>
              <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>📍 {animal.location}</p>
              <button onClick={() => handleDeleteAnimal(animal._id)} style={{ marginTop: '0.8rem', backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'adoptions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {adoptions.length === 0 && <p style={{ color: '#888' }}>No adoption requests yet.</p>}
          {adoptions.map(adoption => (
            <div key={adoption._id} style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '1.2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>🐾 {adoption.animal?.name} — {adoption.animal?.species}</p>
                  <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.9rem' }}>Applicant: {adoption.applicant?.name} ({adoption.applicant?.email})</p>
                  {adoption.note && <p style={{ margin: '0.3rem 0 0', color: '#777', fontSize: '0.85rem' }}>"{adoption.note}"</p>}
                </div>
                <span style={{ backgroundColor: adoption.status === 'pending' ? '#f39c12' : adoption.status === 'approved' ? '#2ecc71' : '#e74c3c', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {adoption.status}
                </span>
              </div>
              {adoption.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => handleReviewAdoption(adoption._id, 'approved')} style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>
                  <button onClick={() => handleReviewAdoption(adoption._id, 'rejected')} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.length === 0 && <p style={{ color: '#888' }}>No reports yet.</p>}
          {reports.map(report => (
            <div key={report._id} style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '1.2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>🚨 {report.species} — {report.city}</p>
                  <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.9rem' }}>📍 {report.location}</p>
                  <p style={{ margin: '0.3rem 0 0', color: '#777', fontSize: '0.85rem' }}>{report.description}</p>
                  <p style={{ margin: '0.3rem 0 0', color: '#888', fontSize: '0.8rem' }}>Reported by: {report.reportedBy?.name}</p>
                </div>
                <span style={{ backgroundColor: report.status === 'pending' ? '#f39c12' : report.status === 'in_progress' ? '#3498db' : '#2ecc71', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                  {report.status}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {report.status === 'pending' && (
                  <button onClick={() => handleHandleReport(report._id)} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Accept</button>
                )}
                {report.status === 'in_progress' && (
                  <button onClick={() => handleResolveReport(report._id)} style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Mark Resolved</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CreateShelterForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', description: '', address: '', city: '', phone: '', email: '' })
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/shelters', form)
      setMsg('✅ Shelter created! Waiting for admin verification.')
      onCreated()
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.message || 'Error'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
      {msg && <p>{msg}</p>}
      {['name', 'description', 'address', 'city', 'phone', 'email'].map(field => (
        <input
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          required={field !== 'description'}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      ))}
      <button type="submit" style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.7rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        Create Shelter
      </button>
    </form>
  )
}

export default ShelterDashboard