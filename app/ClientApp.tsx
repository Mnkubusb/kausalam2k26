"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import Footer from "./components/Footer";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { FestEvent, TeamMember, GalleryItem, ScheduleItem } from "@/types";
import { EVENTS as STATIC_EVENTS, TEAM_MEMBERS as STATIC_TEAM } from "@/constants";

// Dynamic imports for code splitting
const HomePage = dynamic(() => import("@/app/views/HomePage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const EventsPage = dynamic(() => import("@/app/views/EventsPage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const EventDetailsPage = dynamic(() => import("@/app/views/EventDetailsPage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const TeamPage = dynamic(() => import("@/app/views/TeamPage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const SchedulePage = dynamic(() => import("@/app/views/SchedulePage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const HelpPage = dynamic(() => import("@/app/views/HelpPage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const LegalPage = dynamic(() => import("@/app/views/LegalPage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const AdminPage = dynamic(() => import("@/app/views/AdminPage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});
const GalleryPage = dynamic(() => import("@/app/views/GalleryPage"), {
  loading: () => <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
});

export type Page =
  | "home"
  | "events"
  | "event-details"
  | "team"
  | "schedule"
  | "help"
  | "privacy"
  | "terms"
  | "cookies"
  | "admin"
  | "gallery";

interface ClientAppProps {
  initialPage?: Page;
  initialEventId?: string;
}

const ClientApp: React.FC<ClientAppProps> = ({ initialPage = "home", initialEventId = null }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(initialEventId);
  const [events, setEvents] = useState<FestEvent[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL when pathname changes (handling back/forward browser buttons)
  useEffect(() => {
    // This is a basic mapping. In a robust app, we'd have a route config.
    const path = pathname?.split('/').filter(Boolean)[0];
    const eventIdFromUrl = pathname?.split('/').filter(Boolean)[1];

    let newPage: Page = "home";
    if (path) {
        if (path === "events" && eventIdFromUrl) {
            newPage = "event-details";
            setSelectedEventId(eventIdFromUrl);
        } else if (["events", "team", "schedule", "help", "privacy", "terms", "cookies", "admin", "gallery"].includes(path)) {
            newPage = path as Page;
        } else {
            // Handle unknown routes? defaulting to home or keeping current if we want.
            // But if we are here, it's likely a direct navigation.
        }
    } else {
        newPage = "home";
    }
    
    // Only update if different to prevent loops, though React handles this well.
    // However, since we are managing state AND URL, we need to be careful.
    // We trust props/initial state for first render, but update on subsequent navigations.
    // Actually, useEffect on pathname will trigger on mount too if we don't block it.
    // But we initialized state from props which came from the server/parent URL parsing.
    // So this effect is mostly for Client-Side navigation (popstate) or if parent doesn't update.
    
    // Since we are moving to router.push based navigation, the pathname WILL update.
    if (newPage !== currentPage) {
       setCurrentPage(newPage);
    }
    if (newPage === "event-details" && eventIdFromUrl && eventIdFromUrl !== selectedEventId) {
        setSelectedEventId(eventIdFromUrl);
    }
    
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedEventId]);

  useEffect(() => {
    const refs = {
      events: ref(db, "events"),
      team: ref(db, "team"),
      gallery: ref(db, "gallery"),
      schedule: ref(db, "schedule")
    };

    const unsubscribes = [
      onValue(refs.events, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetched: FestEvent[] = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          fetched.sort((a, b) => a.name.localeCompare(b.name));
          setEvents(fetched);
        } else setEvents(STATIC_EVENTS);
      }),
      onValue(refs.team, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetched: TeamMember[] = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setTeam(fetched);
        } else setTeam(STATIC_TEAM);
      }),
      onValue(refs.gallery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetched: GalleryItem[] = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setGallery(fetched);
        }
      }),
      onValue(refs.schedule, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetched: ScheduleItem[] = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          setSchedule(fetched);
        }
      })
    ];

    setLoading(false);
    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const navigateTo = (page: Page, eventId?: string) => {
    if (eventId) {
      setSelectedEventId(eventId);
      router.push(`/events/${eventId}`);
    } else {
        if (page === "home") router.push("/");
        else router.push(`/${page}`);
    }
    // State update will happen in useEffect dependent on pathname
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="relative min-h-screen">
      <Background />
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />

      <main className="pt-20">
        {currentPage === "home" && (
          <HomePage
            events={events}
            onExplore={() => navigateTo("events")}
            onSelectEvent={(id) => navigateTo("event-details", id)}
            onSeeAll={() => navigateTo("events")}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === "events" && (
          <EventsPage
            events={events}
            onSelectEvent={(id) => navigateTo("event-details", id)}
          />
        )}

        {currentPage === "event-details" && selectedEvent && (
          <EventDetailsPage
            event={selectedEvent}
            onBack={() => navigateTo("events")}
          />
        )}
        
        {/* Fallback for event details if event not found yet (loading or invalid ID) */}
        {currentPage === "event-details" && !selectedEvent && !loading && (
             <div className="min-h-[50vh] flex flex-col items-center justify-center text-white">
                 <p className="text-xl mb-4">Event not found</p>
                 <button onClick={() => navigateTo("events")} className="text-red-500 hover:underline">Back to events</button>
             </div>
        )}

        {currentPage === "team" && <TeamPage team={team} />}

        {currentPage === "gallery" && <GalleryPage gallery={gallery} />}

        {currentPage === "schedule" && <SchedulePage schedule={schedule} />}

        {currentPage === "help" && <HelpPage />}

        {currentPage === "admin" && (
          <AdminPage 
            events={events} 
            team={team}
            gallery={gallery} 
            schedule={schedule} 
          />
        )}

        {(currentPage === "privacy" ||
          currentPage === "terms" ||
          currentPage === "cookies") && <LegalPage type={currentPage} />}

        {/* Global Newsletter / Footer CTA */}
        <section className="py-24 px-6 max-w-3xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-black mb-6 font-space uppercase">
            Stay In The Loop
          </h3>
          <p className="text-gray-400 mb-10 text-lg">
            Subscribe to get notifications about event registrations, schedules,
            and pro-night reveals.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all"
            >
              Notify Me
            </button>
          </form>
        </section>
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default ClientApp;
