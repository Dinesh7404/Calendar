import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';

export function getCalendarDates(month, year) {
  const start = startOfWeek(startOfMonth(new Date(year, month)));
  const end = endOfWeek(endOfMonth(new Date(year, month)));
  const days = [];
  let current = start;

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

export function isToday(date) {
  return isSameDay(date, new Date());
}