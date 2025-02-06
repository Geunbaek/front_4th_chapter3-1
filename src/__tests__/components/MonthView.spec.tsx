import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MonthView from '../../components/MonthView';
import { createRandomEvent } from '../utils';

const renderWithUser = (...props: Parameters<typeof render>) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(...props),
  };
};

describe('MonthView', () => {
  it('월 제목이 정상적으로 표시되어야 한다.', () => {
    // Act
    renderWithUser(
      <ChakraProvider>
        <MonthView
          currentDate={new Date('2025-02-01')}
          holidays={{ '2025-02-10': '공휴일' }}
          filteredEvents={[]}
          notifiedEvents={[]}
        />
      </ChakraProvider>
    );

    // Assert
    expect(screen.getByText('2025년 2월')).toBeInTheDocument();
  });

  it('요일 헤더가 정상적으로 렌더링되어야 한다.', () => {
    // Act
    renderWithUser(
      <ChakraProvider>
        <MonthView
          currentDate={new Date('2025-02-01')}
          holidays={{}}
          filteredEvents={[]}
          notifiedEvents={[]}
        />
      </ChakraProvider>
    );

    // Assert
    ['일', '월', '화', '수', '목', '금', '토'].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('이벤트가 정상적으로 표시되어야 한다.', () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    renderWithUser(
      <ChakraProvider>
        <MonthView
          currentDate={new Date('2025-02-01')}
          holidays={{}}
          filteredEvents={[event]}
          notifiedEvents={[]}
        />
      </ChakraProvider>
    );

    // Assert
    expect(screen.getByText(`${event.title}`)).toBeInTheDocument();
  });

  it('공휴일이 정상적으로 표시되어야 한다.', () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    renderWithUser(
      <ChakraProvider>
        <MonthView
          currentDate={new Date('2025-02-01')}
          holidays={{ '2025-02-10': '공휴일' }}
          filteredEvents={[event]}
          notifiedEvents={[]}
        />
      </ChakraProvider>
    );

    // Assert
    expect(screen.getByText('공휴일')).toBeInTheDocument();
  });
});
