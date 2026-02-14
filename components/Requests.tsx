import React, { useState } from 'react';
import { DeviceRequest, User } from '../types';

interface RequestsProps {
  requests: DeviceRequest[];
  users: User[];
  onApprove: (requestId: string, name: string, mobile: string) => void;
  onSwap: (requestId: string, userId: string) => void;
  onDelete: (id: string) => void;
}

const Requests: React.FC<RequestsProps> = ({ requests, users, onApprove, onSwap, onDelete }) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DeviceRequest | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [manualMac, setManualMac] = useState('');
  const [swapUserId, setSwapUserId] = useState('');
  const [confirmSwap, setConfirmSwap] = useState(false);

  const openApprove = (req: DeviceRequest) => {
    setSelectedRequest(req);
    setIsManualMode(false);
    setIsApproveModalOpen(true);
    setName('');
    setMobile('');
  };

  const openManualApprove = () => {
    setSelectedRequest(null);
    setIsManualMode(true);
    setIsApproveModalOpen(true);
    setManualMac('');
    setName('');
    setMobile('');
  };

  const openSwap = (req: DeviceRequest) => {
    setSelectedRequest(req);
    setIsSwapModalOpen(true);
    setSwapUserId('');
    setConfirmSwap(false);
  };

  // Shared Input Component Matching the "Infrastructure" style
  const InputBox = ({ label, value, onChange, placeholder }: any) => (
    <div className="w-full">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-1">{label}</label>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-base font-black shadow-sm placeholder:text-slate-300 text-slate-800"
      />
    </div>
  );

  return (
    <div className="space-y-10 animate-in">
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-12 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/30 gap-8">
          <div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Access Queue</h3>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Hardware Activation Authority</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={openManualApprove}
              className="bg-blue-600 text-white px-10 py-5 rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center space-x-3"
            >
              <span className="material-icons text-lg">add</span>
              <span>Manual Add</span>
            </button>
            <span className="text-[11px] font-black text-blue-600 bg-blue-100/50 px-8 py-5 rounded-[1.75rem] uppercase tracking-[0.2em] border border-blue-100">
              {requests.length} Pending
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
              <tr>
                <th className="px-12 py-10">Hardware Identity</th>
                <th className="px-12 py-10">MAC Address</th>
                <th className="px-12 py-10">Timestamp</th>
                <th className="px-12 py-10 text-right">Engineering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-12 py-40 text-center font-black text-slate-200 uppercase tracking-[0.7em] text-[18px]">
                    System Queue Clear
                  </td>
                </tr>
              ) : requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-12 py-10">
                    <div className="flex items-center space-x-8">
                      <div className="w-18 h-18 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-2xl transition-all border border-slate-50">
                        <span className="material-icons text-4xl">router</span>
                      </div>
                      <div>
                        <p className="text-[18px] font-black text-slate-800 tracking-tighter">{req.deviceName || 'Node Device'}</p>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">UUID: {req.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <span className="font-mono text-[14px] bg-slate-100 px-6 py-3 rounded-2xl text-blue-600 font-black border border-slate-200 uppercase tracking-wider">
                      {req.macAddress}
                    </span>
                  </td>
                  <td className="px-12 py-10 text-[14px] font-black text-slate-500">
                    {new Date(req.requestTime).toLocaleString()}
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex items-center justify-end space-x-5">
                      <button 
                        onClick={() => openApprove(req)}
                        className="flex items-center space-x-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <span className="material-icons text-base">add_circle</span>
                        <span>ADD</span>
                      </button>
                      <button 
                        onClick={() => openSwap(req)}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <span className="material-icons text-base">swap_horizontal_circle</span>
                        <span>SWIPE</span>
                      </button>
                      <button 
                        onClick={() => onDelete(req.id)}
                        className="w-14 h-14 text-red-300 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
                      >
                        <span className="material-icons text-2xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activation Modal (Add User) */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 bg-slate-900/95 backdrop-blur-md">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/10 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
              <div>
                <h4 className="text-4xl font-black text-slate-800 tracking-tighter">Configure Profile</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">AUTHORIZE NEW SUBSCRIBER IDENTITY</p>
              </div>
              <button onClick={() => setIsApproveModalOpen(false)} className="w-16 h-16 bg-slate-50 hover:bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                <span className="material-icons text-4xl">close</span>
              </button>
            </div>
            
            <div className="p-12 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-12">
               <div className="p-10 bg-blue-50/50 rounded-[3rem] border border-blue-100 flex items-center space-x-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                    <span className="material-icons text-4xl">router</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Identity Protocol Locked</p>
                    <p className="text-[13px] font-black text-blue-800 uppercase tracking-widest mt-1">Hardware Identity detected: <span className="text-blue-600 font-mono">{isManualMode ? manualMac : selectedRequest?.macAddress}</span></p>
                  </div>
               </div>

               {isManualMode && (
                 <InputBox label="Identity MAC Address" value={manualMac} onChange={setManualMac} placeholder="00:00:00:00:00:00" />
               )}

               <div className="space-y-10">
                 <InputBox label="Subscriber Official Name" value={name} onChange={setName} placeholder="Enter full name..." />
                 <InputBox label="Primary Contact / Mobile" value={mobile} onChange={setMobile} placeholder="Enter mobile number..." />
               </div>

               <div className="p-10 bg-emerald-50/50 rounded-[3.5rem] border-2 border-dashed border-emerald-200">
                  <p className="text-[12px] font-black text-emerald-800 uppercase leading-relaxed tracking-[0.2em] text-center italic opacity-70">
                    New profile will be initialized as EXPIRED.<br/>Manual recharge mandatory for activation.
                  </p>
               </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-6 flex-shrink-0">
              <button onClick={() => setIsApproveModalOpen(false)} className="px-12 py-6 font-black text-slate-400 uppercase tracking-[0.3em] text-[12px] hover:text-slate-800 transition-colors">Abort</button>
              <button 
                onClick={() => {
                  if (name && mobile && (isManualMode ? manualMac : true)) {
                    if (isManualMode) {
                      // Call onApprove with a temporary ID for manual mode
                      onApprove('manual-' + Date.now(), name, mobile);
                    } else if (selectedRequest) {
                      onApprove(selectedRequest.id, name, mobile);
                    }
                    setIsApproveModalOpen(false);
                  }
                }}
                className={`px-24 py-7 bg-blue-600 text-white rounded-[2.5rem] shadow-[0_25px_50px_rgba(37,99,235,0.4)] uppercase tracking-[0.3em] text-[12px] font-black transition-all hover:bg-blue-700 active:scale-95 ${(!name || !mobile || (isManualMode && !manualMac)) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                Add & Deploy Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standardized Swap Modal (Swipe) */}
      {isSwapModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-10 bg-slate-900/95 backdrop-blur-md">
          <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-[0_0_150px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/10 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
              <div>
                <h4 className="text-4xl font-black text-slate-800 tracking-tighter">Hardware Migration</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">RELOCATE EXISTING SUBSCRIBER</p>
              </div>
              <button onClick={() => setIsSwapModalOpen(false)} className="w-16 h-16 bg-slate-50 hover:bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                <span className="material-icons text-4xl">close</span>
              </button>
            </div>
            
            <div className="p-12 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-12">
              <div className="p-10 bg-indigo-50/50 rounded-[3rem] border border-indigo-100 flex items-center space-x-8">
                 <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                    <span className="material-icons text-4xl">swap_horizontal_circle</span>
                 </div>
                 <div className="flex-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Migration Target Locked</p>
                    <p className="text-[13px] font-black text-indigo-800 uppercase tracking-widest mt-1">Target MAC: <span className="text-indigo-600 font-mono">{selectedRequest.macAddress}</span></p>
                 </div>
              </div>
              
              <div className="space-y-6">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 px-1">Choose Global Subscriber</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-7 font-black text-base outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer text-slate-700 shadow-sm"
                    value={swapUserId}
                    onChange={(e) => setSwapUserId(e.target.value)}
                  >
                    <option value="">-- SEARCH SUBSCRIBER DB --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} (Current: {u.macAddress})</option>
                    ))}
                  </select>
                  <span className="material-icons absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>

              {swapUserId && (
                <label className="flex items-center space-x-10 p-12 bg-slate-900 text-white rounded-[3.5rem] cursor-pointer hover:bg-slate-800 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.3)] animate-in zoom-in">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={confirmSwap}
                      onChange={(e) => setConfirmSwap(e.target.checked)}
                      className="w-10 h-10 rounded-xl bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-[0.25em] leading-relaxed">Authorize irreversible hardware identity replacement for this profile.</span>
                </label>
              )}
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-6 flex-shrink-0">
              <button onClick={() => setIsSwapModalOpen(false)} className="px-12 py-6 font-black text-slate-400 uppercase tracking-[0.3em] text-[12px] hover:text-slate-800 transition-colors">Abort</button>
              <button 
                onClick={() => {
                  if (swapUserId && confirmSwap) {
                    onSwap(selectedRequest.id, swapUserId);
                    setIsSwapModalOpen(false);
                  }
                }}
                className={`px-28 py-7 bg-blue-600 text-white rounded-[2.5rem] shadow-[0_25px_50px_rgba(37,99,235,0.4)] uppercase tracking-[0.3em] text-[12px] font-black transition-all hover:bg-blue-700 active:scale-95 ${(!swapUserId || !confirmSwap) ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
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

export default Requests;
