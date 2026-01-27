
import React from 'react';
import AuthScreen from './components/auth/AuthScreen';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import WorkspaceView from './components/workspace/WorkspaceView';
import IdeaPreviewModal from './components/idea-card/IdeaPreviewModal';
import { useWorkspace } from './hooks/useWorkspace';


const App: React.FC = () => {
  const {
    currentUser,
    handleAuthSuccess,
    handleLogout,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    activeFilter,
    setActiveFilter,
    dynamicCategories,
    // Workspace Props
    visibleIdeas,
    ideas,
    isAnalyzing,
    handleAddIdea,
    handleDeleteIdea,
    handleToggleShare,
    setPreviewIdea,
    // Preview/Edit Props (Consumed by WorkspaceView internally or if we moved Preview there?
    // Actually Preview is a modal overlay that sits on top. 
    // Let's check how WorkspaceView was written... 
    // Wait, I put the IdeaCard list in WorkspaceView, but the PREVIEW MODAL was left in App.tsx in my previous thought process? 
    // Let's check WorkspaceView content again. 
    // Ah, WorkspaceView DOES NOT have the modal. 
    // I need to either move the modal to a separate component or keep it here.
    // Given the size, I should probably extract the PreviewModal too.
    previewIdea,
    // ... other props needed for preview
    handleClosePreview,
    isEditing,
    setIsEditing,
    editContent,
    setEditContent,
    editImages,
    setEditImages,
    editEditorRef,
    editFileInputRef,
    handleStartEdit,
    handleSaveEdit,
    handleAddEditImage,
    isSharePopoverOpen,
    setIsSharePopoverOpen,
    handleGenerateShareLink,
    handleUpdateSharePermission,
    handleCopyShareLink,
    linkCopied,
    canEdit,
    commentText,
    setCommentText,
    handleAddComment,
    rootComments,
    replyingTo,
    setReplyingTo,
    replyText,
    setReplyText,
    handleToggleLike,
    handleAddReply,
    hiddenRootCount,
    showAllRootComments,
    setShowAllRootComments
  } = useWorkspace();

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0c1422]">
      <Header
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          dynamicCategories={dynamicCategories}
          currentUser={currentUser}
        />

        <WorkspaceView
          activeTab={activeTab}
          viewMode={viewMode}
          visibleIdeas={visibleIdeas}
          ideas={ideas}
          isAnalyzing={isAnalyzing}
          currentUserId={currentUser.id}
          onAdd={handleAddIdea}
          onDelete={handleDeleteIdea}
          onToggleShare={handleToggleShare}
          onPreview={setPreviewIdea}
          onSetActiveTab={setActiveTab}
        />
      </div>

      {/* Preview Modal - Extracted to keep App clean? Or just render here? 
           Let's extract it to components/idea-card/IdeaPreviewModal.tsx to be safe 
           and strictly follow "no long files".
       */}
      {/* Preview Modal */}
      {previewIdea && (
        <IdeaPreviewModal
          previewIdea={previewIdea}
          currentUser={currentUser}
          onClose={handleClosePreview}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editContent={editContent}
          setEditContent={setEditContent}
          editImages={editImages}
          setEditImages={setEditImages}
          editEditorRef={editEditorRef}
          editFileInputRef={editFileInputRef}
          onStartEdit={handleStartEdit}
          onSaveEdit={handleSaveEdit}
          isAnalyzing={isAnalyzing}
          onAddEditImage={handleAddEditImage}
          isSharePopoverOpen={isSharePopoverOpen}
          setIsSharePopoverOpen={setIsSharePopoverOpen}
          onGenerateShareLink={handleGenerateShareLink}
          onUpdateSharePermission={handleUpdateSharePermission}
          onCopyShareLink={handleCopyShareLink}
          linkCopied={linkCopied}
          onToggleShare={handleToggleShare}
          commentText={commentText}
          setCommentText={setCommentText}
          onAddComment={handleAddComment}
          rootComments={rootComments}
          hiddenRootCount={hiddenRootCount}
          showAllRootComments={showAllRootComments}
          setShowAllRootComments={setShowAllRootComments}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          replyText={replyText}
          setReplyText={setReplyText}
          onToggleLike={handleToggleLike}
          onAddReply={handleAddReply}
          canEdit={canEdit}
        />
      )}
    </div>
  );
};

export default App;
