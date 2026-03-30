'use client';

import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: {
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
  } | null;
  isNew?: boolean;
  slotStart?: Date;
  slotEnd?: Date;
}

export function EventModal({
  isOpen,
  onClose,
  event,
  isNew = false,
  slotStart,
  slotEnd,
}: EventModalProps) {
  if (!isOpen) return null;

  const displayEvent = event || {
    title: '',
    start: slotStart || new Date(),
    end: slotEnd || new Date(),
    description: '',
    location: '',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? 'New Event' : displayEvent.title || 'Event Details'}
    >
      {isNew ? (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Event title"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start
              </label>
              <input
                type="datetime-local"
                defaultValue={
                  slotStart ? slotStart.toISOString().slice(0, 16) : ''
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End
              </label>
              <input
                type="datetime-local"
                defaultValue={
                  slotEnd ? slotEnd.toISOString().slice(0, 16) : ''
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Optional description"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>Create Event</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Date & Time</p>
            <p className="text-sm text-gray-200">
              {displayEvent.start.toLocaleDateString()}{' '}
              {displayEvent.start.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              -{' '}
              {displayEvent.end.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {displayEvent.description && (
            <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm text-gray-200">
                {displayEvent.description}
              </p>
            </div>
          )}
          {displayEvent.location && (
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm text-gray-200">{displayEvent.location}</p>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
