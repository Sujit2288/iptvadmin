import React, { useState } from 'react';
import { Channel, Category, Bouquet, ChannelSource } from '../types';

interface ChannelsProps {
  channels: Channel[];
  categories: Category[];
  bouquets: Bouquet[];
  onAdd: (channel: Channel) => void;
  onDelete: (id: string) => void;
}

const Channels: React.FC<ChannelsProps> = ({ channels, categories, bouquets, onAdd, onDelete }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [category, setCategory] = useState('');
  const [bouquet, setBouquet] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamType, setStreamType] = useState<'hls' | 'dash'>('hls');
  const [isDrmEnabled, setIsDrmEnabled] = useState(false);
  const [kid, setKid] = useState('');
  const [key, setKey] = useState('');

  const handleAdd = () => {
    const includeDrm = isDrmEnabled || streamType === 'dash';
    
    const source: ChannelSource = {
      name: "Server 1",
      url: streamUrl,
      type: streamType,
      ...(includeDrm && kid && key ? { drm: { kid, key } } : {})
    };

    const newChannel: Channel = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      img,
      category,
      bouquet,
      description: "India",
      sources: [source]
    };

    onAdd(newChannel);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setImg(''); setCategory(''); setBouquet('');
    setStreamUrl(''); setStreamType('hls'); setIsDrmEnabled(false);
    setKid(''); setKey('');
  };

  return (
    <div className="space-y-8 animate-in duration-500">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Broadcasting Grid</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">Live stream delivery infrastructure</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="flex items-center space-x-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
        >
          <span className="material-icons text-lg">add_circle</span>
          <span>Deploy Channel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {channels.map(channel => (
          <div key={channel.id} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="h-48 bg-slate-50 relative p-6 flex items-center justify-center border-b border-slate-50">
              <img src={channel.img} alt={channel.name} className="max-h-full max-w-full object-contain filter drop-shadow-lg" />
              <button 
                onClick={() => onDelete(channel.id)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-lg flex items-center justify-center"
              >
                <span className="material-icons text-xl">delete</span>
              </button>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg shadow-xl tracking-widest">
                    {channel.category}
                 </span>
                 {channel.sources[0]?.drm && (
                   <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase rounded-lg shadow-xl tracking-widest">
                     DRM
                   </span>
                 )}
              </div>
            </div>
            <div className="p-8">
              <h4 className="text-lg font-black text-slate-800 tracking-tight truncate mb-1">{channel.name}</h4>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-4">
                ID: {channel.bouquet}
              </p>
              <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black px-2 py-1 bg-blue-100 text-blue-600 rounded-lg uppercase">
                  {channel.sources[0]?.type}
                </span>
                <span className="text-[9px] font-bold text-slate-400 truncate flex-1 font-mono">
                  {channel.sources[0]?.url}
                </span>
              </div>
            </div>
          </div>
        ))}
        {channels.length === 0 && (
          <div className="col-span-full py-40 text-center font-black text-slate-200 uppercase tracking-[0.5em] text-[16px]">
            No Broadcasts Active
          </div>
        )}
      </div>

      {/* Re-Engineered Modal for better reliability and consistency */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-slate-900/90 backdrop-blur-md overflow-hidden">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-[3rem] flex-shrink-0">
              <div>
                <h4 className="text-3xl font-black text-slate-800 tracking-tight">Configure Channel</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Establish a new broadcast node in the grid</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-14 h-14 bg-slate-50 hover:bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                <span className="material-icons text-3xl">close</span>
              </button>
            </div>
            
            {/* Modal Scrollable Content */}
            <div className="p-10 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-12">
              {/* Part 1: Identity */}
              <div className="space-y-8">
                <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] border-l-4 border-blue-600 pl-4">Channel Identity</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Official Title" value={name} onChange={setName} placeholder="e.g. Zee TV" />
                  <InputField label="Asset Logo URL" value={img} onChange={setImg} placeholder="https://..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Grid Taxonomy</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm appearance-none cursor-pointer"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">-- SELECT CATEGORY --</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Content Portfolio</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm appearance-none cursor-pointer"
                        value={bouquet}
                        onChange={(e) => setBouquet(e.target.value)}
                      >
                        <option value="">-- SELECT BOUQUET --</option>
                        {bouquets.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      </select>
                      <span className="material-icons absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: Technical Protocol */}
              <div className="space-y-8">
                <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] border-l-4 border-indigo-600 pl-4">Delivery Protocol</h5>
                <div className="space-y-8">
                  <InputField label="Stream Ingress Link" value={streamUrl} onChange={setStreamUrl} placeholder="HLS/DASH Master URL" />
                  
                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Codec Encapsulation</label>
                      <div className="flex space-x-6">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input type="radio" checked={streamType === 'hls'} onChange={() => { setStreamType('hls'); setIsDrmEnabled(false); }} className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300" />
                          <span className="text-xs font-black text-slate-600 uppercase tracking-wider group-hover:text-blue-600 transition-colors">HLS (M3U8)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                          <input type="radio" checked={streamType === 'dash'} onChange={() => { setStreamType('dash'); setIsDrmEnabled(true); }} className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300" />
                          <span className="text-xs font-black text-slate-600 uppercase tracking-wider group-hover:text-blue-600 transition-colors">DASH (MPD)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex-1 max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                          DRM Protection
                        </span>
                        <button 
                          onClick={() => streamType !== 'dash' && setIsDrmEnabled(!isDrmEnabled)}
                          className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isDrmEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-300'} ${streamType === 'dash' ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${isDrmEnabled ? 'translate-x-8' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Required for DASH clearing</p>
                    </div>
                  </div>

                  {/* DRM Sub-form */}
                  {(isDrmEnabled || streamType === 'dash') && (
                    <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-8 animate-in slide-in-from-top-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <InputField label="ClearKey ID (KID)" value={kid} onChange={setKid} placeholder="32 chars HEX" />
                         <InputField label="ClearKey VALUE (KEY)" value={key} onChange={setKey} placeholder="32 chars HEX" />
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 bg-slate-50 border-t border-slate-100 rounded-b-[3rem] flex flex-col sm:flex-row justify-end gap-6 flex-shrink-0 sticky bottom-0 z-10">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-10 py-5 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-slate-800 transition-colors"
              >
                Abort Configuration
              </button>
              <button 
                disabled={!name || !streamUrl || !category || (streamType === 'dash' && (!kid || !key))}
                onClick={handleAdd}
                className="px-20 py-6 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-500/40 uppercase tracking-widest text-[11px] font-black disabled:opacity-50 hover:bg-blue-700 transition-all active:scale-95"
              >
                Deploy Broadcast
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
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm"
    />
  </div>
);

export default Channels;
