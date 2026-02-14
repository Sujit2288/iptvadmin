import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Import components
import App from './App';
import { db } from './services/firebase';

// --- View Sections ---

const RequestsView = ({ requests, users, onApprove, onSwap, onDelete }: any) => {
  const [approveModal, setApproveModal] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState<any>(null);
  const [isManual, setIsManual] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', mac: '', userId: '', confirm: false });

  const openApprove = (req: any) => {
    setSelectedReq(req);
    setIsManual(false);
    setForm({ ...form, name: '', mobile: '', mac: req.macAddress });
    setApproveModal(true);
  };

  const openManual = () => {
    setSelectedReq(null);
    setIsManual(true);
    setForm({ ...form, name: '', mobile: '', mac: '' });
    setApproveModal(true);
  };

  return (
    <div className="space-y-12 animate-in">
       <div className="p-14 bg-white rounded-[4rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Access Queue</h3>
            <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Global device activation protocols</p>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={openManual}
              className="bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center space-x-4"
            >
              <span className="material-icons text-xl">add_circle</span>
              <span>Manual Provision</span>
            </button>
            <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-8 py-6 rounded-[2rem] border border-blue-100 uppercase tracking-[0.3em]">
              {requests.length} Pending
            </span>
          </div>
       </div>

       <div className="bg-white rounded-[4.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
                   <tr>
                      <th className="px-14 py-10">Hardware Identity</th>
                      <th className="px-14 py-10">MAC Address</th>
                      <th className="px-14 py-10">Timestamp</th>
                      <th className="px-14 py-10 text-right">Engineering</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {requests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-14 py-10">
                            <div className="flex items-center space-x-10">
                               <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-2xl transition-all border border-slate-50">
                                  <span className="material-icons text-4xl">router</span>
                               </div>
                               <div>
                                  <p className="text-[20px] font-black text-slate-800 tracking-tighter leading-none mb-1">{req.deviceName || 'Node Device'}</p>
                                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">UUID: {req.id.substring(0, 8)}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-14 py-10">
                            <span className="font-mono text-[15px] bg-slate-100 px-7 py-3 rounded-2xl text-blue-600 font-black border border-slate-200 uppercase tracking-widest">
                               {req.macAddress}
                            </span>
                         </td>
                         <td className="px-14 py-10 text-[15px] font-black text-slate-500">
                            {new Date(req.requestTime).toLocaleString()}
                         </td>
                         <td className="px-14 py-10 text-right">
                            <div className="flex items-center justify-end space-x-5">
                               <button 
                                 onClick={() => openApprove(req)} 
                                 className="flex items-center space-x-3 px-8 py-4 bg-emerald-50 text-emerald-600 rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                               >
                                 <span className="material-icons text-xl">add_circle</span>
                                 <span>ADD</span>
                               </button>
                               <button 
                                 onClick={() => { setSelectedReq(req); setForm({ ...form, userId: '', confirm: false }); setSwapModal(true); }} 
                                 className="flex items-center space-x-3 px-8 py-4 bg-blue-50 text-blue-600 rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                               >
                                 <span className="material-icons text-xl">swap_horizontal_circle</span>
                                 <span>SWIPE</span>
                               </button>
                               <button onClick={() => onDelete(req.id)} className="w-16 h-16 text-red-300 bg-red-50 hover:bg-red-500 hover:text-white rounded-[1.75rem] transition-all flex items-center justify-center active:scale-95">
                                 <span className="material-icons text-3xl">delete_sweep</span>
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                   {requests.length === 0 && <tr><td colSpan={4} className="p-60 text-center font-black text-slate-200 uppercase tracking-[0.8em] text-[20px]">System Queue Empty</td></tr>}
                </tbody>
             </table>
          </div>
       </div>

       {/* Enhanced Approve Modal (Matched to User Description) */}
       {approveModal && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 bg-slate-900/95 backdrop-blur-md">
            <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/10 overflow-hidden">
               <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                  <div>
                    <h4 className="text-4xl font-black text-slate-800 tracking-tighter">Configure Profile</h4>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">AUTHORIZE NEW SUBSCRIBER IDENTITY</p>
                  </div>
                  <button onClick={() => setApproveModal(false)} className="w-18 h-18 bg-slate-50 hover:bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                    <span className="material-icons text-4xl">close</span>
                  </button>
               </div>
               <div className="p-14 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-12">
                  <div className="p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100 flex items-center space-x-10">
                      <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
                        <span className="material-icons text-5xl">router</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">Protocol Identity Detection</p>
                        <p className="text-[15px] font-black text-blue-800 uppercase tracking-widest mt-1 leading-tight">Hardware Identity detected: <span className="text-blue-600 font-mono">{isManual ? form.mac : selectedReq?.macAddress}</span></p>
                      </div>
                  </div>
                  
                  {isManual && (
                    <div className="w-full">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 px-1">Identity MAC Address</label>
                      <input type="text" placeholder="00:00:00:00:00:00" value={form.mac} onChange={(e)=>setForm({...form, mac:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-lg font-black shadow-sm" />
                    </div>
                  )}

                  <div className="space-y-12">
                    <div className="w-full">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 px-1">Subscriber Official Name</label>
                      <input type="text" placeholder="Enter full name..." value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-lg font-black shadow-sm" />
                    </div>
                    <div className="w-full">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 px-1">Primary Contact / Mobile</label>
                      <input type="text" placeholder="Enter mobile number..." value={form.mobile} onChange={(e)=>setForm({...form, mobile:e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-7 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-lg font-black shadow-sm" />
                    </div>
                  </div>
                  
                  <div className="p-12 bg-emerald-50/50 rounded-[4rem] border-2 border-dashed border-emerald-200">
                      <p className="text-[14px] font-black text-emerald-800 uppercase leading-relaxed tracking-[0.25em] text-center italic opacity-70">
                        New profile will be initialized as EXPIRED.<br/>Manual recharge mandatory for activation.
                      </p>
                  </div>
               </div>
               <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-6 flex-shrink-0">
                  <button onClick={() => setApproveModal(false)} className="px-14 py-7 font-black text-slate-400 uppercase tracking-[0.4em] text-[13px] hover:text-slate-800 transition-colors">Abort</button>
                  <button 
                    onClick={() => {
                      if(form.name && form.mobile && (isManual ? form.mac : true)) {
                        onApprove(isManual ? 'manual-'+Date.now() : selectedReq.id, form.name, form.mobile);
                        setApproveModal(false);
                      }
                    }} 
                    className={`px-32 py-8 bg-blue-600 text-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(37,99,235,0.4)] uppercase tracking-[0.3em] text-[13px] font-black transition-all active:scale-95 ${(!form.name || !form.mobile || (isManual && !form.mac)) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    Add & Deploy Node
                  </button>
               </div>
            </div>
         </div>
       )}

       {/* Enhanced Swap Modal (styam matched to User Description) */}
       {swapModal && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 bg-slate-900/95 backdrop-blur-md">
            <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/10 overflow-hidden">
               <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                  <div>
                    <h4 className="text-4xl font-black text-slate-800 tracking-tighter">Hardware Migration</h4>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">RELOCATE EXISTING SUBSCRIBER</p>
                  </div>
                  <button onClick={() => setSwapModal(false)} className="w-18 h-18 bg-slate-50 hover:bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                    <span className="material-icons text-4xl">close</span>
                  </button>
               </div>
               <div className="p-14 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-12">
                  <div className="p-10 bg-indigo-50/50 rounded-[3rem] border border-indigo-100 flex items-center space-x-10">
                       <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
                          <span className="material-icons text-5xl">swap_horizontal_circle</span>
                       </div>
                       <div className="flex-1">
                          <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Migration Target Locked</p>
                          <p className="text-[15px] font-black text-indigo-800 uppercase tracking-widest mt-1 leading-tight">Target MAC: <span className="text-indigo-600 font-mono">{selectedReq?.macAddress}</span></p>
                       </div>
                  </div>
                  <div className="space-y-8">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 px-1">Choose Global Subscriber</label>
                      <div className="relative">
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-10 py-8 font-black text-lg outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 appearance-none cursor-pointer shadow-sm" value={form.userId} onChange={(e)=>setForm({...form, userId:e.target.value})}>
                          <option value="">-- SEARCH SUBSCRIBER DB --</option>
                          {users.map((u:any) => <option key={u.id} value={u.id}>{u.name} (Current Node: {u.macAddress})</option>)}
                        </select>
                        <span className="material-icons absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                      </div>
                  </div>
                  {form.userId && (
                    <label className="flex items-center space-x-12 p-14 bg-slate-900 text-white rounded-[4rem] cursor-pointer hover:bg-slate-800 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.4)] animate-in zoom-in">
                      <input type="checkbox" className="w-12 h-12 rounded-2xl bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500" checked={form.confirm} onChange={(e)=>setForm({...form, confirm:e.target.checked})} />
                      <span className="text-[14px] font-black uppercase tracking-[0.3em] leading-relaxed flex-1">Authorize irreversible hardware identity replacement for this profile.</span>
                    </label>
                  )}
               </div>
               <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-6 flex-shrink-0">
                  <button onClick={() => setSwapModal(false)} className="px-14 py-7 font-black text-slate-400 uppercase tracking-[0.4em] text-[13px] hover:text-slate-800 transition-colors">Abort</button>
                  <button 
                    onClick={() => { if(form.userId && form.confirm) { onSwap(selectedReq.id, form.userId); setSwapModal(false); } }} 
                    className={`px-32 py-8 bg-blue-600 text-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(37,99,235,0.4)] uppercase tracking-[0.3em] text-[13px] font-black transition-all active:scale-95 ${(!form.userId || !form.confirm) ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    Migrate Hardware
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

// --- Execution ---
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}
