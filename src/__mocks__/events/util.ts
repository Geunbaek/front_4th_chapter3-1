import { Event, EventForm } from '../../types';
import { push } from '../../utils/array';

export const makeNewEvent = (events: Event[], eventForm: EventForm): Event => {
  const nextId = (Math.max(...events.map((event) => Number(event.id))) + 1).toString();
  return { id: nextId, ...eventForm };
};

export const addEvent = (events: Event[], newEvent: Event) => {
  return push(events, newEvent);
};
