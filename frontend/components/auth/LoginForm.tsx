import React, { useState } from 'react';
import { User } from '../../types';
import { login } from '../../services/authService';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onToggleSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onToggleSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      const response = await login(email, password);
      // Store token (should be in context/storage, simplest here is just passing user up)
      localStorage.setItem('token', response.access_token);
      onLogin(response.user);
    } catch (error: any) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] transition-all"
            required
          />
        </div>

        <div className="relative">
          <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#fd7912] hover:bg-[#fd7912]/80 text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 mt-2"
        >
          Sign In
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800 text-center">
        <p className="text-slate-400 text-sm">
          Don’t have an account yet?
          <button
            onClick={onToggleSignUp}
            className="ml-2 text-[#fd7912] font-bold hover:text-[#fd7912]/80 transition-colors focus:outline-none"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
