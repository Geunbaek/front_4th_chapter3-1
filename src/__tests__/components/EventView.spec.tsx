import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EventView from '../../components/EventView';
import { createRandomEvent } from '../utils';

const renderWithUser = (...props: Parameters<typeof render>) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(...props),
  };
};

const mockSetView = vi.fn();
const mockNavigate = vi.fn();

describe('EventView 컴포넌트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('일정 보기 제목이 정상적으로 표시되어야 한다.', () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    renderWithUser(
      <ChakraProvider>
        <EventView
          view={'month'}
          setView={mockSetView}
          navigate={mockNavigate}
          currentDate={new Date()}
          filteredEvents={[event]}
          notifiedEvents={[event.id]}
          holidays={{}}
        />
      </ChakraProvider>
    );

    // Assert
    expect(screen.getByText('일정 보기')).toBeInTheDocument();
  });

  it('이전 버튼 클릭 시 navigate 함수가 호출되어야 한다.', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventView
          view={'month'}
          setView={mockSetView}
          navigate={mockNavigate}
          currentDate={new Date()}
          filteredEvents={[event]}
          notifiedEvents={[event.id]}
          holidays={{}}
        />
      </ChakraProvider>
    );
    await user.click(screen.getByLabelText('Previous'));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('prev');
  });

  it('다음 버튼 클릭 시 navigate 함수가 호출되어야 한다.', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventView
          view={'month'}
          setView={mockSetView}
          navigate={mockNavigate}
          currentDate={new Date()}
          filteredEvents={[event]}
          notifiedEvents={[event.id]}
          holidays={{}}
        />
      </ChakraProvider>
    );
    await user.click(screen.getByLabelText('Next'));

    // Asser
    expect(mockNavigate).toHaveBeenCalledWith('next');
  });

  it('뷰 변경 시 setView 함수가 호출되어야 한다.', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventView
          view={'month'}
          setView={mockSetView}
          navigate={mockNavigate}
          currentDate={new Date()}
          filteredEvents={[event]}
          notifiedEvents={[event.id]}
          holidays={{}}
        />
      </ChakraProvider>
    );

    await user.selectOptions(screen.getByLabelText('view'), 'week');

    expect(mockSetView).toHaveBeenCalledWith('week');
  });
});
