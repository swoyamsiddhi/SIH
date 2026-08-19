import { apiClient } from './client';
import { events as mockEvents, event as mockEvent } from '../../data/mockData';

export const eventsApi = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/events');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockEvents;
    }
  },
  
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/events/${id}`);
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockEvent;
    }
  },
  
  register: async (id, athleteId) => {
    try {
      const res = await apiClient.post(`/events/${id}/register`, { athlete_id: athleteId });
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return { status: "REGISTERED" };
    }
  }
};
