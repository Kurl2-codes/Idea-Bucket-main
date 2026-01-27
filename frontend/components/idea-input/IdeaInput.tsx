
import React, { useState, useRef } from 'react';
import IdeaInputUI from './IdeaInputUI';

interface IdeaInputProps {
  onAdd: (text: string, imageDatas?: string[]) => void;
  isAnalyzing: boolean;
}

const IdeaInput: React.FC<IdeaInputProps> = ({ onAdd, isAnalyzing }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hasText, setHasText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleExecCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    checkText();
  };

  const checkText = () => {
    const plainText = editorRef.current?.innerText || '';
    setHasText(plainText.trim().length > 0);
  };

  const processFiles = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    fileList.forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    let imageFound = false;
    const files: File[] = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            files.push(blob);
            imageFound = true;
          }
        }
      }
    }

    if (imageFound) {
      e.preventDefault();
      processFiles(files);

      const text = e.clipboardData.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
      }
    } else {
      const html = e.clipboardData.getData('text/html');
      if (html && html.includes('<img')) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
      }
    }

    setTimeout(checkText, 0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemovePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = editorRef.current?.innerHTML || '';
    const plainText = editorRef.current?.innerText || '';
    
    if (plainText.trim()) {
      onAdd(content, previews.length > 0 ? previews : undefined);
      if (editorRef.current) editorRef.current.innerHTML = '';
      setPreviews([]);
      setHasText(false);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <IdeaInputUI
      isAnalyzing={isAnalyzing}
      previews={previews}
      isDragging={isDragging}
      hasText={hasText}
      editorRef={editorRef}
      fileInputRef={fileInputRef}
      onPaste={handlePaste}
      onInput={checkText}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onRemovePreview={handleRemovePreview}
      onSubmit={handleSubmit}
      onTriggerFileInput={handleTriggerFileInput}
      onFileChange={handleFileChange}
      onExecCommand={handleExecCommand}
    />
  );
};

export default IdeaInput;
