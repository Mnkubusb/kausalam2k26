"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import Footer from "./components/Footer";
import { db, auth } from "@/lib/firebase";
import { ref, onValue, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { FestEvent } from "@/types";
import { EVENTS as STATIC_EVENTS } from "@/constants";

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
const AuthPage = dynamic(() => import("@/app/views/AuthPage"), {
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
  | "gallery"
  | "login"
  | "register";

interface ClientAppProps {
  initialPage?: Page;
  initialEventId?: string;
}

const ClientApp: React.FC<ClientAppProps> = ({ initialPage = "home", initialEventId = null }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Derive page state from URL
  const path = pathname?.split('/').filter(Boolean)[0];
  const eventIdFromUrl = pathname?.split('/').filter(Boolean)[1] || null;

  let currentPage: Page = "home";
  if (path) {
    if (path === "events" && eventIdFromUrl) {
      currentPage = "event-details";
    } else if (["events", "team", "schedule", "help", "privacy", "terms", "cookies", "admin", "gallery", "login", "register"].includes(path)) {
      currentPage = path as Page;
    }
  }

  const selectedEventId = currentPage === "event-details" ? eventIdFromUrl : null;

  const [events, setEvents] = useState<FestEvent[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [scheduleItems, setScheduleItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'student' | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const eventsRef = ref(db, "events");
    const teamRef = ref(db, "team");
    const galleryRef = ref(db, "gallery");
    const scheduleRef = ref(db, "schedule");

    // Helper to fetch data from a ref
    const fetchData = (dataRef: any, setter: (data: any) => void, staticFallback: any) => {
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetchedData: any[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setter(fetchedData);
        } else {
          setter(staticFallback);
        }
        setLoading(false);
      });
    };

    fetchData(eventsRef, (data) => {
      data.sort((a: any, b: any) => a.name.localeCompare(b.name));
      setEvents(data);
    }, STATIC_EVENTS);

    fetchData(teamRef, setTeamMembers, []); 
    fetchData(galleryRef, setGalleryItems, []);
    fetchData(scheduleRef, setScheduleItems, []);

    // Listen for auth state changes to fetch user role
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        setUserRole(userData?.role || 'student');
      } else {
        setUserRole(null);
      }
    });

    return () => {
      unsubscribeAuth();
    };
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

        {currentPage === "team" && <TeamPage members={teamMembers} />}

        {currentPage === "gallery" && <GalleryPage items={galleryItems} />}

        {currentPage === "schedule" && <SchedulePage schedule={scheduleItems} />}

        {currentPage === "help" && <HelpPage />}

        {currentPage === "admin" && userRole === "admin" && (
          <AdminPage 
            events={events} 
            teamMembers={teamMembers} 
            galleryItems={galleryItems} 
            scheduleItems={scheduleItems}
            userRole={userRole}
          />
        )}

        {currentPage === "admin" && userRole !== "admin" && !loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-white px-6 text-center">
            <h2 className="text-4xl font-black font-space uppercase mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-8 max-w-md">You need administrator privileges to view this page. Please sign in with an admin account.</p>
            <button 
              onClick={() => navigateTo("login")}
              className="px-8 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all"
            >
              Go to Login
            </button>
          </div>
        )}

        {(currentPage === "login" || currentPage === "register") && (
          <AuthPage 
            initialMode={currentPage === "register" ? 'register' : 'login'} 
            onLoginSuccess={(role) => {
              setUserRole(role);
              navigateTo(role === 'admin' ? 'admin' : 'home');
            }}
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
