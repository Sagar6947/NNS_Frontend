import Link from 'next/link';
import { 
  BarChart3, 
  Search, 
  Scale, 
  Megaphone, 
  FileText, 
  Share2, 
  UploadCloud, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#1a1b1e] border-r border-[#2d2e33] flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-orange-500/20 text-orange-500 flex items-center justify-center">
          <Search size={20} />
        </div>
        <h1 className="font-bold text-orange-500 text-xl tracking-tight">नेरेटिव सुरक्षा (NNS)</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {/* <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <BarChart3 size={20} />
          <span>सामान्य अवलोकन<br/><span className="text-xs opacity-70">(Overview)</span></span>
        </Link> */}
        
        <Link href="/monitoring" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Search size={20} />
          <span>न्यूज़ मॉनिटरिंग (C1)</span>
        </Link>

        {/* <Link href="/credibility" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Scale size={20} />
          <span>क्रेडिबिलिटी स्कोरर<br/><span className="text-xs opacity-70">(C2)</span></span>
        </Link> */}

        {/* <Link href="/counter" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Megaphone size={20} />
          <span>काउंटर नेरेटिव (C3)</span>
        </Link> */}

        <Link href="/epaper" className="flex items-center gap-3 px-4 py-3 text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-lg transition-colors font-medium">
          <FileText size={20} />
          <span>ई-पेपर (C1.1)</span>
        </Link>

        {/* <Link href="/social" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Share2 size={20} />
          <span>सोशल मीडिया (C1.3)</span>
        </Link> */}

        {/* <Link href="/upload" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <UploadCloud size={20} />
          <span>डायरेक्ट अपलोड<br/><span className="text-xs opacity-70">(C1.4)</span></span>
        </Link> */}

        {/* <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <Settings size={20} />
          <span>सिस्टम सेटिंग्स<br/><span className="text-xs opacity-70">(Settings)</span></span>
        </Link> */}
      </nav>

      <div className="p-4 m-4 rounded-lg bg-[#202124] border border-[#2d2e33]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-500 font-medium text-sm">लाइव सुरक्षा सक्रिय</span>
        </div>
        <p className="text-xs text-gray-500">५० पोर्टल और २०० कीवर्ड्स निरंतर स्कैनिंग पर लगे हैं।</p>
      </div>
    </div>
  );
}
