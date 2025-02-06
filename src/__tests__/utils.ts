import { faker } from '@faker-js/faker';

import { categories, notificationOptions } from '../constants';
import { Event } from '../types';
import { fillZero, formatDate } from '../utils/dateUtils';

export const assertDate = (date1: Date, date2: Date) => {
  expect(date1.toISOString()).toBe(date2.toISOString());
};

export const parseHM = (timestamp: number) => {
  const date = new Date(timestamp);
  const h = fillZero(date.getHours());
  const m = fillZero(date.getMinutes());
  return `${h}:${m}`;
};

export const toHM = (hour: number, minute: number) => {
  const hh = hour.toString().padStart(2, '0');
  const mm = minute.toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

export const getRandomTimeRange = () => {
  const startHour = faker.number.int({ min: 0, max: 20 });
  const startMinute = faker.number.int({ min: 0, max: 59 });

  const duration = faker.number.int({ min: 10, max: 180 });

  const startTotal = startHour * 60 + startMinute;

  const endTotal = startTotal + duration;

  const endHour = Math.floor(endTotal / 60);
  const endMinute = endTotal % 60;

  return {
    startTime: toHM(startHour, startMinute),
    endTime: toHM(endHour, endMinute),
  };
};

export const createRandomEvent = (overwrites: Partial<Event> = {}): Event => {
  const { startTime: randomStartTime, endTime: RandomEndTime } = getRandomTimeRange();

  const {
    id = faker.string.uuid(),
    title = faker.word.noun({ length: { min: 2, max: 5 } }),
    date = formatDate(faker.date.anytime()),
    startTime = randomStartTime,
    endTime = RandomEndTime,
    description = faker.lorem.sentence(),
    location = faker.location.city(),
    category = faker.helpers.arrayElement(categories),
    repeat = {
      type: 'none',
      interval: 0,
    },
    notificationTime = faker.helpers.arrayElement(
      notificationOptions.map((option) => option.value)
    ),
  } = overwrites;

  return {
    id,
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    repeat,
    notificationTime,
  };
};
