import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

function ReportStray() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    description: '',
    location: '',
    city: '',
    species: 'other',
    photos: [],
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>You need to be logged in to report a stray.</h2>
        <a href="/login" style={{ color: '#e63946' }}>Login here</a>
      </div>
    )
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await api.post('/reports', form)
      setMessage('✅ Report submitted! A nearby shelter will be notified.')
      setForm({ description: '', location: '', city: '', species: 'other', photos: [] })
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Something went wrong'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>🚨 Report a Stray Animal</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>
        Found a stray? Fill in the details below and a shelter near you will follow up.
      </p>

      {message && (
        <p style={{ padding: '0.8rem', backgroundColor: '#f0f0f0', borderRadius: '6px', marginBottom: '1rem' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Species</label>
          <select
            name="species"
            value={form.species}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="bird">Bird</option>
            <option value="rabbit">Rabbit</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Location (street / area)</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Rue de la Liberté, near the market"
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="e.g. Tunis"
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the animal — color, size, condition, behavior..."
            required
            rows={4}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  )
}

export default ReportStray