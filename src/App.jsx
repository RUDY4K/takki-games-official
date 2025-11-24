import React, { useState, useEffect, useRef } from 'react';
import { Play, Search, Menu, X, Star, Zap, Trophy, Grid, Target, RefreshCw, Gamepad2, ChevronDown, Flame, Sparkles, User as UserIcon, Share2, Download, TrendingUp } from 'lucide-react';

// --- إعدادات النظام ---
const GAMES_PER_PAGE = 100;

// --- قاموس الترجمة ---
const CATEGORY_TRANSLATIONS = {
  "Racing": "سباق", "Action": "أكشن", "Shooting": "تصويب", "Arcade": "أركيد",
  "Puzzle": "ألغاز", "Girls": "بنات", "Sports": "رياضة", "Adventure": "مغامرات",
  "Strategy": "استراتيجية", "Education": "تعليم", "Fighting": "قتال",
  "Board": "لوحية", "Multiplayer": "جماعية", "Driving": "قيادة", "IO": "تحدي",
  "2 Player": "لاعبين", "3D": "ثلاثية الأبعاد"
};

const CATEGORIES = ["الكل", "سباق", "أكشن", "تصويب", "أركيد", "ألغاز", "بنات", "رياضة"];

// --- مكون الإعلانات الذكي ---
const AdSpace = ({ position, className, customImage, customLink }) => {
  const adRef = useRef(null);
  useEffect(() => {
    if (!customImage && adRef.current && window.adsbygoogle) {
      try { 
          if (adRef.current.innerHTML === "") {
              (window.adsbygoogle = window.adsbygoogle || []).push({}); 
          }
      } catch (e) { 
          // تجاهل التحذيرات
      }
    }
  }, [customImage]);
  
  return (
    <div className={`overflow-hidden rounded-xl my-6 flex justify-center items-center shadow-lg ${className}`}>
      {customImage ? (
        <a href={customLink || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative group">
            <img src={customImage} alt="Ad" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 right-0 bg-black/50 text-[10px] text-white px-1">راعي رسمي</div>
        </a>
      ) : (
        <div className="w-full h-full bg-slate-800/50 flex flex-col items-center justify-center border border-dashed border-slate-700/50 backdrop-blur-sm min-h-[90px]">
            <span className="text-[10px] text-slate-500 mb-1">إعلان - {position}</span>
            {/* تأكد من أن هذا الرقم هو رقمك الصحيح من أدسنس */}
            <ins className="adsbygoogle" style={{ display: 'block', width: '100%', height: '100%' }} data-ad-client="ca-pub-7564871953180369" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true" ref={adRef}></ins>
        </div>
      )}
    </div>
  );
};

// --- مكون البانر الرئيسي ---
const HeroSection = ({ onPlay }) => (
  <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-10 shadow-2xl group cursor-pointer bg-slate-900" onClick={onPlay}>
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 z-0">
       {/* تم تغيير النص البديل (alt) ليظهر بالعربية في حال لم تتحمل الصورة */}
       <img src="https://img.gamedistribution.com/5d508d0393344338b71d723341594892-512x512.jpeg" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="لعبة الأسبوع Moto X3M" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
    <div className="absolute bottom-0 right-0 p-6 md:p-10 z-20 w-full md:w-2/3 text-right">
      <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full mb-3 animate-pulse">🔥 لعبة الأسبوع</span>
      <h2 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">Moto X3M</h2>
      <p className="text-slate-300 text-sm md:text-base mb-6 line-clamp-2">تحدى الجاذبية في أقوى لعبة سباق دراجات نارية. هل يمكنك تجاوز العقبات والوصول لخط النهاية؟</p>
      <button className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm md:text-base font-bold px-8 py-3 rounded-full shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2 w-fit">
        <Play size={20} fill="currentColor" /> العب الآن مجاناً
      </button>
    </div>
  </div>
);

const CARD_COLORS = ["from-red-600 to-orange-600", "from-emerald-600 to-green-600", "from-blue-600 to-cyan-600", "from-purple-600 to-pink-600", "from-amber-600 to-yellow-600", "from-indigo-600 to-blue-700"];

export default function TakkiGamesPortal() {
  const [games, setGames] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [notification, setNotification] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const gameTimerRef = useRef(null);

  useEffect(() => {
    if (selectedGame) {
        document.title = `العب ${selectedGame.title} مجاناً | تكي قيمز`;
    } else {
        document.title = "تكي قيمز | أفضل العاب المتصفح المجانية في السعودية";
    }
  }, [selectedGame]);

  // --- دالة المشاركة ---
  const handleShare = async () => {
    const shareData = {
      title: 'تكي قيمز',
      text: selectedGame ? `تعال تحداني في لعبة ${selectedGame.title} على تكي قيمز! 🔥` : 'أفضل موقع ألعاب أونلاين في السعودية 🇸🇦',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showNotification("شكراً لمشاركة الموقع! 💚", "success");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showNotification("تم نسخ الرابط، شاركه مع أصدقائك!", "success");
      }
    } catch (err) { console.log('Share canceled'); }
  };

  const handleInstallHint = () => {
      showNotification("قريباً: ستتمكن من تثبيت الموقع كتطبيق!", "info");
  };

  const fetchGames = async (pageNum = 1, append = false) => {
    if (append) setIsLoadingMore(true); else setIsLoading(true);
    
    const TARGET_URL = `https://gamemonetize.com/feed.php?format=0&num=${GAMES_PER_PAGE}&page=${pageNum}`;
    const PROXY_URL = `https://api.allorigins.win/get?url=${encodeURIComponent(TARGET_URL)}`;

    try {
        const response = await fetch(PROXY_URL);
        if (!response.ok) throw new Error("Network Error");
        
        const data = await response.json();
        let actualGameData = [];
        try {
            if (data.contents) {
                actualGameData = JSON.parse(data.contents);
            }
        } catch (e) { console.warn("JSON Parse error", e); }
        
        if (!Array.isArray(actualGameData) || actualGameData.length === 0) {
            if (!append) throw new Error("No games found");
            setIsLoadingMore(false); return;
        }

        const processedGames = actualGameData.map((game, index) => {
            const translatedCategory = CATEGORY_TRANSLATIONS[game.category] || "منوعات";
            const isHot = Math.random() > 0.8;
            const isNew = Math.random() > 0.85 && !isHot;

            return {
                id: game.id || `${pageNum}-${index}`,
                title: game.title,
                category: translatedCategory,
                image: game.thumb, 
                color: CARD_COLORS[index % CARD_COLORS.length],
                rating: (4 + Math.random()).toFixed(1),
                players: Math.floor(Math.random() * 50 + 10) + "K",
                xpReward: Math.floor(Math.random() * 50 + 20),
                url: game.url,
                isHot, isNew
            };
        });

        if (append) {
            setGames(prev => [...prev, ...processedGames]);
            setIsLoadingMore(false);
        } else {
            setGames(processedGames);
            setIsLoading(false);
            if(pageNum === 1) showNotification(`تم تحميل ${processedGames.length} لعبة جديدة!`, "success");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        setIsLoading(false); setIsLoadingMore(false);
        if (!append) {
             const fallbackGames = [
                { id: "1", title: "Paper.io 2", category: "أركيد", thumb: "https://img.gamedistribution.com/9d2d564c537645d7a12a9478c4730063-512x512.jpeg", url: "https://paper-io.com" },
                { id: "2", title: "Moto X3M", category: "سباق", thumb: "https://img.gamedistribution.com/5d508d0393344338b71d723341594892-512x512.jpeg", url: "https://moto-x3m.io" },
                { id: "3", title: "Candy Clicker", category: "ألغاز", thumb: "https://img.gamedistribution.com/6a8a28a3363542a687a067413774a408-512x512.jpeg", url: "https://poki.com" },
                { id: "4", title: "Sniper 3D", category: "تصويب", thumb: "https://img.gamedistribution.com/8d13f2534c254776a0667c4f73272c65-512x512.jpeg", url: "https://krunker.io" },
            ];
            const processedFallback = fallbackGames.map((game, index) => ({ ...game, image: game.thumb, color: CARD_COLORS[index % CARD_COLORS.length], rating: "4.5", players: "10K", xpReward: 50, isHot: index===0 }));
            setGames(processedFallback);
            showNotification("جاري عرض الألعاب الأساسية (تحقق من الاتصال)", "info");
        }
    }
  };

  useEffect(() => { fetchGames(1, false); }, []);
  const handleLoadMore = () => { const nextPage = page + 1; setPage(nextPage); fetchGames(nextPage, true); };
  
  const openGame = (game) => { 
      setGameLoading(true); setSelectedGame(game); setPlayTime(0); 
      setTimeout(() => { setGameLoading(false); gameTimerRef.current = setInterval(() => setPlayTime(prev => prev + 1), 1000); }, 1500); 
  };
  const closeGame = () => { setSelectedGame(null); if (gameTimerRef.current) clearInterval(gameTimerRef.current); };
  const showNotification = (msg, type) => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); };

  const filteredGames = games.filter(game => {
    const matchesCategory = activeCategory === "الكل" || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden flex flex-col">
      {notification && (
        <div className={`fixed top-20 left-4 z-[60] px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-500 animate-in slide-in-from-left ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'} text-white flex items-center gap-2`}>
          <Zap size={18} className="fill-current" /> <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-800 rounded-full text-emerald-400 transition-colors"><Menu size={24} /></button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setActiveCategory("الكل"); fetchGames(1, false);}}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg"><Gamepad2 className="text-white" size={24} /></div>
              <div className="hidden sm:block"><h1 className="text-xl font-black text-white">تكي <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-cyan-400">قيمز</span></h1></div>
            </div>
          </div>
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
            <Search className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 pt-2.5" size={18} />
            <input type="text" placeholder="ابحث في آلاف الألعاب المجانية..." className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pr-10 pl-4 text-sm focus:border-emerald-500 outline-none transition-all focus:bg-slate-800" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleInstallHint} className="p-2 hover:bg-slate-800 rounded-full text-emerald-400 transition-colors hidden sm:block" title="تثبيت التطبيق"><Download size={20} /></button>
          </div>
        </div>
      </header>

      <div className="flex pt-4 lg:pt-6 px-2 lg:px-6 gap-6 container mx-auto flex-1">
        <aside className={`fixed inset-y-0 right-0 z-30 w-64 bg-[#0f172a] border-l border-slate-800 transform transition-transform duration-300 lg:transform-none lg:static lg:w-64 lg:bg-transparent lg:border-none overflow-y-auto ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          <div className="p-4 lg:p-0 space-y-6">
            <div className="lg:hidden flex justify-between mb-6"><h3 className="font-bold text-white">القائمة</h3><button onClick={() => setSidebarOpen(false)}><X size={24} /></button></div>
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-3 px-2 flex gap-2"><Grid size={14} /> الأقسام</h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setSidebarOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
                    <div className="flex items-center gap-3"><span>{cat}</span></div>
                    {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                  </button>
                ))}
              </div>
            </div>
            
            {/* --- تم استبدال قائمة المتصدرين بقائمة الألعاب المميزة الحقيقية --- */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-3 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
                    <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"><TrendingUp size={14} /> ألعاب ينصح بها</h3>
                </div>
                <div className="divide-y divide-slate-700/30">
                    {/* نعرض أول 5 ألعاب من القائمة المجلوبة بشكل عشوائي أو ثابت */}
                    {(games.length > 0 ? games.slice(0, 5) : []).map((game, idx) => (
                        <div key={idx} onClick={() => openGame(game)} className="flex items-center gap-3 p-3 hover:bg-slate-700/40 cursor-pointer transition-colors group">
                            <img src={game.image} alt={game.title} className="w-10 h-10 rounded-lg object-cover border border-slate-600 group-hover:border-emerald-500" />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-400">{game.title}</div>
                                <div className="text-[10px] text-slate-500">{game.category}</div>
                            </div>
                            <div className="text-[10px] font-bold text-yellow-500 flex items-center gap-0.5">
                                <Star size={10} className="fill-current" /> {game.rating}
                            </div>
                        </div>
                    ))}
                    {games.length === 0 && (
                        <div className="p-4 text-center text-xs text-slate-500">جاري تحميل القائمة...</div>
                    )}
                </div>
            </div>

            <AdSpace position="جانبي" />
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-20">
          {!searchTerm && activeCategory === "الكل" && !isLoading && <HeroSection onPlay={() => openGame({title: "Moto X3M", url: "https://moto-x3m.io"})} />}

          <div className="flex items-center justify-between mb-6">
             <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">{activeCategory === "الكل" ? "أحدث الألعاب" : activeCategory}</h2>
                <p className="text-slate-400 text-sm mt-1">{isLoading ? "جاري تجهيز الألعاب..." : `اختر من بين ${filteredGames.length} لعبة مجانية`}</p>
             </div>
          </div>

          {isLoading && page === 1 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-800"></div>)}</div>
          ) : (
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGames.map((game, index) => (
                    <React.Fragment key={game.id}>
                        {index === 4 && <div className="col-span-full"><AdSpace position="بين الألعاب" className="bg-slate-800/30 border-slate-700/30 min-h-[90px]" /></div>}
                        <div 
                            onClick={() => openGame(game)}
                            className="group relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-900/20 cursor-pointer"
                        >
                            <div className={`h-44 w-full bg-gradient-to-br ${game.color} relative overflow-hidden flex items-center justify-center`}>
                                <img 
                                    src={game.image} 
                                    alt={game.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    onError={(e) => {e.target.style.display='none';}} 
                                />
                                <div className="absolute top-3 left-3 flex gap-2 z-10">
                                    {game.isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><Flame size={10} /> رائج</span>}
                                    {game.isNew && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><Sparkles size={10} /> جديد</span>}
                                </div>
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10"><Star size={10} className="text-yellow-400 fill-yellow-400" /> {game.rating}</div>
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20"><button className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/40"><Play size={24} className="fill-current ml-1" /></button></div>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white truncate text-lg group-hover:text-emerald-400 transition-colors pr-1">{game.title}</h3>
                                    <div className="bg-slate-700/50 px-2 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700 whitespace-nowrap">{game.category}</div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-700/50">
                                    <div className="flex items-center gap-1.5"><UserIcon size={12} /> <span>{game.players}</span></div>
                                    <div className="flex items-center gap-1.5 text-emerald-400"><Target size={12} /> <span>+{game.xpReward} XP</span></div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                    ))}
                </div>
                
                <div className="mt-12 flex justify-center">
                    <button onClick={handleLoadMore} disabled={isLoadingMore} className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-emerald-600 text-white font-bold rounded-full border border-slate-700 hover:border-emerald-500 transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg">
                        {isLoadingMore ? "جاري جلب ألعاب جديدة..." : <><ChevronDown size={20} /> اكتشف المزيد من الألعاب</>}
                    </button>
                </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-auto">
        <div className="container mx-auto px-6 text-center md:text-right">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2"><Gamepad2 className="text-emerald-500" size={24} /><h2 className="text-xl font-black text-white">تكي قيمز</h2></div>
                    <p className="text-slate-400 text-sm max-w-md">وجهتك الأولى لألعاب المتصفح المجانية في السعودية. استمتع بآلاف الألعاب بدون تحميل.</p>
                </div>
                <div className="flex gap-6 text-sm text-slate-400">
                    <a href="#" className="hover:text-emerald-400 transition-colors">شروط الاستخدام</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-500 text-center">© 2024 TakkiGames.com - جميع الحقوق محفوظة.</div>
        </div>
      </footer>

      {selectedGame && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a]">
            <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-lg z-10">
                <div className="flex items-center gap-4">
                    <button onClick={closeGame} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full"><X size={24} /></button>
                    <div className="flex items-center gap-3 border-r border-slate-800 pr-4 mr-2"><h3 className="font-bold text-white text-sm">{selectedGame.title}</h3></div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleShare} className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center gap-2 px-4 text-xs font-bold"><Share2 size={16} /> <span className="hidden sm:inline">مشاركة</span></button>
                </div>
            </div>
            <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
                {gameLoading ? <div className="text-emerald-400 font-bold animate-pulse">جاري التشغيل...</div> : <iframe className="w-full h-full border-none" src={selectedGame.url} title={selectedGame.title} allow="autoplay; fullscreen; gamepad;" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-pointer-lock" />}
            </div>
            <div className="bg-slate-900 border-t border-slate-800 p-2 flex justify-center"><AdSpace position="بانر أسفل اللعبة" className="w-[728px] h-[90px]" /></div>
        </div>
      )}
    </div>
  );
}
