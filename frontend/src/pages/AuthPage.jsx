import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const AuthPage = () => {
  const [role, setRole] = useState('company');
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const endpoint = `/auth/${role}/${mode}`;
      const { data } = await client.post(endpoint, form);
      login(data);
      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Stock Market Analyser</h1>
        <div className="toggles">
          <button className={role === 'company' ? 'active' : ''} onClick={() => setRole('company')}>Company</button>
          <button className={role === 'buyer' ? 'active' : ''} onClick={() => setRole('buyer')}>Buyer</button>
        </div>
        <div className="toggles">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Signup</button>
        </div>
        <form onSubmit={submit}>
          {mode === 'signup' && role === 'company' && (
            <>
              <input placeholder="Company Name" onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
              <input placeholder="Industry" onChange={(e) => setForm({ ...form, industry: e.target.value })} required />
              <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </>
          )}
          {mode === 'signup' && role === 'buyer' && (
            <>
              <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input type="number" placeholder="Wallet Balance" onChange={(e) => setForm({ ...form, walletBalance: Number(e.target.value) })} />
            </>
          )}
          <input type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="error">{error}</p>}
          <button type="submit">{mode === 'login' ? 'Login' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
