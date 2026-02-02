
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, Globe, Mail } from 'lucide-react';
import { TEAM_MEMBERS } from '@/constants';

const CATEGORIES = ['All', 'Core', 'Technical', 'Cultural', 'Creative', 'Publicity', 'Operations'];

const TeamCard: React.FC<{ member: any; index: number }> = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative aspect-4/5 rounded-[40px] overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500/40 transition-all duration-500">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" 
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
        
        {/* Hover Social Links */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          {Object.entries(member.links).map(([platform, url]) => (
            <a 
              key={platform} 
              href={url as string} 
              className="p-3 bg-red-600 rounded-2xl text-white hover:bg-white hover:text-red-600 transition-colors shadow-xl"
            >
              {platform === 'linkedin' && <Linkedin size={20} />}
              {platform === 'github' && <Github size={20} />}
              {platform === 'twitter' && <Twitter size={20} />}
              {platform === 'instagram' && <Instagram size={20} />}
            </a>
          ))}
        </div>

        {/* Info */}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
            {member.category}
          </p>
          <h3 className="text-2xl font-black text-white font-space leading-tight mb-1">
            {member.name}
          </h3>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest opacity-80">
            {member.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const TeamPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTeam = TEAM_MEMBERS.filter(member => 
    activeCategory === 'All' || member.category === activeCategory
  );

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 font-black tracking-[0.4em] uppercase text-xs mb-4"
        >
          The Architects of Kaushalam
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-9xl font-black mb-8 font-space uppercase tracking-tighter"
        >
          MEET THE <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-rose-500">TEAM</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          A dedicated group of visionaries working tirelessly to bring you the most immersive college festival experience in the country.
        </motion.p>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center mb-16">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide bg-white/5 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl font-bold whitespace-nowrap transition-all uppercase tracking-widest text-[10px] border ${
                activeCategory === cat 
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' 
                  : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredTeam.map((member, idx) => (
          <TeamCard key={member.id} member={member} index={idx} />
        ))}
      </div>

      {/* Join the Team CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-32 p-12 md:p-20 rounded-[60px] bg-linear-to-br from-red-600/10 to-transparent border border-red-600/20 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] -z-10" />
        <h2 className="text-4xl md:text-6xl font-black mb-6 font-space uppercase tracking-tighter">Want to join the legacy?</h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          We're always looking for passionate volunteers and coordinators. Be part of the team that builds the future.
        </p>
        <button className="px-10 py-5 bg-white text-black font-black rounded-3xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
          Volunteer Registration
        </button>
      </motion.div>
    </div>
  );
};

export default TeamPage;
