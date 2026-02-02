
export interface AffiliateLink {
  id: string;
  title: string;
  url: string;
  platform: 'note' | 'x' | 'instagram' | 'threads' | 'favorite' | 'other';
  genre: string;
  description: string;
  createdAt: number;
}

export interface AppState {
  links: AffiliateLink[];
  genres: string[];
  isAuthenticated: boolean;
  accessKey: string | null;
}

export const PLATFORMS = [
  { id: 'favorite', name: 'よく使う', color: 'bg-yellow-400' },
  { id: 'note', name: 'Note', color: 'bg-green-600' },
  { id: 'x', name: 'X (Twitter)', color: 'bg-black' },
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-600' },
  { id: 'threads', name: 'Threads', color: 'bg-indigo-900' },
  { id: 'other', name: 'その他', color: 'bg-gray-600' }
] as const;
