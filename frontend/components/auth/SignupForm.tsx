import React, { useState } from 'react';
import { User } from '../../types';
import { register } from '../../services/authService';

const DEPARTMENTS = [
  'AI Development',
  'Design',
  'Marketing',
  'Web Development',
  'IT Support'
];

interface SignupFormProps {
  onSignup: (user: User) => void;
  onToggleLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onToggleLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !department) return;

    try {
      const response = await register(name, email, password, department);
      localStorage.setItem('token', response.access_token);
      onSignup(response.user);
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] transition-all"
            required
          />
        </div>

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

        <div className="relative">
          <i className="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] appearance-none transition-all cursor-pointer"
            required
          >
            <option value="" disabled className="bg-slate-900">Select department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept} className="bg-slate-900">{dept}</option>
            ))}
          </select>
          <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs"></i>
        </div>

        <button
          type="submit"
          className="w-full bg-[#fd7912] hover:bg-[#fd7912]/80 text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 mt-2"
        >
          Create Account
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800 text-center">
        <p className="text-slate-400 text-sm">
          Already have an account?
          <button
            onClick={onToggleLogin}
            className="ml-2 text-[#fd7912] font-bold hover:text-[#fd7912]/80 transition-colors focus:outline-none"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
