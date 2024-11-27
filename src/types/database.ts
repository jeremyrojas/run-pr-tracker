export interface Profile {
  id: string;
  name: string | null;
  location: string | null;
  bio: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  distance: string;
  time: string;
  location: string | null;
  date: string | null;
  created_at: string;
  updated_at: string;
} 