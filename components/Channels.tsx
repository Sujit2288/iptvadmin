
import React, { useState } from 'react';
import { Channel, Category, Bouquet, ChannelSource } from '../types';

interface ChannelsProps {
  channels: Channel[];
  categories: Category[];
  bouquets: Bouquet[];
  onAdd: (channel: Channel) => void;
  onUpdate: (channel: Channel) => void;
  onDelete: (id: string) => void;
}

const Channels: React.FC<ChannelsProps> = ({ channels, categories, bouquets, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [sid, setSid] = useState('');
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [category, setCategory] = useState('');
  const [bouquet, setBouquet] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamType, setStreamType] = useState<'hls' | 'dash'>('hls');
  const [isDrmEnabled, setIsDrmEnabled] = useState(false);
  const [kid, setKid] = useState('');
  const [key, setKey] = useState('');

  const openAdd = () => {
    resetForm();
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (channel: Channel) => {
    setEditingId(channel.id);
    setSid(channel.sid);
    setName(channel.name);
    setImg(channel.img);
    setCategory(channel.category);
    setBouquet(channel.bouquet);
    
    const source = channel.sources[0];
    if (source) {
      setStreamUrl(source.url);
      setStreamType(source.type);
      setIsDrmEnabled(!!source.drm);
      setKid(source.drm?.kid || '');
      setKey(source.drm?.key || '');
    }
    
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const includeDrm = isDrmEnabled || streamType === 'dash';
    
    const source: ChannelSource = {
      name: "Server 1",
      url: streamUrl,
      type: streamType,
      ...(includeDrm && kid && key ? { drm: { kid, key } } : {})
    };

    const channelData: Channel = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      sid: sid || '0',
      name,
      img,
      category,
      bouquet,
      description: "India",
      sources: [source]
    };

    if (editingId) {
      onUpdate(channelData);
    } else {
      onAdd(channelData);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSid(''); setName(''); setImg(''); setCategory(''); setBouquet('');
    setStreamUrl(''); setStreamType('hls'); setIsDrmEnabled(false);
    setKid(''); setKey('');
  };

  return (
    <div className="space-y-10 animate-in duration-500">
      {/* Header Section */}
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
        <div>
          <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Broadcasting Grid</h3>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Live stream delivery infrastructure</p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center space-x-4 px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          <span className="material-icons text-2xl">add_circle</span>
          <span>Deploy Channel</span>
        </button>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {channels.map(channel => (
          <div key={channel.id} className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-3 transition-all duration-500">
            <div className="h-56 bg-slate-50 relative p-8 flex items-center justify-center border-b border-slate-50/50">
              <img src={channel.img} alt={channel.name} className="max-h-full max-w-full object-contain filter drop-shadow-2xl" />
              
              <div className="absolute top-6 right-6 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                  onClick={() => openEdit(channel)}
                  className="w-12 h-12 bg-white/90 backdrop-blur-xl text-blue-600 rounded-2xl transition-all hover:bg-blue-600 hover:text-white shadow-xl flex items-center justify-center"
                >
                  <span className="material-icons text-2xl">edit</span>
                </button>
                <button 
                  onClick={() => onDelete(channel.id)}
                  className="w-12 h-12 bg-white/90 backdrop-blur-xl text-red-500 rounded-2xl transition-all hover:bg-red-500 hover:text-white shadow-xl flex items-center justify-center"
                >
                  <span className="material-icons text-2xl">delete</span>
                </button>
              </div>

              <div className="absolute top-6 left-6 flex flex-col gap-3">
                 <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-xl shadow-2xl tracking-widest">
                    {channel.category}
                 </span>
                 {channel.sources[0]?.drm && (
                   <span className="px-4 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl shadow-2xl tracking-widest">
                     DRM
                   </span>
                 )}
                 <span className="px-4 py-1.5 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl shadow-2xl tracking-widest">
                    SID: {channel.sid}
                 </span>
              </div>
            </div>
            <div className="p-10">
              <h4 className="text-2xl font-black text-slate-800 tracking-tighter truncate mb-2">{channel.name}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] mb-6">
                PORTFOLIO: {channel.bouquet}
              </p>
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-[1.75rem] border border-slate-100">
                <span className="text-[11px] font-black px-3 py-1.5 bg-blue-100 text-blue-600 rounded-xl uppercase">
                  {channel.sources[0]?.type}
                </span>
                <span className="text-[10px] font-bold text-slate-400 truncate flex-1 font-mono">
                  {channel.sources[0]?.url}
                </span>
              </div>
            </div>
          </div>
        ))}
        {channels.length === 0 && (
          <div className="col-span-full py-60 text-center font-black text-slate-200 uppercase tracking-[0.8em] text-[22px]">
            No Broadcasts Active
          </div>
        )}
      </div>

      {/* MASTER CHANNEL DEPLOYMENT / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 sm:p-12 bg-slate-900/95 backdrop-blur-2xl overflow-hidden animate-in fade-in">
          <div className="bg-white rounded-[4.5rem] shadow-[0_0_200px_rgba(0,0,0,0.5)] w-full max-w-5xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/20">
            
            <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20 rounded-t-[4.5rem] flex-shrink-0">
              <div>
                <h4 className="text-5xl font-black text-slate-800 tracking-tighter">
                  {editingId ? 'Synchronize Node Parameters' : 'Deploy Broadcast Node'}
                </h4>
                <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mt-3 uppercase">
                  {editingId ? 'MODIFYING LIVE INGRESS CONFIGURATION' : 'ESTABLISHING GLOBAL INGRESS CONFIGURATION'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-20 h-20 bg-slate-50 hover:bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                <span className="material-icons text-5xl">close</span>
              </button>
            </div>
            
            <div className="p-14 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-16">
              
              {/* SECTION 1: Identity */}
              <div className="space-y-10">
                <h5 className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em] border-l-8 border-blue-600 pl-6">Broadcast Identity & SID</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <InputField label="Official Title" value={name} onChange={setName} placeholder="e.g. Zee TV" />
                  <InputField label="SID ID NO" value={sid} onChange={setSid} placeholder="e.g. 101" />
                  <InputField label="Asset Logo URL" value={img} onChange={setImg} placeholder="https://..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Grid Taxonomy</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:ring-8 focus:ring-blue-500/10 focus:bg-white transition-all text-xl font-black shadow-sm appearance-none cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">-- ALLOCATE CATEGORY --</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      <span className="material-icons absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-3xl">expand_more</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Content Portfolio</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:ring-8 focus:ring-blue-500/10 focus:bg-white transition-all text-xl font-black shadow-sm appearance-none cursor-pointer"
                        value={bouquet}
                        onChange={(e) => setBouquet(e.target.value)}
                      >
                        <option value="">-- ALLOCATE BOUQUET --</option>
                        {bouquets.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      </select>
                      <span className="material-icons absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-3xl">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Transmission */}
              <div className="space-y-10">
                <h5 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.4em] border-l-8 border-indigo-600 pl-6">Transmission Pipeline</h5>
                <div className="space-y-12">
                  <InputField label="Stream Ingress Link" value={streamUrl} onChange={setStreamUrl} placeholder="HLS (.m3u8) or DASH (.mpd)" />
                  
                  <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Codec Encapsulation</label>
                      <div className="flex space-x-12">
                        <label className="flex items-center space-x-5 cursor-pointer group">
                          <input type="radio" checked={streamType === 'hls'} onChange={() => { setStreamType('hls'); setIsDrmEnabled(false); }} className="w-8 h-8 text-blue-600 border-slate-300" />
                          <span className="text-xl font-black text-slate-700 uppercase tracking-widest group-hover:text-blue-600 transition-colors">HLS (M3U8)</span>
                        </label>
                        <label className="flex items-center space-x-5 cursor-pointer group">
                          <input type="radio" checked={streamType === 'dash'} onChange={() => { setStreamType('dash'); setIsDrmEnabled(true); }} className="w-8 h-8 text-blue-600 border-slate-300" />
                          <span className="text-xl font-black text-slate-700 uppercase tracking-widest group-hover:text-blue-600 transition-colors">DASH (MPD)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex-1 max-w-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-black text-slate-800 uppercase tracking-widest">
                          DRM Protection
                        </span>
                        <button 
                          onClick={() => streamType !== 'dash' && setIsDrmEnabled(!isDrmEnabled)}
                          className={`w-18 h-9 rounded-full relative transition-all duration-300 ${isDrmEnabled ? 'bg-emerald-500 shadow-xl shadow-emerald-500/30' : 'bg-slate-300'} ${streamType === 'dash' ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          <div className={`absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isDrmEnabled ? 'translate-x-10' : 'translate-x-1.5'}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3 italic">Required for DASH clearing</p>
                    </div>
                  </div>

                  {(isDrmEnabled || streamType === 'dash') && (
                    <div className="p-12 bg-amber-50/50 rounded-[4rem] border-2 border-dashed border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-top-4">
                       <InputField label="ClearKey ID (KID)" value={kid} onChange={setKid} placeholder="32 chars HEX" />
                       <InputField label="ClearKey Value (KEY)" value={key} onChange={setKey} placeholder="32 chars HEX" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-12 bg-slate-50 border-t border-slate-100 rounded-b-[4.5rem] flex flex-col sm:flex-row justify-end items-center gap-10 flex-shrink-0 sticky bottom-0 z-20">
              <button onClick={() => setIsModalOpen(false)} className="px-14 py-7 font-black text-slate-400 uppercase tracking-[0.4em] text-[13px] hover:text-slate-800 transition-colors">Abort</button>
              <button 
                disabled={!name || !streamUrl || !category || !sid || (streamType === 'dash' && (!kid || !key))}
                onClick={handleSubmit}
                className="px-32 py-8 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl shadow-blue-500/40 uppercase tracking-[0.4em] text-[14px] font-black disabled:opacity-50 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
              >
                {editingId ? 'Authorize & Synchronize' : 'Authorize & Deploy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder }: any) => (
  <div className="w-full">
    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-5 px-1">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:ring-8 focus:ring-blue-500/10 focus:bg-white transition-all text-xl font-black shadow-sm placeholder:text-slate-300 text-slate-800"
    />
  </div>
);

export default Channels;
