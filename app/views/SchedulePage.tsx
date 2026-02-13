
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Coffee, Star } from 'lucide-react';

const SCHEDULE_DATA = {
  // ... (keep static data as fallback)
  'Day 1': [
    { time: '09:00 AM', title: 'Inauguration Ceremony', venue: 'Main Auditorium', type: 'Official' },
    { time: '11:00 AM', title: 'Byte Battles 2.0 Kickoff', venue: 'Computing Lab A', type: 'Technical' },
    { time: '01:00 PM', title: 'Networking Lunch', venue: 'Food Court', type: 'Social' },
    { time: '02:00 PM', title: 'Cyber Strike Prelims', venue: 'Gaming Zone', type: 'Sports' },
    { time: '06:00 PM', title: 'Acoustic Night', venue: 'Open Plaza', type: 'Cultural' },
  ],
  'Day 2': [
    { time: '10:00 AM', title: 'AI Workshop', venue: 'Seminar Hall B', type: 'Workshops' },
    { time: '12:00 PM', title: 'Robo Rumble Heats', venue: 'Arena 1', type: 'Technical' },
    { time: '02:00 PM', title: 'Artistic Echoes', venue: 'Open Plaza', type: 'Cultural' },
    { time: '04:00 PM', title: 'Photography Gallery Open', venue: 'Campus Hall', type: 'Cultural' },
    { time: '07:00 PM', title: 'Symphony of Souls', venue: 'Main Auditorium', type: 'Cultural' },
  ],
  'Day 3': [
    { time: '09:00 AM', title: 'Byte Battles Finals', venue: 'Computing Lab A', type: 'Technical' },
    { time: '11:00 AM', title: 'Robo Rumble Finals', venue: 'Arena 1', type: 'Technical' },
    { time: '02:00 PM', title: 'Cyber Strike Finals', venue: 'Gaming Zone', type: 'Sports' },
    { time: '04:00 PM', title: 'Closing & Prize Distribution', venue: 'Main Auditorium', type: 'Official' },
    { time: '08:00 PM', title: 'Pro-Night DJ Set', venue: 'Grand Ground', type: 'Cultural' },
  ]
};

interface SchedulePageProps {
  schedule: any[];
}

const SchedulePage: React.FC<SchedulePageProps> = ({ schedule }) => {
  const [activeDay, setActiveDay] = useState<string>('Day 1');

  // Group items by day
  const groupedSchedule: any = {};
  if (schedule && schedule.length > 0) {
    schedule.forEach(item => {
      if (!groupedSchedule[item.day]) groupedSchedule[item.day] = [];
      groupedSchedule[item.day].push(item);
    });
  }

  const displayData = Object.keys(groupedSchedule).length > 0 ? groupedSchedule : SCHEDULE_DATA;
  const days = Object.keys(displayData);
  
  // Ensure activeDay is valid for the current displayData
  const currentDay = displayData[activeDay] ? activeDay : days[0];

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-9xl font-black mb-6 font-space uppercase tracking-tighter"
        >
          THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">SCHEDULE</span>
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Don't miss a beat. Plan your three days of innovation and excitement.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="flex gap-2 bg-white/5 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-8 py-4 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs ${
                activeDay === day 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {displayData[currentDay]?.map((item: any, idx: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="group relative flex gap-8 items-center"
              >
                {/* Time */}
                <div className="w-24 text-right hidden sm:block">
                  <span className="text-red-500 font-black font-space whitespace-nowrap">{item.time}</span>
                </div>
                
                {/* Divider */}
                <div className="relative flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-600/20 z-10" />
                  {idx !== displayData[currentDay].length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-red-600 to-transparent absolute top-4 h-[calc(100%+1.5rem)]" />
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-red-500/30 transition-all transform hover:scale-[1.01]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="sm:hidden text-red-500 font-black mb-1">{item.time}</div>
                      <h3 className="text-xl font-black font-space mb-2">{item.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={14}/> {item.venue}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] uppercase font-black">{item.type}</span>
                      </div>
                    </div>
                    {item.type === 'Official' ? <Star className="text-red-600" /> : <Coffee className="text-gray-600" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SchedulePage;
