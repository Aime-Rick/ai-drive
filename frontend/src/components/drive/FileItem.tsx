import React from 'react';
import { DriveFile } from '../../types';
import { useDrive } from '../../contexts/DriveContext';
import { formatFileSize, formatDate, getFileIcon } from '../../lib/utils';

interface FileItemProps {
  file: DriveFile;
}

export function FileItem({ file }: FileItemProps) {
  const { navigateToFolder } = useDrive();

  const handleClick = () => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
          {getFileIcon(file.mimeType)}
        </div>
        
        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {file.name}
        </h3>
        
        <div className="text-xs text-gray-500 space-y-1">
          {file.size && (
            <div>{formatFileSize(file.size)}</div>
          )}
          <div>{formatDate(file.modifiedTime)}</div>
        </div>
      </div>
    </div>
  );
}