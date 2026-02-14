
import React, { useState } from 'react';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
  onAdd: (cat: Category) => void;
  onDelete: (id: string) => void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, onAdd, onDelete }) => {
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
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Category</h3>
        <div className="flex space-x-3">
          <input 
            type="text" 
            placeholder="e.g. Sports, Movies, News..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button 
            onClick={handleAdd}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
          >
            Create
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
          Active Categories
        </div>
        <div className="divide-y divide-slate-100">
          {categories.map(cat => (
            <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <span className="material-icons">folder</span>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">{cat.name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase">{cat.channelCount} Channels</p>
                 </div>
              </div>
              <div className="flex items-center space-x-2">
                 <button className="p-2 text-slate-400 hover:text-blue-500 rounded-lg transition-colors">
                    <span className="material-icons text-sm">edit</span>
                 </button>
                 <button 
                   onClick={() => onDelete(cat.id)}
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

export default Categories;
