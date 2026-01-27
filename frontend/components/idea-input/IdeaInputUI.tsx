
import React, { RefObject } from 'react';

interface IdeaInputUIProps {
  isAnalyzing: boolean;
  previews: string[];
  isDragging: boolean;
  hasText: boolean;
  editorRef: RefObject<HTMLDivElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onPaste: (e: React.ClipboardEvent) => void;
  onInput: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onRemovePreview: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTriggerFileInput: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExecCommand: (command: string, value?: string) => void;
}

const IdeaInputUI: React.FC<IdeaInputUIProps> = ({
  isAnalyzing,
  previews,
  isDragging,
  hasText,
  editorRef,
  fileInputRef,
  onPaste,
  onInput,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemovePreview,
  onSubmit,
  onTriggerFileInput,
  onFileChange,
  onExecCommand
}) => {
  return (
    <div 
      className={`glass rounded-2xl p-6 shadow-2xl mb-8 transition-all border-2 ${
        isDragging ? 'border-[#fd7912] bg-[#fd7912]/10' : 'border-transparent hover:border-[#fd7912]/30'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
              <i className="fas fa-pen-nib mr-2 text-[#fd7912]"></i>
              Description Required
            </h3>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center space-x-1 p-2 bg-slate-900/80 rounded-t-xl border-x border-t border-slate-700">
            <button type="button" onClick={() => onExecCommand('bold')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors" title="Bold">
              <i className="fas fa-bold"></i>
            </button>
            <button type="button" onClick={() => onExecCommand('italic')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors" title="Italic">
              <i className="fas fa-italic"></i>
            </button>
            <button type="button" onClick={() => onExecCommand('formatBlock', 'h2')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors font-bold" title="Header">
              H
            </button>
            <div className="w-px h-4 bg-slate-700 mx-1"></div>
            <button type="button" onClick={() => onExecCommand('insertUnorderedList')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors" title="Bullet List">
              <i className="fas fa-list-ul"></i>
            </button>
            <button type="button" onClick={() => onExecCommand('indent')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors" title="Indent">
              <i className="fas fa-indent"></i>
            </button>
            <button type="button" onClick={() => onExecCommand('outdent')} className="w-8 h-8 rounded hover:bg-slate-700 text-slate-300 transition-colors" title="Outdent">
              <i className="fas fa-outdent"></i>
            </button>
          </div>

          <div 
            ref={editorRef}
            contentEditable
            onPaste={onPaste}
            onInput={onInput}
            data-placeholder="A text description is required to capture your idea. Start typing or paste content..."
            className={`w-full bg-slate-900/50 text-slate-100 rounded-b-xl p-4 min-h-[150px] focus:ring-2 outline-none border transition-all overflow-y-auto rich-editor ${
              hasText ? 'focus:ring-[#fd7912] border-slate-700' : 'focus:ring-red-500/50 border-red-900/30'
            }`}
          />
          
          <style>{`
            .rich-editor:empty:before {
              content: attr(data-placeholder);
              color: #64748b;
              pointer-events: none;
              display: block;
            }
            .rich-editor h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: white; }
            .rich-editor ul { list-style-type: disc; padding-left: 1.5rem; }
            .rich-editor b, .rich-editor strong { font-weight: 700; color: white; }
          `}</style>
          
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {previews.map((src, index) => (
                <div key={index} className="relative group w-24 h-24">
                  <img src={src} alt={`Preview ${index}`} className="rounded-lg border border-slate-600 shadow-lg object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => onRemovePreview(index)}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 text-[10px] shadow-lg transition-transform hover:scale-110 opacity-0 group-hover:opacity-100"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onTriggerFileInput}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 hover:border-[#fd7912]/50"
              >
                <i className="fas fa-images"></i>
                <span className="hidden sm:inline">Attach Images</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>
            
            <button
              type="submit"
              disabled={isAnalyzing || !hasText}
              className={`flex items-center space-x-2 px-6 py-2 text-white font-semibold rounded-lg shadow-lg transition-all transform ${
                !hasText || isAnalyzing 
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-[#fd7912] hover:bg-[#fd7912]/80 shadow-[#fd7912]/20 hover:-translate-y-0.5'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i>
                  <span>Capture Idea</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IdeaInputUI;
