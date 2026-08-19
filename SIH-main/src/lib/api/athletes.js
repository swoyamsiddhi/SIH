import { apiClient } from './client';
import { athlete as mockAthlete, sportMatches as mockSportMatches, growthHistory as mockGrowth, performanceHistory as mockPerformance, personalBests as mockPersonalBests, scoutAlerts as mockAlerts } from '../../data/mockData';

export const athletesApi = {
  getMe: async () => {
    try {
      const res = await apiClient.get('/athletes/me');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      console.warn("Backend not available, falling back to mock athlete");
      return mockAthlete;
    }
  },

  getDNA: async () => {
    try {
      const res = await apiClient.get('/athletes/me/dna');
      const data = res.data;
      
      // Calculate overall DNA score based on available dimensions
      const validDimensions = Object.values(data.dimensions).filter(v => v !== null);
      const overall = validDimensions.length ? Math.round(validDimensions.reduce((a, b) => a + b, 0) / validDimensions.length) : 0;
      
      // Determine strengths and weaknesses
      const sortedDims = Object.entries(data.dimensions)
        .filter(([_, v]) => v !== null)
        .sort((a, b) => b[1] - a[1]);
        
      const strengths = sortedDims.slice(0, 3).map(d => d[0]);
      const devAreas = sortedDims.slice(-2).map(d => d[0]);
      
      // Convert nulls to 0 for the UI gauges to render properly (or omit them)
      const formattedAttrs = {};
      for (const [k, v] of Object.entries(data.dimensions)) {
        if (v !== null) {
          formattedAttrs[k.charAt(0).toUpperCase() + k.slice(1)] = Math.round(v);
        } else {
          formattedAttrs[`${k.charAt(0).toUpperCase() + k.slice(1)} (Needs Data)`] = 0;
        }
      }

      return {
        athleteDNA: overall,
        dnaChangePercent: 0,
        attributes: formattedAttrs,
        strengths: strengths.length ? strengths : ['Take more assessments'],
        developmentAreas: devAreas.length ? devAreas : ['Take more assessments'],
        dataCompleteness: Math.round(data.data_completeness * 100)
      };
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockAthlete; // mockAthlete contains the mock DNA attributes
    }
  },
  
  getSportPotential: async () => {
    try {
      const res = await apiClient.get('/athletes/me/sport-potential');
      // Map to frontend format
      return res.data.map((p, index) => ({
        sport: p.sport_name,
        match: Math.round(p.suitability_score),
        rank: index + 1,
        confidence: Math.round(p.confidence_score),
        contributingAttrs: p.strengths.reduce((acc, curr, i) => ({...acc, [`Strength ${i+1}`]: curr}), {}),
        strengths: p.strengths,
        gaps: p.development_gaps
      }));
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockSportMatches;
    }
  },

  getGrowth: async () => {
    try {
      const res = await apiClient.get('/athletes/me/growth');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockGrowth;
    }
  },

  getPerformanceHistory: async () => {
    try {
      const res = await apiClient.get('/athletes/me/performance-history');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockPerformance;
    }
  },

  getPersonalBests: async () => {
    try {
      const res = await apiClient.get('/athletes/me/personal-bests');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockPersonalBests;
    }
  },

  getScoutAlerts: async () => {
    try {
      const res = await apiClient.get('/athletes/me/scout-alerts');
      return res.data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_API_MODE === 'strict') throw e;
      return mockAlerts;
    }
  }
};
