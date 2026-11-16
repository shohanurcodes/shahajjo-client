export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Winter Relief",
  "Food Drive",
  "Awareness",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface AttendeeSummary {
  name: string;
  image?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  date: string;
  createdById: string;
  createdByEmail: string;
  createdByName: string;
  createdAt: string | null;
  updatedAt: string | null;
  attendeeCount: number;
  attendees: AttendeeSummary[];
  isJoined: boolean;
  isOwner: boolean;
  joinedAt: string | null;
}

export interface EventPayload {
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  date: string;
}

export interface ProfileStats {
  eventsCreated: number;
  eventsJoined: number;
  upcomingJoined: number;
}

export interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string>;
}

export interface EventsResponse {
  events: EventItem[];
  count: number;
}

export interface EventResponse {
  event: EventItem;
  message?: string;
}

export interface JoinResponse {
  message: string;
  joined: boolean;
  attendeeCount: number;
}

export interface StatsResponse {
  stats: ProfileStats;
}
