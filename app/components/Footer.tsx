
import React from 'react';
import { Instagram, Twitter, Linkedin, Facebook, MapPin, Mail, Phone, Shield } from 'lucide-react';
import { type Page } from '../ClientApp';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black/40 border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl">
               <img src="/logo.webp" alt="logo" className='w-full h-full object-contain' />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black font-space leading-none">KAUSHALAM</span>
              <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">GEC Bilaspur</span>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed mb-6">
            The flagship annual college festival of Government Engineering College Bilaspur. A testament to engineering, creativity, and the pursuit of excellence.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="p-2.5 bg-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-white/10 transition-all">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black mb-6 text-white tracking-widest text-sm uppercase">Quick Links</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li><button onClick={() => onNavigate('home')} className="hover:text-red-500 transition-colors">Home</button></li>
            <li><button onClick={() => onNavigate('events')} className="hover:text-red-500 transition-colors">Events</button></li>
            <li><button onClick={() => onNavigate('schedule')} className="hover:text-red-500 transition-colors">Schedule</button></li>
            <li><button onClick={() => onNavigate('team')} className="hover:text-red-500 transition-colors">Core Team</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-6 text-white tracking-widest text-sm uppercase">Support</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li><button onClick={() => onNavigate('help')} className="hover:text-red-500 transition-colors">Help Center</button></li>
            <li><button onClick={() => onNavigate('privacy')} className="hover:text-red-500 transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('terms')} className="hover:text-red-500 transition-colors">Terms of Service</button></li>
            <li><button onClick={() => onNavigate('cookies')} className="hover:text-red-500 transition-colors">Cookie Policy</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black mb-6 text-white tracking-widest text-sm uppercase">Contact GECB</h4>
          <ul className="space-y-4 text-gray-400 font-medium">
            <li className="flex items-start gap-3">
              <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
              <span>GEC Bilaspur Campus, Koni, Bilaspur, Chhattisgarh - 495009</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={20} className="text-red-600 flex-shrink-0" />
              <span>kaushalam@gecbps.ac.in</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={20} className="text-red-600 flex-shrink-0" />
              <span>+91 7752 260333</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
        <div className="flex flex-col gap-1">
          <p>&copy; 2026 Kaushalam. Hosted by GEC Bilaspur. All rights reserved.</p>
          <p className="text-[10px] tracking-widest uppercase font-bold text-gray-600">
            Designed & Developed by <span className="text-red-500/80">Manik Chand Sahu</span>
          </p>
        </div>
        <button 
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 hover:text-red-500 transition-colors opacity-50 hover:opacity-100"
        >
          <Shield size={14} /> Management Access
        </button>
      </div>
    </footer>
  );
};

export default Footer;
