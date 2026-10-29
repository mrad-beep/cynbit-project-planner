// Rule-based scoping engine + lead storage for the Project Planner.
// All estimates are illustrative heuristics, not Cynbit quotes.

export const TIER_COLOR = { Starter: 'green', Growth: 'blue', Scale: 'purple' };

export const GOALS = [
  { value: 'web', label: 'Build a website or web app', service: 'Software Development', weeks: [4, 8], stack: ['React', 'Node.js', 'PostgreSQL'] },
  { value: 'ai', label: 'Automate work with AI', service: 'AI Automation', weeks: [3, 8], stack: ['LLM APIs', 'Python', 'Vector database'] },
  { value: 'seo', label: 'Get more traffic and leads', service: 'Digital Marketing & SEO', weeks: [2, 6], stack: ['Technical SEO audit', 'Analytics', 'Content plan'] },
  { value: 'cloud', label: 'Set up or fix cloud infrastructure', service: 'Cloud Infrastructure', weeks: [2, 5], stack: ['AWS or Azure', 'Docker', 'CI/CD'] },
  { value: 'reviews', label: 'Manage online reviews', service: 'AI Automation', product: 'Revio', weeks: [1, 3], stack: ['Revio'] },
  { value: 'property', label: 'Manage rental properties', service: 'Software Development', product: 'TenantEase', weeks: [1, 3], stack: ['TenantEase'] },
  { value: 'learn', label: 'Learn to code and get job-ready', service: null, product: 'Cynbit Studio', weeks: null, stack: ['Cynbit Studio'] },
];

export const FEATURES = [
  { value: 'auth', label: 'User login and roles', weeks: 1 },
  { value: 'payments', label: 'Online payments', weeks: 1 },
  { value: 'dashboard', label: 'Analytics dashboard', weeks: 1 },
  { value: 'admin', label: 'Admin panel', weeks: 1 },
  { value: 'api', label: 'Third-party integrations', weeks: 1 },
  { value: 'chatbot', label: 'AI chatbot or agent', weeks: 2 },
  { value: 'mobile', label: 'Mobile app', weeks: 3 },
];

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: 'quarter', label: 'Within 3 months' },
  { value: 'flexible', label: 'Flexible' },
];

const HINTS = {
  ai: /chatbot|agent|automat|llm|gpt|workflow|\bai\b/gi,
  seo: /\bseo\b|rank|traffic|ads|marketing|leads|campaign/gi,
  cloud: /\baws\b|azure|cloud|server|devops|hosting/gi,
  reviews: /review|reputation|rating|feedback/gi,
  property: /tenant|rent|landlord|property|hostel|flat/gi,
  learn: /learn|course|interview|resume|student|placement|intern/gi,
  web: /website|web app|\bapp\b|portal|dashboard|ecommerce|store|booking/gi,
};

// Reads the free-text description and returns the best-matching goal key (or null).
export function detectGoal(text = '') {
  let best = null;
  let bestCount = 0;
  for (const [goal, re] of Object.entries(HINTS)) {
    const count = (text.match(re) || []).length;
    if (count > bestCount) {
      best = goal;
      bestCount = count;
    }
  }
  return best;
}

export const weeksText = (weeks) => (weeks ? `${weeks[0]}–${weeks[1]} weeks` : 'Self-paced');

export function buildPlan({ goal, features = [], timeline }) {
  const g = GOALS.find((x) => x.value === goal) || GOALS[0];
  if (!g.weeks) {
    return { goal: g, product: g.product, services: [], weeks: null, tier: 'Starter', stack: g.stack, notes: [`${g.product} is a ready-made product, so no custom build is needed.`] };
  }

  const picked = FEATURES.filter((f) => features.includes(f.value));
  const extra = picked.reduce((sum, f) => sum + f.weeks, 0);
  const weeks = [g.weeks[0] + extra, g.weeks[1] + extra];
  const tier = weeks[1] <= 5 ? 'Starter' : weeks[1] <= 10 ? 'Growth' : 'Scale';

  const services = new Set([g.service]);
  picked.forEach((f) => services.add(f.value === 'chatbot' ? 'AI Automation' : 'Software Development'));
  if (tier === 'Scale') services.add('Cloud Infrastructure');

  const stack = [...g.stack];
  if (features.includes('mobile')) stack.push('React Native');
  if (features.includes('chatbot') && !stack.includes('LLM APIs')) stack.push('LLM APIs');

  const notes = [];
  if (g.product) notes.push(`Start with ${g.product} (ready-made) and add custom work only where it falls short.`);
  if (timeline === 'asap' && weeks[0] > 4) notes.push('You want to move fast, so consider launching a smaller first version and adding the rest later.');
  if (tier === 'Scale') notes.push('A project this size is usually delivered in phases.');

  return { goal: g, product: g.product, services: [...services], weeks, tier, stack, notes };
}

// Lead storage (browser localStorage in this prototype; swap for an API in production).
const KEY = 'cynbit_planner_leads';

export function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function saveLead(lead) {
  try {
    localStorage.setItem(KEY, JSON.stringify([lead, ...getLeads()]));
    return true;
  } catch {
    return false;
  }
}

export function clearLeads() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export const TIERS_NOTE = 'Starter is up to 5 weeks, Growth up to 10, Scale beyond that. Estimates are rough guides, not quotes.';
