import React, { useState } from 'react';
import { Bouquet } from '../types';

interface BouquetsProps {
  bouquets: Bouquet[];
  onAdd: (bq: Bouquet) => void;
  onDelete: (id: string) => void;
}

const Bouquets: React.FC<BouquetsProps> = ({ bouquets, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name) return;
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name,
      channelCount: 0
    });
    setName('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Content Bouquets</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Broadcaster bundle authority</p>
        </div>
        <button 
          onClick={() => { setName(''); setIsModalOpen(true); }} 
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Add Bouquet
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
        <div className="px-10 py-5 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Portfolios</div>
        {bouquets.length === 0 ? (
          <div className="p-20 text-center font-black text-slate-200 uppercase tracking-[0.3em] text-[11px]">No portfolios provisioned</div>
        ) : bouquets.map(bq => (
          <div key={bq.id} className="px-10 py-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
            <div className="flex items-center space-x-6">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-white transition-colors">
                  <span className="material-icons text-2xl">auto_awesome_motion</span>
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">{bq.name}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{bq.channelCount} Streams Included</p>
               </div>
            </div>
            <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => onDelete(bq.id)}
                 className="p-4 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
               >
                  <span className="material-icons text-xl">delete</span>
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-[2.5rem]">
              <div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Engineer Bouquet</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Deploy broadcaster grouping identity</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 transition-colors">
                <span className="material-icons text-2xl">close</span>
              </button>
            </div>
            <div className="p-10 overflow-y-auto flex-1 bg-white">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Bouquet Official Title</label>
              <input 
                type="text" 
                placeholder="e.g. Star Network, Sony Liv..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm"
              />
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 rounded-b-[2.5rem] flex flex-col sm:flex-row justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-slate-800"
              >
                Dismiss
              </button>
              <button 
                disabled={!name}
                onClick={handleAdd}
                className="px-16 py-5 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 uppercase tracking-widest text-[11px] font-black disabled:opacity-50 transition-all"
              >
                Authorize Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bouquets;
