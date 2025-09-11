import React, { createContext, useContext, useEffect, useState } from 'react';
import { DriveFile, DriveContextType } from '../types';
import { driveApi } from '../lib/api';
import { useAuth } from './AuthContext';

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export function useDrive() {
  const context = useContext(DriveContext);
  if (context === undefined) {
    throw new Error('useDrive must be used within a DriveProvider');
  }
  return context;
}

interface DriveProviderProps {
  children: React.ReactNode;
}

export function DriveProvider({ children }: DriveProviderProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      checkConnectionStatus();
    }
  }, [user]);

  useEffect(() => {
    if (isConnected) {
      refreshFiles();
    }
  }, [currentFolder, isConnected]);

  const checkConnectionStatus = async () => {
    try {
      const status = await driveApi.getConnectionStatus();
      setIsConnected(status.connected);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const refreshFiles = async () => {
    if (!isConnected) return;
    
    setIsLoading(true);
    try {
      const response = await driveApi.getFiles(currentFolder || undefined, searchQuery || undefined);
      setFiles(response.files || []);
      setBreadcrumbs(response.breadcrumbs || []);
    } catch (error) {
      console.error('Failed to load files:', error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    setSearchQuery(''); // Clear search when navigating
  };

  const uploadFile = async (file: File, parentId?: string) => {
    try {
      await driveApi.uploadFile(file, parentId || currentFolder || undefined);
      await refreshFiles();
    } catch (error) {
      throw error;
    }
  };

  const createFolder = async (name: string, parentId?: string) => {
    try {
      await driveApi.createFolder(name, parentId || currentFolder || undefined);
      await refreshFiles();
    } catch (error) {
      throw error;
    }
  };

  const connectDrive = async () => {
    try {
      const response = await driveApi.connectDrive();
      if (response.auth_url) {
        window.open(response.auth_url, '_blank');
        // Poll for connection status
        const pollInterval = setInterval(async () => {
          try {
            const status = await driveApi.getConnectionStatus();
            if (status.connected) {
              setIsConnected(true);
              clearInterval(pollInterval);
              await refreshFiles();
            }
          } catch (error) {
            // Continue polling
          }
        }, 2000);
        
        // Stop polling after 5 minutes
        setTimeout(() => clearInterval(pollInterval), 300000);
      }
    } catch (error) {
      throw error;
    }
  };

  const value: DriveContextType = {
    files,
    currentFolder,
    breadcrumbs,
    isLoading,
    isConnected,
    searchQuery,
    setSearchQuery,
    navigateToFolder,
    refreshFiles,
    uploadFile,
    createFolder,
    connectDrive,
  };

  return <DriveContext.Provider value={value}>{children}</DriveContext.Provider>;
}