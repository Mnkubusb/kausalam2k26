
export type EventCategory = 'Technical' | 'Cultural' | 'Sports' | 'Workshops' | 'Fun Events';
export type HomeEventsGridSize =
  | 'auto'
  | 'small'
  | 'wide'
  | 'tall'
  | 'large'
  | 'smaller'
  | 'bigger';

export interface FestEvent {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  longDescription: string;
  eventType?: string;
  prizePool?: string;
  teamSize?: string;
  pointOfContact?: string;
  pointOfContacts?: EventPointOfContact[];
  date: string;
  time: string;
  venue: string;
  image: string;
  icon: string;
  gridSpan: 'small' | 'medium' | 'large';
  homeGridSize?: HomeEventsGridSize;
  homeApproved?: boolean;
  registrationUrl: string;
}

export interface EventPointOfContact {
  name: string;
  phone?: string;
  image?: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  category: string;
  title: string;
  url: string;
  link?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: string;
  image: string;
  links?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    dribbble?: string;
  };
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  title: string;
  venue: string;
  type: string;
}
