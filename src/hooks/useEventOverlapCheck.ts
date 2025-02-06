import { useState } from 'react';

import { Event, EventForm } from '../types';
import { findOverlappingEvents } from '../utils/eventOverlap';

function useEventOverlapCheck(events: Event[]) {
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const checkOverlap = (newEvent: Event | EventForm) => {
    const overlaps = findOverlappingEvents(newEvent, events);
    setOverlappingEvents(overlaps);
    return overlaps.length > 0;
  };

  return { overlappingEvents, checkOverlap };
}

export default useEventOverlapCheck;
