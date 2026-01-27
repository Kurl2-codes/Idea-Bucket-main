
import React from 'react';
import { Idea, User, SharePermission, Comment } from '../../types';
import { ImageSlideshow } from '../ui/ImageSlideshow';
import { CommentItem } from '../ui/CommentItem';

interface IdeaPreviewModalProps {
    previewIdea: Idea;
    currentUser: User;
    onClose: () => void;
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    editContent: string;
    setEditContent: (val: string) => void;
    editImages: string[];
    setEditImages: (val: string[] | ((prev: string[]) => string[])) => void;
    editEditorRef: React.RefObject<HTMLDivElement>;
    editFileInputRef: React.RefObject<HTMLInputElement>;
    onStartEdit: () => void;
    onSaveEdit: () => void;
    isAnalyzing: boolean;
    onAddEditImage: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // Sharing
    isSharePopoverOpen: boolean;
    setIsSharePopoverOpen: (val: boolean) => void;
    onGenerateShareLink: () => void;
    onUpdateSharePermission: (perm: SharePermission) => void;
    onCopyShareLink: () => void;
    linkCopied: boolean;
    onToggleShare: (id: string) => void;

    // Comments
    commentText: string;
    setCommentText: (val: string) => void;
    onAddComment: (e: React.FormEvent) => void;
    rootComments: Comment[];
    hiddenRootCount: number;
    showAllRootComments: boolean;
    setShowAllRootComments: (val: boolean) => void;
    replyingTo: string | null;
    setReplyingTo: (val: string | null) => void;
    replyText: string;
    setReplyText: (val: string) => void;
    onToggleLike: (id: string) => void;
    onAddReply: (e: React.FormEvent, id: string) => void;

    canEdit: boolean;
}

const IdeaPreviewModal: React.FC<IdeaPreviewModalProps> = ({
    previewIdea,
    currentUser,
    onClose,
    isEditing,
    setIsEditing,
    editContent,
    // setEditContent, // Passed nicely via contentEditable binding or just used in Save
    editImages,
    setEditImages,
    editEditorRef,
    editFileInputRef,
    onStartEdit,
    onSaveEdit,
    isAnalyzing,
    onAddEditImage,
    isSharePopoverOpen,
    setIsSharePopoverOpen,
    onGenerateShareLink,
    onUpdateSharePermission,
    onCopyShareLink,
    linkCopied,
    onToggleShare,
    commentText,
    setCommentText,
    onAddComment,
    rootComments,
    hiddenRootCount,
    showAllRootComments,
    setShowAllRootComments,
    replyingTo,
    setReplyingTo,
    replyText,
    setReplyText,
    onToggleLike,
    onAddReply,
    canEdit
}) => {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"></div>

            <div
                className="glass relative w-full max-w-7xl max-h-[92vh] overflow-y-auto scrollbar-preview rounded-[2.5rem] shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-8 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-xl z-10">
                    <div className="flex items-center space-x-4">
                        <span className="text-[11px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg bg-[#fd7912]/10 text-[#fd7912] border border-[#fd7912]/20">
                            {previewIdea.category}
                        </span>
                        {previewIdea.isShared ? (
                            <span className="text-[11px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Shared with {previewIdea.authorDepartment}
                            </span>
                        ) : (
                            <span className="text-[11px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                Private
                            </span>
                        )}
                        {(previewIdea.userId === currentUser.id || previewIdea.sharePermission === 'editor') && (
                            <span className="text-[11px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Edit Access
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {previewIdea.userId === currentUser.id && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsSharePopoverOpen(!isSharePopoverOpen)}
                                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-all"
                                    title="Link Sharing"
                                >
                                    <i className="fas fa-link text-xl"></i>
                                </button>
                                {isSharePopoverOpen && (
                                    <div className="absolute right-0 top-14 w-64 glass p-6 rounded-2xl border border-white/10 shadow-2xl z-20 animate-in slide-in-from-top-2 duration-200">
                                        <h4 className="text-xs font-black uppercase text-slate-500 mb-4 tracking-widest">Link Sharing</h4>
                                        {!previewIdea.shareLinkId ? (
                                            <button
                                                onClick={onGenerateShareLink}
                                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg transition-all"
                                            >
                                                Generate Link
                                            </button>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black uppercase text-slate-600">Permission</label>
                                                    <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                                                        <button
                                                            onClick={() => onUpdateSharePermission('viewer')}
                                                            className={`flex-1 py-1 text-[9px] font-black uppercase rounded ${previewIdea.sharePermission === 'viewer' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}
                                                        >
                                                            Viewer
                                                        </button>
                                                        <button
                                                            onClick={() => onUpdateSharePermission('editor')}
                                                            className={`flex-1 py-1 text-[9px] font-black uppercase rounded ${previewIdea.sharePermission === 'editor' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500'}`}
                                                        >
                                                            Editor
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={onCopyShareLink}
                                                    className={`w-full py-2 text-[10px] font-black uppercase rounded-lg transition-all flex items-center justify-center space-x-2 ${linkCopied ? 'bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                                                >
                                                    {linkCopied ? (
                                                        <><i className="fas fa-check"></i> <span>Copied!</span></>
                                                    ) : (
                                                        <><i className="far fa-copy"></i> <span>Copy Link</span></>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {canEdit && !isEditing && (
                            <button
                                onClick={onStartEdit}
                                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-[#fd7912] transition-all"
                            >
                                <i className="fas fa-edit text-xl"></i>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all transform hover:rotate-90"
                        >
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-8 sm:p-14 space-y-12">
                    <div className="space-y-6">
                        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
                            {previewIdea.title}
                        </h1>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                    {previewIdea.authorName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-base text-slate-200 font-semibold">{previewIdea.authorName}</span>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{previewIdea.authorDepartment}</span>
                                </div>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                            <span className="text-base text-slate-500">
                                {new Date(previewIdea.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-8">
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Images</h3>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        {editImages.map((src, idx) => (
                                            <div key={idx} className="relative group w-32 h-32">
                                                <img src={src} className="rounded-xl object-cover w-full h-full border border-slate-700" alt={`Edit ${idx}`} />
                                                <button
                                                    onClick={() => setEditImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <i className="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => editFileInputRef.current?.click()}
                                            className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-600 hover:text-[#fd7912] hover:border-[#fd7912] transition-all"
                                        >
                                            <i className="fas fa-plus mb-2"></i>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Add Image</span>
                                        </button>
                                        <input type="file" multiple accept="image/*" ref={editFileInputRef} onChange={onAddEditImage} className="hidden" />
                                    </div>
                                </div>
                            ) : (
                                <ImageSlideshow images={previewIdea.imageDatas || []} />
                            )}
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Content</h3>
                            <div className="w-full p-8 rounded-[2rem] bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 transition-colors">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-1 p-2 bg-slate-950/80 rounded-t-xl border border-slate-800">
                                            <button onClick={() => document.execCommand('bold')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors"><i className="fas fa-bold"></i></button>
                                            <button onClick={() => document.execCommand('italic')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors"><i className="fas fa-italic"></i></button>
                                            <button onClick={() => document.execCommand('formatBlock', false, 'h2')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors font-bold">H</button>
                                            <button onClick={() => document.execCommand('insertUnorderedList')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors"><i className="fas fa-list-ul"></i></button>
                                        </div>
                                        <div
                                            ref={editEditorRef}
                                            contentEditable
                                            dangerouslySetInnerHTML={{ __html: editContent }}
                                            className="w-full bg-slate-950 p-6 min-h-[300px] text-slate-100 outline-none border-x border-b border-slate-800 rounded-b-xl focus:ring-1 focus:ring-[#fd7912]/30"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-base xl:text-lg font-normal preview-content"
                                        dangerouslySetInnerHTML={{ __html: previewIdea.content || (previewIdea.imageDatas && previewIdea.imageDatas.length > 0 ? "Visual inputs captured." : "No text description.") }}
                                    />
                                )}
                            </div>
                        </div>

                        {!isEditing && (
                            <>
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Metadata & Tags</h3>
                                    <div className="w-full p-8 bg-slate-800/20 rounded-[2rem] border border-slate-700/30 hover:border-slate-600 transition-colors">
                                        <div className="flex flex-wrap gap-3">
                                            {previewIdea.tags.map(tag => (
                                                <span key={tag} className="px-5 py-2.5 bg-slate-800 text-slate-400 rounded-xl text-[11px] font-bold border border-slate-700/50 shadow-sm uppercase tracking-wider">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Team Insights</h3>
                                    <div className="w-full p-8 glass rounded-[2rem] border border-slate-800/50">
                                        {(previewIdea.userId === currentUser.id || (previewIdea.isShared && previewIdea.authorDepartment === currentUser.department) || previewIdea.sharePermission === 'editor') ? (
                                            <form onSubmit={onAddComment} className="mb-8">
                                                <div className="relative group">
                                                    <textarea
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        placeholder="Add a thought..."
                                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#fd7912]/50 transition-all resize-none min-h-[100px]"
                                                        required
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={!commentText.trim()}
                                                        className="absolute bottom-3 right-3 px-6 py-2 bg-[#fd7912] hover:bg-[#fd7912]/80 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#fd7912]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Post Comment
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <p className="text-slate-500 text-xs mb-8 italic">Public link viewer mode. Collaboration is disabled unless granted editor rights.</p>
                                        )}

                                        <div className="space-y-2">
                                            {previewIdea.comments && previewIdea.comments.length > 0 ? (
                                                <>
                                                    {rootComments.map(comment => (
                                                        <CommentItem
                                                            key={comment.id}
                                                            comment={comment}
                                                            depth={0}
                                                            currentUserId={currentUser.id}
                                                            replyingTo={replyingTo}
                                                            setReplyingTo={setReplyingTo}
                                                            replyText={replyText}
                                                            setReplyText={setReplyText}
                                                            onToggleLike={onToggleLike}
                                                            onAddReply={onAddReply}
                                                        />
                                                    ))}

                                                    {hiddenRootCount > 0 && !showAllRootComments && (
                                                        <button
                                                            onClick={() => setShowAllRootComments(true)}
                                                            className="mt-4 w-full py-3 rounded-2xl border border-slate-800 bg-slate-900/40 text-xs font-bold text-[#fd7912] hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                                                        >
                                                            <i className="fas fa-chevron-down"></i>
                                                            <span>Show {hiddenRootCount} more root comments</span>
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <i className="fas fa-comments text-slate-800 text-3xl mb-3"></i>
                                                    <p className="text-slate-600 text-xs">No insights shared yet. Be the first to comment!</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="p-8 border-t border-slate-800 flex justify-end space-x-4 sticky bottom-0 bg-slate-900/95 backdrop-blur-xl z-10">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-black transition-all border border-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSaveEdit}
                                disabled={isAnalyzing}
                                className="px-8 py-3 bg-[#fd7912] hover:bg-[#fd7912]/80 text-white rounded-2xl text-sm font-black transition-all shadow-xl shadow-[#fd7912]/20 disabled:opacity-50"
                            >
                                {isAnalyzing ? <><i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...</> : <><i className="fas fa-save mr-2"></i> Save & Re-analyze</>}
                            </button>
                        </>
                    ) : (
                        <>
                            {previewIdea.userId === currentUser.id && (
                                <button
                                    onClick={() => onToggleShare(previewIdea.id)}
                                    className={`px-8 py-3 rounded-2xl text-sm font-black transition-all shadow-xl ${previewIdea.isShared
                                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        : 'bg-[#fd7912] hover:bg-[#fd7912]/80 text-white shadow-[#fd7912]/20'
                                        }`}
                                >
                                    {previewIdea.isShared ? <><i className="fas fa-lock mr-2"></i> Unshare</> : <><i className="fas fa-share mr-2"></i> Share with {currentUser.department}</>}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-black transition-all border border-slate-700"
                            >
                                Close
                            </button>
                        </>
                    )}
                </div>
            </div>
            <style>{`
        .preview-content h2 { font-weight: 800; margin: 1.5rem 0 1rem 0; color: white; line-height: 1.2; }
        .preview-content ul { list-style-type: disc; padding-left: 2rem; margin: 1rem 0; }
        .preview-content li { margin-bottom: 0.5rem; }
        .preview-content b, .preview-content strong { font-weight: 700; color: white; }
        .preview-content i, .preview-content em { font-style: italic; }
        .preview-content p { margin-bottom: 1rem; }
      `}</style>
        </div>
    );
};

export default IdeaPreviewModal;
