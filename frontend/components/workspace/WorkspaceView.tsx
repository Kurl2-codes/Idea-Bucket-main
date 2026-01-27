import React from 'react';
import IdeaInput from '../idea-input/IdeaInput';
import IdeaCard from '../idea-card/IdeaCard';
import AdminDashboard from '../admin/AdminDashboard';
import { Idea, MainTab, ViewMode } from '../../types';

interface WorkspaceViewProps {
    activeTab: MainTab;
    viewMode: ViewMode;
    visibleIdeas: Idea[];
    ideas: Idea[]; // For latest list in capture mode
    isAnalyzing: boolean;
    currentUserId: string; // Passed from parent
    onAdd: (content: string, imageDatas?: string[]) => void;
    onDelete: (id: string) => void;
    onToggleShare: (id: string) => void;
    onPreview: (idea: Idea) => void;
    onSetActiveTab: (tab: MainTab) => void;
}

const WorkspaceView: React.FC<WorkspaceViewProps> = ({
    activeTab,
    viewMode,
    visibleIdeas,
    ideas,
    isAnalyzing,
    currentUserId,
    onAdd,
    onDelete,
    onToggleShare,
    onPreview,
    onSetActiveTab
}) => {
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
            {activeTab === 'capture' ? (
                <div className="max-w-3xl mx-auto py-8 animate-in fade-in duration-300">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Capture Insight</h2>
                        <p className="text-slate-400 font-medium">Capture text or images. Gemini will automatically organize and contextualize them for you.</p>
                    </div>
                    <IdeaInput onAdd={onAdd} isAnalyzing={isAnalyzing} />

                    {ideas.length > 0 && (
                        <div className="mt-12">
                            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-6 flex items-center">
                                <div className="w-8 h-px bg-slate-800 mr-3"></div>
                                Latest Workspace Additions
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {ideas.slice(0, 2).map(idea => (
                                    <div key={idea.id} className="glass p-5 rounded-2xl border-slate-800/50 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => { onPreview(idea); onSetActiveTab('workspace'); }}>
                                        <h4 className="text-sm font-bold text-slate-300 truncate">{idea.title}</h4>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <span className="text-[10px] text-[#fd7912] font-black uppercase tracking-wider">{idea.category}</span>
                                            <span className="text-[10px] text-slate-600">•</span>
                                            <span className="text-[10px] text-slate-500">{new Date(idea.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : activeTab === 'admin' ? (
                <AdminDashboard />
            ) : (
                <div className="animate-in fade-in duration-500">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-200 capitalize flex items-center tracking-tight">
                                <i className="fas fa-database mr-4 text-[#fd7912]"></i>
                                {viewMode === 'all' ? 'Knowledge Hub' : viewMode === 'mine' ? 'My Desk' : 'Team Library'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1 font-medium">Viewing {visibleIdeas.length} curated {visibleIdeas.length === 1 ? 'item' : 'items'} in your active workspace.</p>
                        </div>
                    </div>

                    {visibleIdeas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {visibleIdeas.map(idea => (
                                <IdeaCard
                                    key={idea.id}
                                    idea={idea}
                                    currentUserId={currentUserId}
                                    onDelete={onDelete}
                                    onToggleShare={onToggleShare}
                                    onPreview={onPreview}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="glass rounded-[3rem] p-24 text-center border-dashed border-slate-800 bg-slate-900/20">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <i className="fas fa-lightbulb text-slate-600 text-4xl"></i>
                            </div>
                            <h3 className="text-2xl font-black text-slate-300 mb-3 tracking-tight">Workspace is empty</h3>
                            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
                                Start by capturing a new idea, screenshot, or text snippet. Our AI will handle the organization.
                            </p>
                            <button
                                onClick={() => onSetActiveTab('capture')}
                                className="mt-10 px-10 py-3.5 bg-[#fd7912] text-white text-sm font-black rounded-2xl hover:bg-[#fd7912]/80 transition-all transform hover:-translate-y-0.5"
                            >
                                Capture First Insight
                            </button>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
};

export default WorkspaceView;
