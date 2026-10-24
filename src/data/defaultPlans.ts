import { EventPlan } from '../types/event';

export const SAMPLE_EVENTS: EventPlan[] = [
  {
    id: 'plan-wedding-garden',
    title: 'Elena & Julian’s Botanical Glasshouse Wedding',
    type: 'wedding',
    date: '2026-11-14',
    location: 'Conservatory Botanical Gardens, Austin, TX',
    guestCount: 120,
    theme: 'Romantic Greenhouse Luxe with Olive & Warm Gold',
    vibe: 'Timeless, intimate, warm candlelight, organic florals',
    colorPalette: ['#2F4F4F', '#D4AF37', '#FAF9F6', '#8F9779', '#E6C280'],
    visionSummary: 'An ethereal celebration nestled within architectural glass conservatory arches. Cascading eucalyptus runners, bespoke hand-lettered place cards, gentle string quartet melodies transitioning into lively acoustic folk, and an open-air farm-to-table feast.',
    heroImage: '/src/assets/images/wedding_inspiration_mood_1792837355748.jpg',
    budget: {
      totalBudget: 35000,
      currency: 'USD',
      items: [
        { id: 'b-1', category: 'Venue', name: 'Glasshouse Atrium & Courtyard Rental', estimatedCost: 9500, actualCost: 9500, status: 'deposit_paid', notes: 'Includes tables, chivari chairs, and setup cleanup' },
        { id: 'b-2', category: 'Catering', name: 'Farm-to-Table Plated Dinner & Canapés', estimatedCost: 11000, actualCost: 10800, status: 'planned', notes: '3-course organic dinner with wine pairing' },
        { id: 'b-3', category: 'Florals & Decor', name: 'Arbor Floral Arch & Botanical Centerpieces', estimatedCost: 4500, actualCost: 4200, status: 'deposit_paid', notes: 'White ranunculus, olive branch runners, brass candelabras' },
        { id: 'b-4', category: 'Photography & Video', name: 'Full-Day 10-Hr Coverage + Drone + Film', estimatedCost: 4000, actualCost: 4000, status: 'deposit_paid', notes: 'Second shooter included, online gallery delivery' },
        { id: 'b-5', category: 'Music & Sound', name: 'Acoustic Ceremony Duo + Evening DJ Band', estimatedCost: 2800, actualCost: 2500, status: 'planned', notes: 'Wireless lavalier mics for vows' },
        { id: 'b-6', category: 'Attire & Beauty', name: 'Hair, Makeup & Bridal Party Styling', estimatedCost: 1800, actualCost: 1600, status: 'planned' },
        { id: 'b-7', category: 'Contingency Fund', name: 'Buffer for Weather & Gratuity', estimatedCost: 1400, actualCost: 0, status: 'planned', notes: 'Reserved for unexpected logistics' }
      ]
    },
    timeline: [
      { id: 't-1', timeframe: '9–12 Months Before', title: 'Book Venue & Core Vendors', description: 'Lock in glasshouse venue date, secure photographer, and book primary caterer.', category: 'Logistics', completed: true },
      { id: 't-2', timeframe: '6 Months Before', title: 'Send Save-the-Dates & Finalize Attire', description: 'Mail foil-pressed stationery, confirm wedding party attire and color swatches.', category: 'Stationery', completed: true },
      { id: 't-3', timeframe: '3 Months Before', title: 'Menu Tasting & Floral Mockup', description: 'Sample chef’s seasonal proteins, wine pairings, and review tabletop mockups.', category: 'Catering', completed: true },
      { id: 't-4', timeframe: '1 Month Before', title: 'Confirm RSVPs & Seating Layout', description: 'Finalize dietary count with kitchen, print seating chart and escort cards.', category: 'Guests', completed: false },
      { id: 't-5', timeframe: '1 Week Before', title: 'Final Vendor Run-Through & Payments', description: 'Distribute timeline to bridal party and vendors, pack emergency kit.', category: 'Coordination', completed: false }
    ],
    dayOfSchedule: [
      { id: 's-1', time: '09:00 AM', title: 'Bridal Suite Hair & Makeup Starts', description: 'Bridal party arrives for glam with mimosas and brunch bites.', responsiblePerson: 'Lead MUA / Maid of Honor', location: 'Bridal Suite', completed: false },
      { id: 's-2', time: '12:30 PM', title: 'Florals & Rentals Delivery', description: 'Arbor installation, table centerpieces, and place settings set up.', responsiblePerson: 'Lead Florist & Event Coordinator', location: 'Glass Atrium', completed: false },
      { id: 's-3', time: '02:00 PM', title: 'Couple First Look & Portraits', description: 'Private first look in the garden grove followed by wedding party portraits.', responsiblePerson: 'Lead Photographer', location: 'East Rose Garden', completed: false },
      { id: 's-4', time: '04:30 PM', title: 'Guest Arrival & Welcome Refreshments', description: 'Sparkling lavender lemonade and iced herbal tea served as guests take seats.', responsiblePerson: 'Catering Captain', location: 'Courtyard Lawn', completed: false },
      { id: 's-5', time: '05:00 PM', title: 'Ceremony Processional & Vows', description: 'String quartet plays acoustic arrangements; couple exchanges personal vows.', responsiblePerson: 'Officiant & Planner', location: 'Floral Arbor', completed: false },
      { id: 's-6', time: '06:00 PM', title: 'Cocktail Hour & Passed Hors d’Oeuvres', description: 'Truffle arancini, smoked salmon crostini, signature Aperol & Rosemary spritz.', responsiblePerson: 'Bar & Service Team', location: 'Sunset Terrace', completed: false },
      { id: 's-7', time: '07:15 PM', title: 'Grand Entrance & Plated Dinner', description: 'Welcome toast by bride’s father, seasonal 3-course dinner served.', responsiblePerson: 'Emcee & Banquet Staff', location: 'Main Glasshouse', completed: false },
      { id: 's-8', time: '08:45 PM', title: 'First Dance, Cake Cutting & Open Party', description: 'Romantic slow dance, tiered lemon curd cake cutting, dance floor opens.', responsiblePerson: 'DJ / Band Lead', location: 'Dance Floor', completed: false }
    ],
    vendors: [
      { id: 'v-1', category: 'Venue', name: 'Austin Conservatory Glasshouse', contactPerson: 'Marianne Vance', contactEmail: 'marianne@austinbotanic.org', contactPhone: '+1 (512) 555-0142', quotedAmount: 9500, status: 'booked', rating: 5, contractSigned: true, notes: 'Contract covers 10am-midnight. Security deposit cleared.' },
      { id: 'v-2', category: 'Catering', name: 'Heritage Heirloom Catering Co.', contactPerson: 'Chef Marcus Cole', contactEmail: 'events@heritageaustin.com', contactPhone: '+1 (512) 555-8392', quotedAmount: 11000, status: 'booked', rating: 5, contractSigned: true, notes: 'Dietary menu confirmed: 14 vegetarians, 6 gluten-free.' },
      { id: 'v-3', category: 'Florist', name: 'Wildflower & Twig Botanical Studio', contactPerson: 'Camilla Reyes', contactEmail: 'hello@wildflowertwig.com', quotedAmount: 4500, status: 'booked', rating: 5, contractSigned: true, notes: 'Using sustainable local Texas greenery and cream garden roses.' },
      { id: 'v-4', category: 'Photography', name: 'Lumière Storytelling Photo', contactPerson: 'Derek Chen', contactEmail: 'derek@lumiereweddings.com', quotedAmount: 4000, status: 'booked', rating: 5, contractSigned: true, notes: '35mm film + 4K digital combo package.' },
      { id: 'v-5', category: 'Entertainment', name: 'Silver Strings Quartet & DJ Alex', contactPerson: 'Alex Rivera', contactEmail: 'bookings@silverstringsatx.com', quotedAmount: 2800, status: 'proposal_received', rating: 4, contractSigned: false, notes: 'Awaiting revised playlist agreement.' }
    ],
    personalizedIdeas: [
      { id: 'i-1', title: 'Pressed Wildflower Escort Card Wall', category: 'decor', description: 'Custom acrylic tiles embedded with tiny dried wildflowers matching each table name.', budgetImpact: 'low' },
      { id: 'i-2', title: 'Late-Night Artisan Churro & Espresso Cart', category: 'food_beverage', description: 'Surprise warm cinnamon churros paired with hand-poured decaf cortados at 10 PM.', budgetImpact: 'medium' },
      { id: 'i-3', title: 'Vintage Audio Guestbook Telephone', category: 'entertainment', description: 'An antique rotary phone where guests pick up the receiver and record heartfelt voicemail wishes.', budgetImpact: 'low' },
      { id: 'i-4', title: 'Botanical Seed Packet Favors', category: 'favors', description: 'Small linen envelopes containing heirloom Texas wildflowers with personalized note "Let Love Bloom".', budgetImpact: 'low' }
    ],
    invitationDrafts: {
      formal: 'Together with their families, Elena & Julian request the honour of your presence as they exchange vows and celebrate their marriage. Saturday, November 14, 2026 at five o\'clock in the evening. Conservatory Botanical Gardens, Austin, Texas. Reception to follow.',
      casual: 'We’re getting married! Join Elena & Julian for an evening under the stars and glass greenhouse. Good food, heartwarming vows, and lots of dancing await. Please join us Saturday, November 14, 2026 at 5:00 PM.',
      whatsapp: '🌿 Elena & Julian are tying the knot! 💍 Save the date: Saturday, Nov 14, 2026 @ 5:00 PM at Austin Botanical Glasshouse. We’d love for you to celebrate with us. Details & RSVP: celebrio.app/elena-julian'
    },
    notes: 'Bride’s grandmother requires golf cart transport from parking to the glasshouse entrance. Backup generator on standby.'
  },
  {
    id: 'plan-birthday-milestone',
    title: 'Sophie’s "Golden Hour" 30th Birthday Soirée',
    type: 'birthday',
    date: '2026-10-30',
    location: 'Sunstone Vineyard & Private Estate, Santa Ynez, CA',
    guestCount: 45,
    theme: 'Tuscan Sunset, Terracotta, Neutral Linens & Wild Olive',
    vibe: 'Sophisticated yet laid-back, candlelit long tables, acoustic bossa nova',
    colorPalette: ['#C86D51', '#D4AF37', '#FAF3E0', '#556B2F', '#4A3525'],
    visionSummary: 'An unforgettable milestone 30th birthday dinner in the vineyard hills. Wine tastings led by the master sommelier, wood-fired artisan sourdough pizzas, personalized birthday trivia cocktail hour, and a stunning 2-tier textured vanilla-bean cake.',
    heroImage: '/src/assets/images/birthday_party_mood_1792837356469.jpg',
    budget: {
      totalBudget: 8500,
      currency: 'USD',
      items: [
        { id: 'bb-1', category: 'Venue', name: 'Private Vineyard Terrace & Barrel Room', estimatedCost: 3000, actualCost: 3000, status: 'deposit_paid', notes: 'Private reservation from 4pm to 11pm' },
        { id: 'bb-2', category: 'Catering & Wine', name: 'Wood-fired Pizza & Estate Wine Flights', estimatedCost: 2600, actualCost: 2500, status: 'planned', notes: 'Includes 3 wine varietals and dessert pairings' },
        { id: 'bb-3', category: 'Cake & Pastries', name: 'Custom Two-Tier Vanilla & Gold Foil Cake', estimatedCost: 450, actualCost: 420, status: 'deposit_paid', notes: 'Inscribed with Happy 30th Sophie' },
        { id: 'bb-4', category: 'Decor & Lighting', name: 'Festoon Bistro Strings, Linen Runners & Ceramics', estimatedCost: 1100, actualCost: 950, status: 'paid_in_full' },
        { id: 'bb-5', category: 'Music & Entertainment', name: 'Acoustic Guitarist & Custom Trivia Host', estimatedCost: 900, actualCost: 850, status: 'planned' },
        { id: 'bb-6', category: 'Stationery & Favors', name: 'Personalized Mini Olive Oil Bottles & Menus', estimatedCost: 450, actualCost: 400, status: 'planned' }
      ]
    },
    timeline: [
      { id: 'bt-1', timeframe: '6 Weeks Before', title: 'Estate Booking & Guest List', description: 'Reserve vineyard terrace, finalize 45 close friends and family invites.', category: 'Logistics', completed: true },
      { id: 'bt-2', timeframe: '3 Weeks Before', title: 'Menu & Cake Design Confirmation', description: 'Finalize pizza toppings, salad course, and order two-tier artisan cake.', category: 'Catering', completed: true },
      { id: 'bt-3', timeframe: '1 Week Before', title: 'Playlist & Photo Slideshow', description: 'Curate 90s/00s nostalgic playlist and assemble childhood-to-30 photo montage.', category: 'Entertainment', completed: false },
      { id: 'bt-4', timeframe: '2 Days Before', title: 'Confirm Guest Transportation', description: 'Coordinate wine country shuttle bus pickup from downtown hotel.', category: 'Transportation', completed: false }
    ],
    dayOfSchedule: [
      { id: 'bs-1', time: '04:00 PM', title: 'Vendor Setup & Table Styling', description: 'Place name cards, floral arrangements, candles, and cake setup.', responsiblePerson: 'Event Lead', location: 'Terrace', completed: false },
      { id: 'bs-2', time: '05:30 PM', title: 'Shuttle Arrives & Welcome Aperitivo', description: 'Guests greeted with estate sparkling rosé and charcuterie board.', responsiblePerson: 'Winery Host', location: 'Cypress Lawn', completed: false },
      { id: 'bs-3', time: '06:30 PM', title: 'Golden Hour Sunset Photo Session', description: 'Group photos overlooking rolling vine hills as sun drops.', responsiblePerson: 'Photographer', location: 'Estate Vineyard View', completed: false },
      { id: 'bs-4', time: '07:15 PM', title: 'Family-Style Tuscan Feast', description: 'Artisan blistered pizzas, burrata salads, roasted seasonal vegetables.', responsiblePerson: 'Catering Lead', location: 'Long Banquet Table', completed: false },
      { id: 'bs-5', time: '08:30 PM', title: 'Toasts & Birthday Cake Ceremony', description: 'Heartfelt toasts from friends, candle wish, sparklers, cake cutting.', responsiblePerson: 'Best Friend / Host', location: 'Main Table', completed: false },
      { id: 'bs-6', time: '09:15 PM', title: 'Dancing & Stargazing by the Fire Pit', description: 'Cozy cashmere blankets, gourmet s’mores bar, music.', responsiblePerson: 'All Guests', location: 'Fire Terrace', completed: false }
    ],
    vendors: [
      { id: 'bv-1', category: 'Venue', name: 'Sunstone Vineyard & Estate', contactPerson: 'Kelsey Miller', contactEmail: 'privateevents@sunstoneestate.com', quotedAmount: 3000, status: 'booked', rating: 5, contractSigned: true },
      { id: 'bv-2', category: 'Catering', name: 'Flour & Fire Mobile Wood Fired Oven', contactPerson: 'Chef Enzo', contactEmail: 'enzo@flourandfire.com', quotedAmount: 2600, status: 'booked', rating: 5, contractSigned: true },
      { id: 'bv-3', category: 'Bakery', name: 'Petite Confection Boutique', contactPerson: 'Claire Dubois', contactEmail: 'orders@petiteconfection.com', quotedAmount: 450, status: 'booked', rating: 5, contractSigned: true },
      { id: 'bv-4', category: 'Entertainment', name: 'Leo Gomez Acoustic Guitar & Vocals', contactPerson: 'Leo Gomez', contactEmail: 'leo@leogomezmusic.com', quotedAmount: 900, status: 'contacted', rating: 4, contractSigned: false }
    ],
    personalizedIdeas: [
      { id: 'bi-1', title: '"Roast & Toast" Secret Card Game', category: 'entertainment', description: 'Each guest gets a vintage recipe card to write their favorite memory with Sophie to be read out loud.', budgetImpact: 'low' },
      { id: 'bi-2', title: 'Estate Olive Oil & Rosemary Favors', category: 'favors', description: 'Glass bottles of cold-pressed estate olive oil with custom calligraphy labels "Thank you for celebrating 30 years".', budgetImpact: 'low' },
      { id: 'bi-3', title: 'Custom "Sophie\'s 30th" Polaroids & Guest Journal', category: 'entertainment', description: 'Dual Polaroid cameras with metallic gel pens and linen-bound scrapbook on an easel.', budgetImpact: 'low' }
    ],
    invitationDrafts: {
      formal: 'Please join us in celebrating thirty years of joy, laughter, and friendship as Sophie enters her golden decade. An evening of vineyard dinner and fine wine awaits on Friday, October 30, 2026 at 5:30 PM. Sunstone Vineyard Estate.',
      casual: 'Sophie is turning 30! Come raise a glass under the stars with great food, warm vineyard breezes, and the best company. Friday, Oct 30 at 5:30 PM.',
      whatsapp: '✨ Cheers to 30 Years! Join us for Sophie’s Golden 30th Birthday Dinner in Santa Ynez on Friday, Oct 30 @ 5:30 PM. RSVP here: celebrio.app/sophie30'
    },
    notes: 'Surprise dessert presentation planned with sparklers. Shuttle leaves Solvang at 5:00 PM.'
  },
  {
    id: 'plan-community-festival',
    title: 'Oakridge Annual Harvest & Artisan Street Fair',
    type: 'community',
    date: '2026-11-07',
    location: 'Oakridge Town Square & Main Boulevard',
    guestCount: 650,
    theme: 'Autumn Harvest, Cultural Unity, Local Artisans',
    vibe: 'Festive, family-friendly, vibrant, bustling, inclusive',
    colorPalette: ['#A0522D', '#D2691E', '#F4A460', '#2E8B57', '#800020'],
    visionSummary: 'A community-wide celebration uniting local makers, independent farmers, school musical performances, craft beer tasting, and interactive kids’ science and art workshops across the pedestrianized town boulevard.',
    heroImage: '/src/assets/images/community_event_mood_1792837356226.jpg',
    budget: {
      totalBudget: 18000,
      currency: 'USD',
      items: [
        { id: 'cb-1', category: 'Permits & Municipal', name: 'City Street Closure, Police & EMS Staffing', estimatedCost: 3500, actualCost: 3500, status: 'paid_in_full', notes: 'Full day street permits approved by City Council' },
        { id: 'cb-2', category: 'Infrastructure & Rentals', name: 'Main Stage, Sound System, 40 Vendor Tents', estimatedCost: 5200, actualCost: 5000, status: 'deposit_paid', notes: 'Includes generators, portable washrooms, waste stations' },
        { id: 'cb-3', category: 'Live Music & Emcee', name: 'Local Band Headliner & Community Acts', estimatedCost: 3000, actualCost: 2800, status: 'planned', notes: 'High school jazz band + evening indie folk group' },
        { id: 'cb-4', category: 'Marketing & Signage', name: 'Banners, Social Ads, Printed Town Maps', estimatedCost: 1800, actualCost: 1500, status: 'paid_in_full' },
        { id: 'cb-5', category: 'Kids Discovery Zone', name: 'Pumpkin Carving, Face Painting & Science Booth', estimatedCost: 1500, actualCost: 1400, status: 'planned' },
        { id: 'cb-6', category: 'Volunteer Support', name: 'T-Shirts, Badges & Volunteer Meal Vouchers', estimatedCost: 1200, actualCost: 1100, status: 'planned' },
        { id: 'cb-7', category: 'Contingency Reserve', name: 'Emergency Weather & Surplus Clean Up', estimatedCost: 1800, actualCost: 0, status: 'planned' }
      ]
    },
    timeline: [
      { id: 'ct-1', timeframe: '3 Months Before', title: 'Submit City Permits & Insurance', description: 'Obtain city road closure permit, noise waiver, and community event liability insurance.', category: 'Permits', completed: true },
      { id: 'ct-2', timeframe: '2 Months Before', title: 'Open Artisan & Food Vendor Applications', description: 'Select 35 craft makers, 6 food trucks, and 4 local non-profit partners.', category: 'Vendors', completed: true },
      { id: 'ct-3', timeframe: '1 Month Before', title: 'Publish Fair Schedule & Map', description: 'Distribute festival flyers to schools, libraries, and launch community social campaign.', category: 'Marketing', completed: true },
      { id: 'ct-4', timeframe: '2 Weeks Before', title: 'Volunteer Orientation & Traffic Plan', description: 'Hold briefing for 30 volunteer safety marshals and setup crews.', category: 'Operations', completed: false },
      { id: 'ct-5', timeframe: '2 Days Before', title: 'Deliver Barricades & Electrical Generators', description: 'Stage heavy infrastructure along staging depot.', category: 'Logistics', completed: false }
    ],
    dayOfSchedule: [
      { id: 'cs-1', time: '06:00 AM', title: 'Street Closure & Barricades Placement', description: 'Traffic division closes Main St; municipal barrier placement.', responsiblePerson: 'Operations Lead & Police Liaison', location: 'Main Street', completed: false },
      { id: 'cs-2', time: '07:30 AM', title: 'Vendor Load-In & Tent Setup', description: 'Staggered arrival for 40 artisan booths and food trucks.', responsiblePerson: 'Vendor Coordinator', location: 'Town Square Corridor', completed: false },
      { id: 'cs-3', time: '10:00 AM', title: 'Festival Gates Open & Opening Ceremony', description: 'Mayor welcome speech, town high school marching band fanfare.', responsiblePerson: 'Civic Committee Chair', location: 'Main Pavilion Stage', completed: false },
      { id: 'cs-4', time: '11:30 AM', title: 'Artisan Market & Kids Zone Opens', description: 'Pumpkin painting, cider press demonstration, live pottery throwing.', responsiblePerson: 'Activities Coordinator', location: 'Community Green', completed: false },
      { id: 'cs-5', time: '02:00 PM', title: 'Pie Baking Contest & Live Judging', description: 'Amateur town baking contest with celebrity chef judges.', responsiblePerson: 'Food Stage Host', location: 'Catering Tent', completed: false },
      { id: 'cs-6', time: '04:30 PM', title: 'Evening Headliner Band Performance', description: 'Live folk rock concert, craft beer garden open till dusk.', responsiblePerson: 'Sound Engineer & Emcee', location: 'Main Stage', completed: false },
      { id: 'cs-7', time: '07:00 PM', title: 'Festival Closing & Clean-Up Strike', description: 'Tear down tents, litter sweep, streets reopen by 9:00 PM.', responsiblePerson: 'Sanitation Crew', location: 'All Zones', completed: false }
    ],
    vendors: [
      { id: 'cv-1', category: 'Infrastructure', name: 'Apex Event Staging & Power', contactPerson: 'Dave Hawkins', contactEmail: 'dave@apexevents.org', quotedAmount: 5200, status: 'booked', rating: 5, contractSigned: true },
      { id: 'cv-2', category: 'Permits', name: 'Oakridge Dept of Public Works', contactPerson: 'Officer Sheila Jones', contactEmail: 'permits@oakridgegov.org', quotedAmount: 3500, status: 'booked', rating: 5, contractSigned: true },
      { id: 'cv-3', category: 'Entertainment', name: 'The Wild Rivers Folk Band', contactPerson: 'Gareth Bell', contactEmail: 'bookings@wildriversband.com', quotedAmount: 3000, status: 'booked', rating: 5, contractSigned: true },
      { id: 'cv-4', category: 'Sanitation', name: 'EcoWaste Clean Event Solutions', contactPerson: 'Tara Ramos', contactEmail: 'tara@ecowasteclean.com', quotedAmount: 1800, status: 'proposal_received', rating: 4, contractSigned: false }
    ],
    personalizedIdeas: [
      { id: 'ci-1', title: 'Community Handprint Peace Mural', category: 'entertainment', description: 'A massive 20-foot canvas where children and elders paint their handprints to form an autumn tree canopy.', budgetImpact: 'low' },
      { id: 'ci-2', title: 'Passport to the Square Scavenger Hunt', category: 'entertainment', description: 'Kids collect 6 stamps from local historical booths to earn a free cider donut.', budgetImpact: 'low' },
      { id: 'ci-3', title: 'Local Farmer Pie Baking Trophy', category: 'food_beverage', description: 'Annual engraved wooden rolling pin trophy presented to the town\'s best homemade apple pie.', budgetImpact: 'low' }
    ],
    invitationDrafts: {
      formal: 'The Oakridge Civic Association cordially invites all residents and visitors to the 2026 Annual Harvest & Artisan Street Fair. Saturday, November 7, 2026 from 10:00 AM to 7:00 PM on Main Boulevard. Admission is free and open to all.',
      casual: 'Bring the whole family out to the Oakridge Harvest Fair! Enjoy live music, 40+ local makers, mouthwatering food trucks, and kids’ crafts. Saturday, November 7 from 10 AM to 7 PM on Main St.',
      whatsapp: '🍂 Oakridge Harvest & Artisan Fair is this Saturday, Nov 7! 🎪 40+ craft booths, live music, delicious food trucks & free entry for the family. See the schedule: oakridge.gov/fair2026'
    },
    notes: 'Rain location plan: Municipal Civic Center Gymnasium holds up to 500 guests.'
  }
];
