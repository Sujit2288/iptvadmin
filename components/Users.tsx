
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

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.macAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile.includes(searchTerm)
  );

  const openRecharge = (user: User) => {
    setSelectedUser(user);
    setSelectedPkgId('');
    setIsRechargeModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by name, mobile, or MAC..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-slate-500 px-3 py-1 bg-slate-100 rounded-lg">
            {filteredUsers.length} Users
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Subscriber</th>
                <th className="px-6 py-4">MAC Address</th>
                <th className="px-6 py-4">Active Plan</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No matching users found.
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.status === 'Active' ? 'bg-blue-600' : 'bg-slate-400'}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.mobile}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    {user.macAddress}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user.activePlan === 'No Plan' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      {user.activePlan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(user.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => openRecharge(user)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-900/10 transition-all"
                      >
                        <span className="material-icons text-xs">bolt</span>
                        <span>Recharge</span>
                      </button>
                      <button 
                        onClick={() => onDelete(user.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <span className="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Modal */}
      {isRechargeModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-slate-800">Renew Subscription</h4>
                <p className="text-xs text-slate-500">Sub: {selectedUser.name}</p>
              </div>
              <button onClick={() => setIsRechargeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {packages.map(pkg => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedPkgId === pkg.id 
                        ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-800">{pkg.name}</p>
                    <p className="text-xl font-black text-blue-600">₹{pkg.price}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{pkg.durationDays} Days</p>
                  </button>
                ))}
              </div>
              
              {selectedPkgId && (
                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>New Expiry Date:</span>
                    <span className="font-bold text-slate-800">
                      {(() => {
                        const d = new Date();
                        const pkg = packages.find(p => p.id === selectedPkgId);
                        d.setDate(d.getDate() + (pkg?.durationDays || 0));
                        return d.toLocaleDateString();
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Account Status:</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end space-x-3">
              <button 
                onClick={() => setIsRechargeModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedPkgId}
                onClick={() => {
                  onRecharge(selectedUser.id, selectedPkgId);
                  setIsRechargeModalOpen(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Confirm Recharge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
