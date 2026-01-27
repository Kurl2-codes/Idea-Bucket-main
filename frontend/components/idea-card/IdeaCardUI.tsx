
import React from 'react';
import { Idea } from '../../types';

interface IdeaCardUIProps {
  idea: Idea;
  isOwner: boolean;
  displayImage: string | null;
  categoryStyle: string;
  onDelete: (id: string) => void;
  onToggleShare: (id: string) => void;
  onPreview: (idea: Idea) => void;
  handleAction: (e: React.MouseEvent, action: () => void) => void;
}

const IdeaCardUI: React.FC<IdeaCardUIProps> = ({
  idea,
  isOwner,
  displayImage,
  categoryStyle,
  onDelete,
  onToggleShare,
  onPreview,
  handleAction
}) => {
  return (
    <div
      onClick={() => onPreview(idea)}
      className="glass rounded-xl overflow-hidden flex flex-col h-full group transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#fd7912]/5 hover:border-[#fd7912]/40 cursor-pointer"
    >
      {displayImage && (
        <div className="relative h-48 overflow-hidden bg-slate-900">
          <img
            src={displayImage}
            alt={idea.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {idea.imageDatas && idea.imageDatas.length > 1 && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
              <i className="fas fa-clone mr-1"></i> {idea.imageDatas.length}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${categoryStyle}`}>
              {idea.category}
            </span>
            {idea.isShared ? (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border bg-amber-500/10 text-amber-400 border-amber-500/30">
                <i className="fas fa-users mr-1"></i> Dept Shared
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border bg-slate-500/10 text-slate-400 border-slate-500/30">
                <i className="fas fa-lock mr-1"></i> Private
              </span>
            )}
          </div>
          {isOwner && (
            <button
              onClick={(e) => handleAction(e, () => onDelete(idea.id))}
              className="text-slate-500 hover:text-red-400 transition-colors p-1"
              title="Remove from Workspace"
            >
              <i className="fas fa-trash-alt text-sm"></i>
            </button>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight group-hover:text-[#fd7912] transition-colors">
          {idea.title}
        </h3>

        <p className="text-sm text-slate-400 mb-4 line-clamp-3">
          <div dangerouslySetInnerHTML={{ __html: idea.content || '' }} className="rich-text-content" />
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {idea.tags.map(tag => (
              <span key={tag} className="text-[11px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                {idea.authorName.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-400 font-medium">{idea.authorName}</span>
                <span className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">{idea.authorDepartment}</span>
              </div>
            </div>

            {isOwner && (
              <button
                onClick={(e) => handleAction(e, () => onToggleShare(idea.id))}
                className={`text-[10px] px-3 py-1 rounded-lg transition-colors font-semibold ${idea.isShared
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-[#fd7912] hover:bg-[#fd7912]/80 text-white shadow-[#fd7912]/10'
                  }`}
                title={idea.isShared ? 'Make private' : `Share with ${idea.authorDepartment}`}
              >
                {idea.isShared ? (
                  <><i className="fas fa-lock mr-1"></i> Unshare</>
                ) : (
                  <><i className="fas fa-share mr-1"></i> Share</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCardUI;
