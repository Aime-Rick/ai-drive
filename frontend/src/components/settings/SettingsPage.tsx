import React, { useState } from 'react';
import { User, Link, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useDrive } from '../../contexts/DriveContext';
import { authApi } from '../../lib/api';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { isConnected, connectDrive } = useDrive();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await authApi.deleteAccount();
      await signOut();
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConnectDrive = async () => {
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
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Google Drive Connection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Link className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Google Drive Connection</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">Not Connected</span>
              </>
            )}
          </div>
          
          {!isConnected && (
            <Button
              onClick={handleConnectDrive}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Drive'}
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          {isConnected
            ? 'Your Google Drive is connected and ready to use.'
            : 'Connect your Google Drive to access files and use the AI assistant.'
          }
        </p>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-center mb-4">
          <Trash2 className="h-5 w-5 text-red-500 mr-2" />
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </Button>
      </div>
    </div>
  );
}