
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  setDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from './services/firebase';
import { 
  User, DeviceRequest, Category, Bouquet, Channel, Package 
} from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Requests from './components/Requests';
import Users from './components/Users';
import Channels from './components/Channels';
import Categories from './components/Categories';
import Bouquets from './components/Bouquets';
import Packages from './components/Packages';

type View = 'dashboard' | 'requests' | 'users' | 'channels' | 'categories' | 'bouquets' | 'packages';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Database state
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<DeviceRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  // Real-time listeners
  useEffect(() => {
    if (!isLoggedIn) return;

    // Listen to Users
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const now = new Date();
      const userData = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        const expiryDate = data.expiryDate || new Date(0).toISOString();
        const exp = new Date(expiryDate);
        return { 
          ...data, 
          id: doc.id,
          expiryDate: expiryDate,
          status: exp < now ? 'Expired' : 'Active'
        } as User;
      });
      setUsers(userData.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')));
    });

    // Listen to Device Requests
    const unsubReqs = onSnapshot(collection(db, "deviceRequests"), (snapshot) => {
      const reqData = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return { 
          ...data, 
          id: doc.id,
          macAddress: data.macAddress || data.mac || doc.id,
          requestTime: data.requestTime || new Date().toISOString()
        } as DeviceRequest;
      });
      setRequests(reqData.sort((a, b) => b.requestTime.localeCompare(a.requestTime)));
    });

    // Content Listeners
    const unsubCats = onSnapshot(collection(db, "categories"), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category)));
    });

    const unsubBqs = onSnapshot(collection(db, "bouquets"), (snapshot) => {
      setBouquets(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Bouquet)));
    });

    const unsubChans = onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannels(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Channel)));
    });

    const unsubPkgs = onSnapshot(collection(db, "packages"), (snapshot) => {
      setPackages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Package)));
    });

    return () => {
      unsubUsers(); unsubReqs(); unsubCats(); unsubBqs(); unsubChans(); unsubPkgs();
    };
  }, [isLoggedIn]);

  const handleLogin = (success: boolean) => {
    if (success) setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Database Actions
  const handleApproveRequest = async (requestId: string, name: string, mobile: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    try {
      const newUser: Omit<User, 'id'> = {
        name,
        mobile,
        macAddress: req.macAddress,
        expiryDate: new Date(Date.now() - 86400000).toISOString(), 
        status: 'Expired',
        activePlan: 'No Plan',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "users"), newUser);
      await deleteDoc(doc(db, "deviceRequests", requestId));
    } catch (e) {
      console.error("Error approving request:", e);
    }
  };

  const handleSwapRequest = async (requestId: string, userId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    try {
      await updateDoc(doc(db, "users", userId), { macAddress: req.macAddress });
      await deleteDoc(doc(db, "deviceRequests", requestId));
    } catch (e) {
      console.error("Error swapping device:", e);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    await deleteDoc(doc(db, "deviceRequests", id));
  };

  const handleRechargeUser = async (userId: string, pkgId: string) => {
    const pkg = packages.find(p => p.id === pkgId);
    if (!pkg) return;

    try {
      const newExpDate = new Date();
      newExpDate.setDate(newExpDate.getDate() + pkg.durationDays);
      
      await updateDoc(doc(db, "users", userId), {
        expiryDate: newExpDate.toISOString(),
        activePlan: pkg.name,
        status: 'Active'
      });
    } catch (e) {
      console.error("Error recharging user:", e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
  };

  const handleAddChannel = async (channel: Channel) => {
    const { id, ...data } = channel;
    await addDoc(collection(db, "channels"), data);
  };

  const handleUpdateChannel = async (channel: Channel) => {
    const { id, ...data } = channel;
    await updateDoc(doc(db, "channels", id), data);
  };

  const handleAddCategory = async (cat: Category) => {
    const { id, ...data } = cat;
    await addDoc(collection(db, "categories"), data);
  };

  const handleAddBouquet = async (bq: Bouquet) => {
    const { id, ...data } = bq;
    await addDoc(collection(db, "bouquets"), data);
  };

  const handleAddPackage = async (pkg: Package) => {
    const { id, ...data } = pkg;
    await addDoc(collection(db, "packages"), data);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard users={users} channels={channels} packages={packages} />;
      case 'requests':
        return (
          <Requests 
            requests={requests} 
            users={users}
            onApprove={handleApproveRequest}
            onSwap={handleSwapRequest}
            onDelete={handleDeleteRequest}
          />
        );
      case 'users':
        return (
          <Users 
            users={users} 
            packages={packages}
            onRecharge={handleRechargeUser}
            onDelete={handleDeleteUser}
          />
        );
      case 'channels':
        return (
          <Channels 
            channels={channels} 
            categories={categories} 
            bouquets={bouquets}
            onAdd={handleAddChannel}
            onUpdate={handleUpdateChannel}
            onDelete={(id) => deleteDoc(doc(db, "channels", id))}
          />
        );
      case 'categories':
        return (
          <Categories 
            categories={categories} 
            onAdd={handleAddCategory}
            onDelete={(id) => deleteDoc(doc(db, "categories", id))}
          />
        );
      case 'bouquets':
        return (
          <Bouquets 
            bouquets={bouquets} 
            onAdd={handleAddBouquet}
            onDelete={(id) => deleteDoc(doc(db, "bouquets", id))}
          />
        );
      case 'packages':
        return (
          <Packages 
            packages={packages} 
            bouquets={bouquets}
            onAdd={handleAddPackage}
            onDelete={(id) => deleteDoc(doc(db, "packages", id))}
          />
        );
      default:
        return <Dashboard users={users} channels={channels} packages={packages} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="material-icons text-white">tv</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Bharat Digital</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon="dashboard" 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
          />
          <SidebarItem 
            icon="devices" 
            label="Device Requests" 
            active={currentView === 'requests'} 
            onClick={() => setCurrentView('requests')}
            count={requests.length}
          />
          <SidebarItem 
            icon="people" 
            label="User Management" 
            active={currentView === 'users'} 
            onClick={() => setCurrentView('users')} 
          />
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</div>
          <SidebarItem 
            icon="live_tv" 
            label="Channels" 
            active={currentView === 'channels'} 
            onClick={() => setCurrentView('channels')} 
          />
          <SidebarItem 
            icon="category" 
            label="Categories" 
            active={currentView === 'categories'} 
            onClick={() => setCurrentView('categories')} 
          />
          <SidebarItem 
            icon="auto_awesome_motion" 
            label="Bouquets" 
            active={currentView === 'bouquets'} 
            onClick={() => setCurrentView('bouquets')} 
          />
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business</div>
          <SidebarItem 
            icon="inventory_2" 
            label="Packages" 
            active={currentView === 'packages'} 
            onClick={() => setCurrentView('packages')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-red-400"
          >
            <span className="material-icons text-sm">logout</span>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {currentView.replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <p className="text-sm font-bold text-slate-800">Admin Panel</p>
                <p className="text-xs text-slate-500">Sujit Kumar</p>
             </div>
             <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="material-icons text-slate-500">person</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

interface SidebarItemProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, count }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className={`material-icons text-[20px] ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
        {icon}
      </span>
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
    {count !== undefined && count > 0 && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white'}`}>
        {count}
      </span>
    )}
  </button>
);

export default App;
