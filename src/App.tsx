import { Alert, AlertIcon, AlertTitle, Box, CloseButton, Flex, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import EventForm from './components/EventForm.tsx';
import EventList from './components/EventList.tsx';
import EventView from './components/EventView.tsx';
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
      </Flex>
      <EventList
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredEvents={filteredEvents}
        notifiedEvents={notifiedEvents}
        editEvent={editEvent}
        deleteEvent={deleteEvent}
      />
      {notifications.length > 0 && (
        <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
          {notifications.map((notification, index) => (
            <Alert key={index} status="info" variant="solid" width="auto">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
              </Box>
              <CloseButton
                onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
              />
            </Alert>
          ))}
        </VStack>
      )}
    </Box>
  );
}

export default App;
