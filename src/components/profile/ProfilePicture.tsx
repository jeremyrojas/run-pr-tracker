'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface ProfilePictureProps {
  onUpdate: (url: string) => void;
  initialUrl?: string;
  userId: string;
}

export default function ProfilePicture({ onUpdate, initialUrl, userId }: ProfilePictureProps) {
  const [image, setImage] = useState<string | null>(initialUrl || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl) {
      setImage(initialUrl);
    }
  }, [initialUrl]);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Math.random()}.${fileExt}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      setImage(publicUrl);
      onUpdate(publicUrl);
    } catch (error) {
      console.error('Detailed upload error:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please upload an image smaller than 5MB');
        return;
      }

      await uploadImage(file);
    } catch (error) {
      console.error('Image selection error:', error);
      alert('Error selecting image. Please try again.');
    }
  };

  return (
    <div 
      className="relative w-32 h-32 rounded-full bg-gray-200 cursor-pointer group"
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      {image ? (
        <Image
          src={image}
          alt="Profile"
          fill
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all flex items-center justify-center">
        <span className="text-white opacity-0 group-hover:opacity-100">
          {uploading ? 'Uploading...' : 'Change'}
        </span>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
} 