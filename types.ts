
export interface User {
  id: string;
  name: string;
  mobile: string;
  macAddress: string;
  expiryDate: string; // ISO string
  status: 'Active' | 'Expired';
  activePlan: string;
  createdAt: string;
}

export interface DeviceRequest {
  id: string;
  macAddress: string;
  deviceName: string;
  requestTime: string; // ISO string
}

export interface Category {
  id: string;
  name: string;
  channelCount: number;
}

export interface Bouquet {
  id: string;
  name: string;
  channelCount: number;
}

export interface ChannelSource {
  name: string;
  url: string;
  type: 'hls' | 'dash';
  drm?: {
    kid: string;
    key: string;
  };
}

export interface Channel {
  id: string;
  sid: string; // Added Service ID
  name: string;
  img: string;
  category: string;
  bouquet: string;
  description: string;
  sources: ChannelSource[];
}

export interface Package {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  bouquets: string[];
}
