'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

interface UserInfoProps {
  onUpdate: (data: Partial<Profile>) => void;
  initialData?: Partial<Profile>;
}

export default function UserInfo({ onUpdate, initialData }: UserInfoProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [bio, setBio] = useState(initialData?.bio || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setLocation(initialData.location || '');
      setBio(initialData.bio || '');
    }
  }, [initialData]);

  const handleChange = (field: keyof Profile, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'bio':
        setBio(value);
        break;
    }
    onUpdate({ [field]: value });
  };

  return (
    <div className="w-full space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => handleChange('location', e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        className="w-full p-2 border rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
} 