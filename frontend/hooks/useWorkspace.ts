
import React, { useState, useEffect, useMemo, useRef } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import DOMPurify from 'dompurify';
import { Idea, User, ViewMode, MainTab, Comment, SharePermission } from '../types';
import { analyzeIdea, getIdeas, toggleShare, deleteIdea, addComment, addReply, toggleCommentLike, updateIdea, updateShareLink, getProfile } from '../services/geminiService';

export const useWorkspace = () => {
    const { mutate: globalMutate } = useSWRConfig();

    // 1. Core Data with SWR
    const { data: currentUser, error: userError, mutate: mutateUser } = useSWR<User | null>('auth/me', getProfile, {
        revalidateOnFocus: false,
        shouldRetryOnError: false
    });

    const fetcher = async () => {
        const ideasData = await getIdeas();
        return ideasData.map((analysis: any, index: number) => ({
            id: analysis.id || analysis._id || Date.now().toString() + index,
            userId: analysis.userId,
            authorName: analysis.authorName,
            authorDepartment: analysis.authorDepartment,
            isShared: analysis.isShared || false,
            type: (analysis.image_urls && analysis.image_urls.length > 0) ? 'image' : 'text',
            content: analysis.content || "",
            imageDatas: analysis.image_urls || [],
            title: analysis.title || "Untitled",
            category: analysis.category || "Uncategorized",
            tags: analysis.tags || [],
            createdAt: analysis.createdAt || Date.now(),
            connections: [],
            comments: analysis.comments || [],
            shareLinkId: analysis.shareLinkId,
            sharePermission: analysis.sharePermission as SharePermission | undefined
        }));
    };

    const { data: remoteIdeas = [], mutate: mutateIdeas } = useSWR(
        currentUser ? 'gemini/ideas' : null,
        fetcher
    );

    const ideas = remoteIdeas;
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 2. View States (Restored from localStorage)
    const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('workflow_search') || '');
    const [activeFilter, setActiveFilter] = useState<string | null>(() => localStorage.getItem('workflow_filter') || null);
    const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('workflow_view_mode') as ViewMode) || 'all');
    const [activeTab, setActiveTab] = useState<MainTab>(() => (localStorage.getItem('workflow_tab') as MainTab) || 'workspace');

    const [previewIdea, setPreviewIdea] = useState<Idea | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [showAllRootComments, setShowAllRootComments] = useState(false);

    // 3. Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [editImages, setEditImages] = useState<string[]>([]);
    const editEditorRef = useRef<HTMLDivElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // 4. Sharing State
    const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    // Effects
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sId = urlParams.get('shareId');
        if (sId) {
            (window as any)._pendingShareId = sId;
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('workflow_tab', activeTab);
    }, [activeTab]);
    useEffect(() => {
        localStorage.setItem('workflow_view_mode', viewMode);
    }, [viewMode]);
    useEffect(() => {
        if (activeFilter) localStorage.setItem('workflow_filter', activeFilter);
        else localStorage.removeItem('workflow_filter');
    }, [activeFilter]);
    useEffect(() => {
        localStorage.setItem('workflow_search', searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        if (currentUser && remoteIdeas.length > 0) {
            const pendingId = (window as any)._pendingShareId;
            if (pendingId) {
                const sharedIdea = remoteIdeas.find(i => i.shareLinkId === pendingId);
                if (sharedIdea) {
                    setPreviewIdea(sharedIdea);
                    if (sharedIdea.userId === currentUser.id || sharedIdea.sharePermission === 'editor') {
                        setIsEditing(true);
                        setEditContent(sharedIdea.content);
                        setEditImages(sharedIdea.imageDatas || []);
                    }
                    delete (window as any)._pendingShareId;
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        }
    }, [currentUser, remoteIdeas]);

    // Handlers
    const handleAuthSuccess = (user: User) => {
        mutateUser(user);
    };

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.VITE_API_URL || ""}/api/v1/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (e) { console.error(e); }
        mutateUser(null);
        mutateIdeas([]);
        localStorage.clear();
        window.location.reload();
    };

    const handleAddIdea = async (content: string, imageDatas?: string[]) => {
        if (!currentUser) return;
        setIsAnalyzing(true);
        try {
            const sanitizedContent = DOMPurify.sanitize(content);
            await analyzeIdea(sanitizedContent, imageDatas, currentUser);
            mutateIdeas();
            setActiveTab('workspace');
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDeleteIdea = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this idea?")) return;
        if (previewIdea?.id === id) setPreviewIdea(null);
        try {
            await deleteIdea(id);
            mutateIdeas();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleToggleShare = async (id: string) => {
        try {
            await toggleShare(id);
            mutateIdeas();
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
        try {
            await updateShareLink(previewIdea.id, shareLinkId, 'viewer');
            mutateIdeas();
            setPreviewIdea({ ...previewIdea, shareLinkId, sharePermission: 'viewer' });
        } catch (error) {
            console.error("Failed to generate share link", error);
        }
    };

    const handleUpdateSharePermission = async (perm: SharePermission) => {
        if (!previewIdea) return;
        try {
            if (previewIdea.shareLinkId) {
                await updateShareLink(previewIdea.id, previewIdea.shareLinkId, perm);
            }
            mutateIdeas();
            setPreviewIdea({ ...previewIdea, sharePermission: perm });
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
            mutateIdeas();
            setPreviewIdea(prev => prev ? {
                ...prev,
                comments: [...(prev.comments || []), newComment]
            } : null);
            setCommentText('');
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleToggleLike = async (commentId: string) => {
        if (!currentUser || !previewIdea) return;
        try {
            await toggleCommentLike(previewIdea.id, commentId);
            mutateIdeas();

            const toggleLikeRecursive = (comments: Comment[]): Comment[] => {
                return comments.map(c => {
                    if (c.id === commentId) {
                        const currentLikes = c.likes || [];
                        const alreadyLiked = currentLikes.includes(currentUser.id);
                        return {
                            ...c,
                            likes: alreadyLiked
                                ? currentLikes.filter(uid => uid !== currentUser.id)
                                : [...currentLikes, currentUser.id]
                        };
                    }
                    if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: toggleLikeRecursive(c.replies) };
                    }
                    return c;
                });
            };

            setPreviewIdea(prev => prev ? { ...prev, comments: toggleLikeRecursive(prev.comments || []) } : null);
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const handleAddReply = async (e: React.FormEvent, parentId: string) => {
        e.preventDefault();
        if (!currentUser || !previewIdea || !replyText.trim()) return;
        try {
            const newReply = await addReply(previewIdea.id, parentId, replyText.trim());
            mutateIdeas();
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
            setPreviewIdea(prev => prev ? { ...prev, comments: addReplyRecursive(prev.comments || []) } : null);
            setReplyText('');
            setReplyingTo(null);
        } catch (error) {
            console.error("Failed to add reply", error);
        }
    };

    // Memos
    const visibleIdeas = useMemo(() => {
        if (!currentUser) return [];
        return ideas.filter(idea => {
            const isMine = idea.userId === currentUser.id;
            const isSharedWithMe = idea.isShared && idea.authorDepartment === currentUser.department;
            if (!isMine && !isSharedWithMe) return false;
            if (viewMode === 'mine' && !isMine) return false;
            if (viewMode === 'shared' && !isSharedWithMe) return false;
            const query = searchQuery.toLowerCase();
            const matchesSearch = idea.title.toLowerCase().includes(query) ||
                (idea.content && idea.content.toLowerCase().includes(query)) ||
                idea.tags.some(t => t.toLowerCase().includes(query)) ||
                idea.category.toLowerCase().includes(query);
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
            const sanitizedContent = DOMPurify.sanitize(currentContent);
            const analysis = await analyzeIdea(sanitizedContent, editImages, currentUser, previewIdea.id);
            mutateIdeas();
            setPreviewIdea(prev => prev ? {
                ...prev,
                content: sanitizedContent,
                imageDatas: editImages.length > 0 ? editImages : [],
                title: analysis.title,
                category: analysis.category,
                tags: analysis.tags,
                type: editImages.length > 0 ? 'image' : 'text'
            } : null);
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
