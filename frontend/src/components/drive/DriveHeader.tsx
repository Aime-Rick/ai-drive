import React, { useState } from 'react';
import { Search, Plus, Upload, FolderPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useDrive } from '../../contexts/DriveContext';
import { CreateFolderModal } from './CreateFolderModal';
import { UploadFileModal } from './UploadFileModal';

export function DriveHeader() {
  const { searchQuery, setSearchQuery, refreshFiles } = useDrive();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Drive</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateFolder(true)}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploadFile(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshFiles}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
      />
      
      <UploadFileModal
        isOpen={showUploadFile}
        onClose={() => setShowUploadFile(false)}
      />
    </>
  );
}