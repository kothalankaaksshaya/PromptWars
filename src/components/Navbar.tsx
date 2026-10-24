import React from 'react';
import { Calendar, Sparkles, Award } from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'budget' | 'timeline' | 'vendors' | 'ai-suite';
  onSelectTab: (tab: 'overview' | 'budget' | 'timeline' | 'vendors' | 'ai-suite') => void;
  onOpenWizard: () => void;
  onOpenSubmissionKit: () => void;
  eventTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenWizard,
  onOpenSubmissionKit,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm">
            C
          </div>
          <button
            onClick={() => onSelectTab('overview')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-amber-700 transition-colors whitespace-nowrap">
              Celebrio
            </span>
          </button>
        </div>

        {/* Zone 2: 5 Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('budget')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'budget'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Budget Planner
          </button>
          <button
            onClick={() => onSelectTab('timeline')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Master Timelines
          </button>
          <button
            onClick={() => onSelectTab('vendors')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'vendors'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Vendor Checklist
          </button>
          <button
            onClick={() => onSelectTab('ai-suite')}
            className={`whitespace-nowrap transition-colors pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai-suite'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            AI Studio Suite
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Submission Kit for Hack2skill & New AI Plan) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSubmissionKit}
            title="PromptWars Challenge 5 Submission Kit for Aksshaya kothalanka"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-stone-200"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Submission Kit</span>
          </button>

          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>New AI Plan</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden border-t border-stone-200 px-4 py-2 flex items-center justify-between text-xs overflow-x-auto gap-3">
        <button
          onClick={() => onSelectTab('overview')}
          className={`whitespace-nowrap py-1 ${activeTab === 'overview' ? 'font-bold text-stone-900' : 'text-stone-500'}`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('budget')}
          className={`whitespace-nowrap py-1 ${activeTab === 'budget' ? 'font-bold text-stone-900' : 'text-stone-500'}`}
        >
          Budget
        </button>
        <button
          onClick={() => onSelectTab('timeline')}
          className={`whitespace-nowrap py-1 ${activeTab === 'timeline' ? 'font-bold text-stone-900' : 'text-stone-500'}`}
        >
          Timeline
        </button>
        <button
          onClick={() => onSelectTab('vendors')}
          className={`whitespace-nowrap py-1 ${activeTab === 'vendors' ? 'font-bold text-stone-900' : 'text-stone-500'}`}
        >
          Vendors
        </button>
        <button
          onClick={() => onSelectTab('ai-suite')}
          className={`whitespace-nowrap py-1 flex items-center gap-1 ${activeTab === 'ai-suite' ? 'font-bold text-stone-900' : 'text-stone-500'}`}
        >
          <Sparkles className="w-3 h-3 text-amber-600" />
          AI Suite
        </button>
        <button
          onClick={onOpenSubmissionKit}
          className="whitespace-nowrap py-1 text-amber-700 font-semibold"
        >
          Submission
        </button>
      </div>
    </header>
  );
};
