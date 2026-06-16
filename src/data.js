// The 33-channel matrix (mirrors seed_channels.sql) + sample partner portfolios.
export const VERTICALS = {
  A_RIDES: { label: 'Rides & Drop Logistics', map: 'Live moving map', tint: 'bg-sky-50 text-sky-700' },
  B_HOME: { label: 'Daily Home Services', map: 'Sathi is 2 KM away', tint: 'bg-emerald-50 text-emerald-700' },
  C_MERCHANT: { label: 'Merchant, Rental & Consult', map: 'Video / booking', tint: 'bg-amber-50 text-amber-700' },
};

export const CHANNELS = [
  ['A_RIDES', '🛵', 'Bike Taxi Sathi'], ['A_RIDES', '🚗', 'Cab / Car Sathi'],
  ['A_RIDES', '🛺', 'Auto Sathi'], ['A_RIDES', '🍱', 'Tiffin Delivery'],
  ['A_RIDES', '🥛', 'Milk / Dairy'], ['A_RIDES', '🔥', 'Gas Cylinder'],
  ['A_RIDES', '🚚', 'Mini Goods Vehicle'], ['A_RIDES', '📦', 'Packers & Movers'],
  ['A_RIDES', '✉️', 'Parcel Courier'], ['A_RIDES', '🛕', 'E-Rickshaw'],
  ['A_RIDES', '🚑', 'Ambulance Node'],
  ['B_HOME', '💡', 'Electrician'], ['B_HOME', '🔧', 'Plumber'],
  ['B_HOME', '🪚', 'Carpenter'], ['B_HOME', '💧', 'RO Technician'],
  ['B_HOME', '❄️', 'AC & Fridge'], ['B_HOME', '💈', 'Barber'],
  ['B_HOME', '💅', 'Salon & Mehendi'], ['B_HOME', '🧹', 'Home Cleaning'],
  ['B_HOME', '📱', 'Mobile/Laptop Repair'], ['B_HOME', '📺', 'Heavy Appliance'],
  ['B_HOME', '🧵', 'Tailor Sathi'],
  ['C_MERCHANT', '🐅', 'Safari Providers'], ['C_MERCHANT', '⛺', 'Tent House'],
  ['C_MERCHANT', '🔊', 'DJ & Sound'], ['C_MERCHANT', '💒', 'Marriage Garden'],
  ['C_MERCHANT', '🏠', 'Rooms & PG'], ['C_MERCHANT', '🍲', 'Caterers & Halwai'],
  ['C_MERCHANT', '🛏️', 'Hospital Bed Sync'], ['C_MERCHANT', '🩺', 'Doctor Consult'],
  ['C_MERCHANT', '🌾', 'Agriculture Expert'], ['C_MERCHANT', '📊', 'CA & Tax'],
  ['C_MERCHANT', '⚖️', 'Legal / Vakeel'],
].map(([vertical, icon, name], i) => ({
  no: i + 1,
  vertical,
  icon,
  name,
  webrtc: ['Doctor Consult', 'Agriculture Expert', 'CA & Tax', 'Legal / Vakeel'].includes(name),
}));

export const PARTNERS = [
  {
    name: 'Ramesh Vishwakarma', trade: 'Carpenter Sathi', rating: 4.8, jobs: 212,
    verified: true, platinum: true, km: 1.2, edu: '10th Pass · 18 yrs experience',
    from: 250, hue: 'from-amber-400 to-orange-500',
    work: ['Modular kitchen', 'Door & lock fitting', 'Custom wardrobe'],
  },
  {
    name: 'Sunita Devi', trade: 'Salon & Mehendi Artist', rating: 4.9, jobs: 156,
    verified: true, platinum: false, km: 0.8, edu: 'Diploma · Beautician',
    from: 500, hue: 'from-pink-400 to-rose-500',
    work: ['Bridal mehendi', 'Home facial', 'Hair spa'],
  },
  {
    name: 'Imran Khan', trade: 'AC & Refrigerator Mechanic', rating: 4.6, jobs: 98,
    verified: true, platinum: false, km: 2.4, edu: 'ITI · Refrigeration',
    from: 350, hue: 'from-sky-400 to-cyan-500',
    work: ['Gas charging', 'Deep cleaning'],
  },
  {
    name: 'Dr. Anjali Mehra', trade: 'Doctor Consultant', rating: 4.95, jobs: 540,
    verified: true, platinum: true, km: 0, edu: 'MBBS, MD · Video consult', webrtc: true,
    from: 400, hue: 'from-violet-400 to-purple-500',
    work: ['General medicine', 'Follow-up Rx'],
  },
  {
    name: 'Mahesh Patel', trade: 'Plumber Sathi', rating: 4.7, jobs: 134,
    verified: true, platinum: false, km: 1.6, edu: 'Self-trained · 12 yrs',
    from: 200, hue: 'from-teal-400 to-emerald-500',
    work: ['Leak detection', 'Valve & pipeline'],
  },
  {
    name: 'Vikram Yadav', trade: 'Bike Taxi Sathi', rating: 4.5, jobs: 1180,
    verified: true, platinum: true, km: 0.5, edu: 'Live GPS · Vertical A',
    from: 40, hue: 'from-indigo-400 to-blue-500',
    work: ['City rides', 'Outstation drop'],
  },
];

export const initials = (name) =>
  name.replace(/^(Dr\.?\s*)/i, '').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
