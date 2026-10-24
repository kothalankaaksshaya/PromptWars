import { EventPlan } from '../types/event';
import { SAMPLE_EVENTS } from '../data/defaultPlans';

const STORAGE_KEY = 'celebrio_event_plans_v1';
const ACTIVE_PLAN_KEY = 'celebrio_active_plan_id_v1';

export function loadStoredPlans(): EventPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredPlans(SAMPLE_EVENTS);
      return SAMPLE_EVENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to parse stored plans:', err);
  }
  return SAMPLE_EVENTS;
}

export function saveStoredPlans(plans: EventPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Failed to save plans to storage:', err);
  }
}

export function loadActivePlanId(fallbackId: string): string {
  try {
    return localStorage.getItem(ACTIVE_PLAN_KEY) || fallbackId;
  } catch {
    return fallbackId;
  }
}

export function saveActivePlanId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PLAN_KEY, id);
  } catch (err) {
    console.error('Failed to save active plan id:', err);
  }
}
