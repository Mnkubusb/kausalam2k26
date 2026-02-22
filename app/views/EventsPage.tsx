
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, ArrowRight, Code, Music, Trophy, Cpu, Camera, Palette, Gamepad2, BrainCircuit } from 'lucide-react';
import { EventCategory, FestEvent } from '@/types';

const iconMap: Record<string, any> = {
  Code, Music, Trophy, Cpu, Camera, Palette, Gamepad2, BrainCircuit
};

const CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Technical',
  'Cultural',
  'Pre Events',
  'Fun Events',
  'Literary',
  'Color & Craft Carnival',
  'Decoration',
  'Food Court',
];

interface EventsPageProps {
  events: FestEvent[];
  onSelectEvent: (id: string) => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ events, onSelectEvent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-8xl font-black mb-6 font-space uppercase tracking-tighter"
        >
          Discover <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-rose-500">Events</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg max-w-2xl"
        >
          From high-intensity code marathons to soul-stirring cultural nights, find your next challenge here.
        </motion.p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 relative top-8 z-40 bg-[#050505]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/4 -translate-y-1/2 text-gray-500" size={20} />
        <input 
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-red-500 transition-colors text-white"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 md:flex-1 md:min-w-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all uppercase tracking-widest text-xs border ${
                activeCategory === cat 
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' 
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => {
            const Icon = iconMap[event.icon] || Code;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSelectEvent(event.id)}
                className="group relative bg-white/5 border border-white/10 rounded-[32px] overflow-hidden cursor-pointer hover:border-red-500/40 transition-all duration-500"
              >
                <div className="h-64 relative">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
                      {event.category}
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-4 p-3 w-fit rounded-2xl bg-red-600/10 text-red-500 border border-red-600/20">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-black mb-2 font-space leading-tight">{event.name}</h3>
                  <p className="text-gray-400 mb-6 line-clamp-2 text-sm leading-relaxed">{event.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Calendar size={14}/> <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <MapPin size={14}/> <span>{event.venue}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="mb-6 inline-block p-6 rounded-full bg-white/5 text-gray-500">
            <Search size={48} />
          </div>
          <h3 className="text-2xl font-black mb-2 uppercase">No Events Found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
