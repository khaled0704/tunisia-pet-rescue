import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

function Shelters() {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('')

  const fetchShelters = async () => {
    try {
      setLoading(true)
      const params = {}
      if (city) params.city = city
      const { data } = await api.get('/shelters', { params })
      setShelters(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShelters()
  }, [city])

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🏠 Shelters & NGOs</h1>

      {/* Filter */}
      <input
        type="text"
        placeholder="Search by city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '2rem', width: '250px' }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : shelters.length === 0 ? (
        <p style={{ color: '#888' }}>No verified shelters found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {shelters.map((shelter) => (
            <div key={shelter._id} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Logo or placeholder */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#1a1a2e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '1rem'
              }}>
                {shelter.logo
                  ? <img src={shelter.logo} alt={shelter.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : '🏠'
                }
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{shelter.name}</h3>
                <span style={{
                  backgroundColor: '#2ecc71',
                  color: 'white',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem'
                }}>
                  ✓ Verified
                </span>
              </div>

              {shelter.description && (
                <p style={{ color: '#555', margin: '0.8rem 0', fontSize: '0.9rem' }}>
                  {shelter.description}
                </p>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>📍 {shelter.city}</p>
                <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>📞 {shelter.phone}</p>
                <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>✉️ {shelter.email}</p>
              </div>

              <Link to={`/animals?shelter=${shelter._id}`} style={{
                display: 'block',
                marginTop: '1rem',
                backgroundColor: '#1a1a2e',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                View Animals
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Shelters