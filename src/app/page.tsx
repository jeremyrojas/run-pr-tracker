'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfilePicture from '@/components/profile/ProfilePicture';
import UserInfo from '@/components/profile/UserInfo';
import PersonalRecords from '@/components/records/PersonalRecords';
import { supabase } from '@/lib/supabase';
import type { Profile, PersonalRecord } from '@/types/database';

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [records, setRecords] = useState<Partial<PersonalRecord>[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);
      await fetchUserData(user.id);
    };

    fetchUser();
  }, [router]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      if (profileData) setProfile(profileData);

      // Fetch personal records
      const { data: recordsData, error: recordsError } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId);

      if (recordsError) throw recordsError;
      if (recordsData) setRecords(recordsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleProfileUpdate = (data: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Update profile
      const profileData = {
        id: userId,
        name: profile.name,
        location: profile.location,
        bio: profile.bio,
        profile_image_url: profile.profile_image_url,
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // First, delete existing records
      const { error: deleteError } = await supabase
        .from('personal_records')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Then insert new records
      const validRecords = records
        .filter(record => record.time || record.location || record.date)
        .map(record => ({
          id: crypto.randomUUID(),
          user_id: userId,
          distance: record.distance,
          time: record.time || '',
          location: record.location || null,
          date: record.date || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

      if (validRecords.length > 0) {
        const { error: insertError } = await supabase
          .from('personal_records')
          .insert(validRecords);

        if (insertError) throw insertError;
      }

      alert('Data saved successfully!');
      // Refresh the data
      await fetchUserData(userId);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <main className="min-h-screen p-4 md:p-8 bg-[var(--background)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary-blue)] to-[var(--secondary-blue)] text-transparent bg-clip-text mb-2">
          Run PR Tracker
        </h1>
        <p className="text-[var(--text-secondary)] text-lg font-medium">
          Track your Personal Records
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <ProfilePicture
            userId={userId}
            initialUrl={profile.profile_image_url || undefined}
            onUpdate={(url) => handleProfileUpdate({ profile_image_url: url })}
          />
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{profile.name || 'Runner'}</h2>
            <p className="text-[var(--text-secondary)]">{profile.location || 'Add your location'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--card-background)] rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <UserInfo
              initialData={profile}
              onUpdate={handleProfileUpdate}
            />
          </div>

          <div className="bg-[var(--card-background)] rounded-2xl shadow-lg p-6">
            <PersonalRecords
              initialRecords={records}
              onUpdate={setRecords}
            />
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-[var(--primary-blue)] text-white py-4 px-6 rounded-xl font-semibold
                       hover:bg-[var(--secondary-blue)] transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-[var(--text-secondary)] py-2 px-4 text-sm hover:text-[var(--text-primary)] 
                       transition-colors rounded-lg hover:bg-gray-100 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 