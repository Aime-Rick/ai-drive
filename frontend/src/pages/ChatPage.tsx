import React from 'react';
import { useDrive } from '../contexts/DriveContext';
import { ChatInterface } from '../components/chat/ChatInterface';
import { DriveNotConnected } from '../components/drive/DriveNotConnected';
import { chatApi } from '../lib/api';

export function ChatPage() {
  const { isConnected } = useDrive();

  const handleInitialize = async () => {
    await chatApi.initializeVectorDb();
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="bg-yellow-50 rounded-full p-6 mb-6">
          <div className="text-4xl">🤖</div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Connect Google Drive First
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md">
          To use the AI Assistant, you need to connect your Google Drive first.
          This allows me to access your documents and provide intelligent responses.
        </p>
        
        <DriveNotConnected />
      </div>
    );
  }

  return <ChatInterface onInitialize={handleInitialize} />;
}