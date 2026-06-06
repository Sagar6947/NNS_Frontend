"use client";

import { useEffect, useState } from 'react';
import { Download, Play, AlertTriangle, Search, Filter, Expand, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import MultiSelectDropdown from '@/components/MultiSelectDropdown';

export default function MonitoringPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtersData, setFiltersData] = useState({ keywords: [], sources: [], sourceTypes: [], tones: [] });
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<string[]>([]);
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchArticles();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, selectedKeywords, selectedSources, selectedSourceTypes, selectedTones, searchQuery]);

  const fetchFilters = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/articles/filters`);
      setFiltersData({
        keywords: res.data.keywords.map((k: string) => ({ id: k, name: k })),
        sources: res.data.sources,
        sourceTypes: res.data.sourceTypes,
        tones: res.data.tones
      });
    } catch (err) {
      console.error("Failed to fetch filters", err);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: searchQuery,
      });
      if (selectedKeywords.length) params.append('keywords', JSON.stringify(selectedKeywords));
      if (selectedSources.length) params.append('sources', JSON.stringify(selectedSources));
      if (selectedSourceTypes.length) params.append('sourceTypes', JSON.stringify(selectedSourceTypes));
      if (selectedTones.length) params.append('tones', JSON.stringify(selectedTones));

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/articles?${params.toString()}`);
      setArticles(response.data.articles || response.data);
      setTotalPages(response.data.totalPages || 1);
      setTotalRecords(response.data.total || (response.data.articles ? response.data.articles.length : response.data.length));
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getToneVisual = (tone: string) => {
    switch (tone) {
      case 'anti-national':
        return <div className="border border-red-500/50 bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><AlertTriangle size={12} /> भारत विरोधी</div>;
      case 'national':
        return <div className="border border-green-500/50 bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs w-fit">राष्ट्र समर्थक</div>;
      default:
        return <div className="border border-gray-500/50 bg-gray-500/10 text-gray-400 px-2 py-1 rounded text-xs w-fit">तटस्थ</div>;
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">घटक १: लाइव न्यूज़ मॉनिटरिंग एवं नेरेटिव मार्किंग</h2>
          <p className="text-gray-400 text-sm">AI तकनीक द्वारा कीवर्ड चिन्हित न्यूज़ की पहचान और भारत-विरोधी विमर्श का स्वचालित आकलन</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#202124] border border-[#2d2e33] hover:bg-[#2d2e33] text-gray-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
            <Download size={16} /> समीक्षा रिपोर्ट डाउनलोड (PDF)
          </button>
          <button className="flex items-center gap-2 bg-[#d35400] hover:bg-[#e67e22] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-lg shadow-orange-500/20">
            <Play size={16} /> लाइव स्कैन चलाएं (C1)
          </button>
        </div>
      </div>

      {/* High Priority Alert Box */}
      <div className="mb-8 border border-red-500/30 bg-[#2a1111] p-4 rounded-lg flex items-center gap-3">
        <div className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 tracking-wide">
          <AlertTriangle size={14} /> अति-महत्वपूर्ण अलर्ट
        </div>
        <p className="text-red-200 text-sm">अलर्ट: प्रमुख विदेशी पोर्टल पर मूलनिवासी विमर्श को लेकर भ्रामक ऐतिहासिक लेख लाइव किया गया।</p>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#1a1b1e] border border-[#2d2e33] rounded-xl overflow-hidden shadow-lg shadow-black/20">

        {/* Filters */}
        <div className="p-4 border-b border-[#2d2e33] bg-[#111113] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 items-center flex-1">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">कीवर्ड (Keywords):</span>
              <div className="w-[180px] xl:w-[220px]">
                <MultiSelectDropdown 
                  options={filtersData.keywords} 
                  selectedValues={selectedKeywords} 
                  onChange={(vals) => { setSelectedKeywords(vals); setPage(1); }} 
                  placeholder="Select Keywords..." 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">स्रोत का प्रकार (Source Type):</span>
              <div className="w-[180px] xl:w-[220px]">
                <MultiSelectDropdown 
                  options={filtersData.sourceTypes || []} 
                  selectedValues={selectedSourceTypes} 
                  onChange={(vals) => { setSelectedSourceTypes(vals); setPage(1); }} 
                  placeholder="Select Type..." 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">स्रोत (Sources):</span>
              <div className="w-[180px] xl:w-[220px]">
                <MultiSelectDropdown 
                  options={filtersData.sources} 
                  selectedValues={selectedSources} 
                  onChange={(vals) => { setSelectedSources(vals); setPage(1); }} 
                  placeholder="Select Sources..." 
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">नेरेटिव टोन:</span>
              <div className="w-[180px] xl:w-[220px]">
                <MultiSelectDropdown 
                  options={filtersData.tones} 
                  selectedValues={selectedTones} 
                  onChange={(vals) => { setSelectedTones(vals); setPage(1); }} 
                  placeholder="Select Tone..." 
                />
              </div>
            </div>
          </div>

          <div className="relative flex items-center gap-4 w-full xl:w-auto mt-2 xl:mt-0 justify-between xl:justify-end">
            <div className="text-sm text-gray-400 font-medium whitespace-nowrap shrink-0">कुल न्यूज़: {totalRecords}</div>
            <div className="relative w-full xl:w-auto">
              <input
                type="text"
                placeholder="शीर्षक में खोजें..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="bg-[#202124] border border-[#2d2e33] text-gray-300 text-sm rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:border-blue-500 w-full xl:w-[250px]"
              />
              <Search className="absolute left-3 top-2 text-gray-500" size={14} />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#202124] text-xs uppercase text-gray-500 border-b border-[#2d2e33]">
              <tr>
                <th className="px-4 py-4 font-semibold whitespace-nowrap">क्र.सं. (S.No.)</th>
                <th className="px-4 py-4 font-semibold whitespace-nowrap">दिनांक</th>
                <th className="px-4 py-4 font-semibold">समाचार स्रोत</th>
                <th className="px-4 py-4 font-semibold">कीवर्ड</th>
                <th className="px-4 py-4 font-semibold w-1/4">समाचार का शीर्षक</th>
                <th className="px-4 py-4 font-semibold">उद्देश्य (PURPOSE)</th>
                <th className="px-4 py-4 font-semibold text-center">आर्थिक टोन</th>
                <th className="px-4 py-4 font-semibold text-center">राजनीतिक टोन</th>
                <th className="px-4 py-4 font-semibold text-center">जनसांख्यिकी विभाजन?</th>
                <th className="px-4 py-4 font-semibold text-center">प्रतीक आघात?</th>
                <th className="px-4 py-4 font-semibold">विशेष रिपोर्ट?</th>
                <th className="px-4 py-4 font-semibold text-center">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d2e33]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[#2d2e33]">
                    <td colSpan={12} className="px-4 py-4">
                      <div className="h-12 bg-[#2d2e33]/50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-gray-500">कोई डेटा नहीं मिला (No data found)</td>
                </tr>
              ) : (
                articles.map((article, idx) => {
                  // Fallbacks and parsing for display since DB might have simple JSON strings
                  let keywords = [];
                  try { keywords = typeof article.matched_keywords === 'string' ? JSON.parse(article.matched_keywords) : article.matched_keywords || []; } catch (e) { }

                  return (
                    <tr key={article.article_id || idx} className="hover:bg-[#202124]/50 transition-colors">
                      <td className="px-4 py-4 text-center font-mono text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        {article.ingested_at ? format(new Date(article.ingested_at), 'yyyy-MM-dd') : 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-200">{article.source_name || article.source_id}</div>
                      </td>
                      <td className="px-4 py-4">
                        {keywords.length > 0 ? (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-medium tracking-wide uppercase">
                            {keywords[0]}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-white mb-1 line-clamp-2">{article.title || 'Untitled Article'}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{article.purpose_judgment}</div>
                      </td>
                      <td className="px-4 py-4">
                        {getToneVisual(article.narrative_tone)}
                      </td>
                      <td className="px-4 py-4 text-center text-xs">Capitalistic</td>
                      <td className="px-4 py-4 text-center text-xs">Left-wing</td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 font-bold text-xs rounded">YES</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2 py-1 bg-red-500/10 text-red-400 font-bold text-xs rounded">YES</span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-400">Humanity<br />International Report</td>
                      <td className="px-4 py-4 text-center">
                        <Link href={`/monitoring/${article.article_id}`} className="p-2 hover:bg-[#2d2e33] rounded-lg transition-colors text-gray-400 hover:text-white group relative inline-block">
                          <Expand size={16} />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">देखें</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[#2d2e33] bg-[#111113] flex items-center justify-between text-sm text-gray-400">
          <div>
            Showing {totalRecords === 0 ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, totalRecords)} of {totalRecords} entries
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 bg-[#202124] border border-[#2d2e33] rounded hover:bg-[#2d2e33] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-[#2d2e33] rounded text-white font-medium">{page} / {Math.max(1, totalPages)}</span>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages || totalPages === 0}
              className="p-1.5 bg-[#202124] border border-[#2d2e33] rounded hover:bg-[#2d2e33] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
