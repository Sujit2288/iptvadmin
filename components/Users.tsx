
import React, { useState } from 'react';
import { User, Package } from '../types';

interface UsersProps {
  users: User[];
  packages: Package[];
  onRecharge: (userId: string, pkgId: string) => void;
  onDelete: (id: string) => void;
}

const Users: React.FC<UsersProps> = ({ users, packages, onRecharge, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState('');

  // Robust filtering with safety checks to prevent crashes on missing data
  const filteredUsers = users.filter(u => {
    const name = u.name?.toLowerCase() || '';
    const mac = u.macAddress?.toLowerCase() || '';
    const mobile = u.mobile || '';
    const search = searchTerm.toLowerCase();
    
    return name.includes(search) || mac.includes(search) || mobile.includes(search);
  });

  const openRecharge = (user: User) => {
    setSelectedUser(user);
    setSelectedPkgId('');
    setIsRechargeModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-in duration-500">
      {/* Header & Search Infrastructure */}
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">Subscriber Registry</h3>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Active Network Node Management</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="relative w-full sm:w-96 group">
            <span className="material-icons absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search ID, Mobile or MAC..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:ring-8 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-base font-black shadow-sm placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="px-10 py-5 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center space-x-4">
            <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">Total Population</span>
            <span className="text-2xl font-black text-blue-800 tracking-tighter">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Main Table Infrastructure */}
      <div className="bg-white rounded-[4.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">
              <tr>
                <th className="px-14 py-10">Subscriber Identity</th>
                <th className="px-14 py-10">Hardware Address</th>
                <th className="px-14 py-10">Current Allocation</th>
                <th className="px-14 py-10">Expiration</th>
                <th className="px-14 py-10">State</th>
                <th className="px-14 py-10 text-right">Engineering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-14 py-60 text-center font-black text-slate-200 uppercase tracking-[0.8em] text-[20px]">
                    No Matching Nodes Found
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-14 py-10">
                    <div className="flex items-center space-x-10">
                      <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl transition-transform group-hover:scale-110 ${user.status === 'Active' ? 'bg-blue-600 shadow-blue-500/30' : 'bg-slate-400 shadow-slate-400/30'}`}>
                        {(user.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <p className="text-[20px] font-black text-slate-800 tracking-tighter leading-none mb-2">{user.name || 'System User'}</p>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{user.mobile || 'No Contact'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-14 py-10">
                    <span className="font-mono text-[15px] bg-slate-100 px-7 py-3 rounded-2xl text-slate-600 font-black border border-slate-200 uppercase tracking-widest">
                      {user.macAddress || 'UNASSIGNED'}
                    </span>
                  </td>
                  <td className="px-14 py-10">
                    <div className="flex items-center space-x-4">
                       <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${user.activePlan === 'No Plan' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white'}`}>
                        {user.activePlan || 'DEPROVISIONED'}
                      </span>
                    </div>
                  </td>
                  <td className="px-14 py-10">
                    <p className="text-[15px] font-black text-slate-500">
                      {user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : 'NEVER'}
                    </p>
                  </td>
                  <td className="px-14 py-10">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                        user.status === 'Active' ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {user.status || 'UNKNOWN'}
                      </span>
                    </div>
                  </td>
                  <td className="px-14 py-10 text-right">
                    <div className="flex items-center justify-end space-x-5">
                      <button 
                        onClick={() => openRecharge(user)}
                        className="flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-[1.75rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
                      >
                        <span className="material-icons text-xl">bolt</span>
                        <span>RECHARGE</span>
                      </button>
                      <button 
                        onClick={() => onDelete(user.id)}
                        className="w-16 h-16 text-red-300 bg-red-50 hover:bg-red-500 hover:text-white rounded-[1.75rem] transition-all flex items-center justify-center active:scale-95 shadow-sm"
                      >
                        <span className="material-icons text-3xl">delete_sweep</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High-Fidelity Recharge Modal */}
      {isRechargeModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[4rem] shadow-[0_0_200px_rgba(0,0,0,0.4)] w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500 border border-white/20">
            <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-[4rem] flex-shrink-0">
              <div>
                <h4 className="text-4xl font-black text-slate-800 tracking-tighter">Renew Subscription</h4>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">FOR: {selectedUser.name}</p>
              </div>
              <button onClick={() => setIsRechargeModalOpen(false)} className="w-18 h-18 bg-slate-50 hover:bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 transition-all hover:rotate-90">
                <span className="material-icons text-4xl">close</span>
              </button>
            </div>

            <div className="p-14 overflow-y-auto custom-scrollbar flex-1 bg-white space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {packages.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`p-10 rounded-[3rem] border-4 text-left transition-all duration-300 relative group overflow-hidden ${
                      selectedPkgId === pkg.id 
                        ? 'border-blue-600 bg-blue-50 shadow-2xl shadow-blue-500/20' 
                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    {selectedPkgId === pkg.id && (
                       <span className="material-icons absolute top-6 right-6 text-blue-600 text-3xl animate-in zoom-in">check_circle</span>
                    )}
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{pkg.durationDays} Days Duration</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tighter mb-6 leading-none">{pkg.name}</p>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl font-black text-blue-600">₹{pkg.price}</span>
                      <span className="text-[10px] font-black text-blue-400 uppercase">Net</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedPkgId && (
                <div className="p-10 bg-slate-900 text-white rounded-[3.5rem] shadow-2xl space-y-6 animate-in slide-in-from-top-4">
                  <div className="flex items-center space-x-6 border-b border-white/10 pb-6">
                    <span className="material-icons text-blue-500 text-3xl">event_available</span>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">New Expiration Protocol</p>
                      <p className="text-[20px] font-black tracking-tight">
                        {(() => {
                          const d = new Date();
                          const pkg = packages.find(p => p.id === selectedPkgId);
                          d.setDate(d.getDate() + (pkg?.durationDays || 0));
                          return d.toLocaleDateString(undefined, { dateStyle: 'long' });
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="material-icons text-emerald-500 text-3xl">verified_user</span>
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Service State Migration</p>
                      <p className="text-[20px] font-black text-emerald-400 tracking-tight uppercase">Authorized Activation</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-12 bg-slate-50 border-t border-slate-100 rounded-b-[4rem] flex flex-col sm:flex-row justify-end items-center gap-8 flex-shrink-0">
              <button 
                onClick={() => setIsRechargeModalOpen(false)}
                className="px-12 py-6 font-black text-slate-400 uppercase tracking-[0.4em] text-[13px] hover:text-slate-800 transition-colors"
              >
                Abort Renew
              </button>
              <button 
                disabled={!selectedPkgId}
                onClick={() => {
                  onRecharge(selectedUser.id, selectedPkgId);
                  setIsRechargeModalOpen(false);
                }}
                className="px-32 py-8 bg-blue-600 text-white rounded-[2.5rem] shadow-[0_30px_60px_rgba(37,99,235,0.4)] uppercase tracking-[0.3em] text-[13px] font-black transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:grayscale"
              >
                Authorize & Provision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
