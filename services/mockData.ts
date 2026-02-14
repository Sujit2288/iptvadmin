
import { User, DeviceRequest, Category, Bouquet, Channel, Package } from '../types';

export const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'Rahul Kumar',
    mobile: '9876543210',
    macAddress: '00:1A:2B:3C:4D:5E',
    expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'Active',
    activePlan: 'Gold Pack',
    createdAt: '2023-10-01T10:00:00Z'
  },
  {
    id: 'u2',
    name: 'Suresh Raina',
    mobile: '8877665544',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    expiryDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'Expired',
    activePlan: 'Basic Pack',
    createdAt: '2023-09-15T12:00:00Z'
  }
];

export const initialRequests: DeviceRequest[] = [
  {
    id: 'req1',
    macAddress: '11:22:33:44:55:66',
    deviceName: 'Firestick 4K',
    requestTime: new Date().toISOString()
  },
  {
    id: 'req2',
    macAddress: '77:88:99:00:AA:BB',
    deviceName: 'Mi Box S',
    requestTime: new Date(Date.now() - 3600000).toISOString()
  }
];

export const initialCategories: Category[] = [
  { id: 'c1', name: 'News', channelCount: 15 },
  { id: 'c2', name: 'Sports', channelCount: 8 },
  { id: 'c3', name: 'Entertainment', channelCount: 22 }
];

export const initialBouquets: Bouquet[] = [
  { id: 'b1', name: 'Zee Network', channelCount: 10 },
  { id: 'b2', name: 'Sony Liv', channelCount: 12 }
];

export const initialChannels: Channel[] = [
  {
    id: 'ch1',
    name: "Zee Bharat",
    img: "https://imagesdishtvd2h.whatsonindia.com/dasimages/channel/landscape/360x270/TknReKLD.png",
    category: "News",
    bouquet: "Zee Network",
    description: "India",
    sources: [
      {
        name: "Server 1",
        url: "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Zeehindustan/default/manifest.mpd",
        type: "dash",
        drm: {
          kid: "10616d7c4bee41f1825bd805c6295172",
          key: "dc85f2112f63477fb39fc149493c49be"
        }
      }
    ]
  },
  {
    id: 'ch2',
    name: "ET Now Swadesh",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8s5ukJJCvsZwP7vO8PlUKJHwlnyHZqBiYlA&s",
    category: "News",
    bouquet: "Zee Network",
    description: "India",
    sources: [
      {
        name: "Server 1",
        url: "https://d32gxr3r1ksq2p.cloudfront.net/master.m3u8",
        type: "hls"
      }
    ]
  }
];

export const initialPackages: Package[] = [
  {
    id: 'p1',
    name: 'Gold Pack',
    price: 499,
    durationDays: 30,
    bouquets: ['Zee Network', 'Sony Liv']
  },
  {
    id: 'p2',
    name: 'Basic Pack',
    price: 199,
    durationDays: 28,
    bouquets: ['Zee Network']
  }
];
