import { getGlobalSettings } from '@/lib/storage';
import SettingsEditor from './SettingsEditor';

export default async function SettingsPage() {
  const settings = await getGlobalSettings();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Design Settings
          </h1>
          <p className="text-gray-600 mt-2 font-light">
            Configure default design settings for all new slide decks
          </p>
        </div>

        <SettingsEditor initialSettings={settings} />
      </div>
    </div>
  );
}
