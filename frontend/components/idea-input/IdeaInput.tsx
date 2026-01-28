
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

  // Sanitize HTML to remove garbage attributes from copy-paste (e.g. Teams, Word)
  const sanitizeHTML = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;

    const walk = (el: Element) => {
      // Remove unwanted attributes
      const matchPattern = /^(data-|node|style|class|on)/;
      const toRemove = [];

      for (let i = 0; i < el.attributes.length; i++) {
        const { name } = el.attributes[i];
        if (matchPattern.test(name)) {
          toRemove.push(name);
        }
      }

      toRemove.forEach(name => el.removeAttribute(name));

      // Remove specific tags that we don't want inline (e.g. img - we use attachments)
      if (el.tagName.toLowerCase() === 'img') {
        el.remove();
        return; // Node removed, stop processing this branch
      }

      Array.from(el.children).forEach(walk);
    };

    Array.from(div.children).forEach(walk);
    return div.innerHTML;
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // 1. Handle Files (Images)
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

      // If we also have text, insert it
      const text = e.clipboardData.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
      }
      return;
    }

    // 2. Handle Rich Text (strip mess but keep formatting)
    // We let default behavior happen for text/html to preserve bold/lists
    // But we rely on onSubmit to clean it up.
    // However, if there are images in the HTML that are NOT files (e.g. external links),
    // we might want to prevent them?
    // For now, let default paste happen, we sanitize on submit.

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
    const rawContent = editorRef.current?.innerHTML || '';
    const cleanContent = sanitizeHTML(rawContent);
    const plainText = editorRef.current?.innerText || '';

    if (plainText.trim() || (previews.length > 0)) {
      // Use cleanContent instead of rawContent
      onAdd(cleanContent, previews.length > 0 ? previews : undefined);

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
