import { supabase } from './supabaseClient';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

export async function getCalendarEvents(
  userId: string,
  timeMin: string,
  timeMax: string
): Promise<CalendarEvent[]> {
  const { data: connection } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!connection?.connected || !connection.access_token) return [];

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${connection.calendar_id}/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
    {
      headers: { Authorization: `Bearer ${connection.access_token}` },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.items || []).map(
    (event: {
      id: string;
      summary: string;
      start: { dateTime?: string };
      end: { dateTime?: string };
      description?: string;
      location?: string;
    }) => ({
      id: event.id,
      title: event.summary || 'Untitled Event',
      start: new Date(event.start.dateTime || ''),
      end: new Date(event.end.dateTime || ''),
      description: event.description,
      location: event.location,
    })
  );
}

export async function createCalendarEvent(
  userId: string,
  event: { title: string; start: string; end: string; description?: string }
): Promise<boolean> {
  const { data: connection } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!connection?.connected || !connection.access_token) return false;

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${connection.calendar_id}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${connection.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.title,
        description: event.description,
        start: { dateTime: event.start },
        end: { dateTime: event.end },
      }),
    }
  );

  return res.ok;
}
