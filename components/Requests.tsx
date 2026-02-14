
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
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [swapUserId, setSwapUserId] = useState('');
  const [confirmSwap, setConfirmSwap] = useState(false);

  const openApprove = (req: DeviceRequest) => {
    setSelectedRequest(req);
    setIsApproveModalOpen(true);
    setName('');
    setMobile('');
  };

  const openSwap = (req: DeviceRequest) => {
    setSelectedRequest(req);
    setIsSwapModalOpen(true);
    setSwapUserId('');
    setConfirmSwap(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Device Activation Queue</h3>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
          {requests.length} Pending Requests
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Device Info</th>
              <th className="px-6 py-4">MAC Address</th>
              <th className="px-6 py-4">Requested At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  No pending device requests found.
                </td>
              </tr>
            ) : requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                      <span className="material-icons text-slate-400 text-sm">tv</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{req.deviceName || 'Unknown Device'}</p>
                      <p className="text-xs text-slate-500">{req.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {req.macAddress}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(req.requestTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      onClick={() => openApprove(req)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Approve & Add New User"
                    >
                      <span className="material-icons">add_task</span>
                    </button>
                    <button 
                      onClick={() => openSwap(req)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Swap Existing Device"
                    >
                      <span className="material-icons">swap_horiz</span>
                    </button>
                    <button 
                      onClick={() => onDelete(req.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Dismiss Request"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve Modal */}
      {isApproveModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-800">Activate Device</h4>
              <button onClick={() => setIsApproveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Device MAC (Read Only)</label>
                <input 
                  type="text" 
                  value={selectedRequest.macAddress} 
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter user's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg flex items-start space-x-2">
                <span className="material-icons text-sm mt-0.5">info</span>
                <span>The new user will be created with <b>Expired</b> status. Recharge is required to activate.</span>
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end space-x-3">
              <button 
                onClick={() => setIsApproveModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                disabled={!name || !mobile}
                onClick={() => {
                  onApprove(selectedRequest.id, name, mobile);
                  setIsApproveModalOpen(false);
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Add Subscriber
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      {isSwapModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-800">Swap Device</h4>
              <button onClick={() => setIsSwapModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Device MAC</label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm text-slate-700">
                  {selectedRequest.macAddress}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Existing Subscriber</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={swapUserId}
                  onChange={(e) => setSwapUserId(e.target.value)}
                >
                  <option value="">-- Choose Subscriber --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.macAddress})</option>
                  ))}
                </select>
              </div>
              {swapUserId && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="confirmSwap"
                    checked={confirmSwap}
                    onChange={(e) => setConfirmSwap(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="confirmSwap" className="text-sm font-medium text-blue-800">
                    Confirm replacing old MAC with new MAC
                  </label>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex justify-end space-x-3">
              <button 
                onClick={() => setIsSwapModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                disabled={!swapUserId || !confirmSwap}
                onClick={() => {
                  onSwap(selectedRequest.id, swapUserId);
                  setIsSwapModalOpen(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Execute Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
