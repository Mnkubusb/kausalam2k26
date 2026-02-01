
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

const PixelBlast = dynamic(() => import('./PixelBlast'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#050505]" /> 
});

interface HeroProps {
  onExplore: () => void;
}

const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Interactive PixelBlast Background */}
      <div className="absolute inset-0 z-0">
        <PixelBlast 
          color="#ef4444" 
          pixelSize={4}
          patternScale={2.5}
          patternDensity={1.2}
          liquid={true}
          liquidStrength={0.05}
          liquidRadius={1.5}
          enableRipples={true}
          rippleIntensityScale={1.5}
          speed={0.4}
          edgeFade={0.6}
        />
      </div>

      <div className="text-center z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-red-400 text-sm font-bold mb-8 pointer-events-auto"
        >
          <Sparkles size={16} className="text-red-500" />
          <span>CELEBRATING INNOVATION SINCE 2010</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="text-[14vw] md:text-[10vw] font-[900] leading-[0.85] tracking-tighter mb-6 font-space"
        >
          <span className="sr-only">Kaushalam 2026 GEC Bilaspur Tech Fest</span>
          KAUSHALAM <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-orange-500">2026</span>
        </motion.h1 >

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium"
        >
          Where talent meets innovation in a futuristic fusion of technology, culture, and sports.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center pointer-events-auto"
        >
          <button className="px-8 py-4 bg-white text-black text-lg font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
            Register Now
          </button>
          <button 
            onClick={onExplore}
            className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white text-lg font-black rounded-2xl hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95"
          >
            Explore Events
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce"
      >
        <span className="text-[10px] font-bold tracking-widest uppercase">Scroll to Discover</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};

export default Hero;
