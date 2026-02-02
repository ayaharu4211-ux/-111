
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
      <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-lime-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-tight">AffiVault</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <a href="#intro" onClick={(e) => scrollToSection(e, 'intro')} className="hover:text-lime-600 font-bold transition-colors">製品紹介</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-lime-600 font-bold transition-colors">特徴</a>
          <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-lime-600 font-bold transition-colors">価格</a>
        </div>
        <button 
          onClick={onLaunch}
          className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-md active:scale-95"
        >
          アプリ起動
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-32 text-center">
        <div className="inline-block bg-lime-100 text-lime-700 px-4 py-1 rounded-full text-[10px] md:text-sm font-bold mb-6">
          Threads & Instagram対応！
        </div>
        <h1 className="text-3xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
          リンク管理の時間を<br />
          <span className="text-lime-500">利益に変える。</span>
        </h1>
        <p className="text-base md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed px-4">
          バラバラになったアフィリエイトリンクを一つの場所に。<br className="hidden sm:block" />
          最高のスピードで投稿準備が完了します。
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a 
            href="#pricing" 
            onClick={(e) => scrollToSection(e, 'pricing')}
            className="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-black transition-all shadow-xl"
          >
            今すぐ購入して始める
          </a>
          <button 
            onClick={onLaunch}
            className="w-full sm:w-auto bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold text-base hover:border-lime-500 transition-all"
          >
            既にキーをお持ちの方
          </button>
        </div>

        {/* Product Intro */}
        <div id="intro" className="pt-16 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center text-left">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 md:mb-6 leading-tight">アフィリエイターの「面倒」を<br /><span className="text-lime-500">すべて解決します。</span></h2>
              <div className="space-y-4 text-sm md:text-base text-gray-600 font-medium">
                <p>「あのリンク、どこだっけ？」と探す時間はもう必要ありません。</p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="text-lime-500 font-bold mt-0.5">✓</span>
                    <span>ジャンルごとにタグ付け整理が可能</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-lime-500 font-bold mt-0.5">✓</span>
                    <span>SNSごとの出し分けも分かりやすい</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-lime-500 font-bold mt-0.5">✓</span>
                    <span>外部サーバー不要、プライバシーも安心</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2 bg-lime-50 rounded-[2rem] md:rounded-[3rem] p-6 flex items-center justify-center shadow-inner h-48 md:h-auto md:aspect-square">
               <div className="text-7xl md:text-9xl">📱</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl font-black text-gray-900 mb-4">主な機能</h2>
            <p className="text-gray-500 text-sm font-bold tracking-wider">作業効率を最大化するツールを凝縮</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-12">
            {[
              {
                title: "Threads対応",
                desc: "最新SNSへの対応。頻繁に使うリンクを即座に呼び出せる「よく使う」タブを搭載。",
                icon: "✨"
              },
              {
                title: "爆速コピー",
                desc: "登録リンクをワンタップでクリップボードへ。煩わしい長押しコピーは不要です。",
                icon: "🔗"
              },
              {
                title: "データ出力",
                desc: "JSONファイルでの書き出しに対応。バックアップや、別デバイスへの移行も簡単。",
                icon: "💾"
              }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="text-4xl md:text-5xl mb-6">{f.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-800">{f.title}</h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border-2 md:border-4 border-lime-500 rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">AffiVault Pro 版</h2>
            <p className="text-gray-500 font-bold mb-8 text-sm">すべての機能を、買い切りで。</p>
            
            <div className="flex items-baseline justify-center mb-8">
              <span className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">1,500</span>
              <span className="text-xl md:text-2xl font-black text-gray-900 ml-1">円</span>
              <span className="text-gray-400 font-bold ml-2 text-sm">(税込)</span>
            </div>

            <a 
              href="https://note.com/hanbaipeji/n/n0834d9ad7f29?sub_rt=share_pb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-lime-500 hover:bg-lime-600 text-white text-lg md:text-2xl py-4 md:py-6 rounded-2xl md:rounded-3xl font-black transition-all mb-6 shadow-xl active:scale-95"
            >
              noteで購入する
            </a>
            
            <div className="text-left space-y-2 max-w-sm mx-auto text-xs md:text-sm text-gray-600 font-bold">
              <div className="flex items-center"><span className="text-lime-500 mr-2">●</span> 追加料金なし</div>
              <div className="flex items-center"><span className="text-lime-500 mr-2">●</span> 即座にキーを発行</div>
              <div className="flex items-center"><span className="text-lime-500 mr-2">●</span> 無料アップデート</div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="bg-yellow-50 py-12 md:py-16 border-y border-yellow-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-yellow-800 font-black mb-6">
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-lg md:text-xl">重要なお願い</span>
          </div>
          <p className="text-yellow-900 text-sm md:text-base leading-relaxed font-bold mb-6">
            本アプリはブラウザ内にデータを保存します。<br />
            必ず「ブックマーク」に追加してご利用ください。
          </p>
        </div>
      </section>

      <footer className="py-12 md:py-20 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-xs font-medium px-4">© 2025 AffiVault. リンク管理を、もっと楽に、もっと速く。</p>
      </footer>
    </div>
  );
};

export default LandingPage;
