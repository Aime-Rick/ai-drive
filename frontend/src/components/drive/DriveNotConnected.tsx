import React, { useState } from 'react';
import { Cloud, Link } from 'lucide-react';
import { Button } from '../ui/Button';
import { useDrive } from '../../contexts/DriveContext';

export function DriveNotConnected() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { connectDrive } = useDrive();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectDrive();
    } catch (error) {
      console.error('Failed to connect to Google Drive:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-blue-50 rounded-full p-6 mb-6">
        <Cloud className="h-16 w-16 text-blue-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Connect Your Google Drive
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md">
        To access your files and use the AI assistant, you need to connect your Google Drive account.
        This allows us to securely access your documents and provide intelligent responses.
      </p>
      
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="flex items-center"
      >
        <Link className="h-4 w-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Google Drive'}
      </Button>
      
      <p className="text-sm text-gray-500 mt-4">
        Your data is secure and we only access files you explicitly share.
      </p>
    </div>
  );
}