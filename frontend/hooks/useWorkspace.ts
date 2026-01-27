
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Idea, User, ViewMode, MainTab, Comment, SharePermission } from '../types';
import { analyzeIdea, getIdeas, toggleShare, deleteIdea, addComment, addReply, toggleCommentLike, updateIdea, updateShareLink } from '../services/geminiService';

export const useWorkspace = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const [activeTab, setActiveTab] = useState<MainTab>('workspace');
    const [previewIdea, setPreviewIdea] = useState<Idea | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [showAllRootComments, setShowAllRootComments] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [editImages, setEditImages] = useState<string[]>([]);
    const editEditorRef = useRef<HTMLDivElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Sharing State
    const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    // 1. Initial Load Effect (Run ONCE)
    useEffect(() => {
        // Legacy: Clear old local storage to stop confusion
        localStorage.removeItem('workflow_ideas_v3');

        const savedUserStr = localStorage.getItem('workflow_user');
        if (savedUserStr) {
            try {
                const user = JSON.parse(savedUserStr);
                // Only set if actually different to avoid trivial re-renders
                setCurrentUser(user);
            } catch (e) { console.error(e); }
        }

        // Check for shareable link in URL
        const urlParams = new URLSearchParams(window.location.search);
        const sId = urlParams.get('shareId');
        if (sId) {
            (window as any)._pendingShareId = sId; // Stashing globally for the fetch effect
        }
    }, []);

    // 2. Data Fetching Effect (Run when currentUser changes)
    useEffect(() => {
        const fetchIdeas = async () => {
            if (currentUser) {
                const remoteIdeas = await getIdeas();
                const mappedIdeas: Idea[] = remoteIdeas.map((analysis: any, index) => ({
                    id: analysis.id || analysis._id || Date.now().toString() + index,
                    userId: analysis.userId || currentUser.id,
                    authorName: analysis.authorName || currentUser.name,
                    authorDepartment: analysis.authorDepartment || currentUser.department,
                    isShared: analysis.isShared || false,
                    type: analysis.image_urls && analysis.image_urls.length > 0 ? 'image' : 'text',
                    content: analysis.content || "Fetched content",
                    imageDatas: analysis.image_urls,
                    title: analysis.title,
                    category: analysis.category,
                    tags: analysis.tags,
                    createdAt: analysis.createdAt || Date.now(),
                    connections: [],
                    comments: analysis.comments || [],
                    shareLinkId: analysis.shareLinkId,
                    sharePermission: analysis.sharePermission as SharePermission | undefined
                }));
                // Only update if ideas actually changed (deep check hard, but length check simple)
                setIdeas(mappedIdeas);

                const pendingId = (window as any)._pendingShareId;
                if (pendingId) {
                    const sharedIdea = mappedIdeas.find(i => i.shareLinkId === pendingId);
                    if (sharedIdea) {
                        setPreviewIdea(sharedIdea);

                        // Google Sheets-style: Auto-open editor if user has edit access
                        if (sharedIdea.userId === currentUser.id || sharedIdea.sharePermission === 'editor') {
                            setIsEditing(true);
                            setEditContent(sharedIdea.content);
                            setEditImages(sharedIdea.imageDatas || []);
                        }

                        delete (window as any)._pendingShareId;

                        // Optional: Clean up URL to keep it pretty
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                }
            }
        };

        fetchIdeas();
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('workflow_ideas_v3', JSON.stringify(ideas));
    }, [ideas]);

    const handleAuthSuccess = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('workflow_user', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('workflow_user');
    };

    const handleAddIdea = async (content: string, imageDatas?: string[]) => {
        if (!currentUser) return;
        setIsAnalyzing(true);
        try {
            if (!currentUser) return;

            const analysis = await analyzeIdea(content, imageDatas, currentUser);

            const newIdea: Idea = {
                id: analysis.id || Date.now().toString(),
                userId: analysis.userId || currentUser.id,
                authorName: analysis.authorName || currentUser.name,
                authorDepartment: analysis.authorDepartment || currentUser.department,
                isShared: analysis.isShared || false,
                type: imageDatas && imageDatas.length > 0 ? 'image' : 'text',
                content: analysis.content || content,
                imageDatas: analysis.image_urls || imageDatas, // Prefer URL from backend
                title: analysis.title,
                category: analysis.category,
                tags: analysis.tags,
                createdAt: analysis.createdAt || Date.now(),
                connections: [],
                comments: []
            };

            setIdeas(prev => [newIdea, ...prev]);
            setActiveTab('workspace');
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDeleteIdea = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this idea?")) return;

        // Optimistic update
        setIdeas(prev => prev.filter(i => i.id !== id));
        if (previewIdea?.id === id) setPreviewIdea(null);

        try {
            await deleteIdea(id);
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleToggleShare = async (id: string) => {
        try {
            // Optimistic update
            setIdeas(prev => prev.map(i => {
                if (i.id === id && i.userId === currentUser?.id) {
                    return { ...i, isShared: !i.isShared };
                }
                return i;
            }));

            // Call Backend
            await toggleShare(id);

            if (previewIdea?.id === id) {
                setPreviewIdea(prev => prev ? { ...prev, isShared: !prev.isShared } : null);
            }
        } catch (error) {
            console.error("Failed to share", error);
        }
    };

    const handleGenerateShareLink = async () => {
        if (!previewIdea || !currentUser) return;
        const shareLinkId = Math.random().toString(36).substring(2, 15);
        const updatedIdea: Idea = {
            ...previewIdea,
            shareLinkId,
            sharePermission: 'viewer'
        };

        try {
            await updateShareLink(previewIdea.id, shareLinkId, 'viewer');
            setIdeas(prev => prev.map(i => i.id === previewIdea.id ? updatedIdea : i));
            setPreviewIdea(updatedIdea);
        } catch (error) {
            console.error("Failed to generate share link", error);
        }
    };

    const handleUpdateSharePermission = async (perm: SharePermission) => {
        if (!previewIdea) return;
        const updatedIdea: Idea = { ...previewIdea, sharePermission: perm };

        try {
            if (previewIdea.shareLinkId) {
                await updateShareLink(previewIdea.id, previewIdea.shareLinkId, perm);
            }
            setIdeas(prev => prev.map(i => i.id === previewIdea.id ? updatedIdea : i));
            setPreviewIdea(updatedIdea);
        } catch (error) {
            console.error("Failed to update share permission", error);
        }
    };

    const handleCopyShareLink = () => {
        if (!previewIdea?.shareLinkId) return;
        const url = `${window.location.origin}${window.location.pathname}?shareId=${previewIdea.shareLinkId}`;
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !previewIdea || !commentText.trim()) return;

        try {
            const newComment = await addComment(previewIdea.id, commentText.trim());

            const updatedIdea = {
                ...previewIdea,
                comments: [...(previewIdea.comments || []), newComment]
            };

            setIdeas(prev => prev.map(i => i.id === previewIdea.id ? updatedIdea : i));
            setPreviewIdea(updatedIdea);
            setCommentText('');
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleToggleLike = async (commentId: string) => {
        if (!currentUser || !previewIdea) return;

        try {
            await toggleCommentLike(previewIdea.id, commentId);

            const toggleLikeRecursive = (comments: Comment[]): Comment[] => {
                return comments.map(c => {
                    if (c.id === commentId) {
                        const currentLikes = c.likes || [];
                        const alreadyLiked = currentLikes.includes(currentUser.id);
                        return {
                            ...c,
                            likes: alreadyLiked
                                ? currentLikes.filter(id => id !== currentUser.id)
                                : [...currentLikes, currentUser.id]
                        };
                    }
                    if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: toggleLikeRecursive(c.replies) };
                    }
                    return c;
                });
            };

            const updatedComments = toggleLikeRecursive(previewIdea.comments || []);
            const updatedIdea = { ...previewIdea, comments: updatedComments };

            setIdeas(prev => prev.map(i => i.id === previewIdea.id ? updatedIdea : i));
            setPreviewIdea(updatedIdea);
        } catch (error) {
            console.error("Failed to toggle comment like", error);
        }
    };

    const handleAddReply = async (e: React.FormEvent, parentId: string) => {
        e.preventDefault();
        if (!currentUser || !previewIdea || !replyText.trim()) return;

        try {
            const newReply = await addReply(previewIdea.id, parentId, replyText.trim());

            const addReplyRecursive = (comments: Comment[]): Comment[] => {
                return comments.map(c => {
                    if (c.id === parentId) {
                        return { ...c, replies: [...(c.replies || []), newReply] };
                    }
                    if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: addReplyRecursive(c.replies) };
                    }
                    return c;
                });
            };

            const updatedComments = addReplyRecursive(previewIdea.comments || []);
            const updatedIdea = { ...previewIdea, comments: updatedComments };

            setIdeas(prev => prev.map(i => i.id === previewIdea.id ? updatedIdea : i));
            setPreviewIdea(updatedIdea);
            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            console.error("Failed to add reply", error);
        }
    };

    const visibleIdeas = useMemo(() => {
        if (!currentUser) return [];
        return ideas.filter(idea => {
            const isMine = idea.userId === currentUser.id;
            const isSharedWithMe = idea.isShared && idea.authorDepartment === currentUser.department;

            if (!isMine && !isSharedWithMe) return false;
            if (viewMode === 'mine' && !isMine) return false;
            if (viewMode === 'shared' && !isSharedWithMe) return false;

            const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                idea.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCat = !activeFilter || idea.category === activeFilter;

            return matchesSearch && matchesCat;
        });
    }, [ideas, currentUser, viewMode, searchQuery, activeFilter]);

    const dynamicCategories = useMemo(() => {
        const cats = Array.from(new Set(visibleIdeas.map(i => i.category)));
        return cats.sort();
    }, [visibleIdeas]);

    const rootComments = useMemo(() => {
        if (!previewIdea?.comments) return [];
        const reversed = [...previewIdea.comments].reverse();
        return showAllRootComments ? reversed : reversed.slice(0, 5);
    }, [previewIdea, showAllRootComments]);

    const hiddenRootCount = (previewIdea?.comments?.length || 0) - 5;

    const handleClosePreview = () => {
        setPreviewIdea(null);
        setReplyingTo(null);
        setShowAllRootComments(false);
        setIsEditing(false);
        setIsSharePopoverOpen(false);
    };

    const handleStartEdit = () => {
        if (!previewIdea) return;
        setIsEditing(true);
        setEditContent(previewIdea.content);
        setEditImages(previewIdea.imageDatas || []);
    };

    const handleSaveEdit = async () => {
        if (!previewIdea || !currentUser) return;
        setIsAnalyzing(true);
        try {
            const currentContent = editEditorRef.current?.innerHTML || editContent;
            const analysis = await analyzeIdea(currentContent, editImages, currentUser);

            const updatedIdea: Idea = {
                ...previewIdea,
                content: currentContent,
                imageDatas: editImages.length > 0 ? editImages : undefined,
                title: analysis.title,
                category: analysis.category,
                tags: analysis.tags,
                type: editImages.length > 0 ? 'image' : 'text'
            };

            // Persist to DB
            await updateIdea(previewIdea.id, updatedIdea.content, updatedIdea.title, updatedIdea.category, updatedIdea.tags);

            setIdeas(prev => prev.map(i => i.id === previewIdea.id ? updatedIdea : i));
            setPreviewIdea(updatedIdea);
            setIsEditing(false);
        } catch (error) {
            console.error("Save edit failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);
            fileList.forEach((file: File) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setEditImages((prev) => [...prev, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        if (editFileInputRef.current) editFileInputRef.current.value = '';
    };

    const canEdit = useMemo(() => {
        if (!currentUser || !previewIdea) return false;
        if (previewIdea.userId === currentUser.id) return true;
        if (previewIdea.sharePermission === 'editor') return true;
        return false;
    }, [currentUser, previewIdea]);

    return {
        currentUser,
        ideas,
        isAnalyzing,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        previewIdea,
        setPreviewIdea,
        commentText,
        setCommentText,
        replyingTo,
        setReplyingTo,
        replyText,
        setReplyText,
        showAllRootComments,
        setShowAllRootComments,
        isEditing,
        setIsEditing,
        editContent,
        setEditContent,
        editImages,
        setEditImages,
        editEditorRef,
        editFileInputRef,
        isSharePopoverOpen,
        setIsSharePopoverOpen,
        linkCopied,
        setLinkCopied,
        handleAuthSuccess,
        handleLogout,
        handleAddIdea,
        handleDeleteIdea,
        handleToggleShare,
        handleGenerateShareLink,
        handleUpdateSharePermission,
        handleCopyShareLink,
        handleAddComment,
        handleToggleLike,
        handleAddReply,
        visibleIdeas,
        dynamicCategories,
        rootComments,
        hiddenRootCount,
        handleClosePreview,
        handleStartEdit,
        handleSaveEdit,
        handleAddEditImage,
        canEdit
    };
};
