import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('shelters')
  const [shelters, setShelters] = useState([])
  const [animals, setAnimals] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') return navigate('/')
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [sheltersRes, animalsRes, reportsRes] = await Promise.all([
        api.get('/shelters/all'),
        api.get('/animals'),
        api.get('/reports'),
      ])
      setShelters(sheltersRes.data)
      setAnimals(animalsRes.data)
      setReports(reportsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (id) => {
    try {
      await api.patch(`/shelters/${id}/verify`)
      fetchAll()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteAnimal = async (id) => {
    if (!window.confirm('Delete this animal?')) return
    try {
      await api.delete(`/animals/${id}`)
      fetchAll()
    } catch (err) {
      console.error(err)
    }
  }

  const handleResolveReport = async (id) => {
    try {
      await api.patch(`/reports/${id}/resolve`)
      fetchAll()
    } catch (err) {
      console.error(err)
    }
  }

  const tabStyle = (t) => ({
    padding: '0.6rem 1.5rem',
    border: 'none',
    cursor: 'pointer',
    borderBottom: tab === t ? '3px solid #e63946' : '3px solid transparent',
    backgroundColor: 'transparent',
    fontWeight: tab === t ? 'bold' : 'normal',
    fontSize: '1rem',
  })

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>⚙️ Admin Panel</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>Manage shelters, animals, and reports.</p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Shelters', value: shelters.length, color: '#3498db' },
          { label: 'Pending Verification', value: shelters.filter(s => !s.isVerified).length, color: '#f39c12' },
          { label: 'Total Animals', value: animals.length, color: '#2ecc71' },
          { label: 'Open Reports', value: reports.filter(r => r.status !== 'resolved').length, color: '#e63946' },
        ].map(stat => (
          <div key={stat.label} style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            borderLeft: `4px solid ${stat.color}`,
            minWidth: '150px'
          }}>
            <h2 style={{ margin: 0, color: stat.color }}>{stat.value}</h2>
            <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.9rem' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
        <button style={tabStyle('shelters')} onClick={() => setTab('shelters')}>
          Shelters ({shelters.length})
        </button>
        <button style={tabStyle('animals')} onClick={() => setTab('animals')}>
          Animals ({animals.length})
        </button>
        <button style={tabStyle('reports')} onClick={() => setTab('reports')}>
          Reports ({reports.length})
        </button>
      </div>

      {/* Shelters Tab */}
      {tab === 'shelters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {shelters.length === 0 && <p style={{ color: '#888' }}>No shelters yet.</p>}
          {shelters.map(shelter => (
            <div key={shelter._id} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '1.2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{shelter.name}</h3>
                  <span style={{
                    backgroundColor: shelter.isVerified ? '#2ecc71' : '#f39c12',
                    color: 'white',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem'
                  }}>
                    {shelter.isVerified ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </div>
                <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.9rem' }}>
                  📍 {shelter.city} — {shelter.email}
                </p>
                <p style={{ margin: '0.2rem 0 0', color: '#888', fontSize: '0.85rem' }}>
                  Managed by: {shelter.managedBy?.name} ({shelter.managedBy?.email})
                </p>
              </div>
              {!shelter.isVerified && (
                <button
                  onClick={() => handleVerify(shelter._id)}
                  style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                >
                  ✓ Verify
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Animals Tab */}
      {tab === 'animals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {animals.length === 0 && <p style={{ color: '#888' }}>No animals yet.</p>}
          {animals.map(animal => (
            <div key={animal._id} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{animal.name}</h3>
                <span style={{
                  backgroundColor: animal.status === 'available' ? '#2ecc71' : animal.status === 'pending' ? '#f39c12' : '#95a5a6',
                  color: 'white',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem'
                }}>
                  {animal.status}
                </span>
              </div>
              <p style={{ color: '#555', margin: '0.4rem 0', fontSize: '0.9rem' }}>
                {animal.species} • {animal.age} yr • {animal.gender}
              </p>
              <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>📍 {animal.location}</p>
              <button
                onClick={() => handleDeleteAnimal(animal._id)}
                style={{ marginTop: '0.8rem', backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reports.length === 0 && <p style={{ color: '#888' }}>No reports yet.</p>}
          {reports.map(report => (
            <div key={report._id} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '1.2rem',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>🚨 {report.species} — {report.city}</p>
                <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.9rem' }}>📍 {report.location}</p>
                <p style={{ margin: '0.3rem 0 0', color: '#777', fontSize: '0.85rem' }}>{report.description}</p>
                <p style={{ margin: '0.3rem 0 0', color: '#888', fontSize: '0.8rem' }}>
                  By: {report.reportedBy?.name} — {new Date(report.createdAt).toLocaleDateString()}
                </p>
                {report.handledBy && (
                  <p style={{ margin: '0.3rem 0 0', color: '#3498db', fontSize: '0.85rem' }}>
                    Handled by: {report.handledBy?.name}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{
                  backgroundColor: report.status === 'pending' ? '#f39c12' : report.status === 'in_progress' ? '#3498db' : '#2ecc71',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }}>
                  {report.status}
                </span>
                {report.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolveReport(report._id)}
                    style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPanel