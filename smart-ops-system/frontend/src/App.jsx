import { useState } from 'react';
import api from './api/axios';
import './index.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER', // Default role
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const response = await api.post(endpoint, formData);
      
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setMessage({ type: 'success', text: 'Login Successful! Redirecting...' });
        // Redirect logic would go here
      } else {
        setMessage({ type: 'success', text: 'Registration Successful! Please Login.' });
        setIsLogin(true);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Something went wrong' });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 mt-2">Smart Operations System</p>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@company.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <select 
                className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="USER">User</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;