"use client";

import { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceId, setSourceId] = useState('dainik_bhaskar');
  const [cityEdition, setCityEdition] = useState('bhopal');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('error');
      setMessage('कृपया एक फाइल चुनें (Please select a file)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('source_id', sourceId);
    formData.append('city_edition', cityEdition);

    setStatus('uploading');
    setMessage('फ़ाइल अपलोड की जा रही है और OpenAI द्वारा विश्लेषण किया जा रहा है... (Uploading and analyzing via OpenAI...)');
    setArticles([]);

    try {
      // Connect to the backend API running on port 5001
      const response = await axios.post('http://localhost:5001/api/upload-epaper', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus('success');
      setMessage(`सफलता! ${response.data.articleCount} लेख निकाले गए। (Success! ${response.data.articleCount} articles extracted.)`);
      setArticles(response.data.articles);
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(error.response?.data?.error || 'अपलोड में त्रुटि हुई। (Error during upload.)');
    }
  };

  return (
    <div className="bg-[#1a1b1e] border border-[#2d2e33] rounded-xl overflow-hidden mt-6 shadow-lg shadow-black/20">
      <div className="p-4 border-b border-[#2d2e33] flex items-center gap-2 bg-[#202124]">
        <FileIcon className="text-blue-400" />
        <h3 className="font-semibold text-blue-400">ई-पेपर मैन्युअल अपलोड (Manual Upload PDF)</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-400">
          सीधे स्थानीय ई-पेपर पीडीएफ/छवि फ़ाइल अपलोड करके विश्लेषण प्रक्रिया प्रारंभ करें। अपलोड के बाद OCR और OpenAI द्वारा लेख Articles DB में जोड़ा जाएगा।
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Source / Publication:</label>
            <select 
              className="w-full bg-[#111113] border border-[#2d2e33] rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
            >
              <option value="dainik_bhaskar">Dainik Bhaskar</option>
              <option value="hindustan">Hindustan</option>
              <option value="thewire">The Wire</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">City Edition:</label>
            <select 
              className="w-full bg-[#111113] border border-[#2d2e33] rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none"
              value={cityEdition}
              onChange={(e) => setCityEdition(e.target.value)}
            >
              <option value="bhopal">Bhopal</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Select PDF or Image:</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#2d2e33] border-dashed rounded-lg cursor-pointer hover:bg-[#202124] transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
            </label>
          </div>
          {file && (
            <div className="text-sm text-green-400 mt-2 flex items-center gap-2">
              <CheckCircle2 size={16} /> Selected: {file.name}
            </div>
          )}
        </div>

        {status !== 'idle' && (
          <div className={`p-4 rounded-lg flex items-start gap-3 border ${
            status === 'uploading' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
            status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
            'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {status === 'uploading' && <Loader2 className="animate-spin mt-0.5" size={18} />}
            {status === 'success' && <CheckCircle2 className="mt-0.5" size={18} />}
            {status === 'error' && <AlertCircle className="mt-0.5" size={18} />}
            <div className="text-sm">{message}</div>
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || status === 'uploading'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {status === 'uploading' ? 'Processing...' : 'Upload & Analyze File'}
        </button>

        {articles.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold text-gray-200 border-b border-[#2d2e33] pb-2">Extracted Articles</h4>
            {articles.map((article, idx) => (
              <div key={idx} className="bg-[#111113] p-4 rounded-lg border border-[#2d2e33]">
                <h5 className="font-bold text-orange-400">{article.title || 'Untitled Article'}</h5>
                {article.subtitle && <p className="text-sm text-gray-400 mt-1">{article.subtitle}</p>}
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#202124] p-2 rounded">
                    <span className="text-gray-500 block mb-1">Tone</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      article.narrative_tone === 'anti-national' ? 'bg-red-500/20 text-red-400' : 
                      article.narrative_tone === 'national' ? 'bg-green-500/20 text-green-400' : 
                      'bg-gray-500/20 text-gray-400'
                    }`}>{article.narrative_tone}</span>
                  </div>
                  <div className="bg-[#202124] p-2 rounded">
                    <span className="text-gray-500 block mb-1">Keywords</span>
                    <div className="flex flex-wrap gap-1">
                      {(article.matched_keywords || []).map((kw: string, i: number) => (
                        <span key={i} className="bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px]">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mt-3 bg-[#202124] p-3 rounded border border-[#2d2e33]/50">
                  <span className="text-gray-500 text-xs block mb-1 font-medium">Purpose Judgment</span>
                  {article.purpose_judgment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
      <path d="M10 9H8"/>
    </svg>
  );
}
