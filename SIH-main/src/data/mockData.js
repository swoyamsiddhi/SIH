/* ═══════════════════════════════════════════════════════
   KHEL-NET MOCK DATA STORE
   Comprehensive data layer for all 3 interfaces (~27 screens)
   ═══════════════════════════════════════════════════════ */

/* ── Primary athlete (logged-in user) ────────────────── */
export const athlete = {
  id: 'ATH-28473',
  name: 'Neeraj',
  age: 17,
  location: 'Chennai, Tamil Nadu',
  school: 'DAV Boys Senior Secondary School',
  sport: 'Athletics (Sprinting)',
  height: '178 cm',
  weight: '68 kg',
  dominant: 'Right',
  athleteDNA: 86,
  dnaChangePercent: 14,
  verificationScore: 97,
  attributes: {
    Speed: 87,
    Power: 92,
    Agility: 91,
    Endurance: 76,
    Reaction: 89,
    Flexibility: 82,
    Balance: 84,
    Movement: 90,
  },
  strengths: ['Explosive Power', 'Acceleration', 'Reaction Time'],
  developmentAreas: ['Endurance', 'Balance'],
}

/* ── Sport matches ───────────────────────────────────── */
export const sportMatches = [
  { sport: 'Sprinting', match: 95, rank: 1, contributingAttrs: { Acceleration: 94, 'Explosive Power': 93, Reaction: 87, Agility: 91 } },
  { sport: 'Football', match: 90, rank: 2, contributingAttrs: { Agility: 91, Speed: 87, Endurance: 76, 'Ball Control': 82 } },
  { sport: 'Basketball', match: 86, rank: 3, contributingAttrs: { Power: 92, Agility: 91, Reaction: 89, Speed: 87 } },
  { sport: 'Long Jump', match: 84, rank: 4, contributingAttrs: { 'Explosive Power': 93, Speed: 87, Balance: 84, Movement: 90 } },
  { sport: 'Badminton', match: 78, rank: 5, contributingAttrs: { Reaction: 89, Agility: 91, Movement: 90, Endurance: 76 } },
]

/* ── Assessments ─────────────────────────────────────── */
export const assessments = [
  ['vertical-jump', 'Vertical Jump', 'Physical', 'Explosive leg power', '3 min', 'Medium'],
  ['squat', 'Squat', 'Physical', 'Lower-body control', '4 min', 'Easy'],
  ['push-up', 'Push-up', 'Physical', 'Upper-body strength', '3 min', 'Medium'],
  ['sprint', 'Sprint', 'Physical', 'Acceleration & top speed', '5 min', 'Medium'],
  ['shuttle-run', 'Shuttle Run', 'Physical', 'Agility & endurance', '6 min', 'Hard'],
  ['balance', 'Balance', 'Physical', 'Stability & control', '3 min', 'Easy'],
  ['reaction-test', 'Reaction Test', 'Reaction', 'Response speed', '2 min', 'Easy'],
  ['coordination-test', 'Coordination Test', 'Reaction', 'Movement coordination', '4 min', 'Medium'],
].map(([id, name, category, measures, time, difficulty]) => ({
  id, name, category, measures, time, difficulty,
}))

/* ── Assessment result ───────────────────────────────── */
export const result = {
  jumpHeight: '47 cm',
  explosivePower: '91 percentile',
  form: 88,
  consistency: 94,
  verification: 97,
  peakHeight: '49 cm',
  consistencyValues: [82, 90, 86, 94, 89, 92],
  verificationBreakdown: {
    'Video Integrity': true,
    'Pose Continuity': true,
    'Sensor Signal': true,
    'Timing Consistency': true,
    'Device Integrity': true,
  },
}

/* ── Growth history (monthly) ────────────────────────── */
export const growthHistory = {
  months: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  overall: [68, 72, 76, 80, 83, 86],
  power: [75, 78, 82, 86, 89, 92],
  speed: [70, 73, 78, 81, 84, 87],
  agility: [72, 76, 80, 85, 88, 91],
}

/* ── Performance history ─────────────────────────────── */
export const performanceHistory = [
  { date: '18 Aug', test: 'Vertical Jump', result: '47 cm', verified: true },
  { date: '12 Aug', test: 'Sprint', result: '5.2 sec', verified: true },
  { date: '02 Aug', test: 'Sprint', result: '5.4 sec', verified: true },
  { date: '28 Jul', test: 'Squat', result: '92% form', verified: true },
  { date: '20 Jul', test: 'Vertical Jump', result: '43 cm', verified: true },
  { date: '15 Jul', test: 'Reaction Test', result: '0.21 sec', verified: true },
  { date: '01 Jul', test: 'Balance', result: '87%', verified: true },
  { date: '22 Jun', test: 'Shuttle Run', result: '9.8 sec', verified: true },
]

export const personalBests = [
  { metric: 'Vertical Jump', value: '47 cm', date: '18 Aug' },
  { metric: 'Sprint (30m)', value: '5.2 sec', date: '12 Aug' },
  { metric: 'Reaction Time', value: '0.21 sec', date: '15 Jul' },
  { metric: 'Form Score', value: '94%', date: '28 Jul' },
]

/* ── Events ──────────────────────────────────────────── */
export const events = [
  { id: 1, name: 'Khelo Talent Hunt', organizer: 'SAI Chennai', location: 'Chennai', date: '28 Aug', ageRange: '12–18', sports: ['Athletics', 'Football', 'Basketball'], assessments: ['Sprint', 'Jump', 'Agility'], capacity: 500, registered: 347, status: 'Upcoming' },
  { id: 2, name: 'School Sports Assessment', organizer: 'CBSE', location: 'Kanchipuram', date: '4 Sept', ageRange: '10–16', sports: ['Athletics', 'Badminton'], assessments: ['Sprint', 'Shuttle Run', 'Balance'], capacity: 200, registered: 89, status: 'Upcoming' },
  { id: 3, name: 'Regional Athletics Trial', organizer: 'Tamil Nadu Sports Authority', location: 'Chennai', date: '12 Sept', ageRange: '14–21', sports: ['Athletics'], assessments: ['Sprint', 'Jump', 'Endurance'], capacity: 300, registered: 256, status: 'Upcoming' },
  { id: 4, name: 'District Sprint Championship', organizer: 'District Sports Board', location: 'Coimbatore', date: '20 Sept', ageRange: '15–20', sports: ['Athletics'], assessments: ['Sprint'], capacity: 150, registered: 42, status: 'Upcoming' },
  { id: 5, name: 'National U-18 Trials', organizer: 'SAI', location: 'New Delhi', date: '5 Oct', ageRange: '14–18', sports: ['Athletics', 'Football', 'Basketball', 'Badminton'], assessments: ['Full Battery'], capacity: 1000, registered: 812, status: 'Upcoming' },
]

export const event = events[0]

/* ── Scout alerts (athlete side) ─────────────────────── */
export const scoutAlerts = [
  { id: 1, organization: 'XYZ Sports Academy', reason: 'Top 5% sprint potential in your age group', date: '16 Aug', read: false },
  { id: 2, organization: 'Chennai Sports Foundation', reason: 'Shortlisted for evaluation — explosive power category', date: '10 Aug', read: true },
  { id: 3, organization: 'National Athletics Program', reason: 'Profile viewed by 3 scouts this week', date: '5 Aug', read: true },
]

/* ── Scout stats ─────────────────────────────────────── */
export const scoutStats = {
  athletesAssessed: 12482,
  highPotential: 347,
  newAlerts: 18,
  upcomingEvents: 6,
}

/* ── Scout athletes (expanded pool) ──────────────────── */
export const scoutAthletes = [
  ['ATH-28473', 'Sprint', 95, 14, 98, 20, 'Chennai'],
  ['ATH-19284', 'Football', 93, 18, 96, 17, 'Chennai'],
  ['ATH-18211', 'Basketball', 91, 10, 97, 18, 'Bengaluru'],
  ['ATH-75219', 'Sprint', 92, 16, 99, 16, 'Coimbatore'],
  ['ATH-89422', 'Badminton', 88, 9, 94, 15, 'Hyderabad'],
  ['ATH-56733', 'Football', 90, 13, 96, 19, 'Chennai'],
  ['ATH-44920', 'Long Jump', 87, 20, 95, 17, 'Madurai'],
  ['ATH-64319', 'Sprint', 89, 12, 98, 18, 'Pune'],
  ['ATH-20977', 'Basketball', 85, 8, 93, 16, 'Mumbai'],
  ['ATH-71003', 'Football', 86, 15, 97, 20, 'Delhi'],
  ['ATH-19912', 'Sprint', 94, 21, 98, 17, 'Chennai'],
  ['ATH-40483', 'Badminton', 83, 7, 94, 18, 'Kochi'],
  ['ATH-33190', 'Sprint', 91, 11, 96, 15, 'Bengaluru'],
  ['ATH-55821', 'Football', 88, 17, 95, 19, 'Delhi'],
  ['ATH-27490', 'Basketball', 90, 14, 97, 17, 'Mumbai'],
  ['ATH-61038', 'Long Jump', 86, 9, 93, 16, 'Chennai'],
  ['ATH-48722', 'Sprint', 93, 19, 99, 18, 'Coimbatore'],
  ['ATH-82014', 'Badminton', 85, 12, 95, 20, 'Hyderabad'],
  ['ATH-37266', 'Football', 91, 16, 98, 17, 'Pune'],
  ['ATH-90145', 'Basketball', 87, 10, 94, 16, 'Kochi'],
  ['ATH-14677', 'Sprint', 96, 22, 99, 17, 'Chennai'],
  ['ATH-73580', 'Football', 89, 13, 96, 18, 'Bengaluru'],
  ['ATH-50291', 'Long Jump', 84, 8, 92, 19, 'Madurai'],
  ['ATH-66413', 'Badminton', 82, 6, 91, 15, 'Delhi'],
  ['ATH-41805', 'Sprint', 90, 15, 97, 16, 'Mumbai'],
].map(([id, sport, potential, growth, verification, age, location]) => ({
  id, sport, potential, growth, verification, age, location,
}))

/* ── Scout shortlists ────────────────────────────────── */
export const scoutShortlists = [
  { name: 'Sprint — U18', count: 47, sport: 'Sprint', ageGroup: 'U18' },
  { name: 'Football — U16', count: 29, sport: 'Football', ageGroup: 'U16' },
  { name: 'Potential Camp', count: 18, sport: 'Mixed', ageGroup: 'All' },
]

/* ── Admin / SAI stats ───────────────────────────────── */
export const adminStats = {
  athletesAssessed: 1248291,
  activeAthletes: 832910,
  highPotential: 28491,
  events: 4281,
  assessmentsToday: 12829,
  regionsCovered: 412,
}

/* ── Talent map data ─────────────────────────────────── */
export const talentMapRegions = [
  { state: 'Tamil Nadu', athletes: 142800, topSport: 'Sprint', growth: 18, coords: [78.65, 11.13] },
  { state: 'Maharashtra', athletes: 198400, topSport: 'Football', growth: 14, coords: [75.71, 19.75] },
  { state: 'Karnataka', athletes: 112300, topSport: 'Basketball', growth: 21, coords: [75.71, 15.32] },
  { state: 'Delhi', athletes: 89200, topSport: 'Sprint', growth: 12, coords: [77.21, 28.61] },
  { state: 'Kerala', athletes: 67800, topSport: 'Football', growth: 16, coords: [76.27, 10.85] },
  { state: 'Gujarat', athletes: 78400, topSport: 'Athletics', growth: 9, coords: [71.19, 22.26] },
  { state: 'Uttar Pradesh', athletes: 156200, topSport: 'Sprint', growth: 22, coords: [80.95, 26.85] },
  { state: 'West Bengal', athletes: 94100, topSport: 'Football', growth: 15, coords: [87.85, 22.99] },
  { state: 'Rajasthan', athletes: 62300, topSport: 'Athletics', growth: 11, coords: [74.22, 27.02] },
  { state: 'Punjab', athletes: 71900, topSport: 'Athletics', growth: 13, coords: [75.34, 31.15] },
  { state: 'Haryana', athletes: 83600, topSport: 'Sprint', growth: 25, coords: [76.08, 29.06] },
  { state: 'Telangana', athletes: 58200, topSport: 'Badminton', growth: 19, coords: [79.01, 18.11] },
]

export const talentHotspots = [
  { district: 'Chengalpattu', state: 'Tamil Nadu', sport: 'Sprint', growth: 32, athletes: 4280 },
  { district: 'Pune', state: 'Maharashtra', sport: 'Football', growth: 28, athletes: 8920 },
  { district: 'Bengaluru Urban', state: 'Karnataka', sport: 'Basketball', growth: 24, athletes: 6340 },
  { district: 'Patiala', state: 'Punjab', sport: 'Athletics', growth: 22, athletes: 3180 },
  { district: 'Sonepat', state: 'Haryana', sport: 'Sprint', growth: 30, athletes: 5420 },
]

/* ── Hardware kits ───────────────────────────────────── */
export const hardwareKits = [
  { id: 'KIT-001', status: 'Online', battery: 82, sensor: true, lastSync: '2 min ago', firmware: 'v2.1.4', bluetooth: true },
  { id: 'KIT-002', status: 'Offline', battery: 31, sensor: true, lastSync: '4 hours ago', firmware: 'v2.1.4', bluetooth: false },
  { id: 'KIT-003', status: 'Maintenance', battery: 0, sensor: false, lastSync: '2 days ago', firmware: 'v2.0.8', bluetooth: false },
  { id: 'KIT-004', status: 'Online', battery: 94, sensor: true, lastSync: '30 sec ago', firmware: 'v2.1.4', bluetooth: true },
  { id: 'KIT-005', status: 'Online', battery: 67, sensor: true, lastSync: '5 min ago', firmware: 'v2.1.3', bluetooth: true },
]

/* ── Live event data ─────────────────────────────────── */
export const liveEventData = {
  checkedIn: 437,
  assessmentsCompleted: 291,
  currentlyTesting: 14,
  highPotentialDetected: 23,
  topAthlete: { id: 'ATH-28473', sport: 'Sprint', potential: 96 },
}
