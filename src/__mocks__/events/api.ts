import { http, HttpResponse } from 'msw';

import { addEvent, makeNewEvent } from './util';
import { Event, EventForm } from '../../types';

export const getEvents = (mockData: { events: Event[] }) => {
  return http.get('/api/events', () => {
    return HttpResponse.json(mockData);
  });
};

export const createEvent = (mockData: { events: Event[] }) => {
  return http.post('/api/events', async ({ request }) => {
    const eventForm = (await request.json()) as EventForm;

    const newEvent = makeNewEvent(mockData.events, eventForm);
    mockData.events = addEvent(mockData.events, newEvent);

    return HttpResponse.json(mockData);
  });
};

export const updateEvent = (mockData: { events: Event[] }) => {
  return http.put('/api/events/:id', async ({ params, request }) => {
    const { id } = params;
    const foundEvent = mockData.events.find((event) => event.id === id);

    if (!foundEvent) return HttpResponse.json(null, { status: 404 });

    const updatedEventForm = (await request.json()) as EventForm;
    const updatedEvent: Event = { id: id as string, ...updatedEventForm };
    mockData.events = mockData.events.map((event) => (event.id === id ? updatedEvent : event));

    return HttpResponse.json({ event: updatedEvent });
  });
};

export const deleteEvent = (mockData: { events: Event[] }) => {
  return http.delete('/api/events/:id', async ({ params }) => {
    const { id } = params;
    const foundEvent = mockData.events.find((event) => event.id === id);

    if (!foundEvent) return HttpResponse.json(null, { status: 404 });

    mockData.events = mockData.events.filter((event) => event.id !== id);

    return new HttpResponse(null, { status: 201 });
  });
};
