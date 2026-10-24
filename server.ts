import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Helper: Clean markdown code blocks from model JSON output
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// 1. Full Event Plan Blueprint Generator
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const {
      eventType,
      title,
      date,
      location,
      guestCount,
      totalBudget,
      currency,
      vibe,
      culturalNuances,
      dietaryPreferences,
      specialRequests,
    } = req.body;

    if (!title || !eventType) {
      res.status(400).json({ error: 'Event title and type are required' });
      return;
    }

    if (ai) {
      const prompt = `You are a premier world-class celebration and event planner. 
Generate a comprehensive, production-ready event blueprint in valid JSON format for the following event:
- Event Type: ${eventType}
- Event Title: ${title}
- Target Date: ${date || 'Upcoming'}
- Location / Setting: ${location || 'Local Venue'}
- Guest Count: ${guestCount || 100}
- Target Budget: ${currency || 'USD'} ${totalBudget || 15000}
- Desired Vibe & Aesthetic: ${vibe || 'Festive and memorable'}
- Cultural Nuances & Traditions: ${culturalNuances || 'Standard contemporary'}
- Dietary Preferences: ${dietaryPreferences || 'Standard options with vegan & gluten-free'}
- Special Requests & Vision: ${specialRequests || 'Seamless guest experience'}

Respond ONLY with a valid JSON object matching this schema strictly without conversational filler:
{
  "theme": "Creative theme title (e.g. Tuscan Sunset Vineyard, Celestial Neon Luxe)",
  "vibe": "Concise aesthetic and sensory descriptor",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "visionSummary": "2-3 sentences describing the atmosphere, experience, and guest journey",
  "budgetItems": [
    {
      "category": "Venue | Catering | Florals & Decor | Photography & Media | Music & Sound | Attire & Beauty | Stationery & Favors | Contingency Fund",
      "name": "Detailed item name",
      "estimatedCost": number,
      "actualCost": 0,
      "status": "planned",
      "notes": "Cost breakdown or saving rationale"
    }
  ],
  "timeline": [
    {
      "timeframe": "e.g. 6 Months Before, 3 Months Before, 1 Month Before, 2 Weeks Before, 1 Day Before",
      "title": "Actionable milestone title",
      "description": "Specific deliverables and tasks",
      "category": "Logistics | Catering | Stationery | Decor | Coordination",
      "completed": false
    }
  ],
  "dayOfSchedule": [
    {
      "time": "e.g. 09:00 AM, 11:30 AM, 02:00 PM, 05:00 PM, 07:30 PM, 10:00 PM",
      "title": "Run of show item",
      "description": "Crucial logistics details and cues",
      "responsiblePerson": "Designated person (Coordinator, Caterer, Host, etc.)",
      "location": "Specific zone",
      "completed": false
    }
  ],
  "vendors": [
    {
      "category": "Venue | Catering | Photography | Florist | Entertainment | Baker | Transportation | Decor",
      "name": "Realistic vendor or company style",
      "contactPerson": "Contact name",
      "quotedAmount": number,
      "status": "researching",
      "rating": 5,
      "contractSigned": false,
      "notes": "Expected deliverables"
    }
  ],
  "personalizedIdeas": [
    {
      "title": "Creative concept title",
      "category": "decor | entertainment | food_beverage | favors | icebreaker",
      "description": "Vivid detail on how to execute this touch",
      "budgetImpact": "low | medium | high"
    }
  ],
  "invitationDrafts": {
    "formal": "Formal invitation card wording",
    "casual": "Warm, modern friendly invitation wording",
    "whatsapp": "Punchy emoji-friendly mobile/WhatsApp invite wording with RSVP link"
  },
  "notes": "Top 2 planner tips for avoiding costly mistakes for this specific event type"
}
Ensure the sum of estimatedCost across all budgetItems closely matches the total budget ${totalBudget || 15000}. Provide at least 6 budget items, 5 timeline milestones, 6 day-of schedule blocks, 5 vendor categories, and 4 personalized ideas.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
      res.json({ success: true, plan: parsed });
      return;
    }

    // High quality intelligent fallback if API key is not yet set
    const fallbackBudget = Number(totalBudget) || 15000;
    const fallbackCurrency = currency || 'USD';
    const fallbackPlan = {
      theme: `${title} - Tailored Celebration`,
      vibe: vibe || 'Warm, stylish, and memorable',
      colorPalette: ['#1E3A8A', '#D97706', '#FAF5FF', '#10B981', '#475569'],
      visionSummary: `A beautifully curated ${eventType} gathering celebrating ${title} with seamless flow, personalized guest touches, and elevated dining.`,
      budgetItems: [
        { category: 'Venue', name: 'Primary Venue Rental & Setup', estimatedCost: Math.round(fallbackBudget * 0.35), actualCost: 0, status: 'planned', notes: 'Core space rental including baseline tables and chairs' },
        { category: 'Catering', name: 'Appetizers, Dinner & Beverage Service', estimatedCost: Math.round(fallbackBudget * 0.30), actualCost: 0, status: 'planned', notes: 'Calculated for estimated guest count with dietary options' },
        { category: 'Florals & Decor', name: 'Ambient Lighting, Centerpieces & Backdrop', estimatedCost: Math.round(fallbackBudget * 0.12), actualCost: 0, status: 'planned', notes: 'Seasonal florals and accent candles' },
        { category: 'Photography & Media', name: 'Event Coverage & Digital Gallery', estimatedCost: Math.round(fallbackBudget * 0.10), actualCost: 0, status: 'planned', notes: 'High-res photo delivery and highlight reel' },
        { category: 'Music & Sound', name: 'DJ Sound System or Live Performance', estimatedCost: Math.round(fallbackBudget * 0.08), actualCost: 0, status: 'planned', notes: 'Ceremony / announcements sound and party playlist' },
        { category: 'Contingency Fund', name: 'Buffer for Unforeseen Expenses', estimatedCost: Math.round(fallbackBudget * 0.05), actualCost: 0, status: 'planned', notes: 'Gratuities and weather adaptations' },
      ],
      timeline: [
        { timeframe: '3 Months Before', title: 'Lock Venue & Major Vendors', description: 'Confirm contract with main venue, catering team, and lead photographer.', category: 'Logistics', completed: false },
        { timeframe: '6 Weeks Before', title: 'Send Invitations & Confirm Menus', description: 'Send digital / printed invitations and collect RSVP dietary choices.', category: 'Stationery', completed: false },
        { timeframe: '3 Weeks Before', title: 'Decor & Rental Finalization', description: 'Review seating charts, centerpieces, and rental delivery windows.', category: 'Decor', completed: false },
        { timeframe: '1 Week Before', title: 'Final Headcount & Run-through', description: 'Deliver final guest tally to catering and review master day-of schedule.', category: 'Coordination', completed: false },
        { timeframe: '1 Day Before', title: 'On-site Rehearsal & Staging', description: 'Drop off favors, signage, and confirm AV microphones.', category: 'Logistics', completed: false },
      ],
      dayOfSchedule: [
        { time: '09:00 AM', title: 'Vendor Load-In & Technical Check', description: 'Tables set, audio equipment tested, florals placed.', responsiblePerson: 'Lead Coordinator', location: 'Main Space', completed: false },
        { time: '01:00 PM', title: 'Host & Family Arrival', description: 'Pre-event photos, final wardrobe checks, mic soundcheck.', responsiblePerson: 'Host', location: 'VIP Room', completed: false },
        { time: '03:00 PM', title: 'Guest Arrival & Welcome Drink', description: 'Signature cocktails, mocktails, and soft background music.', responsiblePerson: 'Catering Lead', location: 'Foyer / Lawn', completed: false },
        { time: '04:00 PM', title: 'Main Program / Ceremony', description: 'Welcome remarks, toasts, and milestone presentations.', responsiblePerson: 'Emcee', location: 'Main Stage', completed: false },
        { time: '05:30 PM', title: 'Dinner Service & Festivities', description: 'Plated or buffet feast with celebratory toasts.', responsiblePerson: 'Banquet Team', location: 'Dining Area', completed: false },
        { time: '08:00 PM', title: 'Celebration Finale & Fond Farewell', description: 'Late-night treats, dance music, and guest departure.', responsiblePerson: 'DJ / Coordinator', location: 'Main Space', completed: false },
      ],
      vendors: [
        { category: 'Venue', name: `${location || 'Metro'} Event Space`, contactPerson: 'Venue Manager', quotedAmount: Math.round(fallbackBudget * 0.35), status: 'researching', rating: 5, contractSigned: false, notes: 'Includes parking and basic lighting' },
        { category: 'Catering', name: 'Artisan Catering Studio', contactPerson: 'Head Chef', quotedAmount: Math.round(fallbackBudget * 0.30), status: 'researching', rating: 5, contractSigned: false, notes: 'Full service dinner and bar setup' },
        { category: 'Photography', name: 'Storyteller Visuals', contactPerson: 'Lead Photographer', quotedAmount: Math.round(fallbackBudget * 0.10), status: 'researching', rating: 5, contractSigned: false, notes: 'Full coverage' },
        { category: 'Florals', name: 'Bloom & Petal Florals', contactPerson: 'Floral Designer', quotedAmount: Math.round(fallbackBudget * 0.12), status: 'researching', rating: 4, contractSigned: false, notes: 'Seasonal installations' },
      ],
      personalizedIdeas: [
        { title: 'Signature Heritage Cocktail / Mocktail Bar', category: 'food_beverage', description: 'Create two custom drinks named after significant milestones in the host\'s story.', budgetImpact: 'low' },
        { title: 'Interactive Audio Guestbook Box', category: 'entertainment', description: 'A charming audio station where guests leave spontaneous voice recordings.', budgetImpact: 'low' },
        { title: 'Illuminated Memory Wall', category: 'decor', description: 'A warm photo gallery with fairy lights showcasing journeys and memories.', budgetImpact: 'low' },
        { title: 'Locally Sourced Gourmet Favors', category: 'favors', description: 'Custom mini glass jars of artisan honey or spiced coffee beans with custom labels.', budgetImpact: 'low' },
      ],
      invitationDrafts: {
        formal: `You are cordially invited to celebrate ${title} on ${date || 'the upcoming weekend'} at ${location || 'our chosen venue'}. Please join us for an evening of shared memories and dining.`,
        casual: `Come celebrate ${title} with us! Join us on ${date || 'soon'} for great food, laughter, and celebration at ${location || 'our venue'}.`,
        whatsapp: `🎉 You're invited to celebrate ${title}! 🥂 Date: ${date || 'TBD'} @ ${location || 'Venue'}. RSVP here to let us know you'll be there!`,
      },
      notes: 'Remember to verify local permit requirements and keep a 10% cash buffer for last-minute vendor tips.',
    };

    res.json({ success: true, plan: fallbackPlan, fallback: true });
  } catch (err: any) {
    console.error('Error in /api/generate-plan:', err);
    res.status(500).json({ error: err.message || 'Failed to generate event plan' });
  }
});

// 2. Interactive AI Planning Co-Pilot Chat
app.post('/api/chat-assistant', async (req: Request, res: Response) => {
  try {
    const { message, currentPlan, history } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (ai) {
      const systemInstruction = `You are Celebrio AI, an elite event planner and logistical expert.
You provide concrete, practical, tailored answers regarding event planning:
- Event Title: ${currentPlan?.title || 'Current Event'}
- Event Type: ${currentPlan?.type || 'General Event'}
- Target Budget: ${currentPlan?.budget?.currency || 'USD'} ${currentPlan?.budget?.totalBudget || 0}
- Guest Count: ${currentPlan?.guestCount || 0}
- Location: ${currentPlan?.location || 'Unspecified'}
- Theme: ${currentPlan?.theme || 'Custom'}

Provide concise, enthusiastic, professional advice with bullet points, realistic cost numbers, vendor negotiation tips, or itinerary adjustments when requested. Avoid fluffy conversational filler.`;

      const contents = [
        ...(Array.isArray(history) ? history.map((h: any) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })) : []),
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text || 'I am ready to help you coordinate your event!' });
      return;
    }

    res.json({
      reply: `For your ${currentPlan?.type || 'event'} (${currentPlan?.title || 'celebration'}), here is a top recommendation: With a guest count of ${currentPlan?.guestCount || 100}, prioritize having dedicated signage for seating and dietary labels at the buffet. For your budget of ${currentPlan?.budget?.currency || '$'}${currentPlan?.budget?.totalBudget || 15000}, aim to lock in catering and venue first as they typically comprise 60% of total costs.`,
    });
  } catch (err: any) {
    console.error('Error in /api/chat-assistant:', err);
    res.status(500).json({ error: err.message || 'Chat assistance failed' });
  }
});

// 3. AI Invitation Generator
app.post('/api/generate-invitation', async (req: Request, res: Response) => {
  try {
    const { title, eventType, date, location, host, tone, dressCode, rsvpDeadline, additionalNote } = req.body;

    if (ai) {
      const prompt = `Write 3 distinct creative invitation texts for an event with these specs:
- Title: ${title}
- Event Type: ${eventType}
- Date & Time: ${date}
- Location: ${location}
- Host: ${host || 'The Hosts'}
- Requested Tone: ${tone || 'Warm & Elegant'}
- Dress Code: ${dressCode || 'Smart Casual'}
- RSVP Deadline: ${rsvpDeadline || '2 weeks before'}
- Special Note: ${additionalNote || 'None'}

Return a valid JSON object:
{
  "formal": "Full formal card text with traditional phrasing",
  "modern": "Contemporary, chic wording with clear bullet points",
  "casualMobile": "Snappy text message / WhatsApp formatted with friendly emojis and direct call to action",
  "socialStorySnippet": "1-2 punchy lines for an Instagram/social media invite card"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      res.json({ success: true, invitations: JSON.parse(cleanJsonOutput(response.text || '{}')) });
      return;
    }

    res.json({
      success: true,
      invitations: {
        formal: `You are cordially invited to celebrate ${title} on ${date} at ${location}. Dress Code: ${dressCode || 'Cocktail Attire'}. Please RSVP by ${rsvpDeadline || 'the requested date'}.`,
        modern: `Join us for ${title}! We're gathering on ${date} at ${location}. Good music, delicious food, and wonderful company. Attire: ${dressCode || 'Smart Casual'}.`,
        casualMobile: `🎉 You're on the list! Join us for ${title} on ${date} @ ${location}. RSVP here: celebrio.app/rsvp`,
        socialStorySnippet: `Save the Date ✨ ${title} · ${date} · Can't wait to celebrate!`,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Invitation generation failed' });
  }
});

// 4. AI Speech & Toast Generator
app.post('/api/generate-speech', async (req: Request, res: Response) => {
  try {
    const { speakerRole, recipientName, eventType, tone, anecdotes, duration } = req.body;

    if (ai) {
      const prompt = `Write an authentic, memorable toast / speech for:
- Speaker Role: ${speakerRole || 'Best Friend / Host'}
- Recipient / Star: ${recipientName || 'Honored Guest'}
- Event Type: ${eventType || 'Celebration'}
- Tone: ${tone || 'Heartfelt with subtle humor'}
- Key Stories & Anecdotes: ${anecdotes || 'Shared childhood memories and admiring their kindness'}
- Target Duration: ${duration || '2-3 minutes'}

Include stage direction cue markers like [Pause for laughter], [Raise glass], [Smile at recipient] in square brackets.
Provide the response as JSON:
{
  "speechTitle": "Catchy title for the toast",
  "estimatedTime": "${duration || '3 minutes'}",
  "speechBody": "The full speech text with bracketed stage directions",
  "tipsForDelivery": ["Tip 1", "Tip 2", "Tip 3"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      res.json({ success: true, speech: JSON.parse(cleanJsonOutput(response.text || '{}')) });
      return;
    }

    res.json({
      success: true,
      speech: {
        speechTitle: `A Toast to ${recipientName || 'Our Guest of Honor'}`,
        estimatedTime: '2-3 minutes',
        speechBody: `Good evening everyone. [Smile and look around room] For those who don't know me, I have the absolute privilege of being ${speakerRole || 'a close friend'}. When thinking about what makes today so special, one word comes to mind: gratitude. [Pause] Seeing everyone gathered here tonight is a true testament to the warmth and light ${recipientName || 'our guest of honor'} brings into our lives. May the road ahead be filled with laughter, adventure, and moments as joyful as this one. Everyone, please raise your glasses: To ${recipientName || 'celebration'}! [Raise glass with confidence]`,
        tipsForDelivery: [
          'Make steady eye contact with the audience and recipient',
          'Pause 2 seconds after jokes to let laughter land',
          'Keep your shoulders relaxed and speak slightly slower than normal conversation',
        ],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Speech generation failed' });
  }
});

// 5. AI Vendor Inquiry Draft Generator
app.post('/api/vendor-inquiry', async (req: Request, res: Response) => {
  try {
    const { vendorCategory, vendorName, eventTitle, eventDate, location, guestCount, budgetRange, specificRequirements } = req.body;

    if (ai) {
      const prompt = `Write a polished, professional vendor inquiry message/email from an event host to a potential vendor:
- Vendor Category: ${vendorCategory}
- Vendor Name: ${vendorName || 'Prospective Vendor'}
- Event: ${eventTitle}
- Date: ${eventDate}
- Venue/Location: ${location}
- Estimated Guests: ${guestCount}
- Allocated Budget: ${budgetRange}
- Specific Requirements: ${specificRequirements || 'Availability, portfolio, and standard packages'}

Return a JSON object:
{
  "subjectLine": "Clear, professional subject line",
  "emailBody": "Full ready-to-copy email text with polite tone and clear questions",
  "suggestedFollowUpDate": "When to follow up"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      res.json({ success: true, inquiry: JSON.parse(cleanJsonOutput(response.text || '{}')) });
      return;
    }

    res.json({
      success: true,
      inquiry: {
        subjectLine: `Event Inquiry: ${vendorCategory} for ${eventTitle} on ${eventDate}`,
        emailBody: `Dear ${vendorName || 'Team'},\n\nI hope you're having a wonderful week. I am currently planning ${eventTitle}, taking place on ${eventDate} in ${location} for approximately ${guestCount} guests.\n\nWe love your work and would love to check your availability for this date. We are looking for ${vendorCategory} services within our allocated budget of approximately ${budgetRange}.\n\nCould you please share your package pricing and availability for a brief consultation call?\n\nThank you so much, and looking forward to hearing from you!\n\nWarm regards,\nEvent Planning Team`,
        suggestedFollowUpDate: '3-4 business days',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Vendor inquiry failed' });
  }
});

// 6. AI Budget Optimizer
app.post('/api/optimize-budget', async (req: Request, res: Response) => {
  try {
    const { items, totalBudget, currency, eventType } = req.body;

    if (ai) {
      const prompt = `You are a financial advisor for event productions.
Analyze the following budget breakdown for a ${eventType} event:
Total Budget: ${currency} ${totalBudget}
Items: ${JSON.stringify(items)}

Provide actionable insights in JSON format:
{
  "overallHealth": "Healthy | Over Budget | High Risk | Under Allocated",
  "spentPercentage": number,
  "topSavingsOpportunities": ["Point 1", "Point 2", "Point 3"],
  "hiddenCostsToWatch": ["Cost 1", "Cost 2"],
  "recommendedAdjustments": [
    { "category": "Category name", "currentAllocated": number, "recommendedAllocated": number, "reason": "Explanation" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      res.json({ success: true, analysis: JSON.parse(cleanJsonOutput(response.text || '{}')) });
      return;
    }

    const totalAllocated = (items || []).reduce((acc: number, item: any) => acc + (Number(item.estimatedCost) || 0), 0);
    const spentPercent = totalBudget > 0 ? Math.round((totalAllocated / totalBudget) * 100) : 0;

    res.json({
      success: true,
      analysis: {
        overallHealth: spentPercent > 100 ? 'Over Budget' : spentPercent > 90 ? 'Healthy' : 'Under Allocated',
        spentPercentage: spentPercent,
        topSavingsOpportunities: [
          'Consider seasonal local flowers rather than imported greenhouse blooms to save up to 25% on floral arrangements.',
          'Consolidate bar packages to signature cocktail pairs plus wine & beer rather than open top-shelf liquor.',
          'Inquire about off-peak load-in hours to avoid extra venue overtime fees.',
        ],
        hiddenCostsToWatch: [
          'Service charges (typically 20-22%) and local sales taxes on food & beverage.',
          'Vendor meals for photographer, videographer, and DJ crew.',
          'Electrical power drops or municipal generator fuel fees.',
        ],
        recommendedAdjustments: [
          { category: 'Catering', currentAllocated: Math.round(totalAllocated * 0.4), recommendedAllocated: Math.round(totalBudget * 0.35), reason: 'Keep food and drinks within 35-40% to protect the contingency reserve.' },
          { category: 'Contingency Fund', currentAllocated: Math.round(totalAllocated * 0.03), recommendedAllocated: Math.round(totalBudget * 0.08), reason: 'Maintain at least 8-10% buffer for day-of changes.' },
        ],
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Budget optimization failed' });
  }
});

// Vite middleware in dev / static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Celebrio Event Planner server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
