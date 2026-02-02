
import React from 'react';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">AffiVault</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <a href="#intro" onClick={(e) => scrollToSection(e, 'intro')} className="hover:text-lime-600 font-bold transition-colors">製品紹介</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-lime-600 font-bold transition-colors">特徴</a>
          <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-lime-600 font-bold transition-colors">価格</a>
        </div>
        <button 
          onClick={onLaunch}
          className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          アプリを起動
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block bg-lime-100 text-lime-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 animate-bounce">
          Threads & Instagram対応！最新アフィリエイト管理
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
          リンク管理の時間を<br />
          <span className="text-lime-500">利益に変える。</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          バラバラになったアフィリエイトリンクを、たった一つの場所に。<br />
          スマホ一つで、いつでもどこでも、最高のスピードで投稿準備が完了します。
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a 
            href="#pricing" 
            onClick={(e) => scrollToSection(e, 'pricing')}
            className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl"
          >
            今すぐ購入して始める
          </a>
          <button 
            onClick={onLaunch}
            className="w-full sm:w-auto bg-white border-2 border-gray-200 text-gray-700 px-10 py-4 rounded-2xl font-bold text-lg hover:border-lime-500 hover:text-lime-600 transition-all"
          >
            既にキーをお持ちの方
          </button>
        </div>

        {/* Product Intro (紹介セクション) */}
        <div id="intro" className="pt-24 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center text-left">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">アフィリエイターの「面倒」を<br /><span className="text-lime-500">すべて解決します。</span></h2>
              <div className="space-y-4 text-gray-600 font-medium">
                <p>「あの案件のリンク、どこだっけ？」と探す時間はもう必要ありません。</p>
                <p>AffiVaultは、アフィリエイターが直面する「リンク管理の煩雑さ」を解消するために生まれました。</p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="text-lime-500 font-bold">✓</span>
                    <span>ジャンルごとにタグ付け整理が可能</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-lime-500 font-bold">✓</span>
                    <span>SNSごとの出し分けも視覚的に分かりやすい</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-lime-500 font-bold">✓</span>
                    <span>外部サーバー不要、プライバシーも安心</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-lime-50 rounded-[3rem] p-8 aspect-square flex items-center justify-center shadow-inner">
               <div className="text-9xl">📱</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-4">主な機能</h2>
            <p className="text-gray-500 font-bold">作業効率を最大化するツールを凝縮</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Threads対応 & お気に入り",
                desc: "最新SNSへの対応はもちろん、頻繁に使うリンクを即座に呼び出せる「よく使う」タブを搭載。",
                icon: "✨"
              },
              {
                title: "爆速1タップコピー",
                desc: "登録したリンクをワンタップでクリップボードへ。煩わしい長押しコピーはもう不要です。",
                icon: "🔗"
              },
              {
                title: "データ出力・復元",
                desc: "JSONファイルでの書き出しに対応。バックアップや、別のデバイスへの移行もスムーズです。",
                icon: "💾"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-2 group">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border-4 border-lime-500 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-lime-500 text-white px-10 py-2 font-black text-sm rotate-45 translate-x-10 translate-y-4">
              BEST BUY
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">AffiVault Pro 版</h2>
            <p className="text-gray-500 font-bold mb-10">すべての機能を、買い切りで。</p>
            
            <div className="flex items-baseline justify-center mb-10">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">1,500</span>
              <span className="text-2xl font-black text-gray-900 ml-1">円</span>
              <span className="text-gray-400 font-bold ml-2">(税込)</span>
            </div>

            <a 
              href="https://note.com/hanbaipeji/n/n0834d9ad7f29?sub_rt=share_pb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-lime-500 hover:bg-lime-600 text-white text-2xl py-6 rounded-3xl font-black transition-all mb-6 shadow-xl shadow-lime-100 animate-pulse active:scale-95"
            >
              noteで今すぐ購入する
            </a>
            
            <div className="text-left space-y-3 max-w-sm mx-auto">
              <div className="flex items-center text-sm text-gray-600 font-bold">
                <span className="text-lime-500 mr-2">●</span> 追加料金なし（買い切り型）
              </div>
              <div className="flex items-center text-sm text-gray-600 font-bold">
                <span className="text-lime-500 mr-2">●</span> 購入後、即座にキーを発行
              </div>
              <div className="flex items-center text-sm text-gray-600 font-bold">
                <span className="text-lime-500 mr-2">●</span> アップデートも無料対応
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="bg-yellow-50 py-16 border-y border-yellow-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-yellow-800 font-black mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xl">ご利用上の重要なお願い</span>
          </div>
          <p className="text-yellow-900 leading-relaxed font-bold mb-4">
            本アプリはブラウザのローカル環境（IndexedDB/LocalStorage）にデータを保存します。<br />
            シークレットモードでの利用や、キャッシュの削除によりデータが消える可能性があります。
          </p>
          <div className="inline-block bg-white px-6 py-3 rounded-2xl border border-yellow-200 text-yellow-800 font-black shadow-sm">
            必ず「ブラウザのブックマーク」に追加してご利用ください
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-6 h-6 bg-lime-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="font-bold text-gray-800">AffiVault</span>
        </div>
        <p className="text-gray-400 text-sm font-medium">© 2025 AffiVault. リンク管理を、もっと楽に、もっと速く。</p>
      </footer>
    </div>
  );
};

export default LandingPage;
