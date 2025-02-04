import { faker } from '@faker-js/faker';

import { Event, EventForm } from '../../types';
import { push } from '../../utils/array';

export const makeNewEvent = (eventForm: EventForm): Event => {
  return { ...eventForm, id: faker.string.uuid() };
};

export const addEvent = (events: Event[], newEvent: Event) => {
  return push(events, newEvent);
};
