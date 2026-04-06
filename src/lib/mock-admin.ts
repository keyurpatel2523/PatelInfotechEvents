/* ─── Super Admin mock data ─────────────────────────────────── */

export type AdminCategoryStatus = "active" | "inactive";
export type AdminSupplierStatus = "pending" | "approved" | "rejected" | "suspended";
export type AdminServiceStatus  = "active" | "paused" | "draft" | "disabled";
export type AdminBookingStatus  = "pending" | "confirmed" | "completed" | "cancelled";
export type AdminPaymentStatus  = "unpaid" | "paid" | "refunded";

/* ── Category ─────────────────────────────────────────────────── */
export interface AdminCategory {
  id:           string;
  name:         string;
  slug:         string;
  icon:         string;   // emoji
  parentId:     string | null;
  /**
   * Ordered ancestry chain: [rootId, …, parentId, id].
   * Stored in Firestore so `array-contains` finds all descendants of any node.
   * Length equals level + 1.
   */
  path:         string[];
  level:        number;   // 0 = root
  order:        number;
  serviceCount: number;
  isActive:     boolean;
}

export const ADMIN_CATEGORIES: AdminCategory[] = [
  // Root categories
  { id: "cat-001", name: "Photography",     slug: "photography",     icon: "📷", parentId: null,      path: ["cat-001"],                    level: 0, order: 0, serviceCount: 42, isActive: true },
  { id: "cat-002", name: "Catering",        slug: "catering",        icon: "🍽️", parentId: null,      path: ["cat-002"],                    level: 0, order: 1, serviceCount: 37, isActive: true },
  { id: "cat-003", name: "Décor",           slug: "decor",           icon: "🌸", parentId: null,      path: ["cat-003"],                    level: 0, order: 2, serviceCount: 29, isActive: true },
  { id: "cat-004", name: "AV & Lighting",   slug: "av-lighting",     icon: "💡", parentId: null,      path: ["cat-004"],                    level: 0, order: 3, serviceCount: 18, isActive: true },
  { id: "cat-005", name: "Venue",           slug: "venue",           icon: "🏛️", parentId: null,      path: ["cat-005"],                    level: 0, order: 4, serviceCount: 24, isActive: true },
  { id: "cat-006", name: "Entertainment",   slug: "entertainment",   icon: "🎭", parentId: null,      path: ["cat-006"],                    level: 0, order: 5, serviceCount: 15, isActive: true },
  { id: "cat-007", name: "Transport",       slug: "transport",       icon: "🚗", parentId: null,      path: ["cat-007"],                    level: 0, order: 6, serviceCount: 11, isActive: true },
  { id: "cat-008", name: "Florist",         slug: "florist",         icon: "💐", parentId: null,      path: ["cat-008"],                    level: 0, order: 7, serviceCount: 20, isActive: true },
  // Photography children
  { id: "cat-011", name: "Wedding Photography",  slug: "wedding-photography",  icon: "💒", parentId: "cat-001", path: ["cat-001", "cat-011"],          level: 1, order: 0, serviceCount: 18, isActive: true },
  { id: "cat-012", name: "Event Photography",    slug: "event-photography",    icon: "📸", parentId: "cat-001", path: ["cat-001", "cat-012"],          level: 1, order: 1, serviceCount: 14, isActive: true },
  { id: "cat-013", name: "Portrait Photography", slug: "portrait-photography", icon: "🖼️", parentId: "cat-001", path: ["cat-001", "cat-013"],          level: 1, order: 2, serviceCount: 10, isActive: true },
  // Catering children
  { id: "cat-021", name: "Fine Dining",         slug: "fine-dining",         icon: "🥂", parentId: "cat-002", path: ["cat-002", "cat-021"],          level: 1, order: 0, serviceCount: 12, isActive: true },
  { id: "cat-022", name: "Buffet Service",      slug: "buffet-service",      icon: "🍲", parentId: "cat-002", path: ["cat-002", "cat-022"],          level: 1, order: 1, serviceCount: 10, isActive: true },
  { id: "cat-023", name: "Cocktail Events",     slug: "cocktail-events",     icon: "🍸", parentId: "cat-002", path: ["cat-002", "cat-023"],          level: 1, order: 2, serviceCount: 8,  isActive: true },
  { id: "cat-024", name: "Corporate Catering",  slug: "corporate-catering",  icon: "🏢", parentId: "cat-002", path: ["cat-002", "cat-024"],          level: 1, order: 3, serviceCount: 7,  isActive: false },
  // Décor children
  { id: "cat-031", name: "Floral Arrangements", slug: "floral-arrangements", icon: "🌷", parentId: "cat-003", path: ["cat-003", "cat-031"],          level: 1, order: 0, serviceCount: 11, isActive: true },
  { id: "cat-032", name: "Table Styling",       slug: "table-styling",       icon: "🕯️", parentId: "cat-003", path: ["cat-003", "cat-032"],          level: 1, order: 1, serviceCount: 9,  isActive: true },
  { id: "cat-033", name: "Backdrop & Draping",  slug: "backdrop-draping",    icon: "🎨", parentId: "cat-003", path: ["cat-003", "cat-033"],          level: 1, order: 2, serviceCount: 9,  isActive: true },
  // Venue children
  { id: "cat-051", name: "Ballroom",            slug: "ballroom",            icon: "✨", parentId: "cat-005", path: ["cat-005", "cat-051"],          level: 1, order: 0, serviceCount: 8,  isActive: true },
  { id: "cat-052", name: "Garden & Outdoor",    slug: "garden-outdoor",      icon: "🌿", parentId: "cat-005", path: ["cat-005", "cat-052"],          level: 1, order: 1, serviceCount: 9,  isActive: true },
  { id: "cat-053", name: "Rooftop",             slug: "rooftop",             icon: "🌆", parentId: "cat-005", path: ["cat-005", "cat-053"],          level: 1, order: 2, serviceCount: 7,  isActive: true },
  // Wedding photography children (level 2)
  { id: "cat-111", name: "Engagement Shoots",   slug: "engagement-shoots",   icon: "💍", parentId: "cat-011", path: ["cat-001", "cat-011", "cat-111"], level: 2, order: 0, serviceCount: 6, isActive: true },
  { id: "cat-112", name: "Reception Coverage",  slug: "reception-coverage",  icon: "🥳", parentId: "cat-011", path: ["cat-001", "cat-011", "cat-112"], level: 2, order: 1, serviceCount: 8, isActive: true },
];

/* ── Supplier ─────────────────────────────────────────────────── */
export interface AdminSupplier {
  id:            string;
  businessName:  string;
  ownerName:     string;
  email:         string;
  phone:         string;
  location:      string;
  categories:    string[];
  status:        AdminSupplierStatus;
  rating:        number;
  reviewCount:   number;
  serviceCount:  number;
  bookingCount:  number;
  revenue:       number;
  joinedAt:      string;
  avatarColor:   string;
  initials:      string;
}

export const ADMIN_SUPPLIERS: AdminSupplier[] = [
  { id: "sup-001", businessName: "Mayfair Catering Co.",      ownerName: "James Hartley",    email: "james@mayfaircatering.co.uk",   phone: "+44 20 7123 4567", location: "Mayfair, London",       categories: ["Catering"],              status: "approved",   rating: 4.8, reviewCount: 312, serviceCount: 5,  bookingCount: 158, revenue: 284600, joinedAt: "2024-01-15", avatarColor: "#6366f1", initials: "JH" },
  { id: "sup-002", businessName: "Lens & Light Photography",  ownerName: "Clara Weston",     email: "clara@lensandlight.co.uk",       phone: "+44 20 7234 5678", location: "Shoreditch, London",    categories: ["Photography"],           status: "approved",   rating: 4.9, reviewCount: 198, serviceCount: 4,  bookingCount: 92,  revenue: 138000, joinedAt: "2024-02-20", avatarColor: "#8b5cf6", initials: "CW" },
  { id: "sup-003", businessName: "Bloom & Petal Florists",    ownerName: "Rose Kimura",      email: "rose@bloomandpetal.co.uk",       phone: "+44 20 7345 6789", location: "Chelsea, London",       categories: ["Florist", "Décor"],      status: "approved",   rating: 4.7, reviewCount: 87,  serviceCount: 6,  bookingCount: 64,  revenue: 52400,  joinedAt: "2024-03-08", avatarColor: "#ec4899", initials: "RK" },
  { id: "sup-004", businessName: "Prestige AV Solutions",     ownerName: "Marcus Obi",       email: "marcus@prestigeav.co.uk",        phone: "+44 20 7456 7890", location: "Canary Wharf, London",  categories: ["AV & Lighting"],         status: "approved",   rating: 4.6, reviewCount: 54,  serviceCount: 3,  bookingCount: 41,  revenue: 67800,  joinedAt: "2024-04-12", avatarColor: "#f59e0b", initials: "MO" },
  { id: "sup-005", businessName: "The Grand Event Co.",       ownerName: "Sophia Lane",      email: "sophia@grandevent.co.uk",        phone: "+44 20 7567 8901", location: "Kensington, London",    categories: ["Venue", "Décor"],        status: "pending",    rating: 0,   reviewCount: 0,   serviceCount: 2,  bookingCount: 0,   revenue: 0,      joinedAt: "2025-04-01", avatarColor: "#06b6d4", initials: "SL" },
  { id: "sup-006", businessName: "Capital Entertainment",     ownerName: "Liam Edwards",     email: "liam@capitalent.co.uk",          phone: "+44 20 7678 9012", location: "Soho, London",          categories: ["Entertainment"],         status: "pending",    rating: 0,   reviewCount: 0,   serviceCount: 1,  bookingCount: 0,   revenue: 0,      joinedAt: "2025-04-03", avatarColor: "#22c55e", initials: "LE" },
  { id: "sup-007", businessName: "Regent Chauffeurs",         ownerName: "Fiona Campbell",   email: "fiona@regentchauffeurs.co.uk",   phone: "+44 20 7789 0123", location: "Notting Hill, London",  categories: ["Transport"],             status: "pending",    rating: 0,   reviewCount: 0,   serviceCount: 2,  bookingCount: 0,   revenue: 0,      joinedAt: "2025-04-04", avatarColor: "#84cc16", initials: "FC" },
  { id: "sup-008", businessName: "Golden Tier Bakery",        ownerName: "Thomas Wright",    email: "thomas@goldentierbakery.co.uk",  phone: "+44 20 7890 1234", location: "Greenwich, London",     categories: ["Catering"],              status: "rejected",   rating: 0,   reviewCount: 0,   serviceCount: 0,  bookingCount: 0,   revenue: 0,      joinedAt: "2025-03-15", avatarColor: "#ef4444", initials: "TW" },
  { id: "sup-009", businessName: "Vivid Décor Studio",        ownerName: "Aisha Mohammed",   email: "aisha@vividdecor.co.uk",         phone: "+44 20 7901 2345", location: "Brixton, London",       categories: ["Décor"],                 status: "suspended",  rating: 3.2, reviewCount: 14,  serviceCount: 3,  bookingCount: 8,   revenue: 4200,   joinedAt: "2024-06-01", avatarColor: "#f97316", initials: "AM" },
  { id: "sup-010", businessName: "North Star Photography",    ownerName: "Daniel Park",      email: "daniel@northstarphotos.co.uk",   phone: "+44 20 7012 3456", location: "Camden, London",        categories: ["Photography"],           status: "approved",   rating: 4.5, reviewCount: 76,  serviceCount: 5,  bookingCount: 48,  revenue: 72000,  joinedAt: "2024-05-10", avatarColor: "#a855f7", initials: "DP" },
];

/* ── Service ──────────────────────────────────────────────────── */
export interface AdminService {
  id:           string;
  title:        string;
  supplierId:   string;
  supplierName: string;
  category:     string;
  price:        number;
  priceUnit:    string;
  status:       AdminServiceStatus;
  bookings:     number;
  rating:       number;
  reviewCount:  number;
  createdAt:    string;
}

export const ADMIN_SERVICES: AdminService[] = [
  { id: "svc-001", title: "Mayfair Fine Dining — Full Service",   supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     category: "Catering",       price: 95,  priceUnit: "per head", status: "active",   bookings: 48, rating: 4.9, reviewCount: 201, createdAt: "2024-01-20" },
  { id: "svc-002", title: "Canape & Cocktail Evening",            supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     category: "Catering",       price: 55,  priceUnit: "per head", status: "active",   bookings: 31, rating: 4.7, reviewCount: 89,  createdAt: "2024-03-08" },
  { id: "svc-003", title: "Full Day Wedding Photography",         supplierId: "sup-002", supplierName: "Lens & Light Photography", category: "Photography",    price: 1800,priceUnit: "per day",  status: "active",   bookings: 28, rating: 5.0, reviewCount: 112, createdAt: "2024-02-25" },
  { id: "svc-004", title: "Engagement Shoot — 2 Hours",          supplierId: "sup-002", supplierName: "Lens & Light Photography", category: "Photography",    price: 400, priceUnit: "session",  status: "active",   bookings: 22, rating: 4.9, reviewCount: 64,  createdAt: "2024-03-01" },
  { id: "svc-005", title: "Luxury Floral Centrepieces",           supplierId: "sup-003", supplierName: "Bloom & Petal Florists",   category: "Florist",        price: 280, priceUnit: "per table",status: "active",   bookings: 19, rating: 4.8, reviewCount: 43,  createdAt: "2024-03-15" },
  { id: "svc-006", title: "Bridal Bouquet & Arrangements",       supplierId: "sup-003", supplierName: "Bloom & Petal Florists",   category: "Florist",        price: 450, priceUnit: "package",  status: "active",   bookings: 24, rating: 4.7, reviewCount: 38,  createdAt: "2024-03-20" },
  { id: "svc-007", title: "Premium AV Package — Conference",     supplierId: "sup-004", supplierName: "Prestige AV Solutions",    category: "AV & Lighting",  price: 2200,priceUnit: "per event", status: "active",   bookings: 15, rating: 4.6, reviewCount: 28,  createdAt: "2024-04-15" },
  { id: "svc-008", title: "Wedding DJ & Sound System",           supplierId: "sup-004", supplierName: "Prestige AV Solutions",    category: "AV & Lighting",  price: 1400,priceUnit: "per event", status: "paused",   bookings: 8,  rating: 4.5, reviewCount: 14,  createdAt: "2024-05-01" },
  { id: "svc-009", title: "Rooftop Venue Hire — Half Day",       supplierId: "sup-005", supplierName: "The Grand Event Co.",      category: "Venue",          price: 1200,priceUnit: "half day", status: "draft",    bookings: 0,  rating: 0,   reviewCount: 0,   createdAt: "2025-04-02" },
  { id: "svc-010", title: "Portrait Photography — Studio",       supplierId: "sup-010", supplierName: "North Star Photography",   category: "Photography",    price: 250, priceUnit: "session",  status: "active",   bookings: 18, rating: 4.5, reviewCount: 32,  createdAt: "2024-05-20" },
  { id: "svc-011", title: "Corporate Lunch Buffet",              supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     category: "Catering",       price: 38,  priceUnit: "per head", status: "active",   bookings: 67, rating: 4.9, reviewCount: 201, createdAt: "2024-02-20" },
  { id: "svc-012", title: "Wedding Banquet — Full White Glove",  supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     category: "Catering",       price: 145, priceUnit: "per head", status: "paused",   bookings: 12, rating: 4.6, reviewCount: 44,  createdAt: "2024-04-01" },
  { id: "svc-013", title: "Table & Linen Styling",               supplierId: "sup-003", supplierName: "Bloom & Petal Florists",   category: "Décor",          price: 180, priceUnit: "per table",status: "active",   bookings: 11, rating: 4.6, reviewCount: 22,  createdAt: "2024-04-10" },
  { id: "svc-014", title: "Suspicious Listings — Test Service",  supplierId: "sup-009", supplierName: "Vivid Décor Studio",       category: "Décor",          price: 50,  priceUnit: "per hour", status: "disabled", bookings: 2,  rating: 2.1, reviewCount: 5,   createdAt: "2024-06-10" },
];

/* ── Booking ──────────────────────────────────────────────────── */
export interface AdminBooking {
  id:             string;
  customer:       string;
  customerEmail:  string;
  customerColor:  string;
  customerInitials: string;
  supplierId:     string;
  supplierName:   string;
  service:        string;
  date:           string;
  timeSlot:       string;
  guests:         number;
  amount:         number;
  status:         AdminBookingStatus;
  paymentStatus:  AdminPaymentStatus;
  createdAt:      string;
  notes:          string;
}

export const ADMIN_BOOKINGS: AdminBooking[] = [
  { id: "BK-A3F291", customer: "Emily Richardson",  customerEmail: "emily@example.co.uk",   customerColor: "#6366f1", customerInitials: "ER", supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     service: "Mayfair Fine Dining",        date: "2025-05-14", timeSlot: "7:00 PM",  guests: 120, amount: 13680, status: "confirmed", paymentStatus: "paid",     createdAt: "2025-04-01", notes: "Kosher menu for 30 guests" },
  { id: "BK-B9D445", customer: "Oliver Nash",        customerEmail: "oliver@example.co.uk",  customerColor: "#8b5cf6", customerInitials: "ON", supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     service: "Canape & Cocktail Evening",  date: "2025-05-20", timeSlot: "6:00 PM",  guests: 80,  amount: 5280,  status: "pending",   paymentStatus: "unpaid",   createdAt: "2025-04-03", notes: "" },
  { id: "BK-C1E872", customer: "Priya Patel",        customerEmail: "priya@example.co.uk",   customerColor: "#22c55e", customerInitials: "PP", supplierId: "sup-002", supplierName: "Lens & Light Photography", service: "Full Day Wedding Photography",date: "2025-06-14", timeSlot: "10:00 AM", guests: 1,   amount: 1800,  status: "confirmed", paymentStatus: "paid",     createdAt: "2025-04-05", notes: "Church + reception" },
  { id: "BK-D7H120", customer: "James Thornton",     customerEmail: "james.t@example.co.uk", customerColor: "#f59e0b", customerInitials: "JT", supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     service: "Mayfair Fine Dining",        date: "2025-04-10", timeSlot: "7:30 PM",  guests: 200, amount: 21660, status: "completed", paymentStatus: "paid",     createdAt: "2025-03-01", notes: "" },
  { id: "BK-E5K391", customer: "Sophie Clarke",      customerEmail: "sophie@example.co.uk",  customerColor: "#ef4444", customerInitials: "SC", supplierId: "sup-003", supplierName: "Bloom & Petal Florists",   service: "Luxury Floral Centrepieces", date: "2025-04-05", timeSlot: "2:00 PM",  guests: 60,  amount: 3360,  status: "completed", paymentStatus: "paid",     createdAt: "2025-03-10", notes: "Strictly no nuts in arrangements" },
  { id: "BK-F2M644", customer: "Amelia Brooks",      customerEmail: "amelia@example.co.uk",  customerColor: "#06b6d4", customerInitials: "AB", supplierId: "sup-001", supplierName: "Mayfair Catering Co.",     service: "Wedding Banquet",            date: "2025-06-07", timeSlot: "2:00 PM",  guests: 150, amount: 24750, status: "pending",   paymentStatus: "unpaid",   createdAt: "2025-04-06", notes: "3-course, white linen" },
  { id: "BK-G9P008", customer: "Harry Webb",         customerEmail: "harry@example.co.uk",   customerColor: "#84cc16", customerInitials: "HW", supplierId: "sup-004", supplierName: "Prestige AV Solutions",    service: "Premium AV Package",         date: "2025-03-22", timeSlot: "12:30 PM", guests: 30,  amount: 2200,  status: "cancelled", paymentStatus: "refunded",  createdAt: "2025-03-05", notes: "" },
  { id: "BK-H4N221", customer: "Isabella Foster",    customerEmail: "isabella@example.co.uk",customerColor: "#a855f7", customerInitials: "IF", supplierId: "sup-002", supplierName: "Lens & Light Photography", service: "Engagement Shoot",           date: "2025-05-03", timeSlot: "3:00 PM",  guests: 2,   amount: 400,   status: "confirmed", paymentStatus: "paid",     createdAt: "2025-04-02", notes: "" },
  { id: "BK-I7R553", customer: "George Atkinson",    customerEmail: "george@example.co.uk",  customerColor: "#f97316", customerInitials: "GA", supplierId: "sup-010", supplierName: "North Star Photography",   service: "Portrait Photography",       date: "2025-05-10", timeSlot: "11:00 AM", guests: 1,   amount: 250,   status: "pending",   paymentStatus: "unpaid",   createdAt: "2025-04-05", notes: "" },
  { id: "BK-J2T890", customer: "Charlotte Davis",    customerEmail: "charlotte@example.co.uk",customerColor:"#14b8a6", customerInitials: "CD", supplierId: "sup-003", supplierName: "Bloom & Petal Florists",   service: "Bridal Bouquet & Arrangements",date:"2025-07-19",timeSlot: "All day",  guests: 1,   amount: 450,   status: "pending",   paymentStatus: "unpaid",   createdAt: "2025-04-06", notes: "White roses only" },
];

/* ── Analytics ────────────────────────────────────────────────── */
export interface MonthlyMetric { month: string; revenue: number; bookings: number; }
export interface CategoryMetric { name: string; bookings: number; revenue: number; }

export const MONTHLY_METRICS: MonthlyMetric[] = [
  { month: "Oct", revenue: 41200,  bookings: 28  },
  { month: "Nov", revenue: 58400,  bookings: 39  },
  { month: "Dec", revenue: 94600,  bookings: 67  },
  { month: "Jan", revenue: 32100,  bookings: 22  },
  { month: "Feb", revenue: 47800,  bookings: 33  },
  { month: "Mar", revenue: 71200,  bookings: 48  },
  { month: "Apr", revenue: 89400,  bookings: 58  },
];

export const CATEGORY_METRICS: CategoryMetric[] = [
  { name: "Catering",       bookings: 155, revenue: 312000 },
  { name: "Photography",    bookings: 98,  revenue: 186000 },
  { name: "Venue",          bookings: 62,  revenue: 248000 },
  { name: "Décor",          bookings: 74,  revenue: 89000  },
  { name: "AV & Lighting",  bookings: 41,  revenue: 102000 },
  { name: "Florist",        bookings: 55,  revenue: 67000  },
  { name: "Entertainment",  bookings: 29,  revenue: 58000  },
  { name: "Transport",      bookings: 18,  revenue: 24000  },
];
