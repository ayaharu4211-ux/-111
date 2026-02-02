
import React, { useState, useEffect, useMemo } from 'react';
import { AffiliateLink, PLATFORMS } from '../types';

interface AppVaultProps {
  onLogout: () => void;
}

const AppVault: React.FC<AppVaultProps> = ({ onLogout }) => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  
  // 削除確認用ステート
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  // New/Edit link form state
  const [formData, setFormData] = useState<Partial<AffiliateLink>>({
    platform: 'note',
    genre: '',
    title: '',
    url: '',
    description: ''
  });

  // Load links on mount
  useEffect(() => {
    const saved = localStorage.getItem('affivault_data');
    if (saved) {
      try {
        setLinks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
  }, []);

  // Save links on change
  useEffect(() => {
    localStorage.setItem('affivault_data', JSON.stringify(links));
  }, [links]);

  const genres = useMemo(() => {
    const g = Array.from(new Set(links.map(l => l.genre))).filter(Boolean);
    return ['all', ...g];
  }, [links]);

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        link.title.toLowerCase().includes(searchLower) || 
        link.genre.toLowerCase().includes(searchLower) ||
        link.platform.toLowerCase().includes(searchLower);
      const matchesGenre = selectedGenre === 'all' || link.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [links, searchTerm, selectedGenre]);

  const handleOpenAddModal = () => {
    setEditingLinkId(null);
    setFormData({ platform: 'note', genre: '', title: '', url: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (link: AffiliateLink) => {
    setEditingLinkId(link.id);
    setFormData({ ...link });
    setIsModalOpen(true);
  };

  const handleSaveLink = () => {
    if (!formData.title || !formData.url) {
      alert('タイトルとURLは必須です');
      return;
    }

    if (editingLinkId) {
      setLinks(prev => prev.map(l => l.id === editingLinkId ? { ...l, ...formData as AffiliateLink } : l));
    } else {
      const link: AffiliateLink = {
        id: crypto.randomUUID(),
        title: formData.title!,
        url: formData.url!,
        platform: formData.platform as any || 'other',
        genre: formData.genre || '未分類',
        description: formData.description || '',
        createdAt: Date.now()
      };
      setLinks(prev => [link, ...prev]);
    }

    setIsModalOpen(false);
    setEditingLinkId(null);
    setFormData({ platform: 'note', genre: '', title: '', url: '', description: '' });
  };

  // 削除の最終実行
  const confirmDelete = () => {
    if (linkToDelete) {
      setLinks(prev => prev.filter(l => l.id !== linkToDelete));
      setLinkToDelete(null);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyTooltip(id);
      setTimeout(() => setShowCopyTooltip(null), 2000);
    }).catch(err => {
      console.error('Copy failed', err);
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(links, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affivault-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">A</div>
            <h1 className="text-xl font-black text-gray-800 hidden sm:block">AffiVault <span className="text-lime-500">PRO</span></h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={exportData}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition-all text-sm font-bold flex items-center"
              title="バックアップを保存"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              保存
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-lime-100 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>新規登録</span>
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <button 
              onClick={() => {
                localStorage.removeItem('affivault_access_key');
                onLogout();
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="ログアウト"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Warning Notice */}
      <div className="bg-lime-900 px-4 py-2 text-[10px] md:text-xs text-lime-100 text-center font-bold">
        📢 重要：ブラウザのブックマークに登録してください。データはブラウザ内にのみ保存されます。
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">ジャンル絞り込み</h3>
            <div className="space-y-1.5">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedGenre === g 
                      ? 'bg-lime-500 text-white shadow-md shadow-lime-100' 
                      : 'text-gray-600 hover:bg-lime-50'
                  }`}
                >
                  {g === 'all' ? 'すべて表示' : g}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="検索（タイトル、ジャンル、SNS名）"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 px-14 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-lime-100 shadow-sm transition-all font-medium"
            />
            <svg className="w-6 h-6 text-gray-300 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredLinks.length === 0 ? (
              <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="text-4xl mb-4">📂</div>
                <p className="text-gray-400 font-bold">表示できるリンクがありません</p>
                <button 
                  onClick={handleOpenAddModal}
                  className="mt-4 text-lime-500 font-bold hover:underline"
                >
                  新しいリンクを登録する
                </button>
              </div>
            ) : (
              filteredLinks.map(link => {
                const platformInfo = PLATFORMS.find(p => p.id === link.platform);
                return (
                  <div key={link.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative group flex flex-col h-full border-b-4 hover:border-lime-500">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full text-white ${platformInfo?.color}`}>
                          {platformInfo?.name}
                        </span>
                        <span className="text-xs text-lime-600 font-black px-2 py-0.5 bg-lime-50 rounded-md">
                          #{link.genre}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleOpenEditModal(link)}
                          className="p-2 text-gray-400 hover:text-lime-500 transition-all rounded-full hover:bg-lime-50"
                          title="編集"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLinkToDelete(link.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50"
                          title="削除"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-black text-lg text-gray-800 mb-2 truncate" title={link.title}>{link.title}</h4>
                    
                    <div className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed line-clamp-2">
                      {link.description || "説明・メモはありません"}
                    </div>

                    <div className="flex space-x-2 mt-auto">
                      <button
                        onClick={() => copyToClipboard(link.url, link.id)}
                        className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-black py-3 px-4 rounded-2xl text-sm transition-all flex items-center justify-center relative shadow-lg shadow-lime-100 active:scale-95"
                      >
                        {showCopyTooltip === link.id ? (
                          <span className="font-bold">コピー完了！ ✅</span>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            URLをコピー
                          </>
                        )}
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-3 rounded-2xl transition-all active:scale-95"
                        title="ページを開く"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* 削除確認モーダル */}
      {linkToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">リンクを削除しますか？</h3>
            <p className="text-gray-500 text-sm mb-6">この操作は取り消せません。本当に削除してよろしいですか？</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setLinkToDelete(null)}
                className="flex-1 bg-gray-100 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all"
              >
                キャンセル
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-500 py-3 rounded-2xl font-bold text-white hover:bg-red-600 transition-all shadow-lg shadow-red-100"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-gray-900">{editingLinkId ? 'リンクを編集' : 'リンク登録'}</h3>
                <p className="text-gray-400 text-sm font-bold">情報を入力して保存してください</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-10 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">プラットフォーム</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-lime-500 rounded-2xl px-4 py-3 outline-none transition-all font-bold appearance-none cursor-pointer"
                  >
                    {PLATFORMS.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ジャンル</label>
                  <input 
                    type="text"
                    placeholder="例: 美容, PC"
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-lime-500 rounded-2xl px-4 py-3 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">タイトル *</label>
                <input 
                  type="text"
                  placeholder="アイテムやキャンペーンの名前"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-lime-500 rounded-2xl px-4 py-3 outline-none transition-all font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">アフィリエイトURL *</label>
                <input 
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-lime-500 rounded-2xl px-4 py-3 outline-none transition-all font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">メモ (任意)</label>
                <textarea 
                  rows={2}
                  placeholder="キャンペーン期間などのメモ"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-lime-500 rounded-2xl px-4 py-3 outline-none transition-all font-bold resize-none"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-8 flex space-x-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
              >
                キャンセル
              </button>
              <button 
                onClick={handleSaveLink}
                className="flex-1 bg-lime-500 hover:bg-lime-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-lime-100 transition-all active:scale-95"
              >
                {editingLinkId ? '変更を保存' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppVault;
