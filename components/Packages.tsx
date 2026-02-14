import React, { useState } from 'react';
import { Package, Bouquet } from '../types';

interface PackagesProps {
  packages: Package[];
  bouquets: Bouquet[];
  onAdd: (pkg: Package) => void;
  onDelete: (id: string) => void;
}

const Packages: React.FC<PackagesProps> = ({ packages, bouquets, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedBouquets, setSelectedBouquets] = useState<string[]>([]);

  const toggleBouquet = (bName: string) => {
    if (selectedBouquets.includes(bName)) {
      setSelectedBouquets(selectedBouquets.filter(b => b !== bName));
    } else {
      setSelectedBouquets([...selectedBouquets, bName]);
    }
  };

  const handleAdd = () => {
    if (!name || !price || !duration) return;
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      name,
      price: parseFloat(price),
      durationDays: parseInt(duration),
      bouquets: selectedBouquets
    });
    setIsModalOpen(false);
    setName(''); setPrice(''); setDuration(''); setSelectedBouquets([]);
  };

  return (
    <div className="space-y-12 animate-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Commercial Policies</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global tier and subscription authority</p>
        </div>
        <button 
          onClick={() => { setName(''); setPrice(''); setDuration(''); setSelectedBouquets([]); setIsModalOpen(true); }}
          className="flex items-center space-x-2 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95"
        >
          <span className="material-icons text-sm">add</span>
          <span>Engineering Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-2xl transition-all overflow-hidden group border-t-8 border-t-emerald-500">
            <div className="p-10 bg-slate-50/50 border-b border-slate-100 flex justify-between items-start">
               <div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">{pkg.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{pkg.durationDays} Days Global Access</p>
               </div>
               <div className="text-right">
                  <span className="text-4xl font-black text-emerald-600">₹{pkg.price}</span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Master Rate</p>
               </div>
            </div>
            <div className="p-10 flex-1 space-y-6">
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Network Inclusions:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.bouquets.map(b => (
                      <span key={b} className="px-3 py-1 bg-white text-blue-600 text-[9px] font-black rounded-lg border border-slate-100 shadow-sm uppercase">
                        {b}
                      </span>
                    ))}
                    {pkg.bouquets.length === 0 && <span className="text-[10px] font-bold text-slate-400 italic">No inclusions.</span>}
                  </div>
               </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                 onClick={() => onDelete(pkg.id)}
                 className="p-4 text-red-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-2xl"
               >
                  <span className="material-icons text-xl">delete</span>
               </button>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-full py-40 text-center font-black text-slate-200 uppercase tracking-[0.5em] text-[16px]">No policies defined</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-hidden">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 rounded-t-[2.5rem]">
              <div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">Deploy Commercial Tier</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure global business model identity</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 transition-colors">
                <span className="material-icons text-2xl">close</span>
              </button>
            </div>
            <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
              <div className="space-y-8">
                <InputField label="Plan Identifier / Name" value={name} onChange={setName} placeholder="e.g. Master Gold Tier" />
                <div className="grid grid-cols-2 gap-8">
                  <InputField label="Price (₹)" value={price} onChange={setPrice} placeholder="499" />
                  <InputField label="Cycle Duration (Days)" value={duration} onChange={setDuration} placeholder="30" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Network Bouquet Inclusion</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto custom-scrollbar pr-4">
                    {bouquets.map(b => (
                      <button
                        key={b.id}
                        onClick={() => toggleBouquet(b.name)}
                        className={`text-left px-5 py-4 rounded-2xl border transition-all ${
                          selectedBouquets.includes(b.name) 
                            ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg' 
                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-tight">{b.name}</span>
                          {selectedBouquets.includes(b.name) && <span className="material-icons text-sm">check_circle</span>}
                        </div>
                      </button>
                    ))}
                    {bouquets.length === 0 && (
                      <div className="col-span-2 p-10 text-center text-slate-300 font-black uppercase text-[10px]">No bouquets in DB</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 rounded-b-[2.5rem] flex flex-col sm:flex-row justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-4 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-slate-800"
              >
                Dismiss
              </button>
              <button 
                disabled={!name || !price || !duration || selectedBouquets.length === 0}
                onClick={handleAdd}
                className="px-16 py-5 bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-900/30 uppercase tracking-widest text-[11px] font-black transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                Deploy Global Plan
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
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-bold shadow-sm"
    />
  </div>
);

export default Packages;
