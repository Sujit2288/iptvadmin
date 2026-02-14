import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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

// --- Types ---
interface User {
  id: string;
  name: string;
  mobile: string;
  macAddress: string;
  expiryDate: string;
  status: 'Active' | 'Expired';
  activePlan: string;
  createdAt: string;
}

interface DeviceRequest {
  id: string;
  macAddress: string;
  deviceName: string;
  requestTime: string;
}

interface Category {
  id: string;
  name: string;
}

interface Bouquet {
  id: string;
  name: string;
}

interface ChannelSource {
  name: string;
  url: string;
  type: 'hls' | 'dash';
  drm?: {
    kid: string;
    key: string;
  };
}

interface Channel {
  id: string;
  name: string;
  img: string;
  category: string;
  bouquet: string;
  description: string;
  sources: ChannelSource[];
}

interface Package {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  bouquets: string[];
}

// --- Firebase Configuration ---
const firebaseConfig = {
  projectId: "studio-9054358575-f9a2a",
  appId: "1:94681048239:web:83ffe6e51461d8e613605a",
  apiKey: "AIzaSyDOuoZmdgfzUQ3EfPl6va4Xi6ih5Z6IWhc",
  authDomain: "studio-9054358575-f9a2a.firebaseapp.com",
  storageBucket: "studio-9054358575-f9a2a.appspot.com",
  messagingSenderId: "94681048239"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Components ---

const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="w-full">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-bold"
    />
  </div>
);

const SidebarItem = ({ icon, label, active, onClick, count }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group mb-1 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className={`material-icons text-[20px] ${active ? 'text-white' : 'group-hover:text-white'}`}>
        {icon}
      </span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    {count !== undefined && count > 0 && (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white'}`}>
        {count}
      </span>
    )}
  </button>
);

const Login = ({ onLogin }: { onLogin: (success: boolean) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Sujit@123' && password === 'Sujit@123') {
      onLogin(true);
    } else {
      setError('Invalid Access Credentials');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-800 rounded-full" />
      </div>
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in">
        <div className="p-10 pt-12 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
             <span className="material-icons text-4xl text-white">shield</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Bharat Digital</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-10">Admin Control Center</p>
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <InputField label="Username" value={username} onChange={setUsername} placeholder="Admin ID" />
            <InputField label="Password" value={password} onChange={setPassword} placeholder="••••••••" type="password" />
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center space-x-2 animate-pulse">
                <span className="material-icons text-sm">error</span>
                <span>{error}</span>
              </div>
            )}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs mt-4">
              Authorize Access
            </button>
          </form>
        </div>
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Protected by Bharat Encryption Systems
          </p>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ users, channels, packages }: any) => {
  const now = new Date();
  const activeUsers = users.filter((u: any) => new Date(u.expiryDate) >= now).length;
  const expiredUsers = users.length - activeUsers;

  const growthData = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, i) => ({
      name: m,
      users: Math.floor((users.length || 10) * (0.5 + i * 0.1))
    }));
  }, [users.length]);

  return (
    <div className="space-y-8 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="people" label="Total Subs" value={users.length} color="blue" sub={`${activeUsers} Active / ${expiredUsers} Exp`} />
        <StatCard icon="live_tv" label="Channels" value={channels.length} color="indigo" />
        <StatCard icon="inventory_2" label="Packages" value={packages.length} color="emerald" />
        <StatCard icon="bolt" label="Active Rate" value={`${users.length ? Math.round((activeUsers / users.length) * 100) : 0}%`} color="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-8">Subscriber Growth</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorU" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="users" stroke="#2563eb" fill="url(#colorU)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-black text-slate-800">Server Health</h3>
          <HealthRow label="API Uptime" value={99.9} />
          <HealthRow label="DB Latency" value={14} suffix="ms" inverse />
          <HealthRow label="Bandwidth" value={42} />
          <div className="pt-6 border-t">
            <div className="bg-blue-50 p-4 rounded-2xl flex items-center space-x-3">
              <span className="material-icons text-blue-600">verified</span>
              <div className="text-[10px] font-bold text-blue-800 leading-tight uppercase tracking-wider">
                All systems functional.<br/>Last Sync: Just now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, sub }: any) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
        color === 'blue' ? 'bg-blue-600 shadow-blue-900/20' : 
        color === 'indigo' ? 'bg-indigo-600 shadow-indigo-900/20' : 
        color === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/20' : 
        'bg-amber-500 shadow-amber-900/20'
      }`}>
        <span className="material-icons">{icon}</span>
      </div>
    </div>
    <div>
      <h4 className="text-3xl font-black text-slate-800 mb-1">{value}</h4>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-2 font-bold">{sub}</p>}
    </div>
  </div>
);

const HealthRow = ({ label, value, suffix = '%', inverse = false }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
      <span>{label}</span>
      <span className="text-slate-800">{value}{suffix}</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${inverse ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  </div>
);

const RequestsView = ({ requests, users, onApprove, onSwap, onDelete }: any) => {
  const [modal, setModal] = useState<any>(null);
  const [f, setF] = useState({ name: '', mobile: '', userId: '', confirm: false });

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-in">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Request Queue</h3>
        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-wider">{requests.length} Requests</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-4">Device</th>
              <th className="px-8 py-4">MAC Address</th>
              <th className="px-8 py-4">Timestamp</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((r: any) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                      <span className="material-icons">devices</span>
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-800">{r.deviceName || 'Android TV'}</div>
                      <div className="text-[10px] font-bold text-slate-400">{r.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 font-mono text-xs font-black text-blue-600">{r.macAddress}</td>
                <td className="px-8 py-6 text-xs font-bold text-slate-400">{new Date(r.requestTime).toLocaleString()}</td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button onClick={() => {setModal({type:'approve', r}); setF({name:'', mobile:'', userId:'', confirm:false});}} className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"><span className="material-icons">person_add</span></button>
                  <button onClick={() => {setModal({type:'swap', r}); setF({name:'', mobile:'', userId:'', confirm:false});}} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><span className="material-icons">sync</span></button>
                  <button onClick={() => onDelete(r.id)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-2xl transition-all"><span className="material-icons">close</span></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in scale-95">
            <h4 className="text-2xl font-black text-slate-800 mb-2">{modal.type === 'approve' ? 'Activate User' : 'Replace Device'}</h4>
            <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">MAC: {modal.r.macAddress}</p>
            <div className="space-y-6">
              {modal.type === 'approve' ? (
                <>
                  <InputField label="Subscriber Name" value={f.name} onChange={(v:any)=>setF({...f, name:v})} />
                  <InputField label="Mobile Number" value={f.mobile} onChange={(v:any)=>setF({...f, mobile:v})} />
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Choose User</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm" value={f.userId} onChange={(e)=>setF({...f, userId:e.target.value})}>
                      <option value="">-- Select Subscriber --</option>
                      {users.map((u:any) => <option key={u.id} value={u.id}>{u.name} ({u.macAddress})</option>)}
                    </select>
                  </div>
                  <label className="flex items-center space-x-3 p-4 bg-blue-50 rounded-2xl cursor-pointer group">
                    <input type="checkbox" checked={f.confirm} onChange={(e)=>setF({...f, confirm:e.target.checked})} className="w-5 h-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs font-bold text-blue-800">I confirm replacing the device MAC for this user.</span>
                  </label>
                </>
              )}
            </div>
            <div className="mt-10 flex space-x-3">
              <button onClick={()=>setModal(null)} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px] hover:text-slate-800">Cancel</button>
              <button 
                onClick={() => {
                  if(modal.type==='approve') onApprove(modal.r.id, f.name, f.mobile);
                  else onSwap(modal.r.id, f.userId);
                  setModal(null);
                }}
                disabled={modal.type==='approve' ? (!f.name || !f.mobile) : (!f.userId || !f.confirm)}
                className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 disabled:opacity-50 uppercase tracking-widest text-[10px]"
              >
                {modal.type === 'approve' ? 'Activate Now' : 'Execute Swap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UsersView = ({ users, packages, onRecharge, onDelete }: any) => {
  const [modal, setModal] = useState<any>(null);
  const [pkgId, setPkgId] = useState('');
  const now = new Date();

  return (
    <div className="space-y-6 animate-in">
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-4">Subscriber</th>
              <th className="px-8 py-4">Hardware ID</th>
              <th className="px-8 py-4">Plan</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u: any) => {
              const exp = new Date(u.expiryDate);
              const isActive = exp >= now;
              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{u.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-wider">{u.mobile}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs font-bold text-slate-500">{u.macAddress}</td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-black text-slate-800">{u.activePlan || 'No Plan'}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Exp: {exp.toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {isActive ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button onClick={()=>setModal(u)} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">Recharge</button>
                    <button onClick={()=>onDelete(u.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"><span className="material-icons text-sm">delete</span></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl animate-in">
            <h4 className="text-2xl font-black text-slate-800 mb-2">Recharge Plan</h4>
            <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Subscriber: {modal.name}</p>
            <div className="grid grid-cols-2 gap-4">
              {packages.map((p: any) => (
                <button 
                  key={p.id} 
                  onClick={() => setPkgId(p.id)}
                  className={`p-6 border-2 rounded-2xl text-left transition-all ${pkgId === p.id ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <div className="text-sm font-black text-slate-800 mb-1">{p.name}</div>
                  <div className="text-xl font-black text-blue-600">₹{p.price}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{p.durationDays} Days</div>
                </button>
              ))}
            </div>
            <div className="mt-10 flex space-x-3">
              <button onClick={()=>setModal(null)} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Cancel</button>
              <button 
                onClick={() => { onRecharge(modal.id, pkgId); setModal(null); }}
                disabled={!pkgId}
                className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 disabled:opacity-50 uppercase tracking-widest text-[10px]"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SimpleListView = ({ title, items, onAdd, onDelete }: any) => {
  const [val, setVal] = useState('');
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex space-x-4">
        <div className="flex-1">
          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm" placeholder={`Enter ${title} Name...`} value={val} onChange={(e)=>setVal(e.target.value)}/>
        </div>
        <button onClick={()=>{if(val){onAdd(val); setVal('');}}} className="bg-blue-600 text-white px-8 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-900/20">Add {title}</button>
      </div>
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
        {items.map((i: any) => (
          <div key={i.id} className="px-8 py-5 flex justify-between items-center group hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <span className="material-icons">{title === 'Category' ? 'category' : 'auto_awesome_motion'}</span>
              </div>
              <span className="text-sm font-black text-slate-800">{i.name}</span>
            </div>
            <button onClick={() => onDelete(i.id)} className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <span className="material-icons text-sm">delete</span>
            </button>
          </div>
        ))}
        {items.length === 0 && <div className="p-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No {title}s Registered</div>}
      </div>
    </div>
  );
};

// --- App Root ---

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<DeviceRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    if (!isLoggedIn) return;
    
    const unsubUsers = onSnapshot(collection(db, "users"), (s) => setUsers(s.docs.map(d => ({ ...d.data(), id: d.id } as User))));
    const unsubReqs = onSnapshot(collection(db, "deviceRequests"), (s) => setRequests(s.docs.map(d => ({ ...d.data(), id: d.id, macAddress: d.data().macAddress || d.id } as DeviceRequest))));
    const unsubCats = onSnapshot(collection(db, "categories"), (s) => setCategories(s.docs.map(d => ({ ...d.data(), id: d.id } as any))));
    const unsubBqs = onSnapshot(collection(db, "bouquets"), (s) => setBouquets(s.docs.map(d => ({ ...d.data(), id: d.id } as any))));
    const unsubPkgs = onSnapshot(collection(db, "packages"), (s) => setPackages(s.docs.map(d => ({ ...d.data(), id: d.id } as any))));
    const unsubChans = onSnapshot(collection(db, "channels"), (s) => setChannels(s.docs.map(d => ({ ...d.data(), id: d.id } as any))));

    return () => { unsubUsers(); unsubReqs(); unsubCats(); unsubBqs(); unsubPkgs(); unsubChans(); };
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Login onLogin={setIsLoggedIn} />;

  const handleApprove = async (rid: string, name: string, mob: string) => {
    const r = requests.find(i => i.id === rid);
    if(!r) return;
    await addDoc(collection(db, "users"), { 
      name, 
      mobile: mob, 
      macAddress: r.macAddress, 
      expiryDate: new Date(Date.now() - 86400000).toISOString(), 
      activePlan: 'No Plan',
      createdAt: new Date().toISOString() 
    });
    await deleteDoc(doc(db, "deviceRequests", rid));
  };

  const handleSwap = async (rid: string, uid: string) => {
    const r = requests.find(i => i.id === rid);
    if(!r) return;
    await updateDoc(doc(db, "users", uid), { macAddress: r.macAddress });
    await deleteDoc(doc(db, "deviceRequests", rid));
  };

  const handleRecharge = async (uid: string, pid: string) => {
    const p = packages.find(i => i.id === pid);
    if(!p) return;
    const exp = new Date();
    exp.setDate(exp.getDate() + p.durationDays);
    await updateDoc(doc(db, "users", uid), { expiryDate: exp.toISOString(), activePlan: p.name });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20">
        <div className="p-8 flex items-center space-x-4 border-b border-slate-800/50">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/40">
            <span className="material-icons text-xl">tv</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">Bharat Digital</h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Admin 3.0</p>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem icon="dashboard" label="Dashboard" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <SidebarItem icon="notifications_active" label="Requests" active={currentView === 'requests'} onClick={() => setCurrentView('requests')} count={requests.length} />
          <SidebarItem icon="people" label="Subscribers" active={currentView === 'users'} onClick={() => setCurrentView('users')} />
          <div className="pt-8 pb-3 px-3 text-[10px] text-slate-600 uppercase font-black tracking-[0.2em]">Management</div>
          <SidebarItem icon="category" label="Categories" active={currentView === 'categories'} onClick={() => setCurrentView('categories')} />
          <SidebarItem icon="auto_awesome_motion" label="Bouquets" active={currentView === 'bouquets'} onClick={() => setCurrentView('bouquets')} />
          <SidebarItem icon="inventory_2" label="Pricing Plans" active={currentView === 'packages'} onClick={() => setCurrentView('packages')} />
        </nav>
        <div className="p-6 border-t border-slate-800/50">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
            <span className="material-icons text-[20px]">logout</span>
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-10 sticky top-0 z-10">
          <h2 className="text-xl font-black text-slate-800 capitalize tracking-tight">{currentView.replace(/([A-Z])/g, ' $1')}</h2>
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Sujit Kumar</p>
                <p className="text-[10px] font-bold text-slate-400">Master Administrator</p>
             </div>
             <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center">
                <span className="material-icons text-slate-400">face</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {currentView === 'dashboard' && <DashboardView users={users} channels={channels} packages={packages} />}
          {currentView === 'requests' && <RequestsView requests={requests} users={users} onApprove={handleApprove} onSwap={handleSwap} onDelete={(id: string) => deleteDoc(doc(db, "deviceRequests", id))} />}
          {currentView === 'users' && <UsersView users={users} packages={packages} onRecharge={handleRecharge} onDelete={(id: string) => deleteDoc(doc(db, "users", id))} />}
          {currentView === 'categories' && <SimpleListView title="Category" items={categories} onAdd={(n: any) => addDoc(collection(db, "categories"), { name: n })} onDelete={(id: string) => deleteDoc(doc(db, "categories", id))} />}
          {currentView === 'bouquets' && <SimpleListView title="Bouquet" items={bouquets} onAdd={(n: any) => addDoc(collection(db, "bouquets"), { name: n })} onDelete={(id: string) => deleteDoc(doc(db, "bouquets", id))} />}
          {currentView === 'packages' && <PackageListView packages={packages} bouquets={bouquets} onAdd={(v: any) => addDoc(collection(db, "packages"), v)} onDelete={(id: string) => deleteDoc(doc(db, "packages", id))} />}
        </div>
      </main>
    </div>
  );
};

const PackageListView = ({ packages, bouquets, onAdd, onDelete }: any) => {
  const [modal, setModal] = useState(false);
  const [f, setF] = useState({ name: '', price: '', duration: '', selected: [] as string[] });
  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800">Available Plans</h3>
        <button onClick={() => setModal(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-900/20">Create New Plan</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((p: any) => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group hover:shadow-2xl transition-all">
            <div className="text-3xl font-black text-blue-600 mb-2">₹{p.price}</div>
            <div className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">{p.name}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">{p.durationDays} Days Validity</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {p.bouquets?.map((b: string) => <span key={b} className="text-[9px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-slate-500">{b}</span>)}
            </div>
            <button onClick={() => onDelete(p.id)} className="absolute top-6 right-6 p-2 text-red-200 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><span className="material-icons text-sm">delete</span></button>
          </div>
        ))}
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in">
            <h4 className="text-2xl font-black text-slate-800 mb-8">New Pricing Package</h4>
            <div className="space-y-6">
              <InputField label="Plan Name" value={f.name} onChange={(v: any) => setF({ ...f, name: v })} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Price (₹)" value={f.price} onChange={(v: any) => setF({ ...f, price: v })} />
                <InputField label="Duration (Days)" value={f.duration} onChange={(v: any) => setF({ ...f, duration: v })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Included Bouquets</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {bouquets.map((b: any) => (
                    <label key={b.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 text-blue-600" onChange={(e) => {
                        if(e.target.checked) setF({...f, selected:[...f.selected, b.name]});
                        else setF({...f, selected: f.selected.filter(n => n !== b.name)});
                      }} />
                      <span className="text-xs font-bold text-slate-600">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10 flex space-x-3">
              <button onClick={() => setModal(false)} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Cancel</button>
              <button onClick={() => { onAdd({ name: f.name, price: parseFloat(f.price), durationDays: parseInt(f.duration), bouquets: f.selected }); setModal(false); }} className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-700 uppercase tracking-widest text-[10px]">Create Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Render ---
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}
