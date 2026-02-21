
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, ArrowLeft, Share2, 
  Code, Music, Trophy, Cpu, Camera, Palette, Gamepad2, BrainCircuit,
  Trophy as PrizeIcon, Users, User
} from 'lucide-react';
import { EventPointOfContact, FestEvent } from '@/types';

const iconMap: Record<string, any> = {
  Code, Music, Trophy, Cpu, Camera, Palette, Gamepad2, BrainCircuit
};

const getLiveMonthLabel = (dateText: string) => {
  const monthMatch = dateText.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i
  );
  if (!monthMatch) return "LIVE SOON";
  return `LIVE IN ${monthMatch[1].toUpperCase()}`;
};

const getPointOfContacts = (event: FestEvent): EventPointOfContact[] => {
  if (Array.isArray(event.pointOfContacts) && event.pointOfContacts.length > 0) {
    return event.pointOfContacts.filter((contact) => contact?.name);
  }
  if (event.pointOfContact) {
    return [{ name: event.pointOfContact, phone: "", image: "" }];
  }
  return [];
};

interface EventDetailsPageProps {
  event: FestEvent;
  onBack: () => void;
}

const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onBack }) => {
  const Icon = iconMap[event.icon] || Code;
  const liveMonthLabel = getLiveMonthLabel(event.date);
  const contacts = getPointOfContacts(event);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-24"
    >
      {/* Hero Header */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          src={event.image} 
          alt={event.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        
        <div className="absolute top-10 left-6 md:left-12 z-20">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white font-bold text-sm uppercase tracking-widest hover:bg-red-600 transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Events
          </button>
        </div>

        <div className="absolute bottom-12 left-6 md:left-12 z-20 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex flex-wrap gap-3"
          >
            <span className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-red-600/40">
              {event.category}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em]">
              {liveMonthLabel}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-9xl font-black mb-6 font-space uppercase tracking-tighter text-white"
          >
            {event.name}
          </motion.h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-black mb-6 font-space uppercase tracking-widest text-red-500">About the Event</h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
                {event.longDescription}
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex items-start gap-6 group hover:border-red-500/40 transition-colors">
                <div className="p-4 rounded-3xl bg-red-600/10 text-red-500 group-hover:scale-110 transition-transform">
                  <Icon size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase font-space tracking-widest mb-1">Event Type</h3>
                  <p className="text-gray-400 font-medium">{event.eventType || `${event.category} Competition`}</p>
                </div>
              </div>
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex items-start gap-6 group hover:border-red-500/40 transition-colors">
                <div className="p-4 rounded-3xl bg-red-600/10 text-red-500 group-hover:scale-110 transition-transform">
                  <PrizeIcon size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase font-space tracking-widest mb-1">Prize Pool</h3>
                  <p className="text-gray-400 font-medium">{event.prizePool || "₹25,000 + Goodies"}</p>
                </div>
              </div>
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex items-start gap-6 group hover:border-red-500/40 transition-colors">
                <div className="p-4 rounded-3xl bg-red-600/10 text-red-500 group-hover:scale-110 transition-transform">
                  <Users size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase font-space tracking-widest mb-1">Team Size</h3>
                  <p className="text-gray-400 font-medium">{event.teamSize || "1 - 4 Members"}</p>
                </div>
              </div>
              <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 flex items-start gap-6 group hover:border-red-500/40 transition-colors md:col-span-2">
                <div className="p-4 rounded-3xl bg-red-600/10 text-red-500 group-hover:scale-110 transition-transform">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase font-space tracking-widest mb-3">Point of Contact</h3>
                  {contacts.length > 0 ? (
                    <div className="space-y-3">
                      {contacts.map((contact, idx) => (
                        <div key={`${contact.name}-${idx}`} className="flex items-center gap-3">
                          {contact.image ? (
                            <img
                              src={contact.image}
                              alt={contact.name}
                              className="w-11 h-11 rounded-xl object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10" />
                          )}
                          <div>
                            <p className="text-gray-200 font-semibold leading-tight">{contact.name}</p>
                            {contact.phone && (
                              <p className="text-gray-400 text-sm">{contact.phone}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 font-medium">Contact details will be updated soon.</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-10 rounded-[48px] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl">
              <h3 className="text-xl font-black mb-8 uppercase font-space tracking-widest">Event Logistics</h3>
              
              <div className="space-y-8 mb-12">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-white/5 text-red-500"><Calendar size={24}/></div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Schedule</p>
                    <p className="font-bold text-lg">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-white/5 text-red-500"><Clock size={24}/></div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Timing</p>
                    <p className="font-bold text-lg">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-2xl bg-white/5 text-red-500"><MapPin size={24}/></div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Location</p>
                    <p className="font-bold text-lg">{event.venue}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <a 
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-6 bg-red-600 text-white text-lg font-black rounded-3xl hover:bg-red-500 transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-red-600/30 block text-center uppercase font-space"
                >
                  Register Now
                </a>
                <button className="w-full py-6 flex items-center justify-center gap-2 bg-white/5 text-white font-bold rounded-3xl hover:bg-white/10 transition-all border border-white/10">
                  <Share2 size={20} /> Share Event
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-white/30 font-medium">
                Registrations close 48 hours before the event starts.
              </p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default EventDetailsPage;
