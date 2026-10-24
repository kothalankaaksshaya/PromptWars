import React, { useState } from 'react';
import { EventPlan, EventType, GeneratePlanRequest } from '../types/event';
import { Sparkles, X, RefreshCw, CheckCircle2 } from 'lucide-react';

interface EventWizardModalProps {
  onClose: () => void;
  onPlanCreated: (newPlan: EventPlan) => void;
}

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  onClose,
  onPlanCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [totalBudget, setTotalBudget] = useState<number>(20000);
  const [currency, setCurrency] = useState('USD');
  const [vibe, setVibe] = useState('Warm, elegant, and unforgettable');
  const [culturalNuances, setCulturalNuances] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('Vegetarian and gluten-free accommodations');
  const [specialRequests, setSpecialRequests] = useState('');

  // Quick preset autofill helper
  const applyPreset = (type: EventType) => {
    setEventType(type);
    if (type === 'wedding') {
      setTitle('Maya & Liam’s Coastal Sunset Wedding');
      setDate('2026-12-05');
      setLocation('Cliffside Pavilion, Carmel-by-the-Sea, CA');
      setGuestCount(110);
      setTotalBudget(32000);
      setVibe('Coastal elegance, linen neutrals, ocean breeze, live acoustic jazz');
      setCulturalNuances('Bilingual Spanish & English ceremony readings');
    } else if (type === 'birthday') {
      setTitle('Liam’s Neon Arcade 16th Birthday Bash');
      setDate('2026-11-20');
      setLocation('Retro Wave Lounge & Arcade, Seattle, WA');
      setGuestCount(40);
      setTotalBudget(4500);
      setVibe('Vibrant synthwave neon, competitive multiplayer tournaments, gourmet sliders');
      setCulturalNuances('');
    } else if (type === 'community') {
      setTitle('Pine Valley Autumn Lantern & Music Festival');
      setDate('2026-11-15');
      setLocation('Pine Valley Community Park & Amphitheater');
      setGuestCount(450);
      setTotalBudget(14000);
      setVibe('Wholesome, lantern lighting at dusk, local folk music, artisan food trucks');
      setCulturalNuances('Multicultural youth dance performances and artisan marketplace');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    try {
      const payload: GeneratePlanRequest = {
        eventType,
        title: title.trim(),
        date: date || '2026-12-15',
        location: location.trim() || 'Chosen Venue',
        guestCount: Number(guestCount) || 100,
        totalBudget: Number(totalBudget) || 15000,
        currency,
        vibe: vibe.trim(),
        culturalNuances: culturalNuances.trim(),
        dietaryPreferences: dietaryPreferences.trim(),
        specialRequests: specialRequests.trim(),
      };

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.plan) {
        const raw = data.plan;

        // Map items safely to EventPlan schema
        const newPlan: EventPlan = {
          id: `plan-${Date.now()}`,
          title: title.trim(),
          type: eventType,
          date: date || '2026-12-15',
          location: location.trim() || 'Selected Event Venue',
          guestCount: Number(guestCount) || 100,
          theme: raw.theme || `${title} Theme`,
          vibe: raw.vibe || vibe,
          colorPalette: raw.colorPalette || ['#1E293B', '#F59E0B', '#10B981', '#64748B', '#F8FAFC'],
          visionSummary: raw.visionSummary || 'A meticulously orchestrated celebration designed for unforgettable moments.',
          heroImage: eventType === 'wedding'
            ? '/src/assets/images/wedding_inspiration_mood_1792837355748.jpg'
            : eventType === 'birthday'
            ? '/src/assets/images/birthday_party_mood_1792837356469.jpg'
            : '/src/assets/images/community_event_mood_1792837356226.jpg',
          budget: {
            totalBudget: Number(totalBudget) || 15000,
            currency,
            items: (raw.budgetItems || []).map((bi: any, idx: number) => ({
              id: `b-${Date.now()}-${idx}`,
              category: bi.category || 'General',
              name: bi.name || 'Expense',
              estimatedCost: Number(bi.estimatedCost) || 0,
              actualCost: Number(bi.actualCost) || 0,
              status: bi.status || 'planned',
              notes: bi.notes || '',
            })),
          },
          timeline: (raw.timeline || []).map((ti: any, idx: number) => ({
            id: `t-${Date.now()}-${idx}`,
            timeframe: ti.timeframe || 'Milestone',
            title: ti.title || 'Task',
            description: ti.description || '',
            category: ti.category || 'Logistics',
            completed: false,
          })),
          dayOfSchedule: (raw.dayOfSchedule || []).map((si: any, idx: number) => ({
            id: `s-${Date.now()}-${idx}`,
            time: si.time || '12:00 PM',
            title: si.title || 'Activity',
            description: si.description || '',
            responsiblePerson: si.responsiblePerson || 'Coordinator',
            location: si.location || location || 'Venue',
            completed: false,
          })),
          vendors: (raw.vendors || []).map((vi: any, idx: number) => ({
            id: `v-${Date.now()}-${idx}`,
            category: vi.category || 'Service',
            name: vi.name || 'Vendor',
            contactPerson: vi.contactPerson || '',
            quotedAmount: Number(vi.quotedAmount) || 0,
            status: vi.status || 'researching',
            rating: 5,
            contractSigned: false,
            notes: vi.notes || '',
          })),
          personalizedIdeas: (raw.personalizedIdeas || []).map((pi: any, idx: number) => ({
            id: `i-${Date.now()}-${idx}`,
            title: pi.title || 'Creative Idea',
            category: pi.category || 'entertainment',
            description: pi.description || '',
            budgetImpact: pi.budgetImpact || 'low',
          })),
          invitationDrafts: {
            formal: raw.invitationDrafts?.formal || `You are warmly invited to celebrate ${title}.`,
            casual: raw.invitationDrafts?.casual || `Join us for ${title}!`,
            whatsapp: raw.invitationDrafts?.whatsapp || `🎉 Celebrate ${title} with us!`,
          },
          notes: raw.notes || 'Confirm parking permits and vendor delivery windows 48 hours prior.',
        };

        onPlanCreated(newPlan);
        onClose();
      }
    } catch (err) {
      console.error('Failed to create new plan:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 my-8 text-xs space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Generate New AI Celebration Plan</span>
            </h2>
            <p className="text-stone-500 mt-0.5">
              Powered by Gemini 3.8 Flash to synthesize budgets, schedules, vendors, and creative concepts
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Autofill Presets */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-stone-600">Quick Demo Presets:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('wedding')}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 rounded border border-stone-300 font-medium cursor-pointer"
            >
              Wedding Preset
            </button>
            <button
              type="button"
              onClick={() => applyPreset('birthday')}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 rounded border border-stone-300 font-medium cursor-pointer"
            >
              Birthday Preset
            </button>
            <button
              type="button"
              onClick={() => applyPreset('community')}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-800 rounded border border-stone-300 font-medium cursor-pointer"
            >
              Community Fair Preset
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Type & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4">
              <label className="font-semibold text-stone-700 block mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e: any) => setEventType(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white font-medium"
              >
                <option value="wedding">Wedding</option>
                <option value="birthday">Birthday Celebration</option>
                <option value="community">Community / Cultural Fest</option>
                <option value="anniversary">Anniversary</option>
                <option value="other">Special Milestone</option>
              </select>
            </div>

            <div className="sm:col-span-8">
              <label className="font-semibold text-stone-700 block mb-1">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Maya & Julian's Botanical Wedding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 font-medium text-stone-900"
              />
            </div>
          </div>

          {/* Row 2: Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Target Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Location / Venue Setting</label>
              <input
                type="text"
                placeholder="e.g. Glasshouse Conservatory, Austin, TX"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Row 3: Guest Count, Budget, Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Guest Headcount</label>
              <input
                type="number"
                min="5"
                required
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Total Target Budget</label>
              <input
                type="number"
                min="500"
                step="500"
                required
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>

          {/* Row 4: Vibe & Aesthetic */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Desired Vibe & Visual Aesthetic</label>
            <input
              type="text"
              placeholder="e.g. Romantic candlelight, rustic wood accents, organic eucalyptus, intimate string music"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>

          {/* Row 5: Cultural Nuances & Dietary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Cultural Nuances & Traditions (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Tea ceremony, traditional folk dances, Mehndi night"
                value={culturalNuances}
                onChange={(e) => setCulturalNuances(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Dietary Preferences</label>
              <input
                type="text"
                placeholder="e.g. Vegan canapés, nut-free, halal certified options"
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Special Vision or Constraints</label>
            <textarea
              rows={2}
              placeholder="Any specific requests (e.g. surprise flash mob, pet-friendly outdoor area, acoustic noise curfew at 10 PM)"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-6 py-2.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Complete Blueprint...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Complete Event Plan</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
