export interface Person { name: string; role?: string }
export interface Festival {
  name: string; edition: string; year: number; subtitle?: string;
  school: string; university: string; tagline?: string;
  date?: string; hours?: string; venue?: string; address?: string;
  patron?: Person; chairperson?: Person; logo: string;
  copy: { introWords: string[]; contactHeading: string; contactLine: string };
}
export interface EventItem {
  id: string; name: string; category?: string; poster?: string; icon?: string;
  shortDescription?: string; description?: string; date?: string;
  startTime?: string; endTime?: string; venue?: string; teamSize?: string;
  prize?: string; registrationUrl?: string; rulesUrl?: string; contact?: string;
}
export interface ScheduleItem {
  id: string; eventId?: string; title: string; date: string;
  startTime: string; endTime?: string; venue?: string; category?: string;
}
export interface Contact {
  type: "faculty" | "student" | "general"; name: string; role?: string;
  email?: string; phone?: string; url?: string;
}
