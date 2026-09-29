import type { ScheduleItem } from "./types";

// Transcribed from public/assets/schedule/schedule.pdf — the official run-of-show.
// All slots are on the fest day; row-spanning cells in the PDF are flattened here
// into one item per (club/society × venue) with its full time range.
const DAY = "October 1, 2026";

export const schedule: ScheduleItem[] = [
  { id: "inauguration", title: "Inauguration", date: DAY, startTime: "10:00 AM", endTime: "10:45 AM", venue: "All venues" },
  { id: "cold", title: "COLD", date: DAY, startTime: "11:00 AM", endTime: "12:00 PM", venue: "JC Bose" },
  { id: "volt", title: "VOLT", date: DAY, startTime: "11:00 AM", endTime: "1:00 PM", venue: "Janki Ammal" },
  { id: "ephirium", title: "EPHIRIUM", date: DAY, startTime: "11:00 AM", endTime: "1:00 PM", venue: "Ramanujan" },
  { id: "mc2", title: "MC2", date: DAY, startTime: "12:00 PM", endTime: "1:00 PM", venue: "JC Bose" },
  { id: "abhinay-chits", title: "ABHINAY (Chits)", date: DAY, startTime: "12:00 PM", endTime: "1:00 PM", venue: "Committee Room" },
  { id: "lunch", title: "Lunch", date: DAY, startTime: "1:00 PM", endTime: "2:00 PM", venue: "All venues" },
  { id: "uav", title: "UAV", date: DAY, startTime: "2:00 PM", endTime: "3:30 PM", venue: "JC Bose" },
  { id: "loop", title: "LOOP", date: DAY, startTime: "2:00 PM", endTime: "4:00 PM", venue: "Janki Ammal" },
  { id: "drushyam-start", title: "DRUSHYAM (Start)", date: DAY, startTime: "2:00 PM", endTime: "2:30 PM", venue: "Ramanujan" },
  { id: "drushyam", title: "DRUSHYAM", date: DAY, startTime: "2:00 PM", endTime: "5:30 PM", venue: "Committee Room" },
  { id: "antariksh", title: "ANTARIKSH", date: DAY, startTime: "2:30 PM", endTime: "4:00 PM", venue: "Ramanujan" },
  { id: "megawhats", title: "MEGAWHATS", date: DAY, startTime: "3:30 PM", endTime: "5:30 PM", venue: "JC Bose" },
  { id: "perspectives", title: "PERSPECTIVES", date: DAY, startTime: "4:00 PM", endTime: "5:30 PM", venue: "Janki Ammal" },
  { id: "phoenix", title: "PHOENIX", date: DAY, startTime: "4:00 PM", endTime: "5:30 PM", venue: "Ramanujan" },
  { id: "cultural-club", title: "CULTURAL CLUB (ABHINAY + BANDISH)", date: DAY, startTime: "5:30 PM", endTime: "7:30 PM", venue: "JC Bose" },
  { id: "gdgc", title: "GDGC", date: DAY, startTime: "5:30 PM", endTime: "7:30 PM", venue: "Janki Ammal" },
  { id: "derobotica", title: "DEROBOTICA", date: DAY, startTime: "5:30 PM", endTime: "7:30 PM", venue: "Ramanujan" },
];
