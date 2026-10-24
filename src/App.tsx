/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EventPlan } from './types/event';
import { SAMPLE_EVENTS } from './data/defaultPlans';
import { loadStoredPlans, saveStoredPlans, loadActivePlanId, saveActivePlanId } from './utils/storage';
import { Navbar } from './components/Navbar';
import { EventHeader } from './components/EventHeader';
import { OverviewTab } from './components/OverviewTab';
import { BudgetTab } from './components/BudgetTab';
import { TimelineTab } from './components/TimelineTab';
import { VendorsTab } from './components/VendorsTab';
import { AiSuiteTab } from './components/AiSuiteTab';
import { EventWizardModal } from './components/EventWizardModal';
import { SubmissionKitModal } from './components/SubmissionKitModal';

export default function App() {
  const [plans, setPlans] = useState<EventPlan[]>(() => loadStoredPlans());
  const [activePlanId, setActivePlanId] = useState<string>(() =>
    loadActivePlanId(SAMPLE_EVENTS[0].id)
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors' | 'ai-suite'>('overview');
  const [showWizard, setShowWizard] = useState(false);
  const [showSubmissionKit, setShowSubmissionKit] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveStoredPlans(plans);
  }, [plans]);

  useEffect(() => {
    saveActivePlanId(activePlanId);
  }, [activePlanId]);

  // Current active plan
  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0] || SAMPLE_EVENTS[0];

  const handleUpdateActivePlan = (updated: EventPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handlePlanCreated = (newPlan: EventPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setActivePlanId(newPlan.id);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenWizard={() => setShowWizard(true)}
        onOpenSubmissionKit={() => setShowSubmissionKit(true)}
        eventTitle={activePlan.title}
      />

      {/* Main Event Showcase Banner & Switcher */}
      <EventHeader
        plans={plans}
        activePlan={activePlan}
        onSelectPlan={(id) => setActivePlanId(id)}
        onOpenWizard={() => setShowWizard(true)}
        onUpdatePlan={handleUpdateActivePlan}
      />

      {/* Primary Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            plan={activePlan}
            onUpdatePlan={handleUpdateActivePlan}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab
            plan={activePlan}
            onUpdatePlan={handleUpdateActivePlan}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            plan={activePlan}
            onUpdatePlan={handleUpdateActivePlan}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorsTab
            plan={activePlan}
            onUpdatePlan={handleUpdateActivePlan}
          />
        )}

        {activeTab === 'ai-suite' && (
          <AiSuiteTab plan={activePlan} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-display">Celebrio</span>
            <span aria-hidden="true">·</span>
            <span>GenAI Event & Celebration Planning Assistant</span>
          </div>
          <div className="flex items-center gap-4 text-2xs">
            <button
              onClick={() => setShowSubmissionKit(true)}
              className="text-amber-800 hover:text-amber-900 font-semibold cursor-pointer"
            >
              PromptWars Challenge 5 Kit
            </button>
            <span aria-hidden="true">·</span>
            <span>2026 © Built for Hack2skill Virtual: PromptWars</span>
          </div>
        </div>
      </footer>

      {/* Creation Wizard Modal */}
      {showWizard && (
        <EventWizardModal
          onClose={() => setShowWizard(false)}
          onPlanCreated={handlePlanCreated}
        />
      )}

      {/* Submission Kit Modal */}
      {showSubmissionKit && (
        <SubmissionKitModal onClose={() => setShowSubmissionKit(false)} />
      )}

    </div>
  );
}
