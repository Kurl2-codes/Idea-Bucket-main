
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

      <div className="max-w-md w-full p-8 relative z-10">
        <div className="flex justify-center mb-6">
          <img src="/ideabucket.png" alt="IdeaBucket Logo" className="w-24 h-24 object-contain hover:scale-110 transition-transform drop-shadow-2xl" />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
            IdeaBucket
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
