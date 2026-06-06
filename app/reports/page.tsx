"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, AlertTriangle, FileText, Download } from 'lucide-react';

export default function ReportsPage() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nns_token');
      if (token) return { headers: { 'Authorization': `Bearer ${token}` } };
    }
    return { headers: {} };
  }

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/reports/summary`, getHeaders());
      setReport(res.data);
    } catch (e: any) {
      console.error(e);
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-full flex flex-col animate-pulse">
        <div className="mb-8 border-b border-border-subtle pb-4">
          <div className="h-8 bg-border-subtle rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-border-subtle rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="h-32 bg-bg-panel rounded-xl border border-border-subtle"></div>
          <div className="h-32 bg-bg-panel rounded-xl border border-border-subtle"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-64 bg-bg-panel rounded-xl border border-border-subtle"></div>
          <div className="h-64 bg-bg-panel rounded-xl border border-border-subtle"></div>
          <div className="h-64 bg-bg-panel rounded-xl border border-border-subtle lg:col-span-2"></div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex justify-between items-start border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
            <BarChart3 className="text-blue-500" />
            Credibility & Narrative Reports (C4)
          </h1>
          <p className="text-text-muted">Auto-generated aggregate narrative metrics from normalized articles.</p>
        </div>
        <button className="bg-bg-card hover:bg-black/5 dark:hover:bg-white/5 border border-border-subtle text-text-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-bg-panel border border-border-subtle p-6 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="flex items-center gap-3 text-blue-500 mb-2">
            <FileText size={20} /> <h3 className="font-semibold">Total Processed</h3>
          </div>
          <p className="text-4xl font-bold text-text-primary">{report.total_articles}</p>
        </div>

        <div className="bg-bg-panel border border-border-subtle p-6 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20">
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <AlertTriangle size={20} /> <h3 className="font-semibold">Habitual Repeaters</h3>
          </div>
          <p className="text-4xl font-bold text-text-primary">{report.habitual_repeaters?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Keywords */}
        <div className="bg-bg-panel border border-border-subtle p-6 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20">
          <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border-subtle pb-2">
            <TrendingUp size={20} className="text-orange-500" /> 
            Top Evaluated Keywords
          </h3>
          <div className="space-y-4">
            {report.top_keywords?.map((kw: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-text-secondary font-medium">{kw.keyword}</span>
                <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-sm font-bold">
                  {kw.count} hits
                </span>
              </div>
            ))}
            {(!report.top_keywords || report.top_keywords.length === 0) && (
              <p className="text-sm text-text-muted">No keyword data available.</p>
            )}
          </div>
        </div>

        {/* Tone Distribution */}
        <div className="bg-bg-panel border border-border-subtle p-6 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20">
          <h3 className="text-xl font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">
            Overall Narrative Tone Distribution
          </h3>
          <div className="space-y-4 mt-6">
            {report.tone_distribution?.map((t: any, i: number) => {
              let color = 'bg-gray-500';
              if (t.narrative_tone === 'national') color = 'bg-green-500';
              if (t.narrative_tone === 'anti-national') color = 'bg-red-500';
              
              const percentage = report.total_articles > 0 ? Math.round((t.count / report.total_articles) * 100) : 0;
              
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary capitalize">{t.narrative_tone}</span>
                    <span className="text-text-muted">{percentage}% ({t.count})</span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-2 overflow-hidden border border-border-subtle">
                    <div className={`${color} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Repeaters */}
        <div className="bg-bg-panel border border-border-subtle p-6 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 lg:col-span-2">
          <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border-subtle pb-2">
            <AlertTriangle size={20} className="text-red-500" /> 
            Habitual Repeaters (Anti-National Offenses &gt; 2)
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-card text-xs uppercase text-text-muted font-medium border-b border-border-subtle">
                <tr>
                  <th className="px-6 py-4">Source ID</th>
                  <th className="px-6 py-4">Anti-National Articles</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {report.habitual_repeaters?.map((r: any, i: number) => (
                  <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-text-primary font-mono text-sm">{r.source_id}</td>
                    <td className="px-6 py-4 text-red-600 dark:text-red-400 font-bold">{r.anti_national_count}</td>
                    <td className="px-6 py-4">
                      <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-1 rounded text-xs">
                        Flagged for Review
                      </span>
                    </td>
                  </tr>
                ))}
                {(!report.habitual_repeaters || report.habitual_repeaters.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-text-muted">
                      No habitual repeaters detected recently. Excellent!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
