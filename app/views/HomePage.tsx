
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Target, Zap, Users, Play, ExternalLink, 
  MessageCircle, Youtube, Instagram, Facebook, Twitter,
  Heart, Award, Star, ArrowRight, Camera, GraduationCap
} from 'lucide-react';
import { FestEvent } from '@/types';
import { type Page } from '@/app/ClientApp';
import Hero from '@/app/components/Hero';
import BentoEvents from '@/app/components/BentoEvents';

interface HomePageProps {
  events: FestEvent[];
  onExplore: () => void;
  onSelectEvent: (id: string) => void;
  onSeeAll?: () => void;
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ events, onExplore, onSelectEvent, onSeeAll, onNavigate }) => {
  return (
    <div className="overflow-hidden">
      <Hero onExplore={onExplore} />
      
      {/* 1. Introduction of KAUSHALAM */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-6">
              <GraduationCap size={14} />
              <span>GEC Bilaspur Presents</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 font-space uppercase leading-[0.9] tracking-tighter">
              WHAT IS <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-600 to-rose-500">KAUSHALAM?</span>
            </h2>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed mb-10 font-medium">
              <p>
                Kaushalam is the flagship annual technical and cultural festival of <strong>Government Engineering College Bilaspur</strong>. It serves as a premier platform for young innovators and artists to showcase their brilliance to the world.
              </p>
              <p>
                Founded on the principles of excellence and creativity, Kaushalam at GEC Bilaspur has grown into a massive celebration that brings together thousands of students from across Chhattisgarh and beyond for three days of high-octane competition and cultural immersion.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Target, title: 'Innovation', desc: 'Fostering tech excellence at GEC Bilaspur.' },
                { icon: Heart, title: 'Culture', desc: 'The soul of our vibrant college community.' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-colors group">
                  <item.icon className="text-red-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                  <h4 className="font-bold text-white mb-2 uppercase font-space tracking-widest">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-4/5 rounded-[60px] overflow-hidden border border-white/10 relative shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                alt="GEC Bilaspur Campus"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-white text-2xl font-black font-space uppercase">"Legacy of Excellence"</p>
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">GEC Bilaspur Official</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Respected Principal & Organising Faculties */}
      <section className="py-32 px-6 bg-white/2 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black font-space uppercase tracking-tighter mb-4">OUR <span className="text-red-500">MENTORS</span></h2>
            <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold">Leading GEC Bilaspur into the Future</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Principal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 p-10 md:p-16 rounded-[60px] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-red-600/30 p-2 shrink-0">
                <img src="/Princi.jpeg" className="w-full h-full object-cover rounded-full" alt="Principal" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-red-500 font-black tracking-[0.4em] uppercase text-xs mb-2">Respected Principal, GEC Bilaspur</p>
                <h3 className="text-4xl md:text-6xl font-black font-space uppercase mb-6 tracking-tighter">DR. S.K SANGHAI</h3>
                <p className="text-gray-400 text-lg leading-relaxed italic font-medium">
                  "Kaushalam is a testament to the holistic development we strive for at Government Engineering College Bilaspur. It is heartening to see our students bridge the gap between classroom theory and real-world application with such vigor. I invite every participant to discover their true potential here."
                </p>
              </div>
            </motion.div>

            {[
              { name: 'Dr. Aryan Sharma', role: 'Head of Technical Committee', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
              { name: 'Prof. Meera Iyer', role: 'Head of Cultural Affairs', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop' },
              { name: 'Dr. Vikram Malhotra', role: 'General Coordinator', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop' }
            ].map((faculty, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-[40px] bg-white/5 border border-white/5 text-center group hover:border-red-500/20 transition-all"
              >
                <div className="w-32 h-32 rounded-3xl overflow-hidden mx-auto mb-6 group-hover:scale-105 transition-transform duration-500">
                  <img src={faculty.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={faculty.name} />
                </div>
                <h4 className="text-xl font-black font-space uppercase text-white mb-1">{faculty.name}</h4>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{faculty.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Previous Year Content Preview (Gallery Teaser) */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h2 className="text-4xl md:text-7xl font-black font-space uppercase tracking-tighter">THE <span className="text-red-500">LEGACY</span></h2>
            <p className="text-gray-400 mt-2 font-medium">History of Kaushalam at GEC Bilaspur</p>
          </div>
          <button 
            onClick={() => onNavigate('gallery')}
            className="flex items-center gap-2 text-red-500 font-bold hover:translate-x-2 transition-transform uppercase tracking-widest text-sm"
          >
            Visit Full Gallery <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {[
            { type: 'video', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop', title: 'Kaushalam 2K25 Vlog' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop', title: 'Cultural Night GEC' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop', title: 'Tech Expo Hall' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`relative rounded-[40px] overflow-hidden group cursor-pointer ${i === 0 ? 'md:col-span-2' : ''}`}
              onClick={() => onNavigate('gallery')}
            >
              <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                {item.type === 'video' && (
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl group-hover:scale-125 transition-transform">
                    <Play fill="currentColor" size={24} />
                  </div>
                )}
              </div>
              <div className="absolute bottom-6 left-8 z-10">
                <p className="text-white font-black font-space uppercase tracking-widest">{item.title}</p>
                <p className="text-white/60 text-xs font-bold uppercase">View on Gallery</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Current Year Content (Bento Events) */}
      <BentoEvents 
        events={events} 
        limit={4} 
        onSelectEvent={onSelectEvent} 
        onSeeAll={onSeeAll} 
      />

      {/* 3. Organising Committee details of current year */}
      <section className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black font-space uppercase tracking-tighter mb-4">THE <span className="text-red-500">COUNCIL</span></h2>
          <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold">Leading Kaushalam 2026 @ GECB</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: 'Sneha R.', role: 'President', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Rahul V.', role: 'Tech Head', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Ananya S.', role: 'Cultural Head', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Vikram D.', role: 'PR Head', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Ishita K.', role: 'Design Head', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop' },
            { name: 'Aryan M.', role: 'Sponsorship', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop' }
          ].map((member, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center group"
            >
              <div className="aspect-square rounded-full overflow-hidden border border-white/10 mb-4 p-1 group-hover:border-red-500/50 transition-colors">
                <img src={member.img} className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500" alt={member.name} />
              </div>
              <h5 className="font-bold text-white uppercase text-sm font-space">{member.name}</h5>
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{member.role}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button 
            onClick={() => onNavigate('team')}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            View Full Team
          </button>
        </div>
      </section>

      {/* 6. Social Media Hub */}
      {/* 7. Contact Details */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto rounded-[60px] bg-white p-12 md:p-24 text-black text-center relative overflow-hidden shadow-2xl shadow-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <h2 className="text-4xl md:text-7xl font-black font-space uppercase tracking-tighter mb-8 leading-[0.9]">
            STAY <span className="text-red-600">CONNECTED</span>
          </h2>
          <p className="text-xl font-medium text-gray-600 mb-12 max-w-xl mx-auto">
            Join the GEC Bilaspur official Kaushalam community on WhatsApp and follow our socials for exclusive updates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="https://whatsapp.com/channel/dummy-gecb" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-[#25D366] text-white font-black rounded-3xl hover:bg-[#128C7E] transition-all flex items-center gap-3 transform hover:scale-105 active:scale-95 shadow-xl shadow-green-500/20 uppercase font-space"
            >
              <MessageCircle size={24} /> GECB WhatsApp Group
            </a>
            <div className="flex gap-4">
              {[
                { Icon: Youtube, color: 'bg-[#FF0000]', link: '#' },
                { Icon: Instagram, color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', link: '#' },
                { Icon: Facebook, color: 'bg-[#1877F2]', link: '#' },
                { Icon: Twitter, color: 'bg-[#1DA1F2]', link: '#' }
              ].map((item, i) => (
                <a 
                  key={i} 
                  href={item.link} 
                  className={`p-5 ${item.color} text-white rounded-3xl transition-all transform hover:scale-110 hover:shadow-lg`}
                >
                  <item.Icon size={24} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-16 pt-12 border-t border-black/5 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs">
              <Award className="text-red-600" size={18} /> GEC Bilaspur Heritage
            </div>
            <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs">
              <Star className="text-red-600" size={18} /> Best Engineering Fest
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
