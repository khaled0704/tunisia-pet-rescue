import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

function MyAdoptions() {
  const { user } = useAuth()
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchAdoptions = async () => {
      try {
        const { data } = await api.get('/adoptions/my')
        setAdoptions(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdoptions()
  }, [])

  if (!user) return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h2>Please <Link to="/login" style={{ color: '#e63946' }}>login</Link> to see your adoptions.</h2>
    </div>
  )

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>❤️ My Adoption Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : adoptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
          <p style={{ fontSize: '1.2rem', color: '#888' }}>You haven't applied for any adoptions yet.</p>
          <Link to="/animals" style={{
            backgroundColor: '#e63946',
            color: 'white',
            padding: '0.7rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Browse Animals
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {adoptions.map((adoption) => (
            <div key={adoption._id} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              {/* Animal photo */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                backgroundColor: '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                flexShrink: 0,
                overflow: 'hidden'
              }}>
                {adoption.animal?.photos?.[0]
                  ? <img src={adoption.animal.photos[0]} alt={adoption.animal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : adoption.animal?.species === 'dog' ? '🐶'
                  : adoption.animal?.species === 'cat' ? '🐱'
                  : adoption.animal?.species === 'bird' ? '🐦'
                  : adoption.animal?.species === 'rabbit' ? '🐰'
                  : '🐾'
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.3rem' }}>{adoption.animal?.name}</h3>
                <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', textTransform: 'capitalize' }}>
                  {adoption.animal?.species}
                </p>
                {adoption.shelter && (
                  <p style={{ margin: '0.3rem 0 0', color: '#888', fontSize: '0.85rem' }}>
                    🏠 {adoption.shelter.name} — {adoption.shelter.city}
                  </p>
                )}
                {adoption.note && (
                  <p style={{ margin: '0.5rem 0 0', color: '#777', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    "{adoption.note}"
                  </p>
                )}
                <p style={{ margin: '0.5rem 0 0', color: '#aaa', fontSize: '0.8rem' }}>
                  Applied on {new Date(adoption.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Status badge */}
              <div style={{ flexShrink: 0 }}>
                <span style={{
                  backgroundColor:
                    adoption.status === 'pending' ? '#f39c12'
                    : adoption.status === 'approved' ? '#2ecc71'
                    : '#e74c3c',
                  color: 'white',
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {adoption.status === 'pending' ? '⏳ Pending'
                    : adoption.status === 'approved' ? '✅ Approved'
                    : '❌ Rejected'}
                </span>
                {adoption.reviewedAt && (
                  <p style={{ margin: '0.4rem 0 0', color: '#aaa', fontSize: '0.75rem', textAlign: 'center' }}>
                    {new Date(adoption.reviewedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAdoptions