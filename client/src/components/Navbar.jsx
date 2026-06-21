import { Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar(){
    const {user , logout} = useAuth()
    const navigate = useNavigate()
    const handleLogout = () =>{
        logout()
        navigate('/login')
    }
    return (
        <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#1a1a2e',
        color: 'white'
        }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.3rem', fontWeight: 'bold' }}>
            🐾 Tunisia Pet Rescue
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/animals" style={{ color: 'white', textDecoration: 'none' }}>Animals</Link>
            <Link to="/shelters" style={{ color: 'white', textDecoration: 'none' }}>Shelters</Link>
            <Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>Report a Stray</Link>

            {user ? (
            <>
                <span style={{ color: '#aaa' }}>Hi, {user.name}</span>
                {user?.role === 'visitor' && (
                    <Link to="/my-adoptions" style={{ color: 'white', textDecoration: 'none' }}>My Adoptions</Link>
                )}
                {user.role === 'shelter' && (
                <Link to="/shelter" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                )}
                {user.role === 'admin' && (
                <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
                )}
                <button
                onClick={handleLogout}
                style={{ background: '#e63946', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                Logout
                </button>
            </>
            ) : (
            <>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{
                backgroundColor: '#e63946',
                color: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none'
                }}>Register</Link>
            </>
            )}
        </div>
        </nav>
    )
}

export default Navbar