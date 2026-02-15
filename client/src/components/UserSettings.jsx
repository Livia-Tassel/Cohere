import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const UserSettings = ({ onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',

    // Preferences
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    mentionNotifications: true,
    answerNotifications: true,

    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    allowMessages: true,

    // Display
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'relative'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'security', label: 'Security', icon: '🛡️' }
  ];

  const handleSave = () => {
    // Save settings logic here
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-primary)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                    Username
                  </label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                    Bio
                  </label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                      Location
                    </label>
                    <input
                      type="text"
                      value={settings.location}
                      onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                      className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.website}
                      onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                      className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Get a weekly summary of activity' },
                      { key: 'mentionNotifications', label: 'Mentions', desc: 'When someone mentions you' },
                      { key: 'answerNotifications', label: 'Answers', desc: 'When your question gets answered' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer transition-all">
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{item.label}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{item.desc}</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                          className="w-5 h-5 rounded border-[var(--border-primary)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                    Profile Visibility
                  </label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                  >
                    <option value="public">Public</option>
                    <option value="members">Members Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'showEmail', label: 'Show Email', desc: 'Display email on your profile' },
                    { key: 'showActivity', label: 'Show Activity', desc: 'Display your activity timeline' },
                    { key: 'allowMessages', label: 'Allow Messages', desc: 'Let others send you messages' }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-tertiary)] cursor-pointer transition-all">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{item.label}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{item.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                        className="w-5 h-5 rounded border-[var(--border-primary)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                  >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                      Timezone
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Shanghai">Shanghai</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--text-primary)]">
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                      className="w-full px-4 py-3 border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] focus:border-[var(--border-focus)] focus:outline-none focus:shadow-[0_0_0_3px_var(--glow-primary)] transition-all"
                    >
                      <option value="relative">Relative (2h ago)</option>
                      <option value="absolute">Absolute (Jan 1, 2024)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Security Settings
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        These settings affect your account security. Please be careful when making changes.
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold hover:opacity-90 transition-all">
                  Change Password
                </button>

                <button className="w-full px-4 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-[var(--radius-lg)] font-semibold hover:bg-[var(--bg-elevated)] transition-all">
                  Enable Two-Factor Authentication
                </button>

                <button className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-[var(--radius-lg)] font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-6 mt-6 border-t border-[var(--border-primary)]">
          <button
            onClick={handleSave}
            className="flex-1 btn-primary"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-6 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSettings;
