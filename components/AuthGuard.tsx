
import React, { useState } from 'react';

interface AuthGuardProps {
  onBack: () => void;
  onLogin: () => void;
}

const MASTER_KEY = 'AFFI-MASTER-777';

const AuthGuard: React.FC<AuthGuardProps> = ({ onBack, onLogin }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key === MASTER_KEY) {
      onLogin();
    } else {
      setError('無効なアクセスキーです。購入時のメールをご確認ください。');
    }
  };

  return (
    <div className="min-h-screen bg-lime-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-lime-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">アクセス認証</h2>
          <p className="text-gray-500 mt-2 text-sm px-4">
            noteで購入したアクセスキーを入力してください。<br />
            キーは入力を隠した状態で入力されます。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              アクセスキー
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 outline-none transition-all"
              placeholder="••••••••••••"
              required
            />
            {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-lime-200 transition-all active:scale-95"
          >
            認証して開始する
          </button>
        </form>

        <button
          onClick={onBack}
          className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};

export default AuthGuard;
