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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/articles/${id}`);
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

  // Mock score breakdown out of 100 if none exists in DB
  const scoreData = article.credibility_score ? (typeof article.credibility_score === 'string' ? JSON.parse(article.credibility_score) : article.credibility_score) : {
    source_authenticity: 7,
    recommendation_consistency: 6,
    deliberate_digression: 8,
    author_pattern: 5,
    funding_ownership: 9
  };

  const totalScore = (scoreData.source_authenticity + scoreData.recommendation_consistency + scoreData.deliberate_digression + scoreData.author_pattern + scoreData.funding_ownership);
  // Default mock total is 35 as per the design if we use the default 7+6+8+5+9=35

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

  const sliders = [
    { label: "स्रोत प्रामाणिकता (Source Authenticity)", desc: "स्रोत प्राथमिक है या तृतीयक? उसके पीछे छिपे असली फंडिंग सोर्स का स्तर क्या है।", val: scoreData.source_authenticity },
    { label: "स्रोत सुसंगति (Recommendation Consistency)", desc: "क्या विभिन्न उद्धृत स्रोतों के दावों में गंभीर विरोधाभास व विषयांतर मौजूद हैं?", val: scoreData.recommendation_consistency },
    { label: "जानबूझकर भटकाव / नेरेटिव सेटिंग (Deliberate Digression)", desc: "क्या विषयांतर सुनियोजित रूप से भारत के संदर्भ में नकारात्मक नेरेटिव सेट करता है?", val: scoreData.deliberate_digression },
    { label: "लेखक का पैटर्न (Author Pattern)", desc: "क्या लेखक का इतिहास एकतरफा विमर्श को बढ़ावा देता है?", val: scoreData.author_pattern || 5 },
    { label: "फंडिंग व मालिकाना हक़ (Funding & Ownership)", desc: "क्या प्रकाशन संस्थान को भारत-विरोधी विदेशी अनुदान प्राप्त होता है?", val: scoreData.funding_ownership || 9 }
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm">
        <ArrowLeft size={16} /> वापस जाएं (Back)
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{article.title}</h2>
        <div className="text-gray-400 text-sm flex items-center gap-4">
          <span className="bg-[#202124] px-2 py-1 rounded border border-[#2d2e33]">{article.source_name || article.source_id}</span>
          <span>{article.ingested_at ? new Date(article.ingested_at).toLocaleDateString() : 'N/A'}</span>
          {article.raw_file_url && (
            <a 
              href={article.raw_file_url.startsWith('http') ? article.raw_file_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${article.raw_file_url.startsWith('/') ? '' : '/'}${article.raw_file_url}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-400 flex items-center gap-1 hover:underline"
            >
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

            <div className="flex flex-wrap gap-4 mt-8 w-full justify-center">
              {(() => {
                 try {
                    const bens = typeof article.beneficiary_tags === 'string' ? JSON.parse(article.beneficiary_tags) : article.beneficiary_tags;
                    if (!bens || bens.length === 0) return <div className="text-gray-500 text-sm">No beneficiaries extracted</div>;
                    return bens.map((b: string, i: number) => (
                       <div key={i} className="bg-[#111113] border border-[#2d2e33] rounded px-4 py-2 text-center">
                         <span className="text-[10px] text-gray-500 uppercase block mb-1">संभावित लाभार्थी (Beneficiary)</span>
                         <span className="text-sm text-gray-300 font-medium">{b}</span>
                       </div>
                    ));
                 } catch(e) {
                    return <div className="text-gray-500 text-sm">No beneficiaries extracted</div>;
                 }
              })()}
            </div>

          </div>

          {/* Right Column: Narrative Intelligence Details */}
          <div className="col-span-8 bg-[#1a1b1e] border border-[#2d2e33] rounded-xl p-8 shadow-lg shadow-black/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">नैरेटिव इंटेलिजेंस (Narrative Intelligence extracted by AI)</h3>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Purpose & Intent</h4>
                <p className="text-gray-200 bg-[#202124] border border-[#2d2e33] p-4 rounded-lg leading-relaxed text-sm">
                  {article.purpose_judgment || "No purpose judgment recorded."}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Matched Master Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                     try {
                        const kws = typeof article.matched_keywords === 'string' ? JSON.parse(article.matched_keywords) : article.matched_keywords;
                        if (!kws || kws.length === 0) return <span className="text-gray-500">None detected</span>;
                        return kws.map((k: string, i: number) => (
                           <span key={i} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded text-xs font-bold border border-orange-500/20">{k}</span>
                        ));
                     } catch(e) {
                        return <span className="text-gray-500">None detected</span>;
                     }
                  })()}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Extracted Claims</h4>
                <ul className="space-y-3">
                  {(() => {
                     try {
                        const claims = typeof article.claims === 'string' ? JSON.parse(article.claims) : article.claims;
                        if (!claims || claims.length === 0) return <li className="text-gray-500">No specific claims extracted</li>;
                        return claims.map((c: any, i: number) => (
                           <li key={i} className="bg-[#111113] border border-[#2d2e33] p-3 rounded-lg text-sm text-gray-300">
                             <div className="font-semibold text-white mb-1">Claim: {c.claim || c}</div>
                             {c.cited_source && <div className="text-xs text-blue-400 font-mono">Source cited: {c.cited_source}</div>}
                           </li>
                        ));
                     } catch(e) {
                        return <li className="text-gray-500">No specific claims extracted</li>;
                     }
                  })()}
                </ul>
              </div>

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
