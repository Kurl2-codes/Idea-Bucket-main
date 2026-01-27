import React from 'react';
import { User } from '../../types';

interface HeaderProps {
    currentUser: User | null;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, searchQuery, setSearchQuery, onLogout }) => {
    if (!currentUser) return null;

    return (
        <nav className="glass shrink-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
                <img src="/ideabucket.png" alt="Idea Bucket Logo" className="w-16 h-16 object-contain group-hover:scale-105 transition-transform" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
                    Idea <span className="text-[#fd7912]">Bucket</span>
                </h1>
            </div>

            <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                    <input
                        type="text"
                        placeholder="Search ideas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-2 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fd7912] transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end mr-2 hidden sm:flex">
                    <span className="text-xs font-bold text-white">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{currentUser.department}</span>
                    <button onClick={onLogout} className="text-[10px] text-slate-500 hover:text-red-400 mt-0.5">Logout</button>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#fd7912]/20 border border-[#fd7912] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-[#fd7912]/20">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
            </div>
        </nav>
    );
};

export default Header;
