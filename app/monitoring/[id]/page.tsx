"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, ExternalLink, Link as LinkIcon, Shuffle } from 'lucide-react';
import Link from 'next/link';

export default function ArticleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string);
    }
  }, [params.id]);

  const fetchArticle = async (id: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reports/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Failed to fetch article details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-400">Loading details...</div>;
  }

  if (!article) {
    return (
      <div className="p-8 text-gray-400">
        Article not found. <button onClick={() => router.back()} className="text-blue-500">Go back</button>
      </div>
    );
  }

  const totalScore = typeof article.credibility_score === 'number' ? Math.round(article.credibility_score) : 35;

  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  let scoreColor = "text-red-500";
  let scoreBg = "stroke-red-500";
  let scoreLabel = "अत्यधिक संदेहास्पद (HIGHLY MALICIOUS)";
  
  if (totalScore > 70) {
    scoreColor = "text-green-500";
    scoreBg = "stroke-green-500";
    scoreLabel = "विश्वसनीय (CREDIBLE)";
  } else if (totalScore > 40) {
    scoreColor = "text-yellow-500";
    scoreBg = "stroke-yellow-500";
    scoreLabel = "मिश्रित (MIXED)";
  }

  let evaluations = article.logic_evaluations || [];
  if (typeof evaluations === 'string') {
    try { evaluations = JSON.parse(evaluations); } catch(e) {}
  }

  const sliders = evaluations.length > 0 ? evaluations.map((e: any) => ({
    label: "Logic Match",
    desc: e.logic_text,
    val: e.matched ? Math.round(e.confidence * 20) : 0
  })) : [
    { label: "स्रोत प्रामाणिकता (Source Authenticity)", desc: "स्रोत प्राथमिक है या तृतीयक? उसके पीछे छिपे असली फंडिंग सोर्स का स्तर क्या है।", val: 7 },
    { label: "स्रोत सुसंगति (Recommendation Consistency)", desc: "क्या विभिन्न उद्धृत स्रोतों के दावों में गंभीर विरोधाभास व विषयांतर मौजूद हैं?", val: 6 },
    { label: "जानबूझकर भटकाव / नेरेटिव सेटिंग (Deliberate Digression)", desc: "क्या विषयांतर सुनियोजित रूप से भारत के संदर्भ में नकारात्मक नेरेटिव सेट करता है?", val: 8 },
    { label: "लेखक का पैटर्न (Author Pattern)", desc: "क्या लेखक का इतिहास एकतरफा विमर्श को बढ़ावा देता है?", val: 5 },
    { label: "फंडिंग व मालिकाना हक़ (Funding & Ownership)", desc: "क्या प्रकाशन संस्थान को भारत-विरोधी विदेशी अनुदान प्राप्त होता है?", val: 9 }
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft size={16} /> वापस जाएं (Back)
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{article.headline || article.title}</h2>
        <div className="text-gray-400 text-sm flex items-center gap-4">
          <span className="bg-[#202124] px-2 py-1 rounded border border-[#2d2e33]">{article.source_domain || article.source_name || article.source_id || '-'}</span>
          <span>{article.evaluated_at || article.ingested_at ? new Date(article.evaluated_at || article.ingested_at).toLocaleDateString() : 'N/A'}</span>
          {article.raw_file_url && (
            <a href={article.raw_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 flex items-center gap-1 hover:underline">
              <ExternalLink size={14} /> मूल फ़ाइल देखें
            </a>
          )}
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Source Chain Visualizer */}
        <div className="bg-[#1a1b1e] border border-[#2d2e33] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">बहु-आयामी स्रोत श्रृंखला विज़ुअलाइज़र (Primary, Secondary & Tertiary Sources Chain)</h3>
          
          <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
            {/* Primary */}
            <div className="flex-1 bg-[#111113] border border-[#2d2e33] rounded-xl p-5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">NGO Funded</div>
              <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider text-center">प्राथमिक स्रोत (PRIMARY)</p>
              <h4 className="text-white font-bold text-center mb-1">Western Alliance Think-Tank</h4>
              <p className="text-gray-400 text-xs text-center">Sponsor of division studies</p>
            </div>

            <ArrowRightIcon />

            {/* Secondary */}
            <div className="flex-1 bg-[#111113] border border-[#2d2e33] rounded-xl p-5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">Translated Feed</div>
              <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider text-center">द्वितीयक स्रोत (SECONDARY)</p>
              <h4 className="text-white font-bold text-center mb-1">Global Syndicate Press</h4>
              <p className="text-gray-400 text-xs text-center">Syndicated media distribution</p>
            </div>

            <ArrowRightIcon />

            {/* Tertiary */}
            <div className="flex-1 bg-[#111113] border border-[#2d2e33] rounded-xl p-5 relative border-b-4 border-b-blue-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">Local Affiliate</div>
              <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider text-center">तृतीयक स्रोत (TERTIARY)</p>
              <h4 className="text-white font-bold text-center mb-1">The National Daily Post</h4>
              <p className="text-gray-400 text-xs text-center">Regional online publisher</p>
            </div>
          </div>
        </div>

        {/* Dashboard Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Score Ring & Factors */}
          <div className="col-span-4 bg-[#1a1b1e] border border-[#2d2e33] rounded-xl p-6 flex flex-col items-center justify-center relative shadow-lg shadow-black/20">
            
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" className="stroke-[#2d2e33] fill-none" strokeWidth="8" />
                <circle 
                  cx="70" 
                  cy="70" 
                  r="60" 
                  className={`${scoreBg} fill-none drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out`} 
                  strokeWidth="8" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                />
              </svg>
              {/* Inner Text */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-white leading-none">{totalScore}</span>
                <span className="text-sm text-gray-500 font-bold mt-1">/100</span>
              </div>
            </div>

            <div className={`mt-6 font-bold tracking-widest ${scoreColor}`}>
              {scoreLabel}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 w-full">
              <div className="bg-[#111113] border border-[#2d2e33] rounded p-3 text-center">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">लाभार्थी देश / संस्था</span>
                <span className="text-sm text-gray-300 font-medium">Western Lobbies</span>
              </div>
              <div className="bg-[#111113] border border-[#2d2e33] rounded p-3 text-center">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">लेखन का दृष्टिकोण</span>
                <span className="text-sm text-gray-300 font-medium">Normative (छद्म आदर्शवाद)</span>
              </div>
              <div className="bg-[#111113] border border-[#2d2e33] rounded p-3 text-center">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">राजनीतिक लाभार्थी</span>
                <span className="text-sm text-gray-300 font-medium">Left-leaning fronts</span>
              </div>
              <div className="bg-[#111113] border border-[#2d2e33] rounded p-3 text-center">
                <span className="text-[10px] text-gray-500 uppercase block mb-1">आर्थिक लाभ / लाभार्थी</span>
                <span className="text-sm text-gray-300 font-medium">Controlled markets</span>
              </div>
            </div>

          </div>

          {/* Right Column: Scoring Sliders */}
          <div className="col-span-8 bg-[#1a1b1e] border border-[#2d2e33] rounded-xl p-8 shadow-lg shadow-black/20">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">बहु-आयामी विश्वसनीयता अंशांकन (Scoring Configuration)</h3>
              </div>
              <p className="text-xs text-gray-400 max-w-[200px] text-right">अधिकारी इन स्लाइडर्स को डेटा साक्ष्य के आधार पर ओवरराइड कर सकते हैं।</p>
            </div>

            <div className="space-y-8">
              {sliders.map((slider, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                      <LinkIcon size={14} className="text-gray-500" /> {slider.label}
                    </h4>
                    <span className="text-sm font-bold text-orange-400">{slider.val}/20</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3">{slider.desc}</p>
                  
                  {/* Slider Track */}
                  <div className="h-1.5 w-full bg-[#111113] rounded-full overflow-hidden relative">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" 
                      style={{ width: `${(slider.val / 20) * 100}%` }}
                    ></div>
                  </div>
                  {/* Slider Thumb (Visual Only) */}
                  <div className="relative w-full -mt-2">
                    <div 
                      className="absolute w-3 h-3 bg-orange-400 rounded-full border-2 border-[#1a1b1e] shadow transform -translate-x-1.5"
                      style={{ left: `${(slider.val / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <div className="text-[#2d2e33]">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>
  );
}
