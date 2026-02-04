import { User, IdeaAnalysis } from "../types";

const API_URL = process.env.VITE_API_URL || "";

export const analyzeIdea = async (
  content: string,
  imageDatas: string[] = [],
  user: User,
  id?: string
): Promise<IdeaAnalysis> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/analyze-idea`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        content,
        image_datas: imageDatas || [],
        userId: user.id,
        authorName: user.name,
        authorDepartment: user.department
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Gemini content analysis failed:", error);
    // Return a fallback object so the application remains functional
    return {
      title: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
      category: "Uncategorized",
      tags: [],
      content: content,
      image_urls: imageDatas || []
    };
  }
};

const getAuthHeader = () => {
  // Legacy support for manual tokens - will be ignored by backend if HttpOnly cookie is present
  const token = localStorage.getItem('token');
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const getIdeas = async (): Promise<IdeaAnalysis[]> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas`, {
      headers: {
        ...getAuthHeader()
      },
      credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to fetch ideas");
    return await response.json();
  } catch (error) {
    console.error("Fetch ideas failed:", error);
    return [];
  }
};

export const toggleShare = async (ideaId: string): Promise<{ isShared: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas/${ideaId}/share`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      credentials: "include"
    });
    if (!response.ok) throw new Error("Failed to toggle share");
    return await response.json();
  } catch (error) {
    console.error("Toggle share failed:", error);
    throw error;
  }
};

export const deleteIdea = async (ideaId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas/${ideaId}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete idea");
    }
  } catch (error) {
    console.error("Delete idea failed:", error);
    throw error;
  }
};

export const addComment = async (ideaId: string, text: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas/${ideaId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error("Failed to add comment");
    return await response.json();
  } catch (error) {
    console.error("Add comment failed:", error);
    throw error;
  }
};

export const addReply = async (ideaId: string, commentId: string, text: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas/${ideaId}/comments/${commentId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error("Failed to add reply");
    return await response.json();
  } catch (error) {
    console.error("Add reply failed:", error);
    throw error;
  }
};

export const toggleCommentLike = async (ideaId: string, commentId: string): Promise<{ liked: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas/${ideaId}/comments/${commentId}/toggle-like`, {
      method: "POST",
      headers: {
        ...getAuthHeader()
      }
    });

    if (!response.ok) throw new Error("Failed to toggle comment like");
    return await response.json();
  } catch (error) {
    console.error("Toggle comment like failed:", error);
    throw error;
  }
};

export const updateIdea = async (
  ideaId: string,
  content: string,
  title?: string,
  category?: string,
  tags?: string[]
): Promise<IdeaAnalysis> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas/${ideaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      credentials: "include",
      body: JSON.stringify({ content, title, category, tags })
    });

    if (!response.ok) throw new Error("Failed to update idea");
    return await response.json();
  } catch (error) {
    console.error("Update idea failed:", error);
    throw error;
  }
};

export const updateShareLink = async (
  ideaId: string,
  shareLinkId: string,
  sharePermission: string
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/gemini/ideas/${ideaId}/share-link`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      credentials: "include",
      body: JSON.stringify({ shareLinkId, sharePermission })
    });

    if (!response.ok) throw new Error("Failed to update share link");
    return await response.json();
  } catch (error) {
    console.error("Update share link failed:", error);
    throw error;
  }
};

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        ...getAuthHeader()
      },
      credentials: "include"
    });

    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Get profile failed:", error);
    throw error;
  }
};

