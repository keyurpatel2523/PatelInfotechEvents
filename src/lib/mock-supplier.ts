/* ─── Supplier dashboard mock data ─────────────────────────── */

export type ServiceStatus  = "active"   | "paused"  | "draft";
export type BookingStatus  = "pending"  | "confirmed" | "completed" | "cancelled";

/* ────────────────────────────────────────────────────────────── */
export interface SupplierService {
  id:         string;
  title:      string;
  category:   string;
  price:      number;
  priceUnit:  string;
  status:     ServiceStatus;
  bookings:   number;
  rating:     number;
  reviewCount:number;
  image:      string;
  tags:       string[];
  createdAt:  string;
}

export interface SupplierBooking {
  id:          string;
  serviceId:   string;
  service:     string;
  customer:    string;
  customerInitials: string;
  customerColor:    string;
  date:        string;
  timeSlot:    string;
  guests:      number;
  status:      BookingStatus;
  amount:      number;
  notes:       string;
  createdAt:   string;
}

export interface SupplierReview {
  id:       string;
  customer: string;
  initials: string;
  color:    string;
  service:  string;
  rating:   number;
  text:     string;
  date:     string;
  replied:  boolean;
}

export interface MonthlyEarning {
  month:    string;
  revenue:  number;
  bookings: number;
  payout:   number;
}

/* ─── Services ───────────────────────────────────────────────── */
export const SUPPLIER_SERVICES: SupplierService[] = [
  {
    id: "svc-001",
    title: "Mayfair Catering Co. — Fine Dining Events",
    category: "Catering",
    price: 95,
    priceUnit: "per head",
    status: "active",
    bookings: 48,
    rating: 4.8,
    reviewCount: 312,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80",
    tags: ["weddings", "corporate", "fine-dining"],
    createdAt: "2024-01-15",
  },
  {
    id: "svc-002",
    title: "Canape & Cocktail Evening Package",
    category: "Catering",
    price: 55,
    priceUnit: "per head",
    status: "active",
    bookings: 31,
    rating: 4.7,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    tags: ["cocktails", "canapes", "parties"],
    createdAt: "2024-03-08",
  },
  {
    id: "svc-003",
    title: "Corporate Lunch Buffet Service",
    category: "Catering",
    price: 38,
    priceUnit: "per head",
    status: "active",
    bookings: 67,
    rating: 4.9,
    reviewCount: 201,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
    tags: ["corporate", "buffet", "lunch"],
    createdAt: "2024-02-20",
  },
  {
    id: "svc-004",
    title: "Wedding Banquet — Full Service",
    category: "Catering",
    price: 145,
    priceUnit: "per head",
    status: "paused",
    bookings: 12,
    rating: 4.6,
    reviewCount: 44,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    tags: ["wedding", "banquet", "premium"],
    createdAt: "2024-04-01",
  },
  {
    id: "svc-005",
    title: "Christmas Party Feasting Menu",
    category: "Catering",
    price: 75,
    priceUnit: "per head",
    status: "draft",
    bookings: 0,
    rating: 0,
    reviewCount: 0,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    tags: ["christmas", "seasonal", "party"],
    createdAt: "2024-09-12",
  },
];

/* ─── Bookings ───────────────────────────────────────────────── */
export const SUPPLIER_BOOKINGS: SupplierBooking[] = [
  {
    id: "BK-A3F291",
    serviceId: "svc-001",
    service: "Mayfair Catering Co. — Fine Dining",
    customer: "Emily Richardson",
    customerInitials: "ER",
    customerColor: "#6366f1",
    date: "2025-05-14",
    timeSlot: "7:00 PM",
    guests: 120,
    status: "confirmed",
    amount: 13680,
    notes: "Kosher menu required for 30 guests",
    createdAt: "2025-04-01",
  },
  {
    id: "BK-B9D445",
    serviceId: "svc-002",
    service: "Canape & Cocktail Evening",
    customer: "Oliver Nash",
    customerInitials: "ON",
    customerColor: "#8b5cf6",
    date: "2025-05-20",
    timeSlot: "6:00 PM",
    guests: 80,
    status: "pending",
    amount: 5280,
    notes: "",
    createdAt: "2025-04-03",
  },
  {
    id: "BK-C1E872",
    serviceId: "svc-003",
    service: "Corporate Lunch Buffet",
    customer: "Priya Patel",
    customerInitials: "PP",
    customerColor: "#22c55e",
    date: "2025-04-28",
    timeSlot: "12:00 PM",
    guests: 45,
    status: "confirmed",
    amount: 1863,
    notes: "Vegetarian options for all guests",
    createdAt: "2025-04-05",
  },
  {
    id: "BK-D7H120",
    serviceId: "svc-001",
    service: "Mayfair Catering Co. — Fine Dining",
    customer: "James Hartley",
    customerInitials: "JH",
    customerColor: "#f59e0b",
    date: "2025-04-10",
    timeSlot: "7:30 PM",
    guests: 200,
    status: "completed",
    amount: 21660,
    notes: "",
    createdAt: "2025-03-01",
  },
  {
    id: "BK-E5K391",
    serviceId: "svc-002",
    service: "Canape & Cocktail Evening",
    customer: "Sophie Clarke",
    customerInitials: "SC",
    customerColor: "#ef4444",
    date: "2025-04-05",
    timeSlot: "5:00 PM",
    guests: 60,
    status: "completed",
    amount: 3960,
    notes: "Strictly no nuts",
    createdAt: "2025-03-10",
  },
  {
    id: "BK-F2M644",
    serviceId: "svc-004",
    service: "Wedding Banquet — Full Service",
    customer: "Amelia Brooks",
    customerInitials: "AB",
    customerColor: "#06b6d4",
    date: "2025-06-07",
    timeSlot: "2:00 PM",
    guests: 150,
    status: "pending",
    amount: 24750,
    notes: "3-course menu, white linen, silver cutlery",
    createdAt: "2025-04-06",
  },
  {
    id: "BK-G9P008",
    serviceId: "svc-003",
    service: "Corporate Lunch Buffet",
    customer: "Harry Webb",
    customerInitials: "HW",
    customerColor: "#84cc16",
    date: "2025-03-22",
    timeSlot: "12:30 PM",
    guests: 30,
    status: "cancelled",
    amount: 1254,
    notes: "",
    createdAt: "2025-03-05",
  },
];

/* ─── Reviews ────────────────────────────────────────────────── */
export const SUPPLIER_REVIEWS: SupplierReview[] = [
  {
    id: "rv-001",
    customer: "Emily Richardson",
    initials: "ER",
    color: "#6366f1",
    service: "Mayfair Catering Co. — Fine Dining",
    rating: 5,
    text: "Absolutely incredible experience. The food was exquisite — every single guest complimented the quality. The team was professional, punctual, and discreet. Will 100% book again for our annual gala.",
    date: "2025-04-12",
    replied: true,
  },
  {
    id: "rv-002",
    customer: "James Hartley",
    initials: "JH",
    color: "#f59e0b",
    service: "Mayfair Catering Co. — Fine Dining",
    rating: 5,
    text: "200 guests and not a single issue. From setup to breakdown the service was seamless. The beef wellington was the highlight of the evening. Exceptional value for white-glove service.",
    date: "2025-04-11",
    replied: false,
  },
  {
    id: "rv-003",
    customer: "Sophie Clarke",
    initials: "SC",
    color: "#ef4444",
    service: "Canape & Cocktail Evening",
    rating: 4,
    text: "Great canapés and the cocktail selection was excellent. Slight delay at the start but the team handled it well and everything was delicious. Would recommend for a stylish product launch.",
    date: "2025-04-06",
    replied: true,
  },
  {
    id: "rv-004",
    customer: "Priya Patel",
    initials: "PP",
    color: "#22c55e",
    service: "Corporate Lunch Buffet",
    rating: 5,
    text: "Perfect for our team lunch. Extensive vegetarian options, everything fresh and beautifully presented. Our office has already booked again for next quarter. Highly efficient and friendly staff.",
    date: "2025-03-30",
    replied: false,
  },
  {
    id: "rv-005",
    customer: "Oliver Nash",
    initials: "ON",
    color: "#8b5cf6",
    service: "Canape & Cocktail Evening",
    rating: 4,
    text: "Really impressed with the variety and presentation. The smoked salmon blinis were phenomenal. Only feedback is more vegan options would be appreciated, but overall a fantastic evening.",
    date: "2025-03-15",
    replied: true,
  },
];

/* ─── Monthly earnings ───────────────────────────────────────── */
export const MONTHLY_EARNINGS: MonthlyEarning[] = [
  { month: "Oct",  revenue: 18400, bookings: 11, payout: 16192 },
  { month: "Nov",  revenue: 21200, bookings: 14, payout: 18656 },
  { month: "Dec",  revenue: 34800, bookings: 22, payout: 30624 },
  { month: "Jan",  revenue: 12600, bookings: 8,  payout: 11088 },
  { month: "Feb",  revenue: 15900, bookings: 10, payout: 13992 },
  { month: "Mar",  revenue: 22400, bookings: 16, payout: 19712 },
  { month: "Apr",  revenue: 28900, bookings: 19, payout: 25432 },
];
