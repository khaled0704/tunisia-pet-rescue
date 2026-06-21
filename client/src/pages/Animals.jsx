import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

function Animals() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ species: '', status: '', city: '' })

  const fetchAnimals = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filters.species) params.species = filters.species
      if (filters.status) params.status = filters.status
      if (filters.city) params.city = filters.city

      const { data } = await api.get('/animals', { params })
      setAnimals(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals()
  }, [filters])

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🐾 Available Animals</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <select
          value={filters.species}
          onChange={(e) => setFilters({ ...filters, species: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Species</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="bird">Bird</option>
          <option value="rabbit">Rabbit</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="adopted">Adopted</option>
        </select>

        <input
          type="text"
          placeholder="Search by city..."
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Animals Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : animals.length === 0 ? (
        <p style={{ color: '#888' }}>No animals found.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {animals.map((animal) => (
            <div key={animal._id} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Photo */}
              <div style={{
                height: '180px',
                backgroundColor: '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem'
              }}>
                {animal.photos?.[0]
                  ? <img src={animal.photos[0]} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : animal.species === 'dog' ? '🐶'
                  : animal.species === 'cat' ? '🐱'
                  : animal.species === 'bird' ? '🐦'
                  : animal.species === 'rabbit' ? '🐰'
                  : '🐾'
                }
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{animal.name}</h3>
                  <span style={{
                    backgroundColor: animal.status === 'available' ? '#2ecc71'
                      : animal.status === 'pending' ? '#f39c12' : '#95a5a6',
                    color: 'white',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem'
                  }}>
                    {animal.status}
                  </span>
                </div>
                <p style={{ color: '#555', margin: '0.4rem 0' }}>
                  {animal.species} • {animal.age} yr • {animal.gender}
                </p>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.2rem 0' }}>
                  📍 {animal.location}
                </p>
                <Link to={`/animals/${animal._id}`} style={{
                  display: 'block',
                  marginTop: '1rem',
                  backgroundColor: '#e63946',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Animals