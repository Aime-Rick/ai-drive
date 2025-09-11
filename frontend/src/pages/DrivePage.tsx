import React from 'react';
import { useDrive } from '../contexts/DriveContext';
import { DriveHeader } from '../components/drive/DriveHeader';
import { BreadcrumbNavigation } from '../components/drive/BreadcrumbNavigation';
import { FileGrid } from '../components/drive/FileGrid';
import { DriveNotConnected } from '../components/drive/DriveNotConnected';

export function DrivePage() {
  const { isConnected } = useDrive();

  if (!isConnected) {
    return <DriveNotConnected />;
  }

  return (
    <div className="flex flex-col h-full">
      <DriveHeader />
      <BreadcrumbNavigation />
      <div className="flex-1 overflow-y-auto">
        <FileGrid />
      </div>
    </div>
  );
}