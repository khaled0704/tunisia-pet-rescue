import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

function AnimalDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const { data } = await api.get(`/animals/${id}`)
        setAnimal(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnimal()
  }, [id])

  const handleAdopt = async () => {
    if (!user) return navigate('/login')
    try {
      setApplying(true)
      await api.post('/adoptions', { animalId: id, note })
      setMessage('✅ Adoption request submitted! The shelter will review it.')
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Something went wrong'}`)
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>
  if (!animal) return <p style={{ padding: '2rem' }}>Animal not found.</p>

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <button
        onClick={() => navigate('/animals')}
        style={{ marginBottom: '1rem', cursor: 'pointer', background: 'none', border: 'none', color: '#e63946', fontSize: '1rem' }}
      >
        ← Back to Animals
      </button>

      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* Photo */}
        <div style={{ height: '300px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
          {animal.photos?.[0]
            ? <img src={animal.photos[0]} alt={animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : animal.species === 'dog' ? '🐶'
            : animal.species === 'cat' ? '🐱'
            : animal.species === 'bird' ? '🐦'
            : animal.species === 'rabbit' ? '🐰'
            : '🐾'
          }
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ margin: 0 }}>{animal.name}</h1>
            <span style={{
              backgroundColor: animal.status === 'available' ? '#2ecc71'
                : animal.status === 'pending' ? '#f39c12' : '#95a5a6',
              color: 'white',
              padding: '0.3rem 1rem',
              borderRadius: '20px',
            }}>
              {animal.status}
            </span>
          </div>

          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Species', value: animal.species },
              { label: 'Age', value: `${animal.age} year(s)` },
              { label: 'Gender', value: animal.gender },
              { label: 'Health', value: animal.healthStatus },
              { label: 'Location', value: animal.location },
            ].map((item) => (
              <div key={item.label}>
                <span style={{ color: '#888', fontSize: '0.85rem' }}>{item.label}</span>
                <p style={{ margin: '0.2rem 0 0', fontWeight: 'bold', textTransform: 'capitalize' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {animal.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>About {animal.name}</h3>
              <p style={{ color: '#555', lineHeight: '1.6' }}>{animal.description}</p>
            </div>
          )}

          {/* Shelter info */}
          {animal.shelter && (
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #eee' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>🏠 Shelter</h3>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{animal.shelter.name}</p>
              <p style={{ margin: '0.2rem 0', color: '#555' }}>📍 {animal.shelter.city}</p>
              <p style={{ margin: '0.2rem 0', color: '#555' }}>📞 {animal.shelter.phone}</p>
            </div>
          )}

          {/* Adoption form */}
          {animal.status === 'available' && user?.role === 'visitor' && (
            <div>
              <h3>Apply to Adopt {animal.name}</h3>
              <textarea
                placeholder="Tell the shelter a bit about yourself and why you want to adopt..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button
                onClick={handleAdopt}
                disabled={applying}
                style={{ marginTop: '0.8rem', backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {applying ? 'Submitting...' : 'Submit Adoption Request'}
              </button>
            </div>
          )}

          {animal.status !== 'available' && (
            <p style={{ color: '#888', fontStyle: 'italic' }}>This animal is currently not available for adoption.</p>
          )}

          {!user && animal.status === 'available' && (
            <p>Please <a href="/login" style={{ color: '#e63946' }}>login</a> to apply for adoption.</p>
          )}

          {message && (
            <p style={{ marginTop: '1rem', padding: '0.8rem', backgroundColor: '#f0f0f0', borderRadius: '6px' }}>{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnimalDetail