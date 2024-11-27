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
    <main className="min-h-screen p-8 flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Run PR Tracker</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            Logout
          </button>
        </div>
        
        <div className="flex flex-col items-center space-y-8">
          <ProfilePicture
            userId={userId}
            initialUrl={profile.profile_image_url || undefined}
            onUpdate={(url) => handleProfileUpdate({ profile_image_url: url })}
          />
          <UserInfo
            initialData={profile}
            onUpdate={handleProfileUpdate}
          />
          <PersonalRecords
            initialRecords={records}
            onUpdate={setRecords}
          />
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full max-w-md bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </main>
  );
} 