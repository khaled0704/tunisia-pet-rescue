import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function Login(){
    const { login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: ''})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) =>{
        setForm({...form , [e.target.name]: e.target.value})
    }
    const handleSubmit= async (e)=>{
        e.preventDefault()
        setError('')
        setLoading(true)
        try{
            const user = await login (form.email, form.password)
            if (user.role === 'admin') navigate('/admin')
            else if (user.role === 'shelter') navigate('/shelter')
            else navigate('/')
        }catch(err){
            setError(err.response?.data?.message || 'Login Failed')
        }finally{
            setLoading(false)
        }
    }
    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '2rem' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.5rem' }}
                />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.5rem' }}
                />
                </div>
                <button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    style={{ width: '100%', padding: '0.5rem' }}
                    >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    )
}

export default Login