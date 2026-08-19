import { apiClient } from './client';
import { adminStats as mockAdminStats, talentHotspots as mockHotspots, liveEventData as mockLiveEventData } from '../../data/mockData';

export const adminApi = {
  getKPIs: async () => {
    try {
      const res = await apiClient.get('/admin/analytics/kpi');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockAdminStats;
    }
  },
  
  getHotspots: async () => {
    try {
      const res = await apiClient.get('/admin/analytics/hotspots');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockHotspots;
    }
  },
  
  getLiveEventTelemetry: async (id) => {
    try {
      const res = await apiClient.get(`/admin/events/live/${id}`);
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockLiveEventData;
    }
  }
};
