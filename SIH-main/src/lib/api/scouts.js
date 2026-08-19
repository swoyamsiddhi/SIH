import { scoutStats, scoutAthletes, scoutAlerts, scoutShortlists } from '../../data/mockData'

const isStrict = process.env.NEXT_PUBLIC_API_MODE === 'strict'
const API_BASE = 'http://localhost:8000/api/v1'

function getAuthHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('khelnet_token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function getScoutDashboard() {
  if (!isStrict) return scoutStats;
  
  const res = await fetch(`${API_BASE}/scouts/dashboard`, {
    headers: getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function getScoutAlerts() {
  if (!isStrict) return scoutAlerts;
  
  const res = await fetch(`${API_BASE}/scouts/alerts`, {
    headers: getAuthHeader()
  });
  if (!res.ok) throw new Error('Failed to fetch scout alerts');
  return res.json();
}

export async function discoverScoutAthletes(filters = {}) {
  if (!isStrict) {
    // Return mock data
    return scoutAthletes.map(a => ({
        athlete: { id: a.id, location: a.location, age: a.age },
        sport_potential: a.potential,
        growth_trend: "improving", // mock
        verification_score: a.verification,
        scout_review_score: a.potential
    }));
  }
  
  const res = await fetch(`${API_BASE}/scouts/discover`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(filters)
  });
  
  if (!res.ok) throw new Error('Failed to discover athletes');
  return res.json();
}

export async function parseCopilotQuery(query) {
  if (!isStrict) {
    // Mock parser
    return {
      filters: { sport: "Sprinting" },
      explanation: "Mock parsed query for Sprinting"
    };
  }
  
  const res = await fetch(`${API_BASE}/scouts/copilot/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ query })
  });
  
  if (!res.ok) throw new Error('Failed to parse query');
  return res.json();
}

export async function getScoutAthleteProfile(id) {
  if (!isStrict) {
    const a = scoutAthletes.find(x => x.id === id);
    if (!a) throw new Error("Not found");
    return {
      athlete: { id: a.id, name: a.id, location: a.location, age: a.age },
      sport_potential: a.potential,
      growth_trend: "improving",
      verification_score: a.verification,
      scout_review_score: a.potential
    };
  }
  
  const res = await fetch(`${API_BASE}/scouts/athletes/${id}`, {
    headers: getAuthHeader()
  });
  
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function getScoutShortlists() {
  if (!isStrict) return scoutShortlists;
  
  const res = await fetch(`${API_BASE}/scouts/shortlists`, {
    headers: getAuthHeader()
  });
  
  if (!res.ok) throw new Error('Failed to fetch shortlists');
  return res.json();
}
