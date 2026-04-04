export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  endDate?: string;
  time: string;
  location: string;
  city: string;
  image: string;
  price: number;
  priceLabel?: string;
  capacity: number;
  attendees: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  vendor: Vendor;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  eventsHosted: number;
  verified: boolean;
  badge?: "Top Vendor" | "Rising Star" | "Premium";
  location: string;
}

export const CATEGORIES = [
  { id: "all",        label: "All Events",   emoji: "✨" },
  { id: "music",      label: "Music",        emoji: "🎵" },
  { id: "tech",       label: "Tech",         emoji: "💻" },
  { id: "food",       label: "Food & Drink", emoji: "🍽️" },
  { id: "arts",       label: "Arts",         emoji: "🎨" },
  { id: "sports",     label: "Sports",       emoji: "⚽" },
  { id: "wellness",   label: "Wellness",     emoji: "🧘" },
  { id: "business",   label: "Business",     emoji: "💼" },
  { id: "education",  label: "Education",    emoji: "📚" },
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "Patel Events Co.",
    slug: "patel-events",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Patel",
    description: "Premier event management company specialising in corporate and cultural events across London.",
    category: "Corporate & Cultural",
    rating: 4.9,
    reviewCount: 312,
    eventsHosted: 87,
    verified: true,
    badge: "Top Vendor",
    location: "Shoreditch, London",
  },
  {
    id: "v2",
    name: "TechConf London",
    slug: "techconf-london",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TechConf",
    description: "London's leading tech conference organiser with a focus on innovation and emerging tech.",
    category: "Technology",
    rating: 4.8,
    reviewCount: 204,
    eventsHosted: 45,
    verified: true,
    badge: "Premium",
    location: "Canary Wharf, London",
  },
  {
    id: "v3",
    name: "Harmony Music Group",
    slug: "harmony-music",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Harmony",
    description: "Live music events, concerts, and festivals across London and the South East.",
    category: "Music & Entertainment",
    rating: 4.7,
    reviewCount: 189,
    eventsHosted: 63,
    verified: true,
    badge: "Rising Star",
    location: "Brixton, London",
  },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "e1",
    slug: "london-tech-summit-2025",
    title: "London Tech Summit 2025",
    description: "The UK's largest technology conference bringing together 5,000+ innovators, engineers, and entrepreneurs. Three days of keynotes, workshops, and networking.",
    category: "tech",
    tags: ["AI", "Cloud", "Web3", "Startup"],
    date: "2025-09-15",
    endDate: "2025-09-17",
    time: "9:00 AM",
    location: "ExCeL London, Royal Victoria Dock",
    city: "London",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    price: 299,
    capacity: 5000,
    attendees: 4231,
    rating: 4.9,
    reviewCount: 847,
    featured: true,
    vendor: MOCK_VENDORS[1],
  },
  {
    id: "e2",
    slug: "brixton-jazz-festival",
    title: "Brixton Jazz & Blues Festival",
    description: "An intimate evening of world-class jazz and blues under the stars at Brockwell Park. Featuring 12 artists across 2 stages.",
    category: "music",
    tags: ["Jazz", "Blues", "Live Music", "Outdoor"],
    date: "2025-07-12",
    time: "6:00 PM",
    location: "Brockwell Park Amphitheatre, Brixton",
    city: "London",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    price: 45,
    capacity: 800,
    attendees: 756,
    rating: 4.8,
    reviewCount: 312,
    featured: true,
    vendor: MOCK_VENDORS[2],
  },
  {
    id: "e3",
    slug: "london-street-food-festival",
    title: "London Street Food Festival",
    description: "Celebrate the best of London's diverse food scene with 60+ street food vendors, live cooking demos by top chefs, and live music.",
    category: "food",
    tags: ["Food", "Street Food", "Cultural", "Family"],
    date: "2025-08-02",
    endDate: "2025-08-04",
    time: "11:00 AM",
    location: "Tobacco Dock, Wapping",
    city: "London",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    price: 12,
    priceLabel: "per day",
    capacity: 10000,
    attendees: 7823,
    rating: 4.7,
    reviewCount: 1204,
    featured: false,
    vendor: MOCK_VENDORS[0],
  },
  {
    id: "e4",
    slug: "startup-founders-summit-london",
    title: "Startup Founders Summit London",
    description: "Connect with 200+ funded founders, VCs, and mentors. Pitch your startup, get feedback from investors, and build your network.",
    category: "business",
    tags: ["Startup", "VC", "Networking", "Pitch"],
    date: "2025-10-05",
    time: "10:00 AM",
    location: "The Trampery, Old Street",
    city: "London",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    price: 149,
    capacity: 300,
    attendees: 287,
    rating: 4.8,
    reviewCount: 98,
    featured: false,
    vendor: MOCK_VENDORS[1],
  },
  {
    id: "e5",
    slug: "yoga-wellness-retreat-cotswolds",
    title: "Yoga & Wellness Retreat — Cotswolds",
    description: "A transformative 3-day immersive retreat in the heart of the Cotswolds. Morning yoga, meditation, breathwork sessions, and farm-to-table dining.",
    category: "wellness",
    tags: ["Yoga", "Meditation", "Retreat", "Nature"],
    date: "2025-06-06",
    endDate: "2025-06-08",
    time: "8:00 AM",
    location: "Farmhouse Retreat, Chipping Campden",
    city: "Cotswolds",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    price: 595,
    priceLabel: "3-day package",
    capacity: 60,
    attendees: 48,
    rating: 5.0,
    reviewCount: 67,
    featured: true,
    vendor: MOCK_VENDORS[0],
  },
  {
    id: "e6",
    slug: "contemporary-art-expo-london",
    title: "Contemporary Art Expo London",
    description: "Explore works from 150 emerging and established British artists across 8 curated galleries. Opening night gala, artist talks, and live installations.",
    category: "arts",
    tags: ["Art", "Gallery", "Contemporary", "Culture"],
    date: "2025-11-01",
    endDate: "2025-11-07",
    time: "10:00 AM",
    location: "Saatchi Gallery, Chelsea",
    city: "London",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    price: 0,
    priceLabel: "Free entry",
    capacity: 2000,
    attendees: 1456,
    rating: 4.6,
    reviewCount: 203,
    featured: false,
    vendor: MOCK_VENDORS[0],
  },
];
