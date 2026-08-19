import { apiClient } from './client';
import { hardwareKits as mockHardwareKits } from '../../data/mockData';

export const hardwareApi = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/hardware');
      // Map API response to frontend expected structure
      return res.data.map(k => ({
        id: k.device_id,
        status: k.status === 'ACTIVE' ? 'Online' : k.status === 'INACTIVE' ? 'Offline' : 'Maintenance',
        battery: k.battery_level,
        firmware: k.firmware_version,
        lastSync: k.last_sync ? new Date(k.last_sync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Never',
        sensor: true,
        bluetooth: true
      }));
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockHardwareKits;
    }
  }
};
