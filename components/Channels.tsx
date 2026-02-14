
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
    // If DASH is selected or DRM toggle is on, we include the DRM object
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Live Channels</h3>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all"
        >
          <span className="material-icons text-sm">add</span>
          <span>Add Channel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {channels.map(channel => (
          <div key={channel.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-40 bg-slate-50 relative p-4 flex items-center justify-center">
              <img src={channel.img} alt={channel.name} className="max-h-full max-w-full object-contain" />
              <button 
                onClick={() => onDelete(channel.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-icons text-sm">delete</span>
              </button>
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                 <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold uppercase rounded-md shadow-lg">
                    {channel.category}
                 </span>
                 {channel.sources[0]?.drm && (
                   <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold uppercase rounded-md shadow-lg">
                     DRM
                   </span>
                 )}
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-slate-800 truncate mb-1">{channel.name}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-3">
                Bouquet: {channel.bouquet}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                  {channel.sources[0]?.type}
                </span>
                <span className="text-[9px] text-slate-400 truncate flex-1">
                  {channel.sources[0]?.url}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
              <h4 className="text-lg font-bold text-slate-800">Configure New Channel</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-blue-600 uppercase tracking-widest border-l-2 border-blue-600 pl-2">Basic Info</h5>
                  <div className="space-y-3">
                    <InputField label="Channel Name" value={name} onChange={setName} placeholder="e.g. Zee TV" />
                    <InputField label="Logo URL" value={img} onChange={setImg} placeholder="https://..." />
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                      <select 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bouquet</label>
                      <select 
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        value={bouquet}
                        onChange={(e) => setBouquet(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {bouquets.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-l-2 border-indigo-600 pl-2">Streaming Config</h5>
                  <div className="space-y-3">
                    <InputField label="Stream Link" value={streamUrl} onChange={setStreamUrl} placeholder="HLS/DASH URL" />
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stream Type</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" checked={streamType === 'hls'} onChange={() => { setStreamType('hls'); setIsDrmEnabled(false); }} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-slate-600">HLS</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" checked={streamType === 'dash'} onChange={() => { setStreamType('dash'); setIsDrmEnabled(true); }} className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-slate-600">DASH</span>
                        </label>
                      </div>
                    </div>

                    <div className={`pt-4 mt-4 border-t border-slate-100 transition-all ${streamType === 'dash' ? 'opacity-100' : 'opacity-60'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-bold text-slate-800">
                          {streamType === 'dash' ? 'DRM Configuration (Required)' : 'Enable DRM Protection'}
                        </label>
                        {streamType !== 'dash' && (
                          <button 
                            onClick={() => setIsDrmEnabled(!isDrmEnabled)}
                            className={`w-10 h-5 rounded-full relative transition-colors ${isDrmEnabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isDrmEnabled ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                          </button>
                        )}
                      </div>
                      
                      {(isDrmEnabled || streamType === 'dash') && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                           <InputField label="DRM KID" value={kid} onChange={setKid} placeholder="Example: 10616d7c4bee41f1..." />
                           <InputField label="DRM KEY" value={key} onChange={setKey} placeholder="Example: dc85f2112f63477f..." />
                           <p className="text-[10px] text-slate-400 italic">
                             Required for DASH clear-key protection.
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end space-x-3 sticky bottom-0 z-10">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                disabled={!name || !streamUrl || !category || (streamType === 'dash' && (!kid || !key))}
                onClick={handleAdd}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
              >
                Publish Channel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
    />
  </div>
);

export default Channels;
