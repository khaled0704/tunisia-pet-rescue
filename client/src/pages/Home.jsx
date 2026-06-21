import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        backgroundColor: '#1a1a2e',
        color: 'white',
        textAlign: 'center',
        padding: '5rem 2rem',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          🐾 Every Animal Deserves a Home
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '2rem' }}>
          Find stray animals, connect with shelters, and give a pet a second chance in Tunisia.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/animals" style={{
            backgroundColor: '#e63946',
            color: 'white',
            padding: '0.8rem 2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Adopt Now
          </Link>
          <Link to="/report" style={{
            backgroundColor: 'transparent',
            color: 'white',
            padding: '0.8rem 2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            border: '2px solid white',
            fontWeight: 'bold'
          }}>
            Report a Stray
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '3rem',
        padding: '3rem 2rem',
        backgroundColor: '#f8f9fa',
        textAlign: 'center'
      }}>
        {[
          { number: '500+', label: 'Animals Rescued' },
          { number: '30+', label: 'Shelters & NGOs' },
          { number: '1000+', label: 'Happy Adoptions' },
        ].map((stat) => (
          <div key={stat.label}>
            <h2 style={{ fontSize: '2rem', color: '#e63946', margin: 0 }}>{stat.number}</h2>
            <p style={{ color: '#555', margin: '0.3rem 0 0' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem' }}>How It Works</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { icon: '🔍', title: 'Browse Animals', desc: 'Search available animals by species, age, and location.' },
            { icon: '📋', title: 'Apply to Adopt', desc: 'Submit an adoption request directly to the shelter.' },
            { icon: '🏠', title: 'Give a Home', desc: 'Welcome your new companion into your family.' },
          ].map((step) => (
            <div key={step.title} style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              padding: '2rem',
              width: '220px',
            }}>
              <div style={{ fontSize: '2.5rem' }}>{step.icon}</div>
              <h3 style={{ margin: '1rem 0 0.5rem' }}>{step.title}</h3>
              <p style={{ color: '#555', margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA for shelters */}
      {!user && (
        <div style={{
          backgroundColor: '#1a1a2e',
          color: 'white',
          textAlign: 'center',
          padding: '3rem 2rem'
        }}>
          <h2>Are you a shelter or NGO?</h2>
          <p style={{ color: '#aaa' }}>Join our platform and help more animals find homes.</p>
          <Link to="/register" style={{
            backgroundColor: '#e63946',
            color: 'white',
            padding: '0.8rem 2rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
            Register your Shelter
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home