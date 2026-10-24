import React, { useState } from 'react';
import { EventPlan, TimelineMilestone, DayOfScheduleItem } from '../types/event';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Download,
  Filter,
  User,
  MapPin,
} from 'lucide-react';
import { downloadEventIcs } from '../utils/calendarExport';

interface TimelineTabProps {
  plan: EventPlan;
  onUpdatePlan: (updated: EventPlan) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ plan, onUpdatePlan }) => {
  const [activeSubView, setActiveSubView] = useState<'day_of' | 'pre_event'>('day_of');

  // Milestone Form Modal
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [mTimeframe, setMTimeframe] = useState('');
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mCat, setMCat] = useState('Logistics');

  // Day-of Schedule Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sTime, setSTime] = useState('');
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sLead, setSLead] = useState('');
  const [sLocation, setSLocation] = useState('');

  // Toggle milestone completion
  const toggleMilestone = (id: string) => {
    onUpdatePlan({
      ...plan,
      timeline: plan.timeline.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    });
  };

  const deleteMilestone = (id: string) => {
    onUpdatePlan({
      ...plan,
      timeline: plan.timeline.filter((m) => m.id !== id),
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim() || !mTimeframe.trim()) return;

    const newMilestone: TimelineMilestone = {
      id: `m-${Date.now()}`,
      timeframe: mTimeframe.trim(),
      title: mTitle.trim(),
      description: mDesc.trim(),
      category: mCat,
      completed: false,
    };

    onUpdatePlan({
      ...plan,
      timeline: [...plan.timeline, newMilestone],
    });

    setMTimeframe('');
    setMTitle('');
    setMDesc('');
    setShowMilestoneModal(false);
  };

  // Toggle day-of item
  const toggleScheduleItem = (id: string) => {
    onUpdatePlan({
      ...plan,
      dayOfSchedule: plan.dayOfSchedule.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      ),
    });
  };

  const deleteScheduleItem = (id: string) => {
    onUpdatePlan({
      ...plan,
      dayOfSchedule: plan.dayOfSchedule.filter((s) => s.id !== id),
    });
  };

  const handleAddScheduleItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim() || !sTime.trim()) return;

    const newItem: DayOfScheduleItem = {
      id: `s-${Date.now()}`,
      time: sTime.trim(),
      title: sTitle.trim(),
      description: sDesc.trim(),
      responsiblePerson: sLead.trim() || 'Event Lead',
      location: sLocation.trim() || plan.location,
      completed: false,
    };

    onUpdatePlan({
      ...plan,
      dayOfSchedule: [...plan.dayOfSchedule, newItem],
    });

    setSTime('');
    setSTitle('');
    setSDesc('');
    setSLead('');
    setSLocation('');
    setShowScheduleModal(false);
  };

  const completedCount = plan.dayOfSchedule.filter((s) => s.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-view Switcher */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Master Timelines & Production Schedules
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Coordinate every countdown milestone and day-of minute with designated operational leads
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sub-view segmented tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveSubView('day_of')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSubView === 'day_of'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Day-of Run of Show ({plan.dayOfSchedule.length})
            </button>
            <button
              onClick={() => setActiveSubView('pre_event')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                activeSubView === 'pre_event'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Countdown Milestones ({plan.timeline.length})
            </button>
          </div>

          <button
            onClick={() => downloadEventIcs(plan)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer border border-stone-200"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Download .ICS Calendar</span>
          </button>

          {activeSubView === 'day_of' ? (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Itinerary Cue</span>
            </button>
          ) : (
            <button
              onClick={() => setShowMilestoneModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          )}
        </div>
      </div>

      {/* SUB-VIEW 1: DAY-OF RUN OF SHOW */}
      {activeSubView === 'day_of' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-display">
                Day-of Itinerary & Cues
              </h3>
              <p className="text-xs text-stone-500">
                Synchronized run of show for hosts, coordinators, and vendors on {plan.date}
              </p>
            </div>
            <div className="text-xs text-stone-500 font-mono tabular-nums">
              {completedCount} / {plan.dayOfSchedule.length} cues executed
            </div>
          </div>

          {/* Chronological Vertical Schedule */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
            {plan.dayOfSchedule.map((item) => (
              <div
                key={item.id}
                className={`relative group p-4 rounded-xl border transition-colors ${
                  item.completed
                    ? 'bg-stone-50/60 border-stone-200 opacity-75'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Timeline Dot Indicator */}
                <button
                  onClick={() => toggleScheduleItem(item.id)}
                  title="Toggle completed"
                  className={`absolute -left-6 sm:-left-8 top-5 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer bg-white ${
                    item.completed
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-stone-300 hover:border-stone-500 text-transparent'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.completed ? 'block' : 'hidden'}`} />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-stone-900 tabular-nums px-2 py-0.5 rounded bg-stone-100">
                      {item.time}
                    </span>
                    <h4 className={`text-sm font-bold text-stone-900 ${item.completed ? 'line-through text-stone-500' : ''}`}>
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-stone-400" />
                      <span>{item.responsiblePerson}</span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    <button
                      onClick={() => deleteScheduleItem(item.id)}
                      title="Remove cue"
                      className="text-stone-400 hover:text-red-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed pl-1">
                    {item.description}
                  </p>
                )}
              </div>
            ))}

            {plan.dayOfSchedule.length === 0 && (
              <div className="py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No day-of schedule cues created yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: PRE-EVENT COUNTDOWN MILESTONES */}
      {activeSubView === 'pre_event' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-display">
                Countdown Planning Milestones
              </h3>
              <p className="text-xs text-stone-500">
                Critical deadlines organized by time horizon prior to the event
              </p>
            </div>
            <div className="text-xs text-stone-500 font-mono tabular-nums">
              {plan.timeline.filter((m) => m.completed).length} / {plan.timeline.length} completed
            </div>
          </div>

          <div className="space-y-3">
            {plan.timeline.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-colors ${
                  m.completed ? 'bg-stone-50/70 border-stone-200' : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleMilestone(m.id)}
                    className="mt-0.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-300" />
                    )}
                  </button>

                  <div>
                    {/* Unboxed Metadata: Timeframe · Category */}
                    <div className="text-2xs text-stone-500 font-medium mb-1 flex items-center gap-2">
                      <span className="font-semibold text-stone-800">{m.timeframe}</span>
                      <span aria-hidden="true">·</span>
                      <span>{m.category}</span>
                    </div>

                    <h4 className={`text-sm font-bold text-stone-900 ${m.completed ? 'line-through text-stone-500' : ''}`}>
                      {m.title}
                    </h4>

                    {m.description && (
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {m.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteMilestone(m.id)}
                  title="Remove milestone"
                  className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {plan.timeline.length === 0 && (
              <div className="py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No milestones created yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Day-of Schedule Cue */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200 text-xs">
            <h3 className="text-base font-bold text-stone-900 font-display mb-3">
              Add Day-of Itinerary Cue
            </h3>
            <form onSubmit={handleAddScheduleItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:30 PM"
                    value={sTime}
                    onChange={(e) => setSTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Designated Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. Catering Captain"
                    value={sLead}
                    onChange={(e) => setSLead(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Activity / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Welcome Drinks & Canapés"
                  value={sTitle}
                  onChange={(e) => setSTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Specific Location</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Terrace Lawn"
                  value={sLocation}
                  onChange={(e) => setSLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Logistics Details</label>
                <textarea
                  rows={2}
                  placeholder="Specific cues, mic setup, music changes, etc."
                  value={sDesc}
                  onChange={(e) => setSDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Add Cue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Milestone */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200 text-xs">
            <h3 className="text-base font-bold text-stone-900 font-display mb-3">
              Add Countdown Milestone
            </h3>
            <form onSubmit={handleAddMilestone} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Time Horizon</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6 Months Before"
                    value={mTimeframe}
                    onChange={(e) => setMTimeframe(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Logistics, Catering, Decor"
                    value={mCat}
                    onChange={(e) => setMCat(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Milestone Action</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Book Photographer & Videographer"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deliverables & Notes</label>
                <textarea
                  rows={2}
                  placeholder="Deliverables, deposits due, review notes..."
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
