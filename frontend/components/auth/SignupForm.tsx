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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !department) return;

    // Validation
    if (name.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await register(name, email, password, department);
      // Backend handles the HttpOnly cookie. We no longer store the token in localStorage.
      onSignup(response.user);
    } catch (error: any) {
      setError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4 flex items-center animate-in fade-in slide-in-from-top-2">
          <i className="fas fa-exclamation-circle text-rose-500 mr-2"></i>
          <span className="text-rose-400 text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(null); }}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] transition-all"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] transition-all"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] transition-all"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <i className="fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <select
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setError(null); }}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#fd7912] appearance-none transition-all cursor-pointer"
            required
            disabled={isLoading}
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
          disabled={isLoading}
          className="w-full bg-[#fd7912] hover:bg-[#fd7912]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 mt-2 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <i className="fas fa-spinner fa-spin mr-2"></i> Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
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
