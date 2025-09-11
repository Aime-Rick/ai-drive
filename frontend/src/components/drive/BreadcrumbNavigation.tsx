import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useDrive } from '../../contexts/DriveContext';
import { Button } from '../ui/Button';

export function BreadcrumbNavigation() {
  const { breadcrumbs, navigateToFolder } = useDrive();

  return (
    <div className="flex items-center space-x-1 p-4 bg-gray-50 border-b border-gray-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigateToFolder(null)}
        className="text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4 mr-1" />
        My Drive
      </Button>
      
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateToFolder(crumb.id)}
            className="text-gray-600 hover:text-gray-900"
          >
            {crumb.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
}