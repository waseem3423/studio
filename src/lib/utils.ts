import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Prayer, PrayerType } from "./types";
import { isToday, isPast } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Prayer end times based on user-provided schedule.
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
  
  // Rule 1: If we are viewing a past date, all prayers are locked.
  if (!isToday(selectedDate)) {
    return {
      isLocked: true,
      status: loggedPrayer ? 'prayed' : 'missed',
    };
  }
  
  // For today's date:
  const now = new Date();
  const [endHour, endMinute] = PRAYER_END_TIMES[prayerName].split(':').map(Number);
  const prayerEndTime = new Date();
  prayerEndTime.setHours(endHour, endMinute, 0, 0);

  const timeHasPassed = isPast(prayerEndTime);

  // Rule 2: Fajr, Maghrib, and Isha can be logged anytime during the current day.
  // Dhuhr and Asr follow strict time locking.
  const canBeLoggedLater = prayerName === 'Fajr' || prayerName === 'Maghrib' || prayerName === 'Isha';

  if (loggedPrayer) {
    // If logged, lock it only if time has passed and it's a strict prayer.
    // Allow editing for flexible prayers.
    return { isLocked: timeHasPassed && !canBeLoggedLater, status: 'prayed' };
  }

  // If not logged yet:
  if (timeHasPassed) {
    // If time has passed, but it's a flexible prayer, allow logging.
    if (canBeLoggedLater) {
      return { isLocked: false, status: 'pending' };
    }
    // For strict prayers (Dhuhr, Asr), lock it and mark as missed.
    return { isLocked: true, status: 'missed' };
  }

  // If time has not passed, it's pending and can be logged.
  return { isLocked: false, status: 'pending' };
}
