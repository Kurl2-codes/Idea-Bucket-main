
import React from 'react';
import { Idea } from '../../types';
import IdeaCardUI from './IdeaCardUI';

interface IdeaCardProps {
  idea: Idea;
  currentUserId: string;
  onDelete: (id: string) => void;
  onToggleShare: (id: string) => void;
  onPreview: (idea: Idea) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = (props) => {
  const { idea, currentUserId } = props;
  
  const isOwner = idea.userId === currentUserId;
  const displayImage = idea.imageDatas && idea.imageDatas.length > 0 ? idea.imageDatas[0] : null;

  const getCategoryStyle = (cat: string) => {
    const colors = [
      'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      'bg-teal-500/10 text-teal-400 border-teal-500/30',
      'bg-violet-500/10 text-violet-400 border-violet-500/30',
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    ];
    let hash = 0;
    for (let i = 0; i < cat.length; i++) {
      hash = cat.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <IdeaCardUI
      {...props}
      isOwner={isOwner}
      displayImage={displayImage}
      categoryStyle={getCategoryStyle(idea.category)}
      handleAction={handleAction}
    />
  );
};

export default IdeaCard;
