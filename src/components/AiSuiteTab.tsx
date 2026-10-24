import React, { useState } from 'react';
import { EventPlan } from '../types/event';
import {
  Sparkles,
  MessageSquare,
  Send,
  Mail,
  Mic,
  Copy,
  Check,
  RefreshCw,
  LayoutGrid,
} from 'lucide-react';

interface AiSuiteTabProps {
  plan: EventPlan;
}

export const AiSuiteTab: React.FC<AiSuiteTabProps> = ({ plan }) => {
  const [activeTool, setActiveTool] = useState<'chat' | 'invitations' | 'speeches' | 'seating'>('chat');

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I'm your Celebrio planning co-pilot. I have loaded all details for "${plan.title}" (${plan.type}, ${plan.guestCount} guests, budget ${plan.budget.currency} ${plan.budget.totalBudget.toLocaleString()}). How can I assist with your planning today?`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Invitation Tool State
  const [invTone, setInvTone] = useState('Warm & Elegant');
  const [invHost, setInvHost] = useState('');
  const [invDressCode, setInvDressCode] = useState('Smart Casual / Festive');
  const [invLoading, setInvLoading] = useState(false);
  const [invitationResults, setInvitationResults] = useState<{
    formal: string;
    modern: string;
    casualMobile: string;
    socialStorySnippet: string;
  }>({
    formal: plan.invitationDrafts?.formal || '',
    modern: plan.invitationDrafts?.casual || '',
    casualMobile: plan.invitationDrafts?.whatsapp || '',
    socialStorySnippet: `Save the Date ✨ ${plan.title} · ${plan.date} · ${plan.location}`,
  });
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Speech Tool State
  const [speakerRole, setSpeakerRole] = useState(
    plan.type === 'wedding' ? 'Maid of Honor' : plan.type === 'birthday' ? 'Best Friend' : 'Civic Chair / Host'
  );
  const [recipientName, setRecipientName] = useState(
    plan.type === 'wedding' ? 'The Couple' : plan.type === 'birthday' ? 'The Birthday Star' : 'Our Community'
  );
  const [speechTone, setSpeechTone] = useState('Heartfelt with light humor');
  const [speechAnecdotes, setSpeechAnecdotes] = useState('');
  const [speechDuration, setSpeechDuration] = useState('2-3 minutes');
  const [speechLoading, setSpeechLoading] = useState(false);
  const [speechResult, setSpeechResult] = useState<{
    speechTitle: string;
    estimatedTime: string;
    speechBody: string;
    tipsForDelivery: string[];
  } | null>(null);

  // Seating Advisor State
  const [tableType, setTableType] = useState<'round' | 'long' | 'cocktail'>('round');
  const [seatingAdvice, setSeatingAdvice] = useState<string | null>(null);
  const [seatingLoading, setSeatingLoading] = useState(false);

  // Quick Chat Prompts
  const quickPrompts = [
    `How many bottles of wine and beer should we order for ${plan.guestCount} guests?`,
    `What are 3 practical ways to save 15% on catering for this ${plan.type}?`,
    `What emergency kit items should the coordinator pack on the day of?`,
    `How should we transition smoothly from dinner to dancing?`,
  ];

  // Send Chat Message
  const handleSendChat = async (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    const newHistory = [...chatMessages, { role: 'user' as const, content: textToSend }];
    setChatMessages(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          currentPlan: plan,
          history: newHistory.slice(-6),
        }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Let me help you coordinate those logistics.' },
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered an error. Please try again.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Generate Invitations
  const handleGenerateInvitations = async () => {
    setInvLoading(true);
    try {
      const res = await fetch('/api/generate-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: plan.title,
          eventType: plan.type,
          date: plan.date,
          location: plan.location,
          host: invHost,
          tone: invTone,
          dressCode: invDressCode,
          rsvpDeadline: '2 weeks before event',
        }),
      });
      const data = await res.json();
      if (data.invitations) {
        setInvitationResults(data.invitations);
      }
    } catch (err) {
      console.error('Invitation generator error:', err);
    } finally {
      setInvLoading(false);
    }
  };

  // Generate Speech
  const handleGenerateSpeech = async () => {
    setSpeechLoading(true);
    try {
      const res = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speakerRole,
          recipientName,
          eventType: plan.type,
          tone: speechTone,
          anecdotes: speechAnecdotes,
          duration: speechDuration,
        }),
      });
      const data = await res.json();
      if (data.speech) {
        setSpeechResult(data.speech);
      }
    } catch (err) {
      console.error('Speech generator error:', err);
    } finally {
      setSpeechLoading(false);
    }
  };

  // Seating Advice
  const handleGenerateSeating = async () => {
    setSeatingLoading(true);
    try {
      const prompt = `As an expert event logistics director, recommend an optimal floor plan and seating layout for ${plan.guestCount} guests attending a ${plan.type} titled "${plan.title}". Recommended table type: ${tableType}. Include exact table quantities (e.g. 60-inch rounds seating 8-10, or 8-foot banquet tables), spacing clearances (min 60 inches between tables), dance floor square footage, and buffer for buffet or stage.`;
      
      const res = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          currentPlan: plan,
        }),
      });
      const data = await res.json();
      setSeatingAdvice(data.reply);
    } catch (err) {
      console.error('Seating advice error:', err);
    } finally {
      setSeatingLoading(false);
    }
  };

  const copyToClipboard = (text: string, formatKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(formatKey);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Tool Navigation */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Celebrio GenAI Creative Studio</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Personalized co-planning models: interactive assistant, RSVP wording, speeches, and spatial layout
          </p>
        </div>

        {/* Tool Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveTool('chat')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTool === 'chat'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Co-Pilot Chat</span>
          </button>

          <button
            onClick={() => setActiveTool('invitations')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTool === 'invitations'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Invitations & RSVP</span>
          </button>

          <button
            onClick={() => setActiveTool('speeches')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTool === 'speeches'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speech & Toast Studio</span>
          </button>

          <button
            onClick={() => setActiveTool('seating')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTool === 'seating'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Seating Layout Advisor</span>
          </button>
        </div>
      </div>

      {/* TOOL 1: CHAT ASSISTANT */}
      {activeTool === 'chat' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col h-[600px]">
          
          {/* Chat Messages Viewport */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    C
                  </div>
                )}
                <div
                  className={`max-w-xl text-xs rounded-xl p-3.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-stone-900 text-white font-medium'
                      : 'bg-stone-50 border border-stone-200 text-stone-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  C
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Celebrio AI is calculating recommendations...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-6 py-2 bg-stone-50 border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-2xs">
            <span className="text-stone-400 font-medium whitespace-nowrap">Suggested:</span>
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(q)}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded border border-stone-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about budgets, vendor negotiation, menus, day-of timeline..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 text-xs px-3.5 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={!chatInput.trim() || chatLoading}
              className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>

        </div>
      )}

      {/* TOOL 2: INVITATIONS & RSVP COPYWRITER */}
      {activeTool === 'invitations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Invitation Style Controls
            </h3>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Tone & Voice</label>
              <select
                value={invTone}
                onChange={(e) => setInvTone(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
              >
                <option value="Warm & Elegant">Warm & Elegant</option>
                <option value="Formal & Black-Tie Traditional">Formal & Traditional</option>
                <option value="Chic Modern Minimalist">Chic Modern Minimalist</option>
                <option value="Playful & Whimsical">Playful & Whimsical</option>
                <option value="Community Welcoming & Casual">Community Welcoming</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Host Name / Presenters</label>
              <input
                type="text"
                placeholder="e.g. Together with their parents..."
                value={invHost}
                onChange={(e) => setInvHost(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Attire / Dress Code</label>
              <input
                type="text"
                value={invDressCode}
                onChange={(e) => setInvDressCode(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg"
              />
            </div>

            <button
              onClick={handleGenerateInvitations}
              disabled={invLoading}
              className="w-full py-2.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {invLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>Generate Invitation Variations</span>
            </button>
          </div>

          {/* Output Cards (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Variation 1: Formal */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-stone-500">
                  Formal Card Stationery Wording
                </span>
                <button
                  onClick={() => copyToClipboard(invitationResults.formal, 'formal')}
                  className="inline-flex items-center gap-1 text-2xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  {copiedFormat === 'formal' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'formal' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-serif italic bg-stone-50 p-3 rounded-lg border border-stone-100">
                {invitationResults.formal}
              </p>
            </div>

            {/* Variation 2: Modern */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-stone-500">
                  Modern Clean / Website Landing Copy
                </span>
                <button
                  onClick={() => copyToClipboard(invitationResults.modern, 'modern')}
                  className="inline-flex items-center gap-1 text-2xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  {copiedFormat === 'modern' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'modern' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                {invitationResults.modern}
              </p>
            </div>

            {/* Variation 3: WhatsApp / Text Message */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-stone-500">
                  Mobile & WhatsApp Direct RSVP Message
                </span>
                <button
                  onClick={() => copyToClipboard(invitationResults.casualMobile, 'mobile')}
                  className="inline-flex items-center gap-1 text-2xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  {copiedFormat === 'mobile' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'mobile' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100 font-mono">
                {invitationResults.casualMobile}
              </p>
            </div>

            {/* Variation 4: Social Story Snippet */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-bold uppercase tracking-wider text-stone-500">
                  Instagram / Social Story Teaser Snippet
                </span>
                <button
                  onClick={() => copyToClipboard(invitationResults.socialStorySnippet, 'social')}
                  className="inline-flex items-center gap-1 text-2xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  {copiedFormat === 'social' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormat === 'social' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                {invitationResults.socialStorySnippet}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TOOL 3: SPEECH & TOAST STUDIO */}
      {activeTool === 'speeches' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Toast & Speech Configuration
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Speaker Role</label>
                <input
                  type="text"
                  value={speakerRole}
                  onChange={(e) => setSpeakerRole(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Honored Person(s)</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Tone</label>
                <select
                  value={speechTone}
                  onChange={(e) => setSpeechTone(e.target.value)}
                  className="w-full px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Heartfelt with light humor">Heartfelt with light humor</option>
                  <option value="Emotional & Nostalgic">Emotional & Nostalgic</option>
                  <option value="Funny & Roast-to-Toast">Funny & Warm Roast</option>
                  <option value="Inspirational & Visionary">Inspirational</option>
                  <option value="Short, Punchy & Energetic">Short & Punchy</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Target Duration</label>
                <select
                  value={speechDuration}
                  onChange={(e) => setSpeechDuration(e.target.value)}
                  className="w-full px-2.5 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  <option value="1-2 minutes">1-2 minutes (Quick toast)</option>
                  <option value="2-3 minutes">2-3 minutes (Standard sweet spot)</option>
                  <option value="4-5 minutes">4-5 minutes (Full milestone toast)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Key Anecdotes & Memories to Include</label>
              <textarea
                rows={4}
                placeholder="e.g. When we first met in college, how they always show up for their friends, their passion for cooking..."
                value={speechAnecdotes}
                onChange={(e) => setSpeechAnecdotes(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerateSpeech}
              disabled={speechLoading}
              className="w-full py-2.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {speechLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mic className="w-3.5 h-3.5 text-amber-300" />}
              <span>Generate Toast with Stage Cues</span>
            </button>
          </div>

          {/* Speech Result Display (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 flex flex-col justify-between space-y-4">
            {speechResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-display">
                      {speechResult.speechTitle}
                    </h3>
                    <div className="text-2xs text-stone-500">
                      Duration: {speechResult.estimatedTime} · Role: {speakerRole}
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(speechResult.speechBody, 'speech')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 transition-colors cursor-pointer"
                  >
                    {copiedFormat === 'speech' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormat === 'speech' ? 'Copied' : 'Copy Full Speech'}</span>
                  </button>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {speechResult.speechBody}
                </div>

                {speechResult.tipsForDelivery && (
                  <div className="pt-2">
                    <span className="text-2xs font-bold uppercase tracking-wider text-stone-500 block mb-1">
                      Delivery Tips & Stage Presence
                    </span>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {speechResult.tipsForDelivery.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-16 text-stone-400">
                <Mic className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs font-medium">Ready to create a memorable toast</p>
                <p className="text-2xs text-stone-400 mt-1 max-w-sm text-center">
                  Configure your relationship and memories on the left, then click generate for a complete script with delivery cues.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TOOL 4: SEATING & SPATIAL ADVISOR */}
      {activeTool === 'seating' && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                Floor Plan & Seating Layout Advisor
              </h3>
              <p className="text-xs text-stone-500">
                Calculates table quantities, spatial clearances, and guest flow for {plan.guestCount} guests
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-medium">Table Preference:</span>
                <select
                  value={tableType}
                  onChange={(e: any) => setTableType(e.target.value)}
                  className="px-2.5 py-1.5 border border-stone-300 rounded-md bg-stone-50 text-xs font-medium cursor-pointer"
                >
                  <option value="round">60" Rounds (8-10 guests)</option>
                  <option value="long">8ft Banquet Kings (10-12 guests)</option>
                  <option value="cocktail">Highboy Cocktails & Lounges</option>
                </select>
              </div>

              <button
                onClick={handleGenerateSeating}
                disabled={seatingLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {seatingLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                <span>Calculate Layout Blueprint</span>
              </button>
            </div>
          </div>

          {seatingAdvice ? (
            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed whitespace-pre-wrap font-sans">
              {seatingAdvice}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Standard 60" Round Math</h4>
                <p className="text-2xs text-stone-500">
                  Ideal for conversation. For {plan.guestCount} guests: approximately {Math.ceil(plan.guestCount / 8)} tables of 8, or {Math.ceil(plan.guestCount / 10)} tables of 10. Requires 60-inch service lanes between table backs.
                </p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Dance Floor Formula</h4>
                <p className="text-2xs text-stone-500">
                  Industry rule of thumb: Assume 33-50% of guests on the dance floor simultaneously. For {plan.guestCount} guests, plan approximately {Math.round(plan.guestCount * 4.5)} sq ft of open wooden dance surface.
                </p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">Bar & Buffet Flow</h4>
                <p className="text-2xs text-stone-500">
                  1 bartender per 50-75 guests. Double-sided buffet lines reduce meal delay from 45 minutes to 20 minutes for groups over 100.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
