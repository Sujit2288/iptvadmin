
import React, { useState } from 'react';
import { Bouquet } from '../types';

interface BouquetsProps {
  bouquets: Bouquet[];
  onAdd: (bq: Bouquet) => void;
  onDelete: (id: string) => void;
}

const Bouquets: React.FC<BouquetsProps> = ({ bouquets, onAdd, onDelete }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name) return;
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name,
      channelCount: 0
    });
    setName('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Bouquet</h3>
        <div className="flex space-x-3">
          <input 
            type="text" 
            placeholder="e.g. Sony Liv, Star Network..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            onClick={handleAdd}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/20"
          >
            Create
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
          Active Bouquets
        </div>
        <div className="divide-y divide-slate-100">
          {bouquets.map(bq => (
            <div key={bq.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="material-icons">auto_awesome_motion</span>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">{bq.name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase">{bq.channelCount} Channels</p>
                 </div>
              </div>
              <div className="flex items-center space-x-2">
                 <button className="p-2 text-slate-400 hover:text-indigo-500 rounded-lg transition-colors">
                    <span className="material-icons text-sm">edit</span>
                 </button>
                 <button 
                   onClick={() => onDelete(bq.id)}
                   className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                 >
                    <span className="material-icons text-sm">delete</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bouquets;
