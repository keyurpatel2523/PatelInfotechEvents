import type { ServiceCardData } from "@/components/marketplace/service-card";

/* ─── Sub-types ───────────────────────────────────────────── */
export interface ReviewData {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  date: string;
  rating: number;
  text: string;
  eventType: string;
}

export interface PackageOption {
  id: string;
  label: string;
  price: number;
  unit: string;
  description: string;
  highlights: string[];
  popular?: boolean;
}

export interface FeatureItem {
  emoji: string;
  title: string;
  description: string;
}

export interface ServiceDetailData {
  slug: string;
  images: string[];
  tagline: string;
  longDescription: string;
  included: string[];
  features: FeatureItem[];
  packages: PackageOption[];
  reviews: ReviewData[];
  responseTime: string;
  minimumNotice: string;
  cancellationPolicy: string;
  languages: string[];
  areasServed: string[];
}

/* ─── Detail records ──────────────────────────────────────── */
const SERVICE_DETAILS: ServiceDetailData[] = [
  /* ── Mayfair Catering ──────────────────────────────────── */
  {
    slug: "mayfair-catering-co",
    tagline: "White-glove catering trusted by Michelin-starred chefs and royal households.",
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=85",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    ],
    longDescription:
      "Mayfair Catering Co. brings over 15 years of fine-dining expertise to events across London. We specialise in seasonal British menus crafted from locally sourced produce, delivered by a team of formally trained chefs and white-glove service staff.\n\nFrom intimate Kensington supper clubs to 500-guest corporate galas at the Natural History Museum, every detail is handled with the same exacting standard. We work closely with each client to design bespoke menus that reflect their vision — whether that's a traditional three-course dinner, a grazing table inspired by Borough Market, or a live cooking station that becomes the centrepiece of the evening.",
    included: [
      "Full menu consultation and tasting session",
      "Head chef + dedicated kitchen team",
      "Front-of-house service staff (1:10 guest ratio)",
      "All crockery, glassware, and linen",
      "Setup, service, and full post-event clear-up",
      "Allergen and dietary management",
      "Wine pairing recommendations",
    ],
    features: [
      { emoji: "🍽️", title: "Seasonal British menus",  description: "Locally sourced produce, crafted menus updated every quarter." },
      { emoji: "👨‍🍳", title: "Michelin-trained chefs",  description: "Our head chefs trained under London's most decorated kitchens." },
      { emoji: "🌿", title: "Fully sustainable",        description: "Zero single-use plastic, composted waste, and carbon-offset delivery." },
      { emoji: "🍷", title: "Sommelier on request",     description: "Expert wine and non-alcoholic pairing for every course." },
      { emoji: "⭐", title: "Royal warrant standard",   description: "Vetted and used by venues holding royal entertainment licences." },
      { emoji: "📋", title: "Dedicated event manager",  description: "One point of contact from enquiry through post-event debrief." },
    ],
    packages: [
      {
        id: "essential",
        label: "Essential",
        price: 65,
        unit: "per head",
        description: "Perfect for corporate lunches and informal receptions.",
        highlights: ["2-course set menu", "Service staff", "Basic equipment hire"],
      },
      {
        id: "signature",
        label: "Signature",
        price: 95,
        unit: "per head",
        description: "Our most popular package for weddings and galas.",
        highlights: ["3-course menu + canapés", "White-glove staff", "Full equipment hire", "Menu tasting"],
        popular: true,
      },
      {
        id: "prestige",
        label: "Prestige",
        price: 145,
        unit: "per head",
        description: "The ultimate experience — bespoke from start to finish.",
        highlights: ["Bespoke tasting menu", "Sommelier + wine pairing", "Live stations", "Dedicated manager", "Full styling"],
      },
    ],
    reviews: [
      { id: "r1", author: "Sarah Mitchell", initials: "SM", avatarColor: "#6366f1", date: "12 Mar 2026", rating: 5, text: "Absolutely exceptional. The food was flawless and the service team made our 180-guest wedding feel completely effortless. Every single guest complimented the menu.", eventType: "Wedding Reception" },
      { id: "r2", author: "Oliver Nash",    initials: "ON", avatarColor: "#8b5cf6", date: "28 Feb 2026", rating: 5, text: "We hired Mayfair Catering for our annual company gala at Guildhall. The team were immaculate — from setup to clear-up, zero stress.", eventType: "Corporate Gala" },
      { id: "r3", author: "Emma Thompson",  initials: "ET", avatarColor: "#22c55e", date: "14 Jan 2026", rating: 5, text: "The tasting session alone was worth booking them. They genuinely listened to what we wanted and created something truly personal.", eventType: "Private Dinner" },
      { id: "r4", author: "James Hartley",  initials: "JH", avatarColor: "#f59e0b", date: "5 Dec 2025",  rating: 4, text: "Brilliant food and presentation. Slightly delayed on setup but managed everything beautifully once running. Would absolutely book again.", eventType: "Christmas Party" },
    ],
    responseTime: "Within 2 hours",
    minimumNotice: "4 weeks",
    cancellationPolicy: "Full refund up to 14 days before event",
    languages: ["English", "French"],
    areasServed: ["Mayfair", "Kensington", "Chelsea", "City of London", "Canary Wharf", "Greenwich"],
  },

  /* ── Lumina Photography ────────────────────────────────── */
  {
    slug: "lumina-photography-london",
    tagline: "Award-winning imagery that tells the story of your most important moments.",
    images: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=85",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
    ],
    longDescription:
      "Lumina is London's most sought-after wedding and event photography studio. Founded by Sophie Clarke — three-time winner of the British Wedding Photography Awards — the team blends documentary instinct with editorial flair to produce images that feel both authentic and cinematic.\n\nWe cover everything from intimate elopements to 600-guest celebrations, corporate brand launches to charity galas. Our same-week turnaround on edited galleries means you're sharing your memories while they're still fresh.",
    included: [
      "Pre-event consultation and location scouting",
      "Full-day coverage (up to 12 hours)",
      "Second shooter included as standard",
      "Drone aerial photography where permitted",
      "Online gallery with print-quality downloads",
      "Same-week delivery of 60 edited preview images",
      "Full edited gallery delivered within 4 weeks",
    ],
    features: [
      { emoji: "📸", title: "Award-winning team",      description: "3× British Wedding Photography Award winners since 2022." },
      { emoji: "🎬", title: "Cinematic editing",        description: "Natural, timeless editing style — never over-filtered." },
      { emoji: "🚁", title: "Drone coverage",           description: "Licensed aerial photography for breathtaking venue shots." },
      { emoji: "⚡", title: "Same-week previews",      description: "60 edited images delivered within 5 working days." },
      { emoji: "🖼️", title: "Fine art prints",         description: "Museum-quality prints and albums crafted in-house." },
      { emoji: "🔒", title: "Backed up forever",        description: "Your images are stored on redundant cloud servers permanently." },
    ],
    packages: [
      {
        id: "half-day",
        label: "Half Day",
        price: 950,
        unit: "per booking",
        description: "Ideal for ceremonies, corporate headshots, or parties.",
        highlights: ["6 hours coverage", "Online gallery", "100+ edited images"],
      },
      {
        id: "full-day",
        label: "Full Day",
        price: 1800,
        unit: "per booking",
        description: "Our most popular wedding and event package.",
        highlights: ["12 hours coverage", "Second shooter", "Drone + ground", "500+ edited images", "Same-week previews"],
        popular: true,
      },
      {
        id: "prestige",
        label: "Prestige",
        price: 2800,
        unit: "per booking",
        description: "The complete story — photography and cinematic film.",
        highlights: ["Unlimited coverage", "Full-length film", "Aerial + ground", "Fine art album", "Priority editing"],
      },
    ],
    reviews: [
      { id: "r1", author: "Charlotte Webb",  initials: "CW", avatarColor: "#6366f1", date: "18 Mar 2026", rating: 5, text: "Sophie and the team captured our wedding day perfectly. The drone shots of Brockwell Park are absolutely stunning. Our previews arrived in 3 days!", eventType: "Wedding" },
      { id: "r2", author: "Harry Brooks",    initials: "HB", avatarColor: "#22c55e", date: "2 Mar 2026",  rating: 5, text: "Booked Lumina for our product launch at The Shard. The images were used in our national ad campaign — that tells you the quality.", eventType: "Brand Launch" },
      { id: "r3", author: "Isabella Moore",  initials: "IM", avatarColor: "#8b5cf6", date: "20 Jan 2026", rating: 5, text: "Absolutely blown away. Sophie has an instinct for the perfect moment. Every image from our engagement shoot looks like a magazine spread.", eventType: "Engagement Shoot" },
      { id: "r4", author: "Liam Patterson",  initials: "LP", avatarColor: "#f59e0b", date: "8 Dec 2025",  rating: 4, text: "Stunning work as always. The second shooter really covered everything. Would have liked slightly faster full-gallery delivery but quality is unmatched.", eventType: "Corporate Awards" },
    ],
    responseTime: "Within 4 hours",
    minimumNotice: "6 weeks",
    cancellationPolicy: "50% refund up to 30 days before event",
    languages: ["English"],
    areasServed: ["All London boroughs", "Home Counties", "UK-wide on request"],
  },

  /* ── Bloom Floral ──────────────────────────────────────── */
  {
    slug: "bloom-floral-studio-london",
    tagline: "Immersive floral installations that transform spaces into living art.",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85",
      "https://images.unsplash.com/photo-1490750967868-88df5691cc97?w=800&q=80",
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80",
      "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=800&q=80",
    ],
    longDescription:
      "Bloom is Notting Hill's most acclaimed floral design studio, led by award-winning designer Amelia Brooks. We create large-scale immersive installations — flower walls, suspended canopies, ceremony arches, and table arrangements — that have graced the pages of Vogue, Harper's Bazaar, and World of Interiors.\n\nEvery installation is designed from scratch, sourced sustainably from British and Dutch growers, and installed by our specialist team. We don't do off-the-shelf arrangements — if you want something extraordinary, you've found the right studio.",
    included: [
      "Bespoke design consultation + mood board",
      "Full installation by specialist team",
      "All florals and structural materials",
      "Venue pre-visit and logistics planning",
      "Post-event collection and responsible disposal",
      "Flowers for bridal party on request",
    ],
    features: [
      { emoji: "🌸", title: "Fully bespoke designs",    description: "No templates. Every installation designed around your brief." },
      { emoji: "🌍", title: "Sustainably sourced",      description: "British-grown flowers where possible; RHS-certified suppliers." },
      { emoji: "🏆", title: "Award-winning studio",     description: "BCTF Florist of the Year 2024 and 2025." },
      { emoji: "📰", title: "Featured in Vogue",        description: "Our work has been published in the UK's leading titles." },
      { emoji: "♻️", title: "Zero waste policy",        description: "Compostable materials and flower recycling partnerships." },
      { emoji: "🤝", title: "Venue coordination",       description: "We liaise directly with your venue — you don't need to manage us." },
    ],
    packages: [
      {
        id: "bloom",
        label: "Bloom",
        price: 1800,
        unit: "per event",
        description: "Centrepieces and ceremony styling for smaller events.",
        highlights: ["Table centrepieces (up to 10)", "Ceremony arch", "Consultation included"],
      },
      {
        id: "flourish",
        label: "Flourish",
        price: 3500,
        unit: "per event",
        description: "Full venue transformation — our most popular package.",
        highlights: ["Full venue florals", "Feature installation", "Bridal flowers", "Venue pre-visit"],
        popular: true,
      },
      {
        id: "immersive",
        label: "Immersive",
        price: 7500,
        unit: "per event",
        description: "Large-scale installations. Exhibition and editorial level.",
        highlights: ["Bespoke installation design", "Suspended canopies", "Press/editorial shoots", "Dedicated design team"],
      },
    ],
    reviews: [
      { id: "r1", author: "Georgina Stanhope", initials: "GS", avatarColor: "#ec4899", date: "10 Mar 2026", rating: 5, text: "Amelia transformed our venue into something from a fairytale. Every guest was speechless walking in. The flower wall alone was worth every penny.", eventType: "Wedding at Claridge's" },
      { id: "r2", author: "Marcus Reid",       initials: "MR", avatarColor: "#6366f1", date: "22 Feb 2026", rating: 5, text: "We commissioned Bloom for a Chanel brand activation. The work was genuinely at fashion-week level. Flawless execution under tight timelines.", eventType: "Brand Activation" },
      { id: "r3", author: "Pippa Ashworth",    initials: "PA", avatarColor: "#22c55e", date: "9 Jan 2026",  rating: 5, text: "I cried when I walked into our reception. It was beyond anything I imagined. The team is professional, responsive, and truly passionate.", eventType: "Wedding" },
      { id: "r4", author: "Tom Fairfax",       initials: "TF", avatarColor: "#8b5cf6", date: "18 Nov 2025", rating: 4, text: "Beautiful work for our charity gala. The installations were incredible. Slight overrun on setup but the end result was breathtaking.", eventType: "Charity Gala" },
    ],
    responseTime: "Within 24 hours",
    minimumNotice: "8 weeks",
    cancellationPolicy: "Full refund up to 21 days before event",
    languages: ["English", "French", "Italian"],
    areasServed: ["Central London", "West London", "Surrey", "Berkshire"],
  },

  /* ── SoundWave AV ──────────────────────────────────────── */
  {
    slug: "soundwave-av-london",
    tagline: "Concert-grade sound and intelligent lighting for events of any scale.",
    images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=85",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    ],
    longDescription:
      "SoundWave brings professional-grade audio, visual, and intelligent lighting systems to any venue — from Hackney basement bars to the O2 Arena. Our engineers have over 20 years of live event experience and have worked with names from Coldplay to Glastonbury.\n\nWe're not your average AV hire company. Every setup is designed around your specific room acoustics, capacity, and event atmosphere — then run by a dedicated technician throughout your event so nothing goes wrong.",
    included: [
      "Full rig design and site survey",
      "All equipment supply and transport",
      "Professional crew for setup and pack-down",
      "Dedicated on-site technician throughout event",
      "Microphone systems (wired + wireless)",
      "Confidence monitors and green room audio",
    ],
    features: [
      { emoji: "🔊", title: "Line-array PA systems",    description: "Crystal-clear sound from 50 to 5,000 guests. Always the right rig." },
      { emoji: "💡", title: "Intelligent lighting",     description: "Moving heads, LED wash, lasers, and haze for dramatic effect." },
      { emoji: "📺", title: "LED screen walls",         description: "Custom LED panels and projection mapping on any surface." },
      { emoji: "🎛️", title: "Live mixing",              description: "Our engineers mix your event live for a dynamic experience." },
      { emoji: "🛡️", title: "Fully insured",            description: "£10M public liability. All equipment PAT-tested and certified." },
      { emoji: "⚡", title: "Rapid deployment",         description: "Same-day setup for urgent bookings. 24/7 support line." },
    ],
    packages: [
      {
        id: "club",
        label: "Club",
        price: 800,
        unit: "per day",
        description: "PA + DJ lighting for parties and club nights up to 200 guests.",
        highlights: ["Line array PA", "DJ booth setup", "LED lighting rig"],
      },
      {
        id: "event",
        label: "Event",
        price: 1200,
        unit: "per day",
        description: "Full AV production for corporate events and galas.",
        highlights: ["Concert PA", "Intelligent lighting", "LED screen", "2 technicians", "Microphone systems"],
        popular: true,
      },
      {
        id: "production",
        label: "Production",
        price: 3500,
        unit: "per day",
        description: "Full production for concerts, conferences, and broadcast events.",
        highlights: ["Main stage PA", "Full lighting design", "LED walls", "Live stream setup", "Production manager"],
      },
    ],
    reviews: [
      { id: "r1", author: "Dan Fletcher",    initials: "DF", avatarColor: "#6366f1", date: "15 Mar 2026", rating: 5, text: "SoundWave did our 2,000-person annual conference at ExCeL. Flawless. Not a single technical issue in 3 days. The lighting design was stunning.", eventType: "Annual Conference" },
      { id: "r2", author: "Abi Lawson",      initials: "AL", avatarColor: "#22c55e", date: "1 Mar 2026",  rating: 5, text: "Booked for our brand launch party in Shoreditch. The team transformed the warehouse space completely. Bass was INCREDIBLE.", eventType: "Brand Launch" },
      { id: "r3", author: "Ryan Okafor",     initials: "RO", avatarColor: "#f59e0b", date: "22 Jan 2026", rating: 5, text: "Used SoundWave for our charity concert at Hackney Empire. They understood the acoustics perfectly and the whole night went without a hitch.", eventType: "Charity Concert" },
      { id: "r4", author: "Petra Simmons",   initials: "PS", avatarColor: "#8b5cf6", date: "10 Dec 2025", rating: 4, text: "Great kit and professional crew. Took a bit longer to set up than quoted but sounded incredible once running.", eventType: "Corporate Party" },
    ],
    responseTime: "Within 1 hour",
    minimumNotice: "2 weeks",
    cancellationPolicy: "Full refund up to 7 days before event",
    languages: ["English"],
    areasServed: ["All London", "UK-wide touring available"],
  },

  /* ── The Grand Marquee ─────────────────────────────────── */
  {
    slug: "the-grand-marquee-london",
    tagline: "London's most versatile event space — intimate or spectacular, always extraordinary.",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
      "https://images.unsplash.com/photo-1510924199351-4e9d94df18a6?w=800&q=80",
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    ],
    longDescription:
      "The Grand Marquee is Canary Wharf's premier private event venue — a stunning 5,000 sq ft climate-controlled space with floor-to-ceiling glass, a private rooftop terrace, and state-of-the-art in-house AV infrastructure.\n\nAvailable for private hire for weddings, corporate events, product launches, and exclusive dinners. Our event coordination team handles everything from seating configurations to supplier management, so you simply arrive and enjoy.",
    included: [
      "Exclusive venue hire for up to 350 guests",
      "Private rooftop terrace access",
      "In-house AV system and technical support",
      "Dedicated event coordinator",
      "Multiple layout configurations",
      "Catering kitchen and bar infrastructure",
      "Bridal suite / green room access",
    ],
    features: [
      { emoji: "🏛️", title: "5,000 sq ft main hall",   description: "Adaptable space — theatre, banquet, cabaret, or standing formats." },
      { emoji: "🌇", title: "Private rooftop terrace",  description: "Panoramic Canary Wharf skyline with outdoor heating year-round." },
      { emoji: "📺", title: "Built-in AV",              description: "4K screens, line-array PA, and uplighting all included." },
      { emoji: "🍾", title: "Licensed bar",             description: "Our in-house bar team or bring your preferred supplier." },
      { emoji: "🚗", title: "Secure parking",           description: "40-space private car park with EV charging." },
      { emoji: "♿", title: "Fully accessible",         description: "Step-free access throughout. Dedicated assistance on request." },
    ],
    packages: [
      {
        id: "daytime",
        label: "Daytime",
        price: 4500,
        unit: "per day",
        description: "9am–5pm hire. Ideal for conferences and workshops.",
        highlights: ["8 hours exclusive use", "AV included", "Event coordinator", "Up to 200 guests"],
      },
      {
        id: "evening",
        label: "Evening",
        price: 8500,
        unit: "per event",
        description: "5pm–midnight. The classic wedding and gala package.",
        highlights: ["7 hours exclusive use", "Full AV + lighting", "Rooftop terrace", "Up to 350 guests", "Coordinator"],
        popular: true,
      },
      {
        id: "full-day",
        label: "Full Day",
        price: 12000,
        unit: "per day",
        description: "9am–midnight. Complete production events and large weddings.",
        highlights: ["15 hours exclusive use", "Full AV", "Rooftop", "350 guests", "Bridal suite", "Production support"],
      },
    ],
    reviews: [
      { id: "r1", author: "Victoria Goldsmith", initials: "VG", avatarColor: "#6366f1", date: "20 Mar 2026", rating: 5, text: "Our 280-guest wedding was everything we dreamed of. The space is stunning, the coordinator anticipated every need, and the rooftop at sunset was magical.", eventType: "Wedding" },
      { id: "r2", author: "Nathan Clarke",      initials: "NC", avatarColor: "#22c55e", date: "8 Mar 2026",  rating: 5, text: "Perfect for our annual investor summit. Professional team, flawless AV, and impressive enough to wow our international guests.", eventType: "Investor Summit" },
      { id: "r3", author: "Priya Mehta",        initials: "PM", avatarColor: "#8b5cf6", date: "15 Feb 2026", rating: 5, text: "We launched our new product line here — the space absolutely matched the brand premium. The coordinator was exceptional throughout.", eventType: "Product Launch" },
      { id: "r4", author: "George Williamson",  initials: "GW", avatarColor: "#f59e0b", date: "22 Dec 2025", rating: 4, text: "Brilliant venue for our Christmas party. Parking was tight but the event itself was superb. Will definitely rebook for 2026.", eventType: "Christmas Gala" },
    ],
    responseTime: "Within 3 hours",
    minimumNotice: "6 weeks",
    cancellationPolicy: "50% refund up to 30 days before event",
    languages: ["English", "Arabic", "Mandarin"],
    areasServed: ["Canary Wharf", "City of London", "Greenwich", "Docklands"],
  },

  /* ── Sugarcraft Studio ─────────────────────────────────── */
  {
    slug: "sugarcraft-studio-london",
    tagline: "Edible art for your most cherished celebrations — crafted to perfection in Chelsea.",
    images: [
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1200&q=85",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80",
      "https://images.unsplash.com/photo-1464195244916-405fa0a82545?w=800&q=80",
      "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=800&q=80",
    ],
    longDescription:
      "Sugarcraft Studio is Chelsea's most celebrated artisan cake atelier, led by Isabella Moore — winner of the Great British Bake Off Professional edition and former pastry chef at Claridge's Hotel.\n\nWe create custom sculpted cakes, elaborate dessert tables, and sugar art installations for weddings, milestone birthdays, and corporate events. Every cake is made to order using premium British ingredients, with no artificial flavours, colours, or preservatives.\n\nOur clientele includes members of the Royal Family, BAFTA nominees, and premiership footballers — but we treat every order with the same obsessive attention to detail.",
    included: [
      "Design consultation with Isabella or senior sugarcraft artist",
      "Complimentary flavour and filling tasting",
      "Custom colour matching to your theme",
      "Delivery and setup at your venue",
      "Cake stand and serving tools",
      "Complimentary preserve-tier for the first anniversary",
    ],
    features: [
      { emoji: "🎂", title: "Fully bespoke design",     description: "No catalogue. Every cake designed exclusively for your brief." },
      { emoji: "🌿", title: "All-natural ingredients",  description: "No artificial colours or flavours. 100% British dairy and eggs." },
      { emoji: "🏆", title: "Award-winning artist",     description: "GB Bake Off Professional winner 2023. Former Claridge's pastry chef." },
      { emoji: "🚗", title: "White-glove delivery",     description: "Temperature-controlled delivery and professional venue setup." },
      { emoji: "🖼️", title: "Sugar art installations",  description: "Large-scale edible art pieces and dessert table styling." },
      { emoji: "📅", title: "Anniversary tier",          description: "We preserve your top tier for your first anniversary — complimentary." },
    ],
    packages: [
      {
        id: "celebration",
        label: "Celebration",
        price: 250,
        unit: "per cake",
        description: "One or two-tier cake for birthdays and smaller events.",
        highlights: ["1–2 tiers", "Custom design", "Serves 30–80", "Tasting included"],
      },
      {
        id: "signature",
        label: "Signature",
        price: 380,
        unit: "per cake",
        description: "Our most popular three-tier showpiece cake.",
        highlights: ["3 tiers", "Bespoke design", "Serves 80–150", "Tasting + consultation", "Anniversary tier"],
        popular: true,
      },
      {
        id: "masterpiece",
        label: "Masterpiece",
        price: 650,
        unit: "per cake",
        description: "Multi-tier sculpted showpiece and dessert table styling.",
        highlights: ["4–6 tiers", "Sugar art sculpting", "Serves 150–300", "Dessert table", "Press photography"],
      },
    ],
    reviews: [
      { id: "r1", author: "Francesca Bellamy", initials: "FB", avatarColor: "#ec4899", date: "5 Mar 2026",  rating: 5, text: "Isabella created the most extraordinary cake for our daughter's wedding. 500 guests and every single one mentioned it. Genuinely works of art.", eventType: "Wedding" },
      { id: "r2", author: "Edward Spencer",    initials: "ES", avatarColor: "#6366f1", date: "14 Feb 2026", rating: 5, text: "The Valentine's Day masterpiece Isabella created for our restaurant's special event was sensational. Three tiers of edible sculpture.", eventType: "Restaurant Event" },
      { id: "r3", author: "Rosie Hamilton",    initials: "RH", avatarColor: "#8b5cf6", date: "20 Jan 2026", rating: 5, text: "I cried when I saw my birthday cake. Isabella created an edible replica of our family home. The detail was unbelievable. Worth every penny.", eventType: "50th Birthday" },
      { id: "r4", author: "Simon Carr",        initials: "SC", avatarColor: "#22c55e", date: "12 Dec 2025", rating: 5, text: "Booked for our office Christmas celebration. The dessert table was so beautiful nobody wanted to eat it — but once they did, they wished there was more!", eventType: "Corporate Christmas" },
    ],
    responseTime: "Within 6 hours",
    minimumNotice: "3 weeks",
    cancellationPolicy: "Full refund up to 21 days before event",
    languages: ["English", "Italian"],
    areasServed: ["Chelsea", "Kensington", "Belgravia", "Knightsbridge", "Mayfair", "All Central London"],
  },
];

export function getServiceDetail(slug: string): ServiceDetailData | undefined {
  return SERVICE_DETAILS.find((d) => d.slug === slug);
}

/* Re-export mock services so detail page can cross-reference */
export { MOCK_SERVICES } from "@/lib/mock-services";
