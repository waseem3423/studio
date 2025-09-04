import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Prayer, PrayerType } from "./types";
import { isToday, isPast } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Approximate prayer end times for locking logic (24-hour format)
const PRAYER_END_TIMES: Record<PrayerType, string> = {
  Fajr: '05:45',
  Dhuhr: '15:41',
  Asr: '18:29',
  Maghrib: '19:49',
  Isha: '23:59', // End of day
};

/**
 * Determines the status of a prayer based on current time and whether it was logged.
 * @param prayerName The name of the prayer.
 * @param loggedPrayer The logged prayer data, if it exists.
 * @param selectedDate The date being viewed in the app.
 * @returns An object with the prayer's lock status and current status.
 */
export function getPrayerStatus(
  prayerName: PrayerType,
  loggedPrayer: Prayer | undefined,
  selectedDate: Date
): { isLocked: boolean; status: 'prayed' | 'missed' | 'pending' } {
  
  // If we are viewing a past date, all prayers are considered locked.
  if (!isToday(selectedDate)) {
    return {
      isLocked: true,
      status: loggedPrayer ? 'prayed' : 'missed',
    };
  }
  
  // For today's date, check against prayer times.
  const now = new Date();
  const [endHour, endMinute] = PRAYER_END_TIMES[prayerName].split(':').map(Number);
  const prayerEndTime = new Date();
  prayerEndTime.setHours(endHour, endMinute, 0, 0);

  const timeHasPassed = isPast(prayerEndTime);

  if (loggedPrayer) {
    return { isLocked: timeHasPassed, status: 'prayed' };
  }

  if (timeHasPassed) {
    return { isLocked: true, status: 'missed' };
  }

  return { isLocked: false, status: 'pending' };
}
