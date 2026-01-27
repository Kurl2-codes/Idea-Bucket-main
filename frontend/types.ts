
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  text: string;
  createdAt: number;
  likes?: string[]; // Array of user IDs who liked the comment
  replies?: Comment[]; // Nested comments for replies
}

export type SharePermission = 'viewer' | 'editor';

export interface Idea {
  id: string;
  userId: string;
  authorName: string;
  authorDepartment: string;
  isShared: boolean;
  shareLinkId?: string; // Unique ID for public/private link sharing
  sharePermission?: SharePermission; // Access level for the link
  type: 'text' | 'image';
  content: string; // This stores the original text prompt/content
  imageDatas?: string[]; // This stores the original images
  title: string;
  category: string;
  tags: string[];
  createdAt: number;
  connections: string[];
  comments?: Comment[];
}

export interface IdeaAnalysis {
  id?: string;
  title: string;
  category: string;
  tags: string[];
  userId?: string;
  authorName?: string;
  authorDepartment?: string;
  isShared?: boolean;
  content?: string;
  image_urls?: string[];
  createdAt?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  userLevel: number;
}


export type ViewMode = 'all' | 'mine' | 'shared';
export type MainTab = 'capture' | 'workspace' | 'admin';

