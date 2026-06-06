"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Shield, Plus, Trash2, Key, Users, BookOpen } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('keywords'); // keywords | clusters | sources
  
  const [keywords, setKeywords] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  
  const [newKeyword, setNewKeyword] = useState({ text: '', synonyms: '' });
  const [newCluster, setNewCluster] = useState({ name: '', keyword_ids: [] as number[] });
  const [newSource, setNewSource] = useState({ source_id: '', source_type: 'epaper', name: '' });

  // Dummy logic state per keyword for UI simplicity
  const [newLogic, setNewLogic] = useState<{ [key: number]: string }>({});

  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/settings`;

  const getHeaders = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nns_token');
      if (token) {
        return { headers: { 'Authorization': `Bearer ${token}` } };
      }
    }
    return { headers: {} };
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'keywords') {
        const res = await axios.get(`${API_BASE}/keywords`, getHeaders());
        setKeywords(res.data);
      } else if (activeTab === 'clusters') {
        const res = await axios.get(`${API_BASE}/clusters`, getHeaders());
        setClusters(res.data);
      } else if (activeTab === 'sources') {
        const res = await axios.get(`${API_BASE}/sources`, getHeaders());
        setSources(res.data);
      }
    } catch (e: any) {
      console.error('Fetch error:', e);
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        router.push('/login');
      }
    }
  };

  const handleAddKeyword = async () => {
    try {
      await axios.post(`${API_BASE}/keywords`, {
        text: newKeyword.text,
        synonyms: newKeyword.synonyms ? newKeyword.synonyms.split(',').map(s=>s.trim()) : []
      }, getHeaders());
      setNewKeyword({ text: '', synonyms: '' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteKeyword = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/keywords/${id}`, getHeaders());
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleAddLogic = async (keywordId: number) => {
    try {
      const criteria = newLogic[keywordId];
      if (!criteria) return;
      await axios.post(`${API_BASE}/keywords/${keywordId}/logics`, { criteria }, getHeaders());
      setNewLogic({ ...newLogic, [keywordId]: '' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleAddCluster = async () => {
    try {
      await axios.post(`${API_BASE}/clusters`, newCluster, getHeaders());
      setNewCluster({ name: '', keyword_ids: [] });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteCluster = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/clusters/${id}`, getHeaders());
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleAddSource = async () => {
    try {
      await axios.post(`${API_BASE}/sources`, newSource, getHeaders());
      setNewSource({ source_id: '', source_type: 'epaper', name: '' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/sources/${id}`, getHeaders());
      fetchData();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="text-orange-500" />
          सिस्टम सेटिंग्स (Master Settings)
        </h1>
        <p className="text-gray-400">Manage keywords, logics, and sources for the Narrative Security System.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-[#2d2e33] pb-4">
        <button 
          onClick={() => setActiveTab('keywords')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'keywords' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-400 hover:text-white'}`}>
          <Key size={18} /> Keywords & Logic
        </button>
        <button 
          onClick={() => setActiveTab('clusters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'clusters' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-400 hover:text-white'}`}>
          <Users size={18} /> Clusters
        </button>
        <button 
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'sources' ? 'bg-orange-500/20 text-orange-500' : 'text-gray-400 hover:text-white'}`}>
          <BookOpen size={18} /> Source Registry
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-[#1a1b1e] border border-[#2d2e33] p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Keyword</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Keyword" 
                  className="bg-[#202124] border border-[#2d2e33] rounded px-4 py-2 text-white flex-1"
                  value={newKeyword.text}
                  onChange={(e) => setNewKeyword({...newKeyword, text: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Synonyms (comma separated)" 
                  className="bg-[#202124] border border-[#2d2e33] rounded px-4 py-2 text-white flex-1"
                  value={newKeyword.synonyms}
                  onChange={(e) => setNewKeyword({...newKeyword, synonyms: e.target.value})}
                />
                <button 
                  onClick={handleAddKeyword}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded flex items-center gap-2">
                  <Plus size={18} /> Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keywords.map((kw, idx) => (
                <div key={idx} className="bg-[#1a1b1e] border border-[#2d2e33] p-6 rounded-xl relative">
                  <button onClick={() => handleDeleteKeyword(kw.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>
                  <h4 className="text-xl font-bold text-orange-400 mb-2">{kw.text}</h4>
                  <p className="text-sm text-gray-400 mb-4">Synonyms: {JSON.parse(kw.synonyms || '[]').join(', ') || 'None'}</p>
                  
                  <div className="bg-[#202124] p-4 rounded-lg">
                    <h5 className="text-sm font-semibold text-white mb-2">Evaluation Logics:</h5>
                    <ul className="list-disc pl-5 text-sm text-gray-400 mb-4 space-y-1">
                      {kw.logics && kw.logics.map((l: any, i: number) => (
                        <li key={i}>{l.criteria}</li>
                      ))}
                      {(!kw.logics || kw.logics.length === 0) && <li className="text-gray-600 italic">No logics defined.</li>}
                    </ul>
                    
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add new criteria..." 
                        className="bg-[#111113] border border-[#2d2e33] rounded px-3 py-1 text-white text-sm flex-1"
                        value={newLogic[kw.id] || ''}
                        onChange={(e) => setNewLogic({...newLogic, [kw.id]: e.target.value})}
                      />
                      <button onClick={() => handleAddLogic(kw.id)} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 px-3 py-1 rounded text-sm font-medium">Add Logic</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clusters' && (
          <div className="space-y-6">
            <div className="bg-[#1a1b1e] border border-[#2d2e33] p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Cluster</h3>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="Cluster Name" 
                  className="bg-[#202124] border border-[#2d2e33] rounded px-4 py-2 text-white flex-1"
                  value={newCluster.name}
                  onChange={(e) => setNewCluster({...newCluster, name: e.target.value})}
                />
                <button 
                  onClick={handleAddCluster}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded flex items-center gap-2">
                  <Plus size={18} /> Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clusters.map((c, idx) => (
                <div key={idx} className="bg-[#1a1b1e] border border-[#2d2e33] p-6 rounded-xl relative">
                  <button onClick={() => handleDeleteCluster(c.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500"><Trash2 size={18} /></button>
                  <h4 className="text-xl font-bold text-white mb-2">{c.name}</h4>
                  <p className="text-sm text-gray-400">Keyword IDs: {JSON.parse(c.keyword_ids || '[]').join(', ') || 'None'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="bg-[#1a1b1e] border border-[#2d2e33] p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Register New Source</h3>
              <div className="flex flex-wrap gap-4">
                <input 
                  type="text" 
                  placeholder="Unique Source ID (e.g. the_hindu)" 
                  className="bg-[#202124] border border-[#2d2e33] rounded px-4 py-2 text-white flex-1 min-w-[200px]"
                  value={newSource.source_id}
                  onChange={(e) => setNewSource({...newSource, source_id: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Display Name" 
                  className="bg-[#202124] border border-[#2d2e33] rounded px-4 py-2 text-white flex-1 min-w-[200px]"
                  value={newSource.name}
                  onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                />
                <select 
                  className="bg-[#202124] border border-[#2d2e33] rounded px-4 py-2 text-white"
                  value={newSource.source_type}
                  onChange={(e) => setNewSource({...newSource, source_type: e.target.value})}
                >
                  <option value="epaper">E-Paper</option>
                  <option value="portal">News Portal</option>
                  <option value="social_x">Social X</option>
                  <option value="social_instagram">Social Instagram</option>
                  <option value="social_meta">Social Meta</option>
                  <option value="social_linkedin">Social LinkedIn</option>
                </select>
                <button 
                  onClick={handleAddSource}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded flex items-center gap-2">
                  <Plus size={18} /> Register
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-[#2d2e33] rounded-xl bg-[#1a1b1e]">
              <table className="w-full text-left">
                <thead className="bg-[#202124] text-xs uppercase text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Source ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2e33]">
                  {sources.map((s, idx) => (
                    <tr key={idx} className="hover:bg-[#202124]/50">
                      <td className="px-6 py-4 text-white font-mono text-sm">{s.source_id}</td>
                      <td className="px-6 py-4 text-gray-300 font-medium">{s.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs">
                          {s.source_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDeleteSource(s.source_id)} className="text-gray-500 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
