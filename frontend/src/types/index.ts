export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface DriveFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: number;
  modifiedTime: string;
  parentId?: string;
  webViewLink?: string;
  thumbnailLink?: string;
}

export interface DriveContextType {
  files: DriveFile[];
  currentFolder: string | null;
  breadcrumbs: { id: string; name: string }[];
  isLoading: boolean;
  isConnected: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateToFolder: (folderId: string | null) => void;
  refreshFiles: () => Promise<void>;
  uploadFile: (file: File, parentId?: string) => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<void>;
  connectDrive: () => Promise<void>;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}