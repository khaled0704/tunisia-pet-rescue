import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function Profile() {
  const { user, updatedUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
  })
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photos', file)

    try {
      setUploading(true)
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setAvatar(data.urls[0])
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)
    try {
        const payload = { name: form.name, phone: form.phone, avatar }
        if (form.password) payload.password = form.password

        const { data } = await api.put('/auth/profile', payload)

        const updatedUser = { ...user, name: data.name, phone: data.phone, avatar: data.avatar }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        updateUser({ name: data.name, phone: data.phone, avatar: data.avatar })  // ← add this line
        setMessage('✅ Profile updated successfully!')
        setForm(prev => ({ ...prev, password: '' }))
    } catch (err) {
        setMessage(`❌ ${err.response?.data?.message || 'Something went wrong'}`)
    } finally {
        setLoading(false)
    }
    }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>👤 My Profile</h1>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#1a1a2e',
          margin: '0 auto 1rem',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem'
        }}>
          {avatar
            ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '👤'
          }
        </div>
        <label style={{ cursor: 'pointer', color: '#e63946', fontWeight: 'bold' }}>
          {uploading ? 'Uploading...' : 'Change Avatar'}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {message && (
        <p style={{ padding: '0.8rem', backgroundColor: '#f0f0f0', borderRadius: '6px', marginBottom: '1rem' }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={user?.email}
            disabled
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', backgroundColor: '#f0f0f0', color: '#888' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Phone</label>
          <input
            type="text"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="+216 XX XXX XXX"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>
            New Password <span style={{ color: '#888', fontWeight: 'normal' }}>(leave blank to keep current)</span>
          </label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="Min 6 characters"
            autoComplete="new-password"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '0.8rem' }}>
          <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>
            Role: <strong style={{ textTransform: 'capitalize' }}>{user?.role}</strong>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          style={{ backgroundColor: '#e63946', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default Profile