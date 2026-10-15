export interface LeadEvent {
  type: string;
  source: string;
  date: string;
  amount?: number;
}

export interface Lead {
  id: string;
  ownerName: string;
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  apn: string;
  score: number;
  reasons: string[];
  events: LeadEvent[];
  phone?: string;
  email?: string;
  createdAt: string;
  mailingAddress?: string;
  assessedValue?: number;
  sqft?: number;
  acres?: number;
}

const firstNames = [
  "Maria", "Jose", "Robert", "Jennifer", "Michael", "Linda", "David", "Sarah",
  "James", "Patricia", "John", "Elizabeth", "William", "Barbara", "Richard",
  "Susan", "Thomas", "Jessica", "Charles", "Karen", "Daniel", "Nancy", "Matthew",
  "Lisa", "Anthony", "Betty", "Mark", "Margaret", "Donald", "Sandra",
];

const lastNames = [
  "Garcia", "Martinez", "Rodriguez", "Hernandez", "Lopez", "Gonzalez", "Wilson",
  "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez",
  "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres",
];

const streets = [
  "Main St", "Oak Ave", "Elm Dr", "Pine Rd", "Maple Ln", "Cedar Ct", "Birch Way",
  "Walnut St", "Cherry Ln", "Ash Dr", "Poplar Ave", "Willow Ct", "Spruce Rd",
  "Hickory Ln", "Sycamore Dr", "Magnolia Ave", "Juniper Ct", "Cypress Rd",
  "Redwood Ln", "Sequoia Dr", "Olive Ave", "Palm Ct", "Fig Rd", "Date Ln",
];

const cities = [
  { name: "Bakersfield", zip: "93301" },
  { name: "Bakersfield", zip: "93304" },
  { name: "Bakersfield", zip: "93306" },
  { name: "Bakersfield", zip: "93307" },
  { name: "Bakersfield", zip: "93308" },
  { name: "Bakersfield", zip: "93309" },
  { name: "Bakersfield", zip: "93311" },
  { name: "Bakersfield", zip: "93312" },
  { name: "Bakersfield", zip: "93313" },
  { name: "Bakersfield", zip: "93314" },
  { name: "Delano", zip: "93215" },
  { name: "Ridgecrest", zip: "93555" },
  { name: "Tehachapi", zip: "93561" },
  { name: "Shafter", zip: "93263" },
  { name: "Wasco", zip: "93280" },
  { name: "Taft", zip: "93268" },
  { name: "Arvin", zip: "93203" },
  { name: "McFarland", zip: "93250" },
  { name: "California City", zip: "93505" },
  { name: "Lake Isabella", zip: "93240" },
];

const signalTypes = [
  { type: "pre_foreclosure", weight: 45, label: "Pre-Foreclosure" },
  { type: "tax_delinquent", weight: 35, label: "Tax Delinquent" },
  { type: "probate", weight: 30, label: "Probate" },
  { type: "lien", weight: 20, label: "Lien" },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAPN(): string {
  const part1 = String(randomInt(1, 500)).padStart(3, "0");
  const part2 = String(randomInt(1, 300)).padStart(3, "0");
  const part3 = String(randomInt(1, 50)).padStart(2, "0");
  const part4 = String(randomInt(0, 99)).padStart(2, "0");
  const part5 = String(randomInt(0, 9));
  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

function generateLead(id: number): Lead {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  const ownerName = `${firstName} ${lastName}`;
  const street = `${randomInt(100, 9999)} ${randomChoice(streets)}`;
  const cityInfo = randomChoice(cities);
  const apn = generateAPN();

  // Generate 1-3 signals
  const numSignals = randomInt(1, 3);
  const shuffled = [...signalTypes].sort(() => Math.random() - 0.5);
  const selectedSignals = shuffled.slice(0, numSignals);

  const events: LeadEvent[] = selectedSignals.map((sig) => ({
    type: sig.type,
    source: sig.type === "pre_foreclosure" ? "kern_recorder" : sig.type === "tax_delinquent" ? "kern_tax_collector" : "kern_superior_court",
    date: new Date(Date.now() - randomInt(0, 90) * 86400000).toISOString().split("T")[0],
    amount: sig.type === "tax_delinquent" ? randomInt(500, 25000) : sig.type === "pre_foreclosure" ? randomInt(5000, 50000) : undefined,
  }));

  // Calculate score
  let score = 0;
  const reasons: string[] = [];
  const kinds = new Set(selectedSignals.map((s) => s.type));
  for (const sig of selectedSignals) {
    score += sig.weight;
    reasons.push(`${sig.label} (+${sig.weight})`);
  }
  const dates = events.map((e) => new Date(e.date));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
  const age = Math.floor((Date.now() - maxDate.getTime()) / 86400000);
  if (age <= 30) {
    score += 15;
    reasons.push("Fresh record ≤30 days (+15)");
  } else if (age <= 90) {
    score += 8;
    reasons.push("Recent record ≤90 days (+8)");
  }
  if (kinds.size >= 2) {
    const bonus = Math.min(20, 10 * (kinds.size - 1));
    score += bonus;
    reasons.push(`Multiple distress signals (+${bonus})`);
  }
  score = Math.min(score, 100);

  const hasPhone = Math.random() > 0.4;
  const hasEmail = Math.random() > 0.6;

  return {
    id: `lead-${id}`,
    ownerName: ownerName,
    propertyAddress: street,
    city: cityInfo.name,
    state: "CA",
    zip: cityInfo.zip,
    apn: apn,
    score,
    reasons,
    events,
    phone: hasPhone ? `(${randomInt(600, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}` : undefined,
    email: hasEmail ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomChoice(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"])}` : undefined,
    createdAt: new Date(Date.now() - randomInt(0, 30) * 86400000).toISOString(),
    mailingAddress: Math.random() > 0.5 ? `${randomInt(100, 9999)} ${randomChoice(streets)}, ${randomChoice(cities).name}, CA ${randomChoice(cities).zip}` : undefined,
    assessedValue: randomInt(150000, 850000),
    sqft: randomInt(800, 4500),
    acres: parseFloat((Math.random() * 5 + 0.1).toFixed(2)),
  };
}

export function generateLeads(count: number): Lead[] {
  return Array.from({ length: count }, (_, i) => generateLead(i + 1));
}

export const SIGNAL_COLORS: Record<string, string> = {
  pre_foreclosure: "bg-red-500/10 text-red-400 border-red-500/20",
  tax_delinquent: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  probate: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  lien: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export const SIGNAL_LABELS: Record<string, string> = {
  pre_foreclosure: "Pre-Foreclosure",
  tax_delinquent: "Tax Delinquent",
  probate: "Probate",
  lien: "Lien",
};

export function getScoreGradient(score: number): string {
  if (score >= 80) return "from-emerald-500 via-green-400 to-teal-400";
  if (score >= 60) return "from-amber-500 via-yellow-400 to-orange-400";
  if (score >= 40) return "from-orange-500 via-amber-400 to-yellow-400";
  return "from-red-500 via-orange-400 to-amber-400";
}