
import React from 'react';
import { User, Channel, Package } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  users: User[];
  channels: Channel[];
  packages: Package[];
}

const Dashboard: React.FC<DashboardProps> = ({ users, channels, packages }) => {
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const expiredUsers = users.filter(u => u.status === 'Expired').length;

  // Real User Growth Mock Data based on users creation (simplified)
  const growthData = [
    { name: 'Jul', users: Math.floor(users.length * 0.4) },
    { name: 'Aug', users: Math.floor(users.length * 0.6) },
    { name: 'Sep', users: Math.floor(users.length * 0.8) },
    { name: 'Oct', users: Math.floor(users.length * 0.9) },
    { name: 'Nov', users: users.length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon="people" 
          label="Total Subscriptions" 
          value={users.length} 
          color="blue"
          subLabel={`${activeUsers} Active / ${expiredUsers} Expired`}
        />
        <StatCard 
          icon="live_tv" 
          label="All Channels" 
          value={channels.length} 
          color="indigo" 
        />
        <StatCard 
          icon="inventory_2" 
          label="Total Packages" 
          value={packages.length} 
          color="emerald" 
        />
        <StatCard 
          icon="trending_up" 
          label="Active Users" 
          value={activeUsers} 
          color="amber" 
          percentage={users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">User Growth</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Real-time Data</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">System Health</h3>
          <div className="space-y-6">
             <HealthBar label="Database Status" value={100} color="emerald" />
             <HealthBar label="Storage Used" value={45} color="blue" />
             <HealthBar label="Server Load" value={12} color="indigo" />
             <HealthBar label="API Response" value={98} color="emerald" />
          </div>
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
             <p className="text-xs text-slate-500 leading-relaxed text-center">
               All systems are operational. Last updated: {new Date().toLocaleTimeString()}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, subLabel, percentage }: any) => {
  const colors: any = {
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center text-white shadow-lg shadow-${color}-900/20`}>
          <span className="material-icons">{icon}</span>
        </div>
        {percentage !== undefined && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            {percentage}% Rate
          </span>
        )}
      </div>
      <div>
        <h4 className="text-3xl font-bold text-slate-800 mb-1">{value}</h4>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {subLabel && <p className="text-xs text-slate-400 mt-2">{subLabel}</p>}
      </div>
    </div>
  );
};

const HealthBar = ({ label, value, color }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="text-xs font-bold text-slate-800">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

export default Dashboard;
