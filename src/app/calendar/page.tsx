'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventModal } from '@/components/calendar/EventModal';
import { Button } from '@/components/shared/Button';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [events] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [slotStart, setSlotStart] = useState<Date | undefined>();
  const [slotEnd, setSlotEnd] = useState<Date | undefined>();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=login');
    }
  }, [user, loading, router]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedEvent(null);
    setSlotStart(slotInfo.start);
    setSlotEnd(slotInfo.end);
    setShowModal(true);
  };

  if (loading || !user) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            {events.length === 0
              ? 'Connect Google Calendar to see events'
              : `${events.length} events`}
          </p>
        </div>
        <Button onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })}>
          <Plus className="w-4 h-4 mr-1" />
          New Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            No calendar connected
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Connect Google Calendar to see your events here
          </p>
          <Button>Connect Google Calendar</Button>
        </div>
      ) : (
        <CalendarView
          events={events}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      )}

      <EventModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        isNew={!selectedEvent}
        slotStart={slotStart}
        slotEnd={slotEnd}
      />
    </div>
  );
}
