export type EventType = 'wedding' | 'birthday' | 'community' | 'anniversary' | 'other';

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  status: 'planned' | 'deposit_paid' | 'paid_in_full';
  notes?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  currency: string;
  items: BudgetItem[];
}

export interface TimelineMilestone {
  id: string;
  timeframe: string; // e.g. "6 Months Out", "2 Weeks Out", "1 Day Before"
  title: string;
  description: string;
  category: string;
  completed: boolean;
  dueDate?: string;
}

export interface DayOfScheduleItem {
  id: string;
  time: string; // e.g. "08:00 AM"
  title: string;
  description: string;
  responsiblePerson: string;
  location: string;
  completed: boolean;
}

export interface VendorItem {
  id: string;
  category: string; // 'Venue' | 'Catering' | 'Photography' | 'Florist' | 'Entertainment' | 'Decor' | 'Permits/Security' | 'Other'
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  quotedAmount: number;
  status: 'researching' | 'contacted' | 'proposal_received' | 'booked' | 'declined';
  rating?: number;
  notes?: string;
  contractSigned: boolean;
}

export interface EventIdea {
  id: string;
  title: string;
  category: 'decor' | 'entertainment' | 'food_beverage' | 'favors' | 'icebreaker';
  description: string;
  budgetImpact: 'low' | 'medium' | 'high';
}

export interface EventPlan {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  theme: string;
  vibe: string;
  colorPalette: string[];
  visionSummary: string;
  heroImage?: string;
  budget: BudgetSummary;
  timeline: TimelineMilestone[];
  dayOfSchedule: DayOfScheduleItem[];
  vendors: VendorItem[];
  personalizedIdeas: EventIdea[];
  invitationDrafts: {
    formal: string;
    casual: string;
    whatsapp: string;
  };
  notes: string;
}

export interface GeneratePlanRequest {
  eventType: EventType;
  title: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: string;
  vibe: string;
  culturalNuances?: string;
  dietaryPreferences?: string;
  specialRequests?: string;
}
