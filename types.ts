
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
