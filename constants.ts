
import { FestEvent } from './types';

export const COLORS = {
  primary: '#ef4444', // Red-500
  secondary: '#991b1b', // Red-800
  accent: '#f43f5e', // Rose-500
  bg: '#050505',
  cardBg: 'rgba(20, 20, 20, 0.7)',
};

export const EVENTS: FestEvent[] = [
  {
    id: '1',
    name: 'Byte Battles 2.0',
    category: 'Technical',
    description: 'The ultimate 24-hour coding marathon.',
    longDescription: 'Collaborate with top developers to build innovative solutions for real-world problems. Mentorship and high-stakes prizes await.',
    date: 'March 12, 2026',
    time: '10:00 AM onwards',
    venue: 'Computing Lab A',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop',
    icon: 'Code',
    gridSpan: 'large',
    registrationUrl: 'https://forms.gle/dummy1'
  },
  {
    id: '2',
    name: 'Symphony of Souls',
    category: 'Cultural',
    description: 'A grand musical extravaganza.',
    longDescription: 'Witness solo and band performances from across the state. A night dedicated to the rhythm of life.',
    date: 'March 13, 2026',
    time: '6:00 PM',
    venue: 'Main Auditorium',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a7439?q=80&w=1964&auto=format&fit=crop',
    icon: 'Music',
    gridSpan: 'medium',
    registrationUrl: 'https://forms.gle/dummy2'
  },
  {
    id: '3',
    name: 'Robo Rumble',
    category: 'Technical',
    description: 'Metal clashing with metal.',
    longDescription: 'Watch custom-built robots fight for supremacy in our high-tech arena.',
    date: 'March 14, 2026',
    time: '2:00 PM',
    venue: 'Arena 1',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
    icon: 'Cpu',
    gridSpan: 'medium',
    registrationUrl: 'https://forms.gle/dummy3'
  },
  {
    id: '4',
    name: 'Cyber Strike',
    category: 'Fun Events',
    description: 'Competitive e-sports tournament.',
    longDescription: 'Valorant and CS2 tournaments with pro-level casting and exciting prizes.',
    date: 'March 12-13, 2026',
    time: '9:00 AM',
    venue: 'Gaming Zone',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    icon: 'Gamepad2',
    gridSpan: 'small',
    registrationUrl: 'https://forms.gle/dummy4'
  },
  {
    id: '5',
    name: 'Lens Flare',
    category: 'Cultural',
    description: 'Photography contest for visual storytellers.',
    longDescription: 'Capture the essence of Kaushalam 2026 through your lens and get featured in our annual gallery.',
    date: 'Full Fest',
    time: 'All Day',
    venue: 'Campus-wide',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop',
    icon: 'Camera',
    gridSpan: 'small',
    registrationUrl: 'https://forms.gle/dummy5'
  },
  {
    id: '6',
    name: 'AI Workshop',
    category: 'Pre Events',
    description: 'Master the future of GenAI.',
    longDescription: 'Hands-on training session with industry experts on LLMs and diffusion models.',
    date: 'March 14, 2026',
    time: '11:00 AM',
    venue: 'Seminar Hall B',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    icon: 'BrainCircuit',
    gridSpan: 'medium',
    registrationUrl: 'https://forms.gle/dummy6'
  },
  {
    id: '7',
    name: 'Artistic Echoes',
    category: 'Cultural',
    description: 'Live painting and graffiti contest.',
    longDescription: 'Expression without limits on a canvas that spans the length of the hall.',
    date: 'March 13, 2026',
    time: '1:00 PM',
    venue: 'Open Plaza',
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1974&auto=format&fit=crop',
    icon: 'Palette',
    gridSpan: 'small',
    registrationUrl: 'https://forms.gle/dummy7'
  },
  {
    id: '8',
    name: 'Treasure Trail',
    category: 'Fun Events',
    description: 'A campus-wide clue hunt packed with twists.',
    longDescription: 'Team up and race across checkpoints, solve riddles, and unlock bonus challenges to reach the final treasure first.',
    date: 'March 13, 2026',
    time: '11:30 AM',
    venue: 'Central Lawn',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2070&auto=format&fit=crop',
    icon: 'Trophy',
    gridSpan: 'medium',
    registrationUrl: 'https://forms.gle/dummy8'
  },
  {
    id: '9',
    name: 'Neon Relay',
    category: 'Fun Events',
    description: 'A high-energy relay with unexpected mini tasks.',
    longDescription: 'Sprint, balance, and puzzle your way through a glow-themed relay built for speed, teamwork, and laughter.',
    date: 'March 14, 2026',
    time: '4:00 PM',
    venue: 'Sports Ground',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop',
    icon: 'Gamepad2',
    gridSpan: 'small',
    registrationUrl: 'https://forms.gle/dummy9'
  },
  {
    id: '10',
    name: 'Meme Royale',
    category: 'Fun Events',
    description: 'Live meme-making showdown for creators.',
    longDescription: 'Participants get surprise prompts and limited time to craft the funniest, sharpest memes in front of a live crowd.',
    date: 'March 12, 2026',
    time: '3:30 PM',
    venue: 'Open Mic Arena',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
    icon: 'Palette',
    gridSpan: 'small',
    registrationUrl: 'https://forms.gle/dummy10'
  },
];

export const TEAM_MEMBERS = [
  {
    id: 't1',
    name: 'Dr. Aryan Sharma',
    role: 'Faculty Coordinator',
    category: 'Core',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#', twitter: '#' }
  },
  {
    id: 't2',
    name: 'Sneha Reddy',
    role: 'Student Head',
    category: 'Core',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#', twitter: '#' }
  },
  {
    id: 't3',
    name: 'Vikram Malhotra',
    role: 'Technical Lead',
    category: 'Technical',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#', github: '#' }
  },
  {
    id: 't4',
    name: 'Ishita Kapoor',
    role: 'Cultural Head',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#', instagram: '#' }
  },
  {
    id: 't5',
    name: 'Rohan Gupta',
    role: 'Design Lead',
    category: 'Creative',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#', dribbble: '#' }
  },
  {
    id: 't6',
    name: 'Ananya Verma',
    role: 'Marketing Head',
    category: 'Publicity',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#', twitter: '#' }
  },
  {
    id: 't7',
    name: 'Kabir Das',
    role: 'Event Manager',
    category: 'Operations',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#' }
  },
  {
    id: 't8',
    name: 'Meera Iyer',
    role: 'Finance Head',
    category: 'Operations',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop',
    links: { linkedin: '#' }
  }
];
