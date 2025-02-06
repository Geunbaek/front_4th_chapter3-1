import { Event } from '../types';
import { createEvent, deleteEvent, getEvents, updateEvent } from './events/api';
import { events } from './response/events.json';

const mockData = {
  events: events as Event[],
};

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  getEvents(mockData),
  createEvent(mockData),
  updateEvent(mockData),
  deleteEvent(mockData),
];
