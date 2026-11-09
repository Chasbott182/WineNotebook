import React, { useState } from 'react';
import { PersonalProfile, SecuritySettings, ThemeMode, Wine } from '../types';
import { calculateSecurityScore } from '../utils/wineUtils';
import {
  User,
  Shield,
  Warehouse,
  Sun,
  Moon,
  Plus,
  Trash2,
  Check,
  Lock,
  KeyRound,
  Clock,
  Activity,
  Sparkles,
} from 'lucide-react';

interface SettingsPageProps {
  theme: ThemeMode;
  onThemeChange: (newTheme: ThemeMode) => void;
  profile: PersonalProfile;
  onSaveProfile: (newProfile: PersonalProfile) => Promise<void>;
  security: SecuritySettings;
  onSaveSecurity: (newSecurity: SecuritySettings) => Promise<void>;
  cellarLocations: string[];
  wines: Wine[];
  onAddCellarLocation: (locationName: string) => Promise<string | null>;
  onRemoveCellarLocation: (locationName: string) => Promise<void>;
}

export default function SettingsPage({
  theme,
  onThemeChange,
  profile,
  onSaveProfile,
  security,
  onSaveSecurity,
  cellarLocations,
  wines,
  onAddCellarLocation,
  onRemoveCellarLocation,
}: SettingsPageProps) {
  const [profileForm, setProfileForm] = useState<PersonalProfile>(profile);
  const [securityForm, setSecurityForm] = useState<SecuritySettings>(security);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  const [securitySavedMsg, setSecuritySavedMsg] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);

  const { score: securityScore, level: securityLevel } =
    calculateSecurityScore(securityForm);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveProfile(profileForm);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSecurity(securityForm);
    setSecuritySavedMsg(true);
    setTimeout(() => setSecuritySavedMsg(false), 3000);
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLocationInput.trim();
    if (!trimmed) return;
    const created = await onAddCellarLocation(trimmed);
    if (created) {
      setNewLocationInput('');
      setLocationFeedback(`Added cellar location "${created}"`);
      setTimeout(() => setLocationFeedback(null), 3000);
    }
  };

  const handleRemoveLocation = async (loc: string) => {
    if (cellarLocations.length <= 1) {
      setLocationFeedback('At least one cellar storage location must remain.');
      setTimeout(() => setLocationFeedback(null), 3000);
      return;
    }
    await onRemoveCellarLocation(loc);
    setLocationFeedback(`Removed "${loc}" and reassigned bottles to primary cellar.`);
    setTimeout(() => setLocationFeedback(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-100">Application Settings & Preferences</h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage personal sommelier information, web app security policies, cellar storage zones, and appearance theme.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-stone-950 border border-stone-800 flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Security Score</span>
              <span className="font-bold text-stone-100">
                {securityScore}/100 ({securityLevel})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Theme & Appearance Card */}
        <section className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-800/50 flex items-center justify-center text-amber-300">
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-100">Appearance & Theme</h3>
                <p className="text-xs text-stone-400">Switch between Cellar Dark and Vineyard Light themes</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-200 capitalize">
              {theme} Mode Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                theme === 'dark'
                  ? 'bg-rose-900/60 border-rose-600 shadow-lg'
                  : 'bg-stone-950 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-rose-400">
                  <Moon className="w-4 h-4" />
                </div>
                {theme === 'dark' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-700 text-white">
                    Selected
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-100">Cellar Dark Theme</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Deep obsidian slate & burgundy accents for low-light tasting rooms
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onThemeChange('light')}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                theme === 'light'
                  ? 'bg-amber-950/80 border-amber-500 shadow-lg'
                  : 'bg-stone-950 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-amber-400">
                  <Sun className="w-4 h-4" />
                </div>
                {theme === 'light' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-700 text-white">
                    Selected
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-100">Vineyard Light Theme</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Warm parchment & limestone daylight palette for high contrast
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* 2. Cellar Storage Locations Manager Card */}
        <section className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/70 border border-amber-800/50 flex items-center justify-center text-amber-300">
                <Warehouse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-100">Manage Cellar Locations</h3>
                <p className="text-xs text-stone-400">Add or remove wine storage racks, fridges, and vaults</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-800 text-stone-200">
              {cellarLocations.length} Locations
            </span>
          </div>

          <form onSubmit={handleAddLocation} className="flex gap-2">
            <input
              type="text"
              value={newLocationInput}
              onChange={e => setNewLocationInput(e.target.value)}
              placeholder="Add new location (e.g. Subterranean Cave - Rack C)..."
              aria-label="New cellar location to add"
              className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Location
            </button>
          </form>

          {locationFeedback && (
            <div className="px-3 py-2 rounded-xl bg-stone-950 border border-amber-700/50 text-xs text-amber-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{locationFeedback}</span>
            </div>
          )}

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {cellarLocations.map(loc => {
              const bottleCount = wines.filter(
                w => (w.cellarLocation || 'Main Cellar - Rack A1') === loc
              ).length;
              return (
                <div
                  key={loc}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Warehouse className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-stone-200">{loc}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-800 text-stone-400">
                      {bottleCount} {bottleCount === 1 ? 'bottle' : 'bottles'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(loc)}
                    disabled={cellarLocations.length <= 1}
                    aria-label={`Remove location ${loc}`}
                    title={
                      cellarLocations.length <= 1
                        ? 'At least one cellar location is required'
                        : `Remove ${loc}`
                    }
                    className={`p-1.5 rounded-lg transition-colors ${
                      cellarLocations.length <= 1
                        ? 'text-stone-600 cursor-not-allowed'
                        : 'text-stone-400 hover:text-white hover:bg-red-700'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. User Personal Information Card */}
        <section className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-700 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-100">User Personal Information</h3>
                <p className="text-xs text-stone-400">Manage collector identity, contact details, and tasting profile</p>
              </div>
            </div>
            {profileSavedMsg && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Saved
              </span>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="profileFullName" className="text-xs font-medium text-stone-400">
                  Full Name *
                </label>
                <input
                  id="profileFullName"
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label htmlFor="profileEmail" className="text-xs font-medium text-stone-400">
                  Email Address *
                </label>
                <input
                  id="profileEmail"
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label htmlFor="profileTitle" className="text-xs font-medium text-stone-400">
                  Sommelier Role / Title
                </label>
                <input
                  id="profileTitle"
                  type="text"
                  value={profileForm.title}
                  onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div>
                <label htmlFor="profileLocation" className="text-xs font-medium text-stone-400">
                  Home Region / Location
                </label>
                <input
                  id="profileLocation"
                  type="text"
                  value={profileForm.location}
                  onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>

            <div>
              <label htmlFor="profileFavVarietal" className="text-xs font-medium text-stone-400">
                Signature / Favorite Varietal
              </label>
              <input
                id="profileFavVarietal"
                type="text"
                value={profileForm.favoriteVarietal}
                onChange={e => setProfileForm({ ...profileForm, favoriteVarietal: e.target.value })}
                className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div>
              <label htmlFor="profileBio" className="text-xs font-medium text-stone-400">
                Collector Tasting Bio
              </label>
              <textarea
                id="profileBio"
                rows={2}
                value={profileForm.bio}
                onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full mt-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                Save Personal Profile
              </button>
            </div>
          </form>
        </section>

        {/* 4. Web App Security Settings Card */}
        <section className="bg-stone-900/70 border border-stone-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/70 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-100">Web App Security Management</h3>
                <p className="text-xs text-stone-400">Configure authentication, cellar PIN lock, CORS, and session rules</p>
              </div>
            </div>
            {securitySavedMsg && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Updated
              </span>
            )}
          </div>

          <form onSubmit={handleSecuritySubmit} className="space-y-3.5">
            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-stone-200 block">
                    Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Require OTP verification when signing in from unrecognized devices
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={securityForm.twoFactorEnabled}
                onChange={e =>
                  setSecurityForm({ ...securityForm, twoFactorEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-stone-200 block">
                    Require Security PIN for Bottle Deletion
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Protect high-value cellar inventory from accidental deletion
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={securityForm.requirePinForDelete}
                onChange={e =>
                  setSecurityForm({ ...securityForm, requirePinForDelete: e.target.checked })
                }
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <label htmlFor="securityPinInput" className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Cellar Security PIN
                </label>
                <input
                  id="securityPinInput"
                  type="password"
                  maxLength={8}
                  value={securityForm.securityPin}
                  onChange={e =>
                    setSecurityForm({ ...securityForm, securityPin: e.target.value })
                  }
                  placeholder="4-8 digit PIN"
                  className="w-full mt-1.5 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                <label htmlFor="sessionTimeoutSelect" className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  Idle Session Timeout
                </label>
                <select
                  id="sessionTimeoutSelect"
                  value={securityForm.sessionTimeoutMinutes}
                  onChange={e =>
                    setSecurityForm({
                      ...securityForm,
                      sessionTimeoutMinutes: Number(e.target.value),
                    })
                  }
                  className="w-full mt-1.5 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-rose-600"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={240}>4 Hours</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-medium text-stone-200">Strict API CORS Policy</span>
                </div>
                <input
                  type="checkbox"
                  checked={securityForm.apiCorsRestricted}
                  onChange={e =>
                    setSecurityForm({ ...securityForm, apiCorsRestricted: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-stone-200">Cellar Audit Logging</span>
                </div>
                <input
                  type="checkbox"
                  checked={securityForm.auditLogEnabled}
                  onChange={e =>
                    setSecurityForm({ ...securityForm, auditLogEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-600 rounded"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Save Security Settings
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
