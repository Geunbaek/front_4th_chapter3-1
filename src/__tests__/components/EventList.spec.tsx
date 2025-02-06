import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, vi, expect } from 'vitest';

import EventList from '../../components/EventList';
import { createRandomEvent } from '../utils';

const mockEditEvent = vi.fn();
const mockDeleteEvent = vi.fn();

const renderWithUser = (...props: Parameters<typeof render>) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(...props),
  };
};

describe('EventList 컴포넌트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('검색어가 없으면 이벤트 목록이 정상적으로 렌더링되어야 한다..', () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    renderWithUser(
      <ChakraProvider>
        <EventList
          searchTerm={''}
          setSearchTerm={vi.fn()}
          filteredEvents={[event]}
          notifiedEvents={[event.id]}
          editEvent={mockEditEvent}
          deleteEvent={mockDeleteEvent}
        />
      </ChakraProvider>
    );

    // Assert
    expect(screen.getByLabelText(/일정 검색/)).toBeInTheDocument();
    expect(screen.getByTestId(`event-${event.id}`)).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 editEvent 함수가 호출되어야 한다', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventList
          searchTerm={''}
          setSearchTerm={vi.fn()}
          filteredEvents={[event]}
          notifiedEvents={[event.id]}
          editEvent={mockEditEvent}
          deleteEvent={mockDeleteEvent}
        />
      </ChakraProvider>
    );
    await user.click(screen.getByLabelText(/Edit event/));

    // Assert
    expect(mockEditEvent).toHaveBeenCalledWith(event);
  });

  it('삭제 버튼 클릭 시 deleteEvent 함수가 호출되어야 한다', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventList
          searchTerm={''}
          setSearchTerm={vi.fn()}
          filteredEvents={[event]}
          notifiedEvents={[event.id]}
          editEvent={mockEditEvent}
          deleteEvent={mockDeleteEvent}
        />
      </ChakraProvider>
    );
    await user.click(screen.getByLabelText(/Delete event/));

    // Assert
    expect(mockDeleteEvent).toHaveBeenCalledWith(event.id);
  });
});
