/** Converts a 24-hour "HH:MM" string (as produced by `<input type="time">`) into a 12-hour "H:MM AM/PM" display string. */
export function formatAMPM(time24: string): string {
  const parts = time24.split(':');
  let hours = parseInt(parts[0] || '0');
  const minutes = parseInt(parts[1] || '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

/** Converts a "H:MM AM/PM" display string back into a 24-hour "HH:MM" string for `<input type="time">`. */
export function parseAMPMToInputTime(ampmStr: string): string {
  const match = ampmStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "12:00";
  const [, hh, mm, ampm] = match;
  let hours = parseInt(hh, 10);
  if (ampm.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${mm}`;
}

/** Minutes since midnight for a "H:MM AM/PM" string, for chronological sorting (plain string comparison sorts "02:03 PM" before "07:30 AM"). */
export function timeToMinutes(ampmStr: string): number {
  const [hh, mm] = parseAMPMToInputTime(ampmStr).split(':').map(Number);
  return hh * 60 + mm;
}
