
export type EventCategory = 'Technical' | 'Cultural' | 'Sports' | 'Workshops';

export interface FestEvent {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  icon: string;
  gridSpan: 'small' | 'medium' | 'large';
  registrationUrl: string;
}

export type TeamCategory = 'Core' | 'Technical' | 'Cultural' | 'Creative' | 'Publicity' | 'Operations';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: TeamCategory;
  image: string;
  links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    dribbble?: string;
  };
}

export interface GalleryMedia {
  id: string;
  type: 'image' | 'video';
  category: string;
  title: string;
  url: string;
  link?: string;
  eventId?: string; // Photos linked to events
}

export interface ScheduleEvent {
  id: string;
  day: string; // 'Day 1', 'Day 2', etc.
  time: string; // "09:00 AM"
  title: string;
  venue: string;
  type: string;
}
