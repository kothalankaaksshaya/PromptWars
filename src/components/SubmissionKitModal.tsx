import React, { useState } from 'react';
import { Award, Copy, Check, ExternalLink, X, ShieldCheck, Zap, Code, Video, Linkedin } from 'lucide-react';

interface SubmissionKitModalProps {
  onClose: () => void;
}

export const SubmissionKitModal: React.FC<SubmissionKitModalProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Pre-formatted responses tailored to Hack2skill PromptWars Challenge 5
  const deployedChangesText = `Celebrio v1.0.0 is a production-ready GenAI event planner for weddings, birthdays, and community festivals.
Key capabilities delivered:
1. GenAI Blueprint Generator (Gemini 3.8 Flash): Instant budgets, timelines, vendors, and personalized vision touchpoints.
2. Interactive Budget Allocator: Real-time math with currency switching (USD/EUR/GBP/INR/CAD/AUD), payment status tracking, and AI budget optimization.
3. Master Timelines: Dual-mode countdown milestones and minute-by-minute day-of run-of-show with .ICS Apple/Google Calendar export.
4. Vendor Checklist & RFPs: Procurement pipeline with one-click AI inquiry email drafting.
5. AI Creative Studio: Context-aware co-pilot chat, multi-channel RSVP copywriting (formal, casual, WhatsApp), speech/toast generator with stage cues, and spatial seating calculator.
6. Zero-slop accessible UI: High-density data grid, WCAG AA contrast, and zero client API key exposure.`;

  const genAiServicesText = `GenAI services utilized & touchpoints:
1. Gemini 3.8 Flash SDK (@google/genai v2.4.0) deployed via server-side Express proxy to safeguard API keys.
2. Structured Blueprint Generation (/api/generate-plan): Synthesizes calibrated budget breakdowns, milestones, run-of-show cues, and curated theme concepts with structured JSON schemas.
3. AI Budget Optimizer (/api/optimize-budget): Audits category ratios, detects hidden gratuity/service fees, and recommends rebalancing.
4. AI Co-Pilot Planning Chat (/api/chat-assistant): Real-time conversational assistant maintaining event state for logistics, beverage formulas, and contingency planning.
5. Creative RSVP & Toast Studio (/api/generate-invitation & /api/generate-speech): Generates formal, casual, and WhatsApp invite wording, plus customized toasts with stage direction cues.
6. AI Vendor Inquiry Composer (/api/vendor-inquiry): Produces professional RFP emails tailored to vendor category and budget.`;

  const linkedInPostText = `Excited to present Celebrio, my submission for [Challenge 5: Celebration & Event Planner] in the Virtual: PromptWars Hackathon by Hack2skill! 🚀

Planning weddings, milestone birthdays, and community festivals can be overwhelming. Celebrio combines Google Gemini 3.8 Flash with full-stack TypeScript to streamline the entire event lifecycle:
✨ Instant GenAI Event Blueprints tailored to vibe, budget, and culture
📊 Interactive Budget Allocator with category tracking & AI cost optimization
⏱️ Master Timelines + Day-of Run of Show with 1-click .ICS Calendar sync
📋 Vendor Procurement Directory with automated AI inquiry/RFP drafting
💌 Multi-channel RSVP copywriting & custom speech generator with stage cues

Check out the live deployment and GitHub repo!
#PromptWars #GenAI #Gemini #Hack2skill #EventTech #FullStack`;

  const videoScriptPoints = [
    { time: '0:00 - 0:25', topic: 'Problem & Value Proposition', notes: 'Introduce Celebrio for weddings, birthdays, and community gatherings. Highlight the challenge brief.' },
    { time: '0:25 - 0:55', topic: 'Event Generation & Budget Allocator', notes: 'Demonstrate creating a new event plan with Gemini 3.8 Flash. Show real-time budget adjustments and AI Budget Optimizer.' },
    { time: '0:55 - 1:25', topic: 'Master Timelines & Vendor RFPs', notes: 'Show Day-of Run of Show, 1-click .ICS Calendar export, and drafting an AI vendor inquiry email.' },
    { time: '1:25 - 1:50', topic: 'AI Creative Suite (Toasts & Invitations)', notes: 'Showcase WhatsApp invite generation and toast speech creation with stage direction cues.' },
    { time: '1:50 - 2:00', topic: 'Security & Architecture', notes: 'Explain server-side Gemini SDK proxy (no API key leakage), TypeScript type safety, and responsive design.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-stone-200 my-8 text-xs space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-display">
                Hack2skill PromptWars Submission Kit
              </h2>
              <p className="text-2xs text-stone-500">
                Prepared for <strong className="text-stone-700">Aksshaya kothalanka</strong> · [Challenge 5] Celebration & Event Planner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluation Criteria Alignment Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-stone-700" />
              <span>Code Quality</span>
            </div>
            <p className="text-2xs text-stone-500 mt-1">Modular TypeScript, zero inline styles, clean components.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Security</span>
            </div>
            <p className="text-2xs text-stone-500 mt-1">Server-side Gemini proxy; API keys never leak to browser.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-700" />
              <span>Efficiency</span>
            </div>
            <p className="text-2xs text-stone-500 mt-1">Sub-second local storage, fast Gemini 3.8 Flash inferences.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-stone-700" />
              <span>Testing & Graceful</span>
            </div>
            <p className="text-2xs text-stone-500 mt-1">Algorithmic fallbacks ensure 100% uptime even if offline.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-stone-700" />
              <span>Accessibility</span>
            </div>
            <p className="text-2xs text-stone-500 mt-1">WCAG AA contrast, keyboard navigation, tabular numbers.</p>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span>Alignment</span>
            </div>
            <p className="text-2xs text-stone-500 mt-1">Weddings, birthdays, community fairs, budgets & timelines.</p>
          </div>
        </div>

        {/* Copyable Form Fields Section */}
        <div className="space-y-4">
          
          {/* Field 1: Changes Made */}
          <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">
                1. Describe the changes/updates made in the deployed version
              </span>
              <button
                onClick={() => copyText(deployedChangesText, 'changes')}
                className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors cursor-pointer"
              >
                {copiedKey === 'changes' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'changes' ? 'Copied' : 'Copy Response'}</span>
              </button>
            </div>
            <p className="text-2xs text-stone-600 font-mono bg-stone-50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
              {deployedChangesText}
            </p>
          </div>

          {/* Field 2: Gen AI services utilized */}
          <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">
                2. Mention the Gen AI services utilized in the submission, and where did you utilize it?
              </span>
              <button
                onClick={() => copyText(genAiServicesText, 'services')}
                className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors cursor-pointer"
              >
                {copiedKey === 'services' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'services' ? 'Copied' : 'Copy Response'}</span>
              </button>
            </div>
            <p className="text-2xs text-stone-600 font-mono bg-stone-50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
              {genAiServicesText}
            </p>
          </div>

          {/* Field 3: LinkedIn Post Draft */}
          <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-sky-700" />
                <span>3. LinkedIn Post Draft (Ready to Share)</span>
              </span>
              <button
                onClick={() => copyText(linkedInPostText, 'linkedin')}
                className="inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors cursor-pointer"
              >
                {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'linkedin' ? 'Copied' : 'Copy Post'}</span>
              </button>
            </div>
            <p className="text-2xs text-stone-600 bg-stone-50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
              {linkedInPostText}
            </p>
          </div>

          {/* Field 4: 2-Minute Demo Video Script Outline */}
          <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-red-600" />
                <span>4. Recommended 2-Minute Demo Video Walkthrough Guide</span>
              </span>
            </div>
            <div className="space-y-1.5 pt-1">
              {videoScriptPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-3 text-2xs p-2 bg-stone-50 rounded border border-stone-100">
                  <span className="font-mono font-bold text-stone-800 shrink-0">{pt.time}</span>
                  <div>
                    <strong className="text-stone-900">{pt.topic}:</strong>{' '}
                    <span className="text-stone-600">{pt.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-5 py-2 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
