// First, install date-fns-tz if you haven't already:

import { format, parse, startOfWeek, getDay } from "date-fns";
import { enNZ } from "date-fns/locale/en-NZ";
import { dateFnsLocalizer } from "react-big-calendar";
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz";
const locales = {
  "en-NZ": enNZ,
};

export const timeZone = "Pacific/Auckland";

// Create a timezone-aware localizer for New Zealand
export const localizer = dateFnsLocalizer({
  format: (date: Date, formatStr: string, culture?: string) => {
    // Format the date in NZ timezone
    return formatInTimeZone(date, timeZone, formatStr, {
      locale: locales[culture as keyof typeof locales] || enNZ,
    });
  },
  parse: (dateStr: string, formatStr: string, culture?: string) => {
    // Parse the date string and convert to UTC
    const parsed = parse(dateStr, formatStr, new Date(), {
      locale: locales[culture as keyof typeof locales] || enNZ,
    });
    // Convert from NZ time to UTC
    return fromZonedTime(parsed, timeZone);
  },
  startOfWeek: (date: Date) => {
    // Get start of week in NZ timezone
    const nzDate = toZonedTime(date, timeZone);
    const startOfWeekNZ = startOfWeek(nzDate, { weekStartsOn: 1 });
    return fromZonedTime(startOfWeekNZ, timeZone);
  },
  getDay: (date: Date) => {
    // Get day of week in NZ timezone
    const nzDate = toZonedTime(date, timeZone);
    return getDay(nzDate);
  },
  locales,
});

// Helper functions for date handling
export const dateHelpers = {
  // Convert UTC date to NZ local time for display
  toNZTime: (utcDate: Date): Date => {
    return toZonedTime(utcDate, timeZone);
  },

  // Convert NZ local time to UTC for storage
  toUTC: (nzDate: Date): Date => {
    return fromZonedTime(nzDate, timeZone);
  },

  // Parse a date string ensuring it's treated correctly
  parseAppointmentDate: (dateInput: string | Date | null | undefined): Date => {
    // Handle null or undefined
    if (!dateInput) {
      return new Date(NaN);
    }
    // If it's already a Date object, return it as is
    if (dateInput instanceof Date) {
      return dateInput;
    }

    // Convert to string if it's not already
    const dateString = String(dateInput);

    // If the string already has timezone info, use it as is
    if (dateString.includes('Z') || dateString.match(/[+-]\d{2}:\d{2}$/)) {
      const date = new Date(dateString);
      return date;
    }

    // If no timezone info, treat as UTC (this is often the case with API responses)
    const date = new Date(dateString + 'Z');
    return date;
  },

  // Format date for API (always send as UTC ISO string)
  formatForAPI: (date: Date): string => {
    return date.toISOString();
  },


};

// Transform appointments data with proper timezone handling
export const transformAppointmentsForCalendar = (appointmentsData: any[]) => {
  if (!appointmentsData) return [];

  return appointmentsData.map((appointment: any) => {
    const startTime = dateHelpers.parseAppointmentDate(appointment.startTime);
    const endTime = dateHelpers.parseAppointmentDate(appointment.endTime);
    return {
      ...appointment,
      startTime,
      endTime,
    };
  });
};

// Helper function for components to convert NZ local time to UTC for API
export const convertNZTimeToUTC = (nzDateTime: Date): Date => {
  const utcDate = fromZonedTime(nzDateTime, timeZone)
  return utcDate
}
