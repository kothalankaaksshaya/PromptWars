import React, { useState } from 'react';
import { EventPlan } from '../types/event';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Download,
  Printer,
  Copy,
  Check,
  Share2,
  Sparkles,
} from 'lucide-react';
import { downloadEventIcs } from '../utils/calendarExport';

interface EventHeaderProps {
  plans: EventPlan[];
  activePlan: EventPlan;
  onSelectPlan: (id: string) => void;
  onOpenWizard: () => void;
  onUpdatePlan: (updated: EventPlan) => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  plans,
  activePlan,
  onSelectPlan,
  onOpenWizard,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState(false);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePlan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activePlan.title.replace(/\s+/g, '_')}_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Calculate days remaining
  const calculateDaysRemaining = (targetDate: string) => {
    try {
      const target = new Date(targetDate);
      const today = new Date();
      target.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (isNaN(diffDays)) return null;
      if (diffDays === 0) return 'Today is the event!';
      if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
      return `${diffDays} days away`;
    } catch {
      return null;
    }
  };

  const daysRemainingText = calculateDaysRemaining(activePlan.date);

  return (
    <div className="bg-white border-b border-stone-200">
      {/* Top Strip: Event Switcher & Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Switcher selector */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium whitespace-nowrap">Current Plan:</span>
          <select
            value={activePlan.id}
            onChange={(e) => onSelectPlan(e.target.value)}
            className="bg-stone-50 border border-stone-300 rounded-md py-1 px-2.5 text-stone-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.type.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Utility Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadEventIcs(activePlan)}
            title="Export master run-of-show to Apple / Google Calendar (.ics)"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-600" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handleExportJson}
            title="Download complete plan as JSON backup"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            title="Print or Save as PDF"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleShare}
            title="Copy app link"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors cursor-pointer"
          >
            {shareFeedback ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
            <span>{shareFeedback ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Banner Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Text & Metadata (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata Line with typographic separators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-medium mb-2">
                <span className="uppercase tracking-wider font-semibold text-amber-800">
                  {activePlan.type}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activePlan.date}</span>
                {daysRemainingText && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-700 font-semibold">{daysRemainingText}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{activePlan.guestCount} guests</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-stone-700">
                  {activePlan.budget.currency} {activePlan.budget.totalBudget.toLocaleString()}
                </span>
              </div>

              {/* Event Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 text-balance mb-2 font-display">
                {activePlan.title}
              </h1>

              {/* Theme & Vibe */}
              <p className="text-sm font-medium text-amber-900/80 mb-3">
                Theme: <span className="text-stone-800">{activePlan.theme}</span> · Vibe: <span className="text-stone-700">{activePlan.vibe}</span>
              </p>

              {/* Vision Summary */}
              <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
                {activePlan.visionSummary}
              </p>
            </div>

            {/* Bottom Row: Location, Palette Swatches & Quick Add */}
            <div className="pt-4 mt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate max-w-xs">{activePlan.location}</span>
              </div>

              {/* Color Palette Swatches */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="hidden sm:inline">Palette:</span>
                <div className="flex items-center gap-1.5">
                  {activePlan.colorPalette?.map((hex, i) => (
                    <button
                      key={i}
                      onClick={() => copyHex(hex)}
                      title={`Color ${hex} - Click to copy`}
                      className="group relative w-5 h-5 rounded border border-black/10 transition-transform hover:scale-110 cursor-pointer shadow-2xs"
                      style={{ backgroundColor: hex }}
                    >
                      <span className="sr-only">{hex}</span>
                    </button>
                  ))}
                  {copiedHex && (
                    <span className="text-2xs text-stone-700 font-mono ml-1">
                      {copiedHex} copied
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right: Visual Asset / Mood Photography (5 cols) */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-stone-200 min-h-[220px] bg-stone-100 flex items-center justify-center">
            {activePlan.heroImage ? (
              <img
                src={activePlan.heroImage}
                alt={activePlan.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover min-h-[220px] max-h-[280px]"
              />
            ) : (
              <div className="p-6 text-center text-stone-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Celebrio Event Vision</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium flex items-center justify-between">
              <span className="truncate drop-shadow-sm">{activePlan.theme}</span>
              <span className="font-mono tabular-nums drop-shadow-sm text-2xs opacity-90">
                {activePlan.budget.currency} {activePlan.budget.totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
