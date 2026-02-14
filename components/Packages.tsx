
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
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Pricing Packages</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all"
        >
          <span className="material-icons text-sm">add</span>
          <span>New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-xl transition-all overflow-hidden group">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
               <div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">{pkg.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{pkg.durationDays} Days Duration</p>
               </div>
               <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">₹{pkg.price}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Incl. Taxes</p>
               </div>
            </div>
            <div className="p-6 flex-1 space-y-4">
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selected Bouquets</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.bouquets.map(b => (
                      <span key={b} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">
                        {b}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
            <div className="p-4 bg-slate-50 flex justify-end space-x-2">
               <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <span className="material-icons text-sm">edit</span>
               </button>
               <button 
                 onClick={() => onDelete(pkg.id)}
                 className="p-2 text-slate-400 hover:text-red-500 transition-colors"
               >
                  <span className="material-icons text-sm">delete</span>
               </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-800">Create Pricing Plan</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <InputField label="Plan Name" value={name} onChange={setName} placeholder="e.g. Super Gold" />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Price (₹)" value={price} onChange={setPrice} placeholder="499" />
                <InputField label="Duration (Days)" value={duration} onChange={setDuration} placeholder="30" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Select Bouquets</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {bouquets.map(b => (
                    <button
                      key={b.id}
                      onClick={() => toggleBouquet(b.name)}
                      className={`text-left px-3 py-2 rounded-lg border text-[11px] font-bold transition-all ${
                        selectedBouquets.includes(b.name) 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                disabled={!name || !price || !duration || selectedBouquets.length === 0}
                onClick={handleAdd}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
              >
                Create Plan
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
      className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    />
  </div>
);

export default Packages;
