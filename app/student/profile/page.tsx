'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Mail, Calendar, Save, Lock, Bell, Shield, Download, CheckCircle, BookOpen } from 'lucide-react';

const YEAR_LEVELS = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
];

const SECTIONS = ['A', 'B', 'C', 'D'];

export default function StudentProfile() {
  const { user, token, setUserFromApi } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferenceSaved, setPreferenceSaved] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [isSavingAcademic, setIsSavingAcademic] = useState(false);
  const [academicSaved, setAcademicSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    deadlineReminders: true,
    marketingEmails: false,
    newsUpdates: true,
  });

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
  });

  const [academicData, setAcademicData] = useState({
    yearLevel: 0 as number,
    section: '' as string,
  });

  // Sync state when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || '',
        email: user.email || '',
      });
      setAcademicData({
        yearLevel: user.year_level || 0,
        section: user.section || '',
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setProfileSaved(false);
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profileData.fullName }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUserFromApi(data.user);
      }
      setIsEditingProfile(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handleSaveAcademic = async () => {
    if (!academicData.yearLevel || !academicData.section) return;
    setIsSavingAcademic(true);
    setEnrollmentMessage('');
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          year_level: academicData.yearLevel,
          section: academicData.section,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUserFromApi(data.user);
        if (data.enrolledCount > 0) {
          setEnrollmentMessage(`You have been enrolled in ${data.enrolledCount} subject(s).`);
        } else {
          setEnrollmentMessage('Academic info updated. No matching courses found for enrollment.');
        }
      }
      setAcademicSaved(true);
      setTimeout(() => setAcademicSaved(false), 5000);
    } catch (error) {
      console.error('Failed to save academic info:', error);
    } finally {
      setIsSavingAcademic(false);
    }
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

  const yearLabel = YEAR_LEVELS.find(y => y.value === user?.year_level)?.label;
  const programLabel = user?.course || 'N/A';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your account information and preferences
        </p>
      </div>

      {profileSaved && (
        <Alert variant="success" title="Success">
          Profile updated successfully!
        </Alert>
      )}

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {user?.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Badge variant="success">Active</Badge>
                {yearLabel && <Badge variant="secondary">{yearLabel} {programLabel}</Badge>}
                {user?.section && <Badge variant="secondary">Section {user.section}</Badge>}
              </div>
            </div>
          </div>

          {!isEditingProfile ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Program</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{programLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button variant="primary" onClick={handleEditProfile} className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={() => alert('Password change coming soon')} className="gap-2">
                  <Lock className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Full Name</div>
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Email</div>
                  <Input
                    value={profileData.email}
                    disabled
                    type="email"
                    placeholder="Your email"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact your administrator to change your email.</p>
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

      {/* Academic Information & Enrollment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Academic Information
          </CardTitle>
          <CardDescription>
            Select your year level and section to automatically enroll in your block subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {academicSaved && enrollmentMessage && (
            <Alert variant="success" title="Updated">
              {enrollmentMessage}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Program</div>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white font-medium">
                {programLabel}
              </div>
              <p className="text-xs text-gray-500 mt-1">Set by administrator</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Year Level</div>
              <select
                value={academicData.yearLevel}
                onChange={(e) => setAcademicData({ ...academicData, yearLevel: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Select year</option>
                {YEAR_LEVELS.map(y => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white block mb-2">Section</div>
              <select
                value={academicData.section}
                onChange={(e) => setAcademicData({ ...academicData, section: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select section</option>
                {SECTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleSaveAcademic}
            disabled={isSavingAcademic || !academicData.yearLevel || !academicData.section}
            className="w-full gap-2 mt-2"
          >
            <Save className="w-4 h-4" />
            {isSavingAcademic ? 'Saving & Enrolling...' : 'Save & Update Enrollment'}
          </Button>
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
            <Alert variant="success" title="Saved">
              Your preferences have been updated!
            </Alert>
          )}

          <div className="space-y-3">
            {[
              { key: 'deadlineReminders' as const, label: 'Deadline Reminders', description: 'Get notified about upcoming evaluation deadlines' },
              { key: 'emailNotifications' as const, label: 'Email Notifications', description: 'Receive important updates via email' },
              { key: 'newsUpdates' as const, label: 'News & Updates', description: 'Get the latest news from your institution' },
              { key: 'marketingEmails' as const, label: 'Marketing Emails', description: 'Receive promotional offers and information' },
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
          <div className="pt-3">
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
    </div>
  );
}
