"use client";

import Link from 'next/link';
import { 
  BarChart3, 
  Search, 
  Scale, 
  Megaphone, 
  FileText, 
  Share2, 
  UploadCloud, 
  Settings,
  LogOut,
  MonitorPlay,
  Sun,
  Moon
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  if (pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('nns_token');
    localStorage.removeItem('nns_user');
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const getLinkClass = (path: string) => {
    return isActive(path)
      ? "flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-lg transition-colors font-medium"
      : "flex items-center gap-3 px-4 py-3 hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors";
  };

  return (
    <div className="w-64 h-screen bg-bg-panel border-r border-border-subtle flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-orange-500/20 text-orange-500 flex items-center justify-center">
          <Search size={20} />
        </div>
        <h1 className="font-bold text-orange-500 text-xl tracking-tight">नेरेटिव सुरक्षा (NNS)</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {/* <Link href="/" className={getLinkClass('/')}>
          <BarChart3 size={20} />
          <span>सामान्य अवलोकन<br/><span className="text-xs opacity-70">(Overview)</span></span>
        </Link> */}
        
        <Link href="/monitoring" className={getLinkClass('/monitoring')}>
          <Search size={20} />
          <span>न्यूज़ मॉनिटरिंग (C1)</span>
        </Link>

        {/* <Link href="/credibility" className={getLinkClass('/credibility')}>
          <Scale size={20} />
          <span>क्रेडिबिलिटी स्कोरर<br/><span className="text-xs opacity-70">(C2)</span></span>


        {/* <Link href="/counter" className={getLinkClass('/counter')}>
          <Megaphone size={20} />
          <span>काउंटर नेरेटिव (C3)</span>
        </Link> */}

        <Link href="/epaper" className={getLinkClass('/epaper')}>
          <FileText size={20} />
          <span>ई-पेपर (C1.1)</span>
        </Link>

        <Link href="/portal" className={getLinkClass('/portal')}>
          <MonitorPlay size={20} />
          <span>न्यूज़ पोर्टल (C1.2)</span>
        </Link>

        {/* <Link href="/social" className={getLinkClass('/social')}>
          <Share2 size={20} />
          <span>सोशल मीडिया (C1.3)</span>
        </Link> */}

        {/* <Link href="/reports" className={getLinkClass('/reports')}>
          <BarChart3 size={20} />
          <span>रिपोट्स (C4)</span>
        </Link> */}

        {/* <Link href="/upload" className={getLinkClass('/upload')}>
          <UploadCloud size={20} />
          <span>डायरेक्ट अपलोड<br/><span className="text-xs opacity-70">(C1.4)</span></span>
        </Link> */}

        <Link href="/settings" className={getLinkClass('/settings')}>
          <Settings size={20} />
          <span>सिस्टम सेटिंग्स<br/><span className="text-xs opacity-70">(Settings)</span></span>
        </Link>
      </nav>

      <div className="p-4 m-4 rounded-lg bg-bg-card border border-border-subtle">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-500 font-medium text-sm">लाइव सुरक्षा सक्रिय</span>
        </div>
        <p className="text-xs text-text-muted mb-4">५० पोर्टल और २०० कीवर्ड्स निरंतर स्कैनिंग पर लगे हैं।</p>
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex-1 flex items-center justify-center gap-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-text-primary py-2 rounded-lg transition-colors text-sm font-medium border border-border-subtle"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg transition-colors text-sm font-medium border border-red-500/20"
        >
          <LogOut size={16} /> Secure Logout
        </button>
      </div>
    </div>
  );
}
