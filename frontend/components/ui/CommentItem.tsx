import React, { useState } from 'react';
import { Comment } from '../../types';

interface CommentItemProps {
    comment: Comment;
    depth: number;
    currentUserId: string;
    replyingTo: string | null;
    setReplyingTo: (id: string | null) => void;
    replyText: string;
    setReplyText: (val: string) => void;
    onToggleLike: (id: string) => void;
    onAddReply: (e: React.FormEvent, id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    depth,
    currentUserId,
    replyingTo,
    setReplyingTo,
    replyText,
    setReplyText,
    onToggleLike,
    onAddReply
}) => {
    const [showAllReplies, setShowAllReplies] = useState(false);
    const hasLiked = comment.likes?.includes(currentUserId);

    let indentationClass = '';
    if (depth === 0) {
        indentationClass = 'p-5 bg-slate-900/40 rounded-2xl border border-slate-800/50';
    } else if (depth <= 2) {
        indentationClass = 'ml-8 border-l-2 border-slate-800 pl-4 mt-4';
    } else {
        indentationClass = 'mt-4 border-t border-slate-800/10 pt-4';
    }

    const hasReplies = comment.replies && comment.replies.length > 0;
    const displayReplies = showAllReplies ? comment.replies : (comment.replies?.slice(0, 2) || []);
    const hiddenCount = (comment.replies?.length || 0) - 2;

    return (
        <div className={`${indentationClass} animate-in slide-in-from-top-2 duration-300 mb-4 last:mb-0`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#fd7912]/20 border border-[#fd7912]/20 flex items-center justify-center text-[10px] font-bold text-[#fd7912]">
                        {comment.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200">{comment.userName}</span>
                        <span className="text-[9px] text-[#fd7912] uppercase font-black tracking-widest">{comment.userDepartment}</span>
                    </div>
                </div>
                <span className="text-[10px] text-slate-600">
                    {new Date(comment.createdAt).toLocaleDateString()}
                </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-3">{comment.text}</p>

            <div className="flex items-center space-x-4">
                <button
                    onClick={() => onToggleLike(comment.id)}
                    className={`flex items-center space-x-1.5 text-[11px] font-bold transition-colors ${hasLiked ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <i className={`${hasLiked ? 'fas' : 'far'} fa-heart`}></i>
                    <span>{comment.likes?.length || 0}</span>
                </button>

                <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-[11px] font-bold text-slate-500 hover:text-[#fd7912] transition-colors"
                >
                    <i className="far fa-comment-dots mr-1.5"></i>
                    Reply
                </button>
            </div>

            {replyingTo === comment.id && (
                <form onSubmit={(e) => onAddReply(e, comment.id)} className="mt-4">
                    <div className="relative">
                        <input
                            autoFocus
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#fd7912]/50"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#fd7912] hover:text-[#fd7912]/80 font-bold text-[10px]"
                        >
                            Send
                        </button>
                    </div>
                </form>
            )}

            {hasReplies && (
                <div className="mt-2">
                    {displayReplies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            currentUserId={currentUserId}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            onToggleLike={onToggleLike}
                            onAddReply={onAddReply}
                        />
                    ))}

                    {hiddenCount > 0 && !showAllReplies && (
                        <button
                            onClick={() => setShowAllReplies(true)}
                            className="mt-3 text-[11px] font-bold text-[#fd7912] hover:text-[#fd7912]/80 flex items-center space-x-2 px-2 py-1 rounded hover:bg-[#fd7912]/5 transition-all"
                        >
                            <i className="fas fa-chevron-down mr-1"></i>
                            <span>Show {hiddenCount} more replies</span>
                        </button>
                    )}

                    {showAllReplies && comment.replies && comment.replies.length > 2 && (
                        <button
                            onClick={() => setShowAllReplies(false)}
                            className="mt-3 text-[11px] font-bold text-slate-500 hover:text-slate-400 flex items-center space-x-2 px-2 py-1 rounded hover:bg-slate-800/50 transition-all"
                        >
                            <i className="fas fa-chevron-up mr-1"></i>
                            <span>Hide replies</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
