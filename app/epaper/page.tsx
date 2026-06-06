import UploadPanel from "@/components/UploadPanel";
import { KeyRound, RefreshCw, CheckCircle2 } from "lucide-react";

export default function EpaperPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-border-subtle pb-4">
        <h2 className="text-2xl font-bold text-text-primary mb-2">ई-पेपर ऑटोमेशन नियंत्रण (PDF Automation Panel)</h2>
        <p className="text-text-muted">Configure automated downloads or manually process e-paper editions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Automation Config & Upload */}
        <div className="space-y-6">
          
          {/* Step 1: Login Session */}
          <div className="bg-bg-panel border border-border-subtle rounded-xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 hidden">
            <div className="p-4 border-b border-border-subtle flex items-center gap-2 bg-bg-card">
              <KeyRound className="text-orange-500" size={20} />
              <h3 className="font-semibold text-orange-500">Step 1 — Capture Login Session</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1"><RefreshCw size={12}/> SCHEDULE: 04:30 IST DAILY</span>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1"><RefreshCw size={12}/> 3 RETRIES + BACKOFF</span>
                <span className="px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-semibold">SESSION PERSISTED</span>
              </div>
              
              <p className="text-sm text-text-muted mb-6">
                Click the button below to open a <strong>real browser window</strong>. Log in to your e-paper subscription once — the session is saved automatically for all future headless downloads.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Login Page URL:</label>
                  <input type="text" readOnly value="https://epaper.bhaskar.com/" className="w-full bg-bg-base border border-border-subtle rounded-lg p-3 text-sm text-text-secondary outline-none" />
                </div>
                
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3 text-green-400 text-sm">
                  <CheckCircle2 className="mt-0.5" size={16} />
                  <span>Session is managed by your browser. Ensure you are logged in on the opened tab.</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                    <KeyRound size={18} /> Open Browser & Log In
                  </button>
                  <button className="w-12 bg-bg-card hover:bg-black/5 dark:hover:bg-white/5 border border-border-subtle rounded-lg flex items-center justify-center transition-colors">
                    <RefreshCw size={18} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Panel */}
          <UploadPanel />

        </div>

        {/* Right Column: Terminal Logs */}
        <div className="bg-black/90 dark:bg-black border border-border-subtle rounded-xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 flex flex-col h-[800px]">
          <div className="p-4 border-b border-border-subtle bg-bg-panel flex justify-between items-center">
            <h3 className="font-semibold text-text-primary">लाइव डाउनलोड कंसोल एवं संकलित फाइलें (Logs & Output)</h3>
            <span className="text-[10px] text-text-muted font-mono tracking-widest uppercase">Scraping Engine Terminal</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-green-500/80 leading-relaxed">
            <div>[SYSTEM] ई-पेपर डाउनलोडर तैयार है। कृपया विवरण भरें और प्रारंभ करें।</div>
            {/* Logs will appear here */}
          </div>
        </div>

      </div>
    </div>
  );
}
