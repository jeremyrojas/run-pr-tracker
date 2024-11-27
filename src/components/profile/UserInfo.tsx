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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Name
        </label>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--background)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Location
        </label>
        <input
          type="text"
          placeholder="City, Country"
          value={location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--background)]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
          Bio
        </label>
        <textarea
          placeholder="Tell us about your running journey..."
          value={bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-[var(--background)] resize-none h-24"
        />
      </div>
    </div>
  );
} 