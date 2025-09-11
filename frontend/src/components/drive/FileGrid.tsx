import React from 'react';
import { useDrive } from '../../contexts/DriveContext';
import { FileItem } from './FileItem';
import { Loader2 } from 'lucide-react';

export function FileGrid() {
  const { files, isLoading } = useDrive();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium mb-2">No files found</h3>
        <p className="text-sm">Upload files or create folders to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
}