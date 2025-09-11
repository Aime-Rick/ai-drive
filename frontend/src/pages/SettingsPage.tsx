import React from 'react';
import { SettingsPage as SettingsComponent } from '../components/settings/SettingsPage';

export function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <SettingsComponent />
    </div>
  );
}