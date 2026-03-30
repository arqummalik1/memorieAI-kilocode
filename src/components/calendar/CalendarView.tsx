'use client';

import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

export function CalendarView({
  events,
  onSelectEvent,
  onSelectSlot,
}: CalendarViewProps) {
  const calendarStyle = useMemo(
    () => ({
      height: 600,
      style: {
        backgroundColor: 'transparent',
      },
    }),
    []
  );

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#6366f1',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      fontSize: '12px',
    },
  });

  return (
    <div className="calendar-dark">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={calendarStyle}
        eventPropGetter={eventStyleGetter}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.MONTH}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        popup
      />
      <style jsx global>{`
        .calendar-dark .rbc-calendar {
          color: #e5e7eb;
        }
        .calendar-dark .rbc-header {
          color: #9ca3af;
          border-bottom: 1px solid #374151;
          padding: 8px;
          font-size: 12px;
          font-weight: 600;
        }
        .calendar-dark .rbc-month-view {
          border: 1px solid #374151;
        }
        .calendar-dark .rbc-day-bg {
          border-color: #374151;
        }
        .calendar-dark .rbc-off-range-bg {
          background: #111827;
        }
        .calendar-dark .rbc-today {
          background: rgba(99, 102, 241, 0.1);
        }
        .calendar-dark .rbc-date-cell {
          color: #9ca3af;
          padding: 4px 8px;
          font-size: 12px;
        }
        .calendar-dark .rbc-date-cell.rbc-now {
          font-weight: bold;
          color: #6366f1;
        }
        .calendar-dark .rbc-toolbar {
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .calendar-dark .rbc-toolbar button {
          color: #9ca3af;
          border: 1px solid #374151;
          background: #1f2937;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
        }
        .calendar-dark .rbc-toolbar button:hover {
          background: #374151;
          color: white;
        }
        .calendar-dark .rbc-toolbar button.rbc-active {
          background: #6366f1;
          color: white;
          border-color: #6366f1;
        }
        .calendar-dark .rbc-toolbar-label {
          color: white;
          font-weight: 600;
        }
        .calendar-dark .rbc-time-view {
          border: 1px solid #374151;
        }
        .calendar-dark .rbc-time-header-content {
          border-color: #374151;
        }
        .calendar-dark .rbc-timeslot-group {
          border-color: #374151;
        }
        .calendar-dark .rbc-time-content {
          border-color: #374151;
        }
        .calendar-dark .rbc-time-slot {
          color: #6b7280;
          font-size: 11px;
        }
        .calendar-dark .rbc-agenda-view {
          color: #e5e7eb;
        }
        .calendar-dark .rbc-agenda-date-cell,
        .calendar-dark .rbc-agenda-time-cell,
        .calendar-dark .rbc-agenda-event-cell {
          border-bottom: 1px solid #374151;
          padding: 8px;
          color: #e5e7eb;
        }
        .calendar-dark .rbc-off-range {
          color: #4b5563;
        }
        .calendar-dark .rbc-row-segment {
          padding: 0 2px;
        }
        .calendar-dark .rbc-show-more {
          color: #6366f1;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}
