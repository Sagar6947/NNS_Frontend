"use client";

import { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function UploadPanel({ sourceType = 'epaper' }: { sourceType?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file');
  const [sourceId, setSourceId] = useState('');
  const [cityEdition, setCityEdition] = useState('bhopal');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const [availableSources, setAvailableSources] = useState<any[]>([]);

  useEffect(() => {
    fetchSources();
  }, [sourceType]);

  const fetchSources = async () => {
    try {
      const token = localStorage.getItem('nns_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/settings/sources`, { headers });
      
      const filtered = res.data.filter((s: any) => s.source_type === sourceType);
      setAvailableSources(filtered);
      
      if (filtered.length > 0) {
        setSourceId(filtered[0].source_id);
      }
    } catch (e) {
      console.error('Failed to fetch sources:', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (inputMode === 'file' && !file) {
      setStatus('error');
      setMessage('कृपया एक फाइल चुनें (Please select a file)');
      return;
    }
    if (inputMode === 'url' && !url) {
      setStatus('error');
      setMessage('कृपया एक URL दर्ज करें (Please enter a URL)');
      return;
    }

    const formData = new FormData();
    if (inputMode === 'file' && file) {
      formData.append('file', file);
    } else if (inputMode === 'url' && url) {
      formData.append('url', url);
    }
    
    formData.append('source_id', sourceId);
    formData.append('city_edition', cityEdition);
    formData.append('source_type', sourceType);

    setStatus('uploading');
    setMessage('प्राप्त किया जा रहा है और OpenAI द्वारा विश्लेषण किया जा रहा है... (Extracting and analyzing via OpenAI...)');
    setArticles([]);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/upload-epaper`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setStatus('success');
      setMessage(response.data.message || 'फ़ाइल अपलोड की गई। पृष्ठभूमि में विश्लेषण जारी है... (File queued for background processing...)');
      // We no longer receive 'articles' synchronously. They will show up in the monitoring tab later.
      setArticles([]);
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
        <h3 className="font-semibold text-blue-400">
          {sourceType === 'portal' 
            ? 'पोर्टल स्क्रीनशॉट अपलोड (Manual Portal Upload)'
            : 'ई-पेपर मैन्युअल अपलोड (Manual Upload PDF)'}
        </h3>
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
              {availableSources.length === 0 && <option value="">No sources registered</option>}
              {availableSources.map((s: any) => (
                <option key={s.source_id} value={s.source_id}>{s.name}</option>
              ))}
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

        {sourceType === 'portal' && (
          <div className="flex gap-4 mb-4 border-b border-[#2d2e33] pb-4">
            <button 
              onClick={() => setInputMode('file')}
              className={`text-sm font-semibold pb-2 border-b-2 ${inputMode === 'file' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Upload Screenshot
            </button>
            <button 
              onClick={() => setInputMode('url')}
              className={`text-sm font-semibold pb-2 border-b-2 ${inputMode === 'url' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Enter Article URL
            </button>
          </div>
        )}

        <div className="space-y-2">
          {inputMode === 'file' ? (
            <>
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
            </>
          ) : (
            <>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Article URL:</label>
              <input 
                type="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://example.com/news-article"
                className="w-full bg-[#111113] border border-[#2d2e33] rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none text-gray-200"
              />
            </>
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
          disabled={(inputMode === 'file' && !file) || (inputMode === 'url' && !url) || status === 'uploading'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {status === 'uploading' ? 'Queuing...' : (inputMode === 'file' ? 'Upload File' : 'Extract URL')}
        </button>

        {status === 'success' && (
           <div className="mt-4 p-4 bg-[#202124] rounded-lg border border-[#2d2e33]">
             <p className="text-sm text-gray-300 mb-2">
               Your file has been placed in the background processing queue. Our AI is now reading the text, extracting claims, and scoring the narratives against the defined master logics.
             </p>
             <p className="text-sm text-gray-400">
               Extracted articles will automatically appear in the <strong>न्यूज़ मॉनिटरिंग (C1)</strong> dashboard once normalization completes.
             </p>
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
