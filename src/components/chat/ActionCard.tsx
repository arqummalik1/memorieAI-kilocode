'use client';

interface ActionCardProps {
  type: 'reminder' | 'list_item' | 'calendar_event' | 'note';
  data: Record<string, unknown>;
}

export function ActionCard({ type, data }: ActionCardProps) {
  if (type === 'reminder') {
    return (
      <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-3 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span>⏰</span>
          <span className="text-sm font-medium text-violet-300">Reminder Set</span>
        </div>
        <p className="text-sm text-gray-300">{String(data.title || '')}</p>
        {data.datetime ? (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(String(data.datetime)).toLocaleString()}
          </p>
        ) : null}
      </div>
    );
  }

  if (type === 'list_item') {
    return (
      <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span>📝</span>
          <span className="text-sm font-medium text-green-300">List Updated</span>
        </div>
        <p className="text-sm text-gray-300">
          &quot;{String(data.item_text || '')}&quot; added to {String(data.list_name || '')}
        </p>
      </div>
    );
  }

  if (type === 'calendar_event') {
    return (
      <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span>📅</span>
          <span className="text-sm font-medium text-blue-300">Event Created</span>
        </div>
        <p className="text-sm text-gray-300">{String(data.title || '')}</p>
        {data.datetime ? (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(String(data.datetime)).toLocaleString()}
          </p>
        ) : null}
      </div>
    );
  }

  if (type === 'note') {
    return (
      <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span>📌</span>
          <span className="text-sm font-medium text-yellow-300">Note Saved</span>
        </div>
        <p className="text-sm text-gray-300 line-clamp-2">{String(data.content || '')}</p>
      </div>
    );
  }

  return null;
}
