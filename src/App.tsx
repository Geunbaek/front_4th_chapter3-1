import { Box, Flex } from '@chakra-ui/react';
import { useState } from 'react';

import EventForm from './components/EventForm.tsx';
import EventList from './components/EventList.tsx';
import EventView from './components/EventView.tsx';
import NotificationList from './components/NotificationList.tsx';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event } from './types';

function App() {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const editEvent = (event: Event) => {
    setEditingEvent(event);
  };

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventForm editingEvent={editingEvent} events={events} onSubmit={saveEvent} />
        <EventView
          view={view}
          setView={setView}
          navigate={navigate}
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          holidays={holidays}
        />
        <EventList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          editEvent={editEvent}
          deleteEvent={deleteEvent}
        />
      </Flex>
      <NotificationList notifications={notifications} setNotifications={setNotifications} />
    </Box>
  );
}

export default App;
