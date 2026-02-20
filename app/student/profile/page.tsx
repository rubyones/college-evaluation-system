'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Mail, Phone, MapPin, Calendar, Save, Lock, Bell, Shield, Download, CheckCircle } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferenceSaved, setPreferenceSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    deadlineReminders: true,
    marketingEmails: false,
    newsUpdates: true,
  });

  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '+63-917-123-4567',
    year: '3rd Year',
  });

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileSaved(false);
  };

  const handleSaveProfile = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleChangePassword = () => {
    alert('Password change feature: Redirect to password change page');
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSavingPreferences(false);
      setPreferenceSaved(true);
      setTimeout(() => setPreferenceSaved(false), 3000);
    } catch (error) {
      setIsSavingPreferences(false);
      console.error('Failed to save preferences:', error);
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    setPreferenceSaved(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">👤 My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your account information and preferences
        </p>
      </div>

      {profileSaved && (
        <Alert type="success" title="Success">
          Profile updated successfully!
        </Alert>
      )}

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <Avatar src={user?.avatar} name={user?.name} size="lg" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="success">Active</Badge>
                <Badge variant="secondary">3rd Year BSIT</Badge>
              </div>
            </div>
          </div>

          {!isEditingProfile ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Student ID</p>
                    <p className="font-semibold text-gray-900 dark:text-white">CST-20210001</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Program</p>
                    <p className="font-semibold text-gray-900 dark:text-white">Bachelor of Science in Information Technology</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Mobile</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{profileData.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="primary" onClick={handleEditProfile} className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={handleChangePassword} className="gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Full Name</label>
                  <Input 
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Email</label>
                  <Input 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    type="email"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Phone</label>
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    type="tel"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Manage how we communicate with you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferenceSaved && (
            <Alert type="success" title="Saved">
              Your preferences have been updated!
            </Alert>
          )}

          <div className="space-y-3">
            {[
              { key: 'deadlineReminders' as const, label: '📅 Deadline Reminders', description: 'Get notified about upcoming evaluation deadlines' },
              { key: 'emailNotifications' as const, label: '📧 Email Notifications', description: 'Receive important updates via email' },
              { key: 'newsUpdates' as const, label: '📰 News & Updates', description: 'Get the latest news from your institution' },
              { key: 'marketingEmails' as const, label: '🎯 Marketing Emails', description: 'Receive promotional offers and information' },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                </div>
                <button
                  onClick={() => togglePreference(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences[key]
                      ? 'bg-green-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <Button 
            variant="primary" 
            onClick={handleSavePreferences}
            disabled={isSavingPreferences}
            className="w-full gap-2 mt-4"
          >
            <Save className="w-4 h-4" />
            {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-3">
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">✓ Secure Account</p>
                <p className="text-sm text-green-800 dark:text-green-200">Your account is protected with two-factor authentication</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <strong>Data Privacy:</strong> All your evaluation responses are kept strictly confidential and anonymous to ensure honest feedback.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download My Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Account Created:</span>
            <span className="font-semibold text-gray-900 dark:text-white">August 15, 2021</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Last Login:</span>
            <span className="font-semibold text-gray-900 dark:text-white">Today at 2:30 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Account Status:</span>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Email Verified:</span>
            <span className="text-green-600 font-semibold">✓ Yes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
