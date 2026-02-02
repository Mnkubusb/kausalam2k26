
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added Facebook to the imports from lucide-react
import { Play, Camera, Film, Image as ImageIcon, ExternalLink, Youtube, Instagram, Heart, Facebook } from 'lucide-react';

const MEDIA_ITEMS = [
  { id: '1', type: 'video', category: 'Aftermovie', title: 'Kaushalam 2K25 Official Aftermovie', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop', link: 'https://youtube.com/dummy1' },
  { id: '2', type: 'image', category: 'Cultural', title: 'Symphony of Souls Main Stage', url: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?q=80&w=1964&auto=format&fit=crop' },
  { id: '3', type: 'video', category: 'Vlog', title: 'Student Experience Vlog - Day 1', url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop', link: 'https://youtube.com/dummy2' },
  { id: '4', type: 'image', category: 'Technical', title: 'Robot Wars Final Arena', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop' },
  { id: '5', type: 'image', category: 'Technical', title: 'Byte Battles Hackathon', url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop' },
  { id: '6', type: 'video', category: 'Aftermovie', title: 'EDM Night Highlights', url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop', link: 'https://youtube.com/dummy3' },
  { id: '7', type: 'image', category: 'Cultural', title: 'Classical Dance Performance', url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop' },
  { id: '8', type: 'image', category: 'Campus', title: 'Neon Decorations Campus Hall', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop' },
  { id: '9', type: 'video', category: 'Vlog', title: 'The Making of Kaushalam 2K25', url: 'https://images.unsplash.com/photo-1582192732213-8be32119d187?q=80&w=1974&auto=format&fit=crop', link: 'https://youtube.com/dummy4' },
];

const CATEGORIES = ['All', 'Aftermovie', 'Vlog', 'Technical', 'Cultural', 'Campus'];

const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  const filteredMedia = MEDIA_ITEMS.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
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
          Visual Legacy
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-9xl font-black mb-8 font-space uppercase tracking-tighter"
        >
          FEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">GALLERY</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto font-medium"
        >
          Relive the energy, the excitement, and the innovation. Explore photos, videos, and vlogs from the legacy of Kaushalam.
        </motion.p>
      </div>

      {/* Filter Bar */}
      <div className="flex justify-center mb-16 sticky top-24 z-40">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide bg-black/40 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
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

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredMedia.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="break-inside-avoid relative rounded-[40px] overflow-hidden group cursor-pointer border border-white/5 hover:border-red-500/30 transition-all"
            onClick={() => setSelectedMedia(item)}
          >
            <img src={item.url} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0" alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white">
                {item.type === 'video' ? <Film size={18} /> : <ImageIcon size={18} />}
              </div>
              <span className="px-3 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest">{item.category}</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-xl font-black font-space text-white uppercase leading-tight mb-2">{item.title}</h3>
              <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                {item.type === 'video' ? 'Play Video' : 'View Image'} <ExternalLink size={12} />
              </div>
            </div>

            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-2xl">
                  <Play fill="currentColor" size={24} />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedMedia(null)}
          >
            <div className="max-w-6xl w-full flex flex-col items-center">
              <div className="relative w-full aspect-video rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
                <img src={selectedMedia.url} className="w-full h-full object-cover" alt={selectedMedia.title} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  {selectedMedia.type === 'video' ? (
                    <a 
                      href={selectedMedia.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-10 bg-red-600 rounded-full text-white hover:scale-110 transition-transform shadow-2xl flex items-center gap-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Youtube size={48} />
                      <span className="text-2xl font-black font-space uppercase">Watch on YouTube</span>
                    </a>
                  ) : (
                    <div className="text-white text-center p-12">
                      <ImageIcon size={64} className="mx-auto mb-6 text-red-500" />
                      <h2 className="text-4xl font-black font-space uppercase mb-4">{selectedMedia.title}</h2>
                      <p className="text-white/60 font-bold uppercase tracking-[0.2em]">{selectedMedia.category}</p>
                    </div>
                  )}
                </div>
              </div>
              <button 
                className="mt-8 px-8 py-3 bg-white text-black font-black rounded-full uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                onClick={() => setSelectedMedia(null)}
              >
                Close Gallery
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Hub Redirects */}
      <section className="mt-32 p-12 md:p-24 rounded-[60px] bg-white/5 border border-white/10 text-center relative overflow-hidden">
        <h2 className="text-4xl md:text-7xl font-black mb-8 font-space uppercase tracking-tighter">FOLLOW THE <span className="text-red-500">STORY</span></h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 font-medium">
          Get real-time updates, backstage content, and exclusive teasers on our social channels.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { Icon: Youtube, label: 'YouTube', color: 'bg-red-600', link: '#' },
            { Icon: Instagram, label: 'Instagram', color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', link: '#' },
            { Icon: Facebook, label: 'Facebook', color: 'bg-blue-600', link: '#' },
          ].map((item, i) => (
            <a 
              key={i} 
              href={item.link} 
              className={`px-10 py-5 ${item.color} text-white font-black rounded-3xl hover:scale-105 transition-all flex items-center gap-3 shadow-xl uppercase font-space text-sm`}
            >
              <item.Icon size={20} /> {item.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
