import React, { useState, useEffect, useRef } from 'react';
import { Play, Search, Menu, X, Heart, Star, Zap, Trophy, Monitor, Grid, Info, Share2, User, LogIn, Crown, Target, RefreshCw, Server, Gamepad2 } from 'lucide-react';

// --- مكونات واجهة المستخدم ---

const AdSpace = ({ position, className }) => (
  <div className={`bg-slate-800/50 border border-dashed border-slate-700/50 rounded-lg flex flex-col items-center justify-center text-slate-600 p-2 my-4 ${className}`}>
    <span className="text-[10px] font-bold tracking-wider mb-1 opacity-50">إعلان - {position}</span>
    <div className="w-full h-full min-h-[60px] bg-slate-800/50 flex items-center justify-center text-center text-[10px] text-slate-500">
      مساحة إعلانية (Google Ads)
    </div>
  </div>
);

const CATEGORIES = ["الكل", "Racing", "Action", "Shooting", "Arcade", "Puzzle", "Girls", "Sports"];

const LEADERBOARD_DATA = [
  { id: 1, name: "فهد الأسطورة", points: 15400, avatar: "🦁", rank: 1 },
  { id: 2, name: "سعود جيمر", points: 12350, avatar: "😎", rank: 2 },
  { id: 3, name: "الملكة", points: 10200, avatar: "👑", rank: 3 },
  { id: 4, name: "صياد النوبز", points: 8500, avatar: "🏹", rank: 4 },
  { id: 5, name: "الكاسر", points: 6200, avatar: "🔥", rank: 5 },
];

const CARD_COLORS = [
  "from-red-600 to-orange-600",
  "from-emerald-600 to-green-600",
  "from-blue-600 to-cyan-600",
  "from-purple-600 to-pink-600",
  "from-amber-600 to-yellow-600",
  "from-indigo-600 to-blue-700",
];

export default function TakkiGamesPortal() {
  const [games, setGames] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const gameTimerRef = useRef(null);

  // --- تحسين SEO الديناميكي ---
  useEffect(() => {
    if (selectedGame) {
        document.title = `العب ${selectedGame.title} مجاناً | تكي قيمز`;
    } else if (activeCategory !== "الكل") {
        document.title = `العاب ${activeCategory} اون لاين | تكي قيمز`;
    } else {
        document.title = "تكي قيمز | أفضل العاب المتصفح المجانية في السعودية";
    }
  }, [selectedGame, activeCategory]);

  const fetchGamesFromAutoFeed = async () => {
    setIsLoading(true);
    const API_URL = '[https://gamemonetize.com/feed.php?format=0&num=50&page=1](https://gamemonetize.com/feed.php?format=0&num=50&page=1)';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawData = await response.json();
        const gamesArray = Array.isArray(rawData) ? rawData : [];

        if (gamesArray.length === 0) throw new Error("Empty Data");

        const processedGames = gamesArray.map((game, index) => ({
            id: game.id || index,
            title: game.title,
            category: game.category,
            image: game.thumb, 
            color: CARD_COLORS[index % CARD_COLORS.length],
            rating: (4 + Math.random()).toFixed(1),
            players: Math.floor(Math.random() * 50 + 10) + "K",
            xpReward: Math.floor(Math.random() * 50 + 20),
            url: game.url
        }));

        setGames(processedGames);
        setIsLoading(false);
        showNotification("تم تحديث مكتبة تكي قيمز بنجاح", "success");

    } catch (error) {
        console.error("CORS Error:", error);
        const mockGameMonetizeResponse = [
            { id: "1", title: "Paper.io 2", category: "Arcade", thumb: "[https://img.gamedistribution.com/9d2d564c537645d7a12a9478c4730063-512x512.jpeg](https://img.gamedistribution.com/9d2d564c537645d7a12a9478c4730063-512x512.jpeg)", url: "[https://paper-io.com](https://paper-io.com)" },
            { id: "2", title: "Moto X3M", category: "Racing", thumb: "[https://img.gamedistribution.com/5d508d0393344338b71d723341594892-512x512.jpeg](https://img.gamedistribution.com/5d508d0393344338b71d723341594892-512x512.jpeg)", url: "[https://moto-x3m.io](https://moto-x3m.io)" },
            { id: "3", title: "Candy Clicker", category: "Puzzle", thumb: "[https://img.gamedistribution.com/6a8a28a3363542a687a067413774a408-512x512.jpeg](https://img.gamedistribution.com/6a8a28a3363542a687a067413774a408-512x512.jpeg)", url: "[https://poki.com](https://poki.com)" },
            { id: "4", title: "Sniper 3D", category: "Shooting", thumb: "[https://img.gamedistribution.com/8d13f2534c254776a0667c4f73272c65-512x512.jpeg](https://img.gamedistribution.com/8d13f2534c254776a0667c4f73272c65-512x512.jpeg)", url: "[https://krunker.io](https://krunker.io)" },
        ];
        const fallbackGames = mockGameMonetizeResponse.map((game, index) => ({
             id: game.id, title: game.title, category: game.category, image: game.thumb, 
             color: CARD_COLORS[index % CARD_COLORS.length], rating: "4.5", players: "10K", xpReward: 50, url: game.url
        }));
        setGames(fallbackGames);
        setIsLoading(false);
        showNotification("وضع المعاينة (تم تحميل بيانات احتياطية)", "info");
    }
  };

  useEffect(() => {
    fetchGamesFromAutoFeed();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const mockUser = { name: "اللاعب الجديد", avatar: "🧑‍🚀", level: 1, points: 500, coins: 50, rank: "مبتدئ" };
    setUser(mockUser);
    setShowLoginModal(false);
    showNotification("تم تسجيل الدخول بنجاح! مرحباً بك", "success");
  };

  const openGame = (game) => {
    setGameLoading(true);
    setSelectedGame(game);
    setPlayTime(0);
    setTimeout(() => {
      setGameLoading(false);
      gameTimerRef.current = setInterval(() => setPlayTime(prev => prev + 1), 1000);
    }, 1500);
  };

  const closeGame = () => {
    setSelectedGame(null);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (user && playTime > 5) {
      const earnedPoints = Math.floor(playTime / 2) + 10;
      setUser(prev => ({ ...prev, points: prev.points + earnedPoints }));
      showNotification(`أحسنت! كسبت ${earnedPoints} نقطة خبرة`, "success");
    }
  };

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredGames = games.filter(game => {
    const matchesCategory = activeCategory === "الكل" || game.category === activeCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      
      {notification && (
        <div className={`fixed top-20 left-4 z-[60] px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-500 animate-in slide-in-from-left ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-blue-600'} text-white flex items-center gap-2`}>
          <Zap size={18} className="fill-current" />
          <span className="font-bold text-sm">{notification.msg}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-800 rounded-full text-emerald-400 transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveCategory("الكل")}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30 relative">
                <Gamepad2 className="text-white" size={24} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black tracking-tight text-white">تكي <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-cyan-400">قيمز</span></h1>
                <span className="text-[10px] text-slate-400 font-medium block -mt-1 flex gap-1 items-center">
                   TakkiGames.com
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative group">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
            </div>
            <input 
              type="text" 
              placeholder="ابحث في ألعاب تكي قيمز..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pr-10 pl-4 focus:outline-none focus:border-emerald-500 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 pl-1 pr-3 py-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer group">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{user.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-yellow-400 flex items-center gap-0.5"><Crown size={10} /> {user.points}</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-lg border-2 border-slate-700 group-hover:border-emerald-500 transition-colors">
                  {user.avatar}
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">دخول</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex pt-4 lg:pt-6 px-2 lg:px-6 gap-6 container mx-auto">
        <aside className={`fixed inset-y-0 right-0 z-30 w-64 bg-[#0f172a] border-l border-slate-800 transform transition-transform duration-300 lg:transform-none lg:static lg:w-64 lg:bg-transparent lg:border-none overflow-y-auto ${sidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}`}>
          <div className="p-4 lg:p-0 space-y-6">
             <div className="lg:hidden flex justify-between items-center mb-6">
               <h3 className="font-bold text-white">القائمة</h3>
               <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
            </div>
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                <Grid size={14} /> التصنيفات
              </h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${activeCategory === cat ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                        <span>{cat}</span>
                    </div>
                    {activeCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 overflow-hidden">
                <div className="p-3 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
                    <h3 className="text-xs font-bold text-yellow-500 flex items-center gap-1.5"><Trophy size={14} /> أبطال تكي قيمز</h3>
                </div>
                <div className="divide-y divide-slate-700/30">
                    {LEADERBOARD_DATA.slice(0, 3).map((player, idx) => (
                        <div key={player.id} className="flex items-center gap-3 p-3">
                            <div className="text-xs font-bold text-slate-400">{idx + 1}</div>
                            <div className="flex-1 min-w-0 text-xs font-bold text-slate-200">{player.name}</div>
                            <div className="text-sm">{player.avatar}</div>
                        </div>
                    ))}
                </div>
            </div>
            <AdSpace position="جانبي" />
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-20">
          <div className="flex items-center justify-between bg-slate-800/30 border border-slate-800 rounded-lg p-3 mb-6 text-xs text-slate-400">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>حالة الخادم: <b>متصل (GameMonetize API)</b></span>
             </div>
             <button onClick={fetchGamesFromAutoFeed} disabled={isLoading} className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-50">
                <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                تحديث
             </button>
          </div>

          <div className="flex items-end justify-between mb-6">
             <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                   {activeCategory === "الكل" ? "أحدث الألعاب في تكي قيمز" : `ألعاب ${activeCategory}`}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    {isLoading ? "جاري البحث عن ألعاب جديدة..." : `تم تحميل ${filteredGames.length} لعبة`}
                </p>
             </div>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                   <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-800"></div>
                ))}
             </div>
          ) : (
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
                            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-20"><span className="text-6xl">🎮</span></div>
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                                <Star size={10} className="text-yellow-400 fill-yellow-400" /> {game.rating}
                            </div>
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                                <button className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/40">
                                    <Play size={24} className="fill-current ml-1" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white truncate text-lg group-hover:text-emerald-400 transition-colors pr-1">{game.title}</h3>
                                <div className="bg-slate-700/50 px-2 py-0.5 rounded text-[10px] text-slate-400 border border-slate-700 whitespace-nowrap">{game.category}</div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-3 border-t border-slate-700/50">
                                <div className="flex items-center gap-1.5"><User size={12} /> <span>{game.players}</span></div>
                                <div className="flex items-center gap-1.5 text-emerald-400"><Target size={12} /> <span>+{game.xpReward} XP</span></div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
                ))}
            </div>
          )}
        </main>
      </div>

      {selectedGame && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f172a]">
            <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-lg z-10">
                <div className="flex items-center gap-4">
                    <button onClick={closeGame} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-3 border-r border-slate-800 pr-4 mr-2">
                        <h3 className="font-bold text-white text-sm">{selectedGame.title}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="bg-slate-800 px-3 py-1 rounded text-xs text-white font-mono">{Math.floor(playTime / 60)}:{String(playTime % 60).padStart(2, '0')}</div>
                </div>
            </div>

            <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
                {gameLoading ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-emerald-400 font-bold animate-pulse">جاري تحميل اللعبة...</p>
                    </div>
                ) : (
                    <iframe 
                        className="w-full h-full border-none"
                        title={selectedGame.title}
                        src={selectedGame.url} 
                        allow="autoplay; fullscreen; gamepad; gyroscope; accelerometer; clipboard-write"
                        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-pointer-lock"
                    />
                )}
            </div>
            <div className="bg-slate-900 border-t border-slate-800 p-2 flex justify-center">
                 <div className="w-[728px] h-[90px] bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs rounded">
                     إعلان Google Ads
                 </div>
            </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md overflow-hidden relative p-8 text-center">
                <button onClick={() => setShowLoginModal(false)} className="absolute top-4 left-4 text-slate-400 hover:text-white"><X size={20}/></button>
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-emerald-500/50">
                    <User size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
                <p className="text-slate-400 text-sm mb-8">سجل دخولك لحفظ النقاط والمراكز في تكي قيمز.</p>
                <form onSubmit={handleLogin} className="space-y-4 text-right">
                    <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white" placeholder="اسم المستخدم" required />
                    <input type="password" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white" placeholder="كلمة المرور" required />
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl mt-4">دخول</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
