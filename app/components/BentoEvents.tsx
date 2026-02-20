
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Music, Trophy, Cpu, Camera, Palette, Gamepad2, BrainCircuit,
  Calendar, MapPin, ArrowRight
} from 'lucide-react';
import { FestEvent } from '@/types';

const iconMap: Record<string, any> = {
  Code, Music, Trophy, Cpu, Camera, Palette, Gamepad2, BrainCircuit
};

const normalizeHomeGridSize = (size?: FestEvent['homeGridSize']) => {
  if (size === 'bigger') return 'large';
  if (size === 'smaller') return 'auto';
  return size || 'auto';
};

const BentoCard: React.FC<{ 
  event: FestEvent; 
  index: number;
  onSelect: (id: string) => void;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  anyHovered: boolean;
}> = ({ event, index, onSelect, isHovered, onHover, anyHovered }) => {
  const Icon = iconMap[event.icon] || Code;
  const gridSize = normalizeHomeGridSize(event.homeGridSize);
  const bentoPattern = [
    'col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-2',
    'col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-1',
    'col-span-1 lg:col-span-2 lg:row-span-1',
    'col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-1',
  ];
  const adminSpanMap = {
    auto: '',
    small: 'col-span-1 lg:col-span-2 lg:row-span-1',
    wide: 'col-span-1 sm:col-span-2 lg:col-span-4 lg:row-span-1',
    tall: 'col-span-1 sm:col-span-2 lg:col-span-3 lg:row-span-2',
    large: 'col-span-1 sm:col-span-2 lg:col-span-6 lg:row-span-2',
  };
  const defaultSpan = bentoPattern[index % bentoPattern.length];
  const spanClass = adminSpanMap[gridSize] || defaultSpan;

  return (
    <motion.div
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(event.id)}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${spanClass}
        ${anyHovered && !isHovered ? 'blur-[2px] opacity-40 grayscale-[0.5]' : 'opacity-100'} 
        transition-all duration-500 ease-out border border-white/10 hover:border-red-500/30`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      <img 
        src={event.image} 
        alt={event.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      
      <div className="absolute top-4 right-4 z-20">
        <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/80">
          {event.category}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
        <div className="mb-2 p-2 w-fit rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-red-400">
          <Icon size={20} />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-1 font-space">
          {event.name}
        </h3>
        <p className="text-sm text-gray-300 font-medium line-clamp-1 opacity-80">
          {event.description}
        </p>

        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
          className="overflow-hidden mt-4"
        >
          <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
            <span className="flex items-center gap-1"><Calendar size={14}/> {event.date}</span>
            <span className="flex items-center gap-1"><MapPin size={14}/> {event.venue}</span>
          </div>
          <button className="w-full py-3 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-colors">
            Explore <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface BentoEventsProps {
  events: FestEvent[];
  limit?: number;
  onSeeAll?: () => void;
  onSelectEvent: (id: string) => void;
}

const BentoEvents: React.FC<BentoEventsProps> = ({
  events,
  limit,
  onSeeAll,
  onSelectEvent,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const approvedEvents = events.filter((event) => event.homeApproved === true);
  const displayEvents = limit ? approvedEvents.slice(0, limit) : approvedEvents;

  return (
    <section id="events" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-4 font-space"
          >
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 uppercase">Lineup</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-lg"
          >
            Explore a wide range of events from high-stakes coding to vibrant cultural performances. Your stage, your victory.
          </motion.p>
        </div>
        
        {onSeeAll && (
          <button 
            onClick={onSeeAll}
            className="flex items-center gap-2 text-red-500 font-bold hover:translate-x-2 transition-transform uppercase tracking-widest text-sm"
          >
            View All Events <ArrowRight size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 auto-rows-[220px] lg:auto-rows-[170px]">
        {displayEvents.map((event, index) => (
          <BentoCard 
            key={event.id} 
            event={event} 
            index={index}
            onSelect={onSelectEvent}
            onHover={setHoveredId}
            isHovered={hoveredId === event.id}
            anyHovered={hoveredId !== null}
          />
        ))}
      </div>
    </section>
  );
};

export default BentoEvents;
