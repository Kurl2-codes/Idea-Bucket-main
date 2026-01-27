
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { User } from '../../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c1422] p-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-[#fd7912]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-[#fd7912]/10 rounded-full blur-[120px]"></div>
      
      <div className="max-w-md w-full p-8 rounded-[2.5rem] shadow-2xl relative z-10 glass border-white/10">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0c1422] p-4 rounded-2xl shadow-xl shadow-black/40 border border-slate-800 transform hover:scale-110 transition-transform">
            <i className="fas fa-briefcase text-[#fd7912] text-3xl"></i>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            WorkFlow <span className="text-[#fd7912]">AI</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            {isSignUp ? 'Create your account to start capturing insights.' : 'Welcome back to your secure intelligent workspace.'}
          </p>
        </div>

        {isSignUp ? (
          <SignupForm onSignup={onAuthSuccess} onToggleLogin={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onLogin={onAuthSuccess} onToggleSignUp={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
