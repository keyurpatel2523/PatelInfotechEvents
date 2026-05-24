"use client";

export const dynamic = "force-dynamic";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Users, Star, Clock, Heart,
  Share2, ShieldCheck, ArrowLeft, Ticket, ChevronRight,
  Tag, Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/marketplace/event-card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { cn, formatCurrency as fmt } from "@/lib/utils";

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const event = MOCK_EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const [saved, setSaved] = React.useState(false);
  const [qty, setQty] = React.useState(1);

  const total = event.price * qty;
  const related = MOCK_EVENTS.filter((e) => e.id !== event.id && e.category === event.category).slice(0, 3);
  const fillPercent = Math.round((event.attendees / event.capacity) * 100);

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      <main className="pt-16">
        {/* Hero image */}
        <div className="relative h-[40vh] min-h-[300px] max-h-[480px] overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Back button */}
          <div className="absolute top-6 left-6">
            <Button asChild variant="ghost" size="sm" className="glass text-white border-white/20 hover:bg-white/10">
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" /> Back to events
              </Link>
            </Button>
          </div>

          {/* Action buttons */}
          <div className="absolute top-6 right-6 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="glass text-white border-white/20 hover:bg-white/10"
              onClick={() => setSaved((v) => !v)}
            >
              <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
            </Button>
            <Button size="icon" variant="ghost" className="glass text-white border-white/20 hover:bg-white/10">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Category overlay */}
          <div className="absolute bottom-6 left-6 flex gap-2">
            <Badge variant="brand" size="md">{event.category}</Badge>
            {event.featured && <Badge className="glass border-white/20 text-white" size="md">Featured</Badge>}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-10 lg:grid-cols-3">

            {/* Left — main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title block */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-3xl font-bold leading-tight mb-3" style={{ color: "var(--text-1)" }}>
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--text-3)" }}>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#6366f1]" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#6366f1]" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#6366f1]" />
                    {event.location}, {event.city}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(event.rating) ? "fill-amber-500 text-amber-500" : "text-[--text-4]"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold" style={{ color: "var(--text-1)" }}>{event.rating}</span>
                  <span style={{ color: "var(--text-3)" }}>({event.reviewCount} reviews)</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1.5" style={{ color: "var(--text-3)" }}>
                    <Users className="h-4 w-4" />
                    {event.attendees.toLocaleString()} attending
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" size="sm">
                      <Tag className="h-3 w-3" /> {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Tabs */}
              <Tabs defaultValue="about">
                <TabsList variant="underline">
                  <TabsTrigger value="about" variant="underline">About</TabsTrigger>
                  <TabsTrigger value="schedule" variant="underline">Schedule</TabsTrigger>
                  <TabsTrigger value="reviews" variant="underline">Reviews</TabsTrigger>
                  <TabsTrigger value="venue" variant="underline">Venue</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <div className="prose prose-sm max-w-none" style={{ color: "var(--text-2)" }}>
                    <p className="text-base leading-relaxed">{event.description}</p>
                    <p className="mt-4 text-sm" style={{ color: "var(--text-3)" }}>
                      This event is organized and hosted by <strong>{event.vendor.name}</strong>,
                      a verified vendor on EventSphere with {event.vendor.eventsHosted}+ events and
                      a {event.vendor.rating}★ rating.
                    </p>
                  </div>

                  {/* Capacity indicator */}
                  <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: "var(--text-2)" }}>
                        <Users className="inline h-3.5 w-3.5 mr-1" />
                        {event.attendees.toLocaleString()} / {event.capacity.toLocaleString()} spots filled
                      </span>
                      <span className={fillPercent >= 85 ? "text-amber-600 font-semibold" : "text-[--text-3]"}>
                        {fillPercent}% full{fillPercent >= 85 ? " — Almost sold out!" : ""}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-muted)" }}>
                      <div
                        className={cn("h-full rounded-full transition-all bg-brand-gradient", fillPercent >= 85 && "bg-none bg-amber-500")}
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="schedule">
                  <div className="space-y-4">
                    {[
                      { time: event.time, title: "Doors open & Registration", desc: "Check in and collect your badge" },
                      { time: "10:00 AM", title: "Opening Keynote", desc: "Welcome address and event overview" },
                      { time: "11:30 AM", title: "Panel Discussion", desc: "Industry leaders in conversation" },
                      { time: "1:00 PM",  title: "Lunch Break & Networking", desc: "Catered lunch and open networking" },
                      { time: "2:30 PM",  title: "Workshops", desc: "Choose from 8 parallel workshops" },
                      { time: "5:00 PM",  title: "Closing Ceremony", desc: "Awards, announcements, and wrap-up" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white text-xs font-bold">
                            {i + 1}
                          </div>
                          {i < 5 && <div className="w-px flex-1 mt-1" style={{ background: "var(--border)" }} />}
                        </div>
                        <div className="pb-4">
                          <span className="text-xs font-medium text-[#6366f1]">{item.time}</span>
                          <p className="font-semibold text-sm mt-0.5" style={{ color: "var(--text-1)" }}>{item.title}</p>
                          <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="space-y-4">
                    {[
                      { name: "Arjun Mehta",   rating: 5, date: "2 days ago",   text: "Absolutely incredible event. Top-notch organization and world-class speakers. Worth every rupee!" },
                      { name: "Priya Sharma",  rating: 5, date: "1 week ago",   text: "Best event I've attended in Bangalore this year. The workshops were especially insightful." },
                      { name: "Rohit Verma",   rating: 4, date: "2 weeks ago",  text: "Very well organized. A little crowded but the content quality was outstanding." },
                    ].map((review, i) => (
                      <Card key={i} variant="default" className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar size="sm">
                            <AvatarFallback>{review.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{review.name}</p>
                              <span className="text-xs" style={{ color: "var(--text-4)" }}>{review.date}</span>
                            </div>
                            <div className="flex gap-0.5 my-1">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className={cn("h-3 w-3", j < review.rating ? "fill-amber-500 text-amber-500" : "text-[--text-4]")} />
                              ))}
                            </div>
                            <p className="text-sm" style={{ color: "var(--text-3)" }}>{review.text}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="venue">
                  <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                    <div className="h-48 bg-brand-gradient-subtle flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 mx-auto mb-2 text-[#6366f1]" />
                        <p className="font-semibold" style={{ color: "var(--text-1)" }}>{event.location}</p>
                        <p className="text-sm" style={{ color: "var(--text-3)" }}>{event.city}</p>
                      </div>
                    </div>
                    <div className="p-4" style={{ background: "var(--bg-subtle)" }}>
                      <p className="font-medium text-sm mb-1" style={{ color: "var(--text-1)" }}>{event.location}</p>
                      <p className="text-sm" style={{ color: "var(--text-3)" }}>{event.city}, India</p>
                      <Button variant="outline" size="sm" className="mt-3">
                        <MapPin className="h-3.5 w-3.5" /> Get directions
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Vendor */}
              <div>
                <h3 className="font-semibold text-base mb-4" style={{ color: "var(--text-1)" }}>Organized by</h3>
                <Card variant="default" className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg">
                      <AvatarImage src={event.vendor.avatar} />
                      <AvatarFallback>{event.vendor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold" style={{ color: "var(--text-1)" }}>{event.vendor.name}</p>
                        {event.vendor.verified && (
                          <div className="flex items-center gap-1 text-xs text-[#6366f1]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Verified
                          </div>
                        )}
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>
                        {event.vendor.eventsHosted} events · {event.vendor.rating}★ · {event.vendor.location}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/vendors/${event.vendor.slug}`}>
                        View profile <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right — booking sidebar */}
            <div>
              <div className="sticky top-24">
                <Card variant="elevated" className="p-6 shadow-lg">
                  {/* Price */}
                  <div className="mb-6">
                    {event.price === 0 ? (
                      <div>
                        <span className="text-3xl font-bold text-green-600">Free</span>
                        <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>No ticket needed</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>
                          {fmt(event.price, "INR")}
                        </span>
                        {event.priceLabel && (
                          <span className="text-sm ml-1" style={{ color: "var(--text-3)" }}>
                            /{event.priceLabel}
                          </span>
                        )}
                        <p className="text-xs mt-1" style={{ color: "var(--text-3)" }}>
                          Inclusive of all taxes
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  {event.price > 0 && (
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-2)" }}>
                        Tickets
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border font-bold text-lg transition-colors hover:bg-[--bg-muted]"
                          style={{ borderColor: "var(--border)", color: "var(--text-2)" }}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold" style={{ color: "var(--text-1)" }}>{qty}</span>
                        <button
                          onClick={() => setQty((q) => Math.min(10, q + 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border font-bold text-lg transition-colors hover:bg-[--bg-muted]"
                          style={{ borderColor: "var(--border)", color: "var(--text-2)" }}
                        >
                          +
                        </button>
                        <span className="text-sm ml-auto" style={{ color: "var(--text-3)" }}>Max 10</span>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  {event.price > 0 && (
                    <div className="flex items-center justify-between py-3 mb-4 border-t border-b" style={{ borderColor: "var(--border)" }}>
                      <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>Total</span>
                      <span className="font-bold" style={{ color: "var(--text-1)" }}>{fmt(total, "INR")}</span>
                    </div>
                  )}

                  {/* Book button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full">
                        <Ticket className="h-4 w-4" />
                        {event.price === 0 ? "Register Free" : "Book Tickets"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent size="md">
                      <DialogHeader>
                        <DialogTitle>Complete your booking</DialogTitle>
                        <DialogDescription>
                          {qty} × {event.title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-2)" }}>First name</label>
                            <Input placeholder="Keyur" />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-2)" }}>Last name</label>
                            <Input placeholder="Patel" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-2)" }}>Email</label>
                          <Input type="email" placeholder="keyur@patelinfotec.com" />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-2)" }}>Phone</label>
                          <Input type="tel" placeholder="+91 98765 43210" />
                        </div>
                        {event.price > 0 && (
                          <div className="rounded-xl p-3 bg-brand-gradient-subtle">
                            <div className="flex justify-between text-sm">
                              <span style={{ color: "var(--text-2)" }}>{qty} ticket{qty > 1 ? "s" : ""}</span>
                              <span className="font-bold" style={{ color: "var(--text-1)" }}>{fmt(total, "INR")}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" size="md">Cancel</Button>
                        <Button size="md">
                          {event.price === 0 ? "Confirm Registration" : `Pay ${fmt(total, "INR")}`}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-center mt-3" style={{ color: "var(--text-4)" }}>
                    Free cancellation up to 48hrs before event
                  </p>

                  <Separator className="my-4" />

                  {/* Quick info */}
                  <div className="space-y-2 text-sm">
                    {[
                      { icon: ShieldCheck, text: "Secure payment via Razorpay" },
                      { icon: Info,       text: "Instant confirmation email" },
                      { icon: Ticket,    text: "Digital ticket on your phone" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2" style={{ color: "var(--text-3)" }}>
                        <Icon className="h-4 w-4 text-[#6366f1] shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Related events */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold mb-6" style={{ color: "var(--text-1)" }}>More events you&apos;ll love</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((e) => (
                  <EventCard key={e.id} event={e} variant="default" />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
