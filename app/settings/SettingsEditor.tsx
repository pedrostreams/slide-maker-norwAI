'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ThemeConfig } from '@/lib/types';

interface SettingsEditorProps {
  initialSettings: ThemeConfig;
}

export default function SettingsEditor({ initialSettings }: SettingsEditorProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<ThemeConfig>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleColorChange = (key: keyof ThemeConfig['theme'], value: string) => {
    setSettings({
      ...settings,
      theme: {
        ...settings.theme,
        [key]: value,
      },
    });
  };

  const handleFontChange = (value: string) => {
    setSettings({
      ...settings,
      theme: {
        ...settings.theme,
        fontFamily: value,
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const fonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Raleway',
    'PT Sans',
    'Merriweather',
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Color Settings */}
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-xl font-light text-gray-900 mb-6">Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.theme.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={settings.theme.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography Settings */}
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-xl font-light text-gray-900 mb-6">Typography</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Family
          </label>
          <select
            value={settings.theme.fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {fonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview */}
      <div className="p-8 bg-gray-50">
        <h2 className="text-xl font-light text-gray-900 mb-6">Preview</h2>
        <div
          className="rounded-lg p-8 border"
          style={{
            backgroundColor: settings.theme.backgroundColor,
            color: settings.theme.textColor,
            fontFamily: settings.theme.fontFamily,
          }}
        >
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: settings.theme.primaryColor }}
          >
            Slide Title
          </h1>
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: settings.theme.secondaryColor }}
          >
            Subtitle Text
          </h2>
          <p className="text-lg mb-4">
            This is body text that will appear on your slides. It uses the selected font
            family and text color.
          </p>
          <div
            className="inline-block px-4 py-2 rounded"
            style={{ backgroundColor: settings.theme.accentColor, color: 'white' }}
          >
            Accent Element
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-8 bg-white flex items-center justify-between">
        <p className="text-sm text-gray-600 font-light">
          These settings will be applied to all new slide decks
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
