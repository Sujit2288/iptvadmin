
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Sujit@123' && password === 'Sujit@123') {
      onLogin(true);
    } else {
      setError('Invalid username or password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-slate-800 rounded-full" />
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-10 pt-12 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-900/30 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
             <span className="material-icons text-4xl text-white">shield</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Bharat Digital</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-10">Admin Control Center</p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Username</label>
              <div className="relative">
                 <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">person</span>
                 <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700"
                  placeholder="Admin ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Password</label>
              <div className="relative">
                 <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">lock</span>
                 <input 
                  type="password" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center space-x-3 animate-in shake duration-300">
                 <span className="material-icons text-sm">error</span>
                 <span className="text-xs font-bold">{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all uppercase tracking-widest text-xs"
            >
              Authorize Access
            </button>
          </form>
        </div>
        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
             &copy; 2024 Bharat Digital Systems. All Rights Reserved.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
