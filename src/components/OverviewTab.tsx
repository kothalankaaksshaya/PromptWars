import React, { useState } from 'react';
import { EventPlan, EventIdea } from '../types/event';
import {
  Sparkles,
  Users,
  DollarSign,
  CheckCircle2,
  Calendar,
  Plus,
  Trash2,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';

interface OverviewTabProps {
  plan: EventPlan;
  onUpdatePlan: (updated: EventPlan) => void;
  onNavigateTab: (tab: 'overview' | 'budget' | 'timeline' | 'vendors' | 'ai-suite') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  plan,
  onUpdatePlan,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddIdeaModal, setShowAddIdeaModal] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaCat, setNewIdeaCat] = useState<'decor' | 'entertainment' | 'food_beverage' | 'favors' | 'icebreaker'>('decor');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');
  const [newIdeaImpact, setNewIdeaImpact] = useState<'low' | 'medium' | 'high'>('low');

  // Metrics
  const totalAllocated = plan.budget.items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const totalSpent = plan.budget.items.reduce((sum, item) => sum + (item.actualCost || 0), 0);
  const perGuestCost = plan.guestCount > 0 ? Math.round(plan.budget.totalBudget / plan.guestCount) : 0;
  
  const bookedVendors = plan.vendors.filter((v) => v.status === 'booked').length;
  const totalVendors = plan.vendors.length;

  const completedMilestones = plan.timeline.filter((m) => m.completed).length;
  const totalMilestones = plan.timeline.length;

  const filteredIdeas = selectedCategory === 'all'
    ? plan.personalizedIdeas
    : plan.personalizedIdeas.filter((i) => i.category === selectedCategory);

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;

    const newIdea: EventIdea = {
      id: `idea-${Date.now()}`,
      title: newIdeaTitle.trim(),
      category: newIdeaCat,
      description: newIdeaDesc.trim(),
      budgetImpact: newIdeaImpact,
    };

    onUpdatePlan({
      ...plan,
      personalizedIdeas: [newIdea, ...plan.personalizedIdeas],
    });

    setNewIdeaTitle('');
    setNewIdeaDesc('');
    setShowAddIdeaModal(false);
  };

  const handleDeleteIdea = (id: string) => {
    onUpdatePlan({
      ...plan,
      personalizedIdeas: plan.personalizedIdeas.filter((i) => i.id !== id),
    });
  };

  return (
    <div className="space-y-8">
      
      {/* 4-Stat Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Budget */}
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Total Budget</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {plan.budget.currency} {plan.budget.totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-2xs text-stone-500 flex items-center justify-between">
            <span>Allocated: {plan.budget.currency} {totalAllocated.toLocaleString()}</span>
            <span className="font-mono tabular-nums">
              {plan.budget.totalBudget > 0 ? Math.round((totalAllocated / plan.budget.totalBudget) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Metric 2: Per Guest */}
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Guest Target</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {plan.guestCount}
            </span>
            <span className="text-xs text-stone-500">attendees</span>
          </div>
          <div className="mt-2 text-2xs text-stone-500">
            Est. <span className="font-mono tabular-nums font-medium text-stone-700">{plan.budget.currency} {perGuestCost}</span> per guest
          </div>
        </div>

        {/* Metric 3: Vendors Booked */}
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Vendors Contracted</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {bookedVendors} <span className="text-sm font-normal text-stone-400">/ {totalVendors}</span>
            </span>
          </div>
          <div className="mt-2 text-2xs text-stone-500">
            {totalVendors - bookedVendors > 0
              ? `${totalVendors - bookedVendors} vendor pending contract`
              : 'All vendors secured'}
          </div>
        </div>

        {/* Metric 4: Milestones Progress */}
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 font-medium">Timeline Progress</div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
              {completedMilestones} <span className="text-sm font-normal text-stone-400">/ {totalMilestones}</span>
            </span>
          </div>
          <div className="mt-2 text-2xs text-stone-500">
            {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}% tasks complete
          </div>
        </div>

      </div>

      {/* Two Column Grid: Vision & Concept Details + Personalized Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vision, Notes, Quick Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Aesthetic & Styling Notes */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h2 className="text-base font-bold text-stone-900 font-display">
              Event Concept & Aesthetic Blueprint
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-stone-500 block font-medium">Design Aesthetic</span>
                <p className="text-stone-800 font-medium mt-0.5">{plan.theme}</p>
              </div>

              <div>
                <span className="text-xs text-stone-500 block font-medium">Sensory Vibe</span>
                <p className="text-stone-700 mt-0.5">{plan.vibe}</p>
              </div>

              <div>
                <span className="text-xs text-stone-500 block font-medium">Curated Palette</span>
                <div className="flex items-center gap-2 mt-1">
                  {plan.colorPalette?.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-stone-600">
                      <span
                        className="w-4 h-4 rounded border border-black/10 shadow-2xs inline-block"
                        style={{ backgroundColor: c }}
                      />
                      <span className="font-mono text-2xs">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {plan.notes && (
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-xs text-stone-500 block font-medium">Planner Logistics Note</span>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">{plan.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Navigation Cards */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('budget')}
                className="p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-semibold text-stone-800 flex items-center justify-between">
                  <span>Budget Breakdown</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
                </div>
                <div className="text-2xs text-stone-500 mt-0.5">Manage line items</div>
              </button>

              <button
                onClick={() => onNavigateTab('timeline')}
                className="p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-left transition-colors cursor-pointer group"
              >
                <div className="font-semibold text-stone-800 flex items-center justify-between">
                  <span>Day-of Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900" />
                </div>
                <div className="text-2xs text-stone-500 mt-0.5">Run of show cues</div>
              </button>
            </div>

          </div>

          {/* Invitation Copy Preview Snippet */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 font-display">
                Invitation Draft Snippet
              </h3>
              <button
                onClick={() => onNavigateTab('ai-suite')}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Customize in AI Suite
              </button>
            </div>
            <blockquote className="p-3 bg-stone-50 rounded-lg text-xs text-stone-700 italic border-l-2 border-amber-600">
              "{plan.invitationDrafts?.casual || plan.invitationDrafts?.formal || 'You are invited to join our celebration!'}"
            </blockquote>
          </div>

        </div>

        {/* Right Column: Personalized GenAI Ideas & Vision Touchpoints (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Personalized Celebration Ideas & Experiences</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Bespoke touches generated by GenAI specifically for your vibe, budget, and guest profile
              </p>
            </div>

            <button
              onClick={() => setShowAddIdeaModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer border border-stone-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Idea</span>
            </button>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
            {['all', 'decor', 'entertainment', 'food_beverage', 'favors', 'icebreaker'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer capitalize whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat === 'food_beverage' ? 'Food & Drink' : cat}
              </button>
            ))}
          </div>

          {/* Ideas List */}
          <div className="space-y-3">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors bg-stone-50/50 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {/* Unboxed Metadata: Category · Impact */}
                    <div className="text-2xs text-stone-500 font-medium capitalize mb-1 flex items-center gap-1.5">
                      <span>{idea.category.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className={idea.budgetImpact === 'low' ? 'text-emerald-700 font-semibold' : idea.budgetImpact === 'medium' ? 'text-amber-700 font-semibold' : 'text-stone-700 font-semibold'}>
                        {idea.budgetImpact.toUpperCase()} budget impact
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900">
                      {idea.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    title="Remove idea"
                    className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {idea.description}
                </p>
              </div>
            ))}

            {filteredIdeas.length === 0 && (
              <div className="py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No ideas found in this category.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Add Custom Idea Modal */}
      {showAddIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 font-display mb-3">
              Add Personalized Event Touch
            </h3>
            <form onSubmit={handleAddIdea} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Concept Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Polaroid Guestbook Station"
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newIdeaCat}
                    onChange={(e: any) => setNewIdeaCat(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="decor">Decor</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="food_beverage">Food & Beverage</option>
                    <option value="favors">Favors & Gifts</option>
                    <option value="icebreaker">Icebreaker</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Budget Impact</label>
                  <select
                    value={newIdeaImpact}
                    onChange={(e: any) => setNewIdeaImpact(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="low">Low Cost</option>
                    <option value="medium">Medium Cost</option>
                    <option value="high">High Cost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Description & Logistics</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe how to implement this experience..."
                  value={newIdeaDesc}
                  onChange={(e) => setNewIdeaDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddIdeaModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                >
                  Save Touch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
