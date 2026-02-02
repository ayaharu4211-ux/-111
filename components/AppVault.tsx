
import React, { useState, useEffect, useMemo } from 'react';
import { AffiliateLink, PLATFORMS } from '../types';

interface AppVaultProps {
  onLogout: () => void;
}

// 互換性のあるID生成関数
const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const AppVault: React.FC<AppVaultProps> = ({ onLogout }) => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AffiliateLink>>({
    platform: 'note',
    genre: '',
    title: '',
    url: '',
    description: ''
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('affivault_data');
      if (saved) {
        setLinks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('affivault_data', JSON.stringify(links));
    } catch (e) {
      console.error("Failed to save data", e);
    }
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
        id: generateId(),
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

  const confirmDelete = () => {
    if (linkToDelete) {
      setLinks(prev => prev.filter(l => l.id !== linkToDelete));
      setLinkToDelete(null);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setShowCopyTooltip(id);
        setTimeout(() => setShowCopyTooltip(null), 2000);
      }).catch(err => {
        console.error('Copy failed', err);
      });
    } else {
      // 古いブラウザ用のフォールバック
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopyTooltip(id);
        setTimeout(() => setShowCopyTooltip(null), 2000);
      } catch (err) {
        alert("コピーに失敗しました。URLを長押ししてコピーしてください。");
      }
      document.body.removeChild(textArea);
    }
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">A</div>
            <h1 className="text-lg font-black text-gray-800 hidden sm:block">AffiVault <span className="text-lime-500">PRO</span></h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={exportData}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition-all text-xs font-bold flex items-center"
              title="バックアップを保存"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden xs:inline">保存</span>
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-lime-100 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>新規</span>
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

      <div className="bg-lime-900 px-4 py-2 text-[10px] text-lime-100 text-center font-bold">
        📢 重要：ブラウザのブックマークに登録してください。
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm md:sticky md:top-24">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">ジャンル</h3>
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedGenre === g 
                      ? 'bg-lime-500 text-white shadow-md shadow-lime-100' 
                      : 'text-gray-600 hover:bg-lime-50 bg-gray-50'
                  }`}
                >
                  {g === 'all' ? 'すべて' : g}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="検索（タイトルなど）"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 px-12 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-lime-100 shadow-sm transition-all font-medium text-sm"
            />
            <svg className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredLinks.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="text-4xl mb-3">📂</div>
                <p className="text-gray-400 font-bold text-sm">表示できるリンクがありません</p>
              </div>
            ) : (
              filteredLinks.map(link => {
                const platformInfo = PLATFORMS.find(p => p.id === link.platform);
                return (
                  <div key={link.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm flex flex-col h-full border-b-4 hover:border-lime-500 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full text-white ${platformInfo?.color}`}>
                          {platformInfo?.name}
                        </span>
                        <span className="text-[10px] text-lime-600 font-black px-2 py-0.5 bg-lime-50 rounded-md">
                          #{link.genre}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button onClick={() => handleOpenEditModal(link)} className="p-1.5 text-gray-400 hover:text-lime-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={() => setLinkToDelete(link.id)} className="p-1.5 text-gray-400 hover:text-red-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-base text-gray-800 mb-1 truncate">{link.title}</h4>
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{link.description || "説明なし"}</p>

                    <div className="flex space-x-2 mt-auto">
                      <button
                        onClick={() => copyToClipboard(link.url, link.id)}
                        className="flex-1 bg-lime-500 hover:bg-lime-600 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center shadow-md active:scale-95"
                      >
                        {showCopyTooltip === link.id ? "コピー完了！" : "URLをコピー"}
                      </button>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2.5 rounded-xl"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {linkToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 text-center animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-black text-gray-900 mb-2">削除しますか？</h3>
            <div className="flex space-x-2 mt-6">
              <button onClick={() => setLinkToDelete(null)} className="flex-1 bg-gray-100 py-3 rounded-2xl font-bold text-gray-500 text-sm">戻る</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 py-3 rounded-2xl font-bold text-white text-sm">削除</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-black text-gray-900">{editingLinkId ? '編集' : '新規登録'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">SNS</label>
                  <select value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value as any})} className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold outline-none">
                    {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">ジャンル</label>
                  <input type="text" value={formData.genre} onChange={(e) => setFormData({...formData, genre: e.target.value})} className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">タイトル</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold outline-none" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">URL</label>
                <input type="url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold outline-none" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">メモ</label>
                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold outline-none" />
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white py-3 rounded-xl font-bold text-gray-400 text-sm">中止</button>
              <button onClick={handleSaveLink} className="flex-1 bg-lime-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-lime-100">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppVault;
