import { Event, EventForm } from '../../types';

export const fetchEvents = async () => {
  const response = await fetch('/api/events');
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  const { events } = await response.json();
  return events;
};

export const addEvent = async (eventForm: EventForm) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventForm),
  });
  if (!response.ok) {
    throw new Error('Failed to add event');
  }
  const newEvent = await response.json();
  return newEvent;
};

export const updateEvent = async (event: Event) => {
  const response = await fetch(`/api/events/${event.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error('Failed to add event');
  }
  const updatedEvent = await response.json();
  return updatedEvent;
};

export const deleteEvent = async (id: string) => {
  const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
};
