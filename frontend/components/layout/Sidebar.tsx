import React from 'react';
import { User, MainTab, ViewMode } from '../../types';
import AdminDashboard from '../admin/AdminDashboard'; // Import if needed for type reference or keep logic strict

interface SidebarProps {
    activeTab: MainTab;
    setActiveTab: (tab: MainTab) => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    activeFilter: string | null;
    setActiveFilter: (filter: string | null) => void;
    dynamicCategories: string[];
    currentUser: User;
    isMobileMenuOpen: boolean;
    onCloseMobileMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    activeFilter,
    setActiveFilter,
    dynamicCategories,
    currentUser,
    isMobileMenuOpen,
    onCloseMobileMenu
}) => {
    const sidebarContent = (
        <div className="p-6 space-y-8 h-full overflow-y-auto">
            <section>
                <div className="flex items-center justify-between mb-4 md:hidden">
                    <h2 className="text-xl font-bold text-white">Menu</h2>
                    <button onClick={onCloseMobileMenu} className="text-slate-400 hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Operations</h2>
                <ul className="space-y-1">
                    <li>
                        <button
                            onClick={() => setActiveTab('capture')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-bold flex items-center ${activeTab === 'capture' ? 'bg-[#fd7912] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                        >
                            <i className="fas fa-plus-circle mr-3 text-lg"></i> New Idea
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('workspace')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-bold flex items-center ${activeTab === 'workspace' ? 'bg-[#fd7912] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                        >
                            <i className="fas fa-th-large mr-3 text-lg"></i> Idea Repository
                        </button>
                    </li>
                    {currentUser.userLevel === 1 && (
                        <li>
                            <button
                                onClick={() => setActiveTab('admin')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-bold flex items-center ${activeTab === 'admin' ? 'bg-[#fd7912] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                            >
                                <i className="fas fa-users-cog mr-3"></i> User Management
                            </button>
                        </li>
                    )}
                </ul>
            </section>

            {activeTab === 'workspace' && (
                <>
                    <section className="pt-6 border-t border-slate-800/50">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">View Context</h2>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setViewMode('all')}
                                    className={`w-full text-left px-4 py-2 rounded-xl transition-all text-xs font-medium ${viewMode === 'all' ? 'text-[#fd7912] bg-[#fd7912]/10' : 'text-slate-400 hover:bg-slate-800'}`}
                                >
                                    <i className="fas fa-globe mr-2 opacity-50"></i> All Insights
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setViewMode('mine')}
                                    className={`w-full text-left px-4 py-2 rounded-xl transition-all text-xs font-medium ${viewMode === 'mine' ? 'text-[#fd7912] bg-[#fd7912]/10' : 'text-slate-400 hover:bg-slate-800'}`}
                                >
                                    <i className="fas fa-user mr-2 opacity-50"></i> My Ideas
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setViewMode('shared')}
                                    className={`w-full text-left px-4 py-2 rounded-xl transition-all text-xs font-medium ${viewMode === 'shared' ? 'text-[#fd7912] bg-[#fd7912]/10' : 'text-slate-400 hover:bg-slate-800'}`}
                                >
                                    <i className="fas fa-users mr-2 opacity-50"></i> Shared with Me
                                </button>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2 flex justify-between items-center">
                            <span>Categories</span>
                            {activeFilter && (
                                <button onClick={() => setActiveFilter(null)} className="text-[#fd7912] text-[10px] hover:underline">Clear</button>
                            )}
                        </h2>
                        <ul className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-preview">
                            {dynamicCategories.length === 0 ? (
                                <li className="px-4 py-2 text-slate-600 text-[11px] italic">No categories yet.</li>
                            ) : (
                                dynamicCategories.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setActiveFilter(cat)}
                                            className={`w-full text-left px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium truncate ${activeFilter === cat ? 'bg-[#fd7912]/10 text-[#fd7912] border border-[#fd7912]/30' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                                        >
                                            <i className="fas fa-hashtag mr-2 opacity-30"></i>
                                            {cat}
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </section>
                </>
            )}

            <section className="pt-6 border-t border-slate-800/50">
                <div className="p-4 rounded-2xl bg-[#fd7912]/5 border border-[#fd7912]/10">
                    <h3 className="text-sm font-bold text-[#fd7912] mb-2 flex items-center">
                        <i className="fas fa-robot mr-2"></i> Content Analyst
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span>Gemini Intelligence</span>
                    </div>
                </div>
            </section>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="w-72 glass border-r border-slate-800 shrink-0 hidden md:flex flex-col overflow-y-auto overflow-x-hidden">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobileMenu}></div>

                {/* Drawer */}
                <aside className="absolute inset-y-0 left-0 w-72 bg-[#1e293b] border-r border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                    {sidebarContent}
                </aside>
            </div>
        </>
    );
};

export default Sidebar;
