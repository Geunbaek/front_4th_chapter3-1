import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EventOverlapAlertDialog from '../../components/EventOverlapAlertDialog';
import { createRandomEvent } from '../utils';

const renderWithUser = (...props: Parameters<typeof render>) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(...props),
  };
};

const mockOnSubmit = vi.fn();
const mockClose = vi.fn();

describe('EventOverlapAlertDialog 컴포넌트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('겹치는 일정이 표시되어야 한다', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    renderWithUser(
      <ChakraProvider>
        <EventOverlapAlertDialog
          isOpen={true}
          overlappingEvents={[event]}
          savedEvent={event}
          onConfirm={mockOnSubmit}
          close={mockClose}
        />
      </ChakraProvider>
    );

    // Assert
    expect(await screen.findByText(/일정 겹침 경고/)).toBeInTheDocument();
    expect(
      await screen.findByText(`${event.title} (${event.date} ${event.startTime}-${event.endTime})`)
    ).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 close 함수가 호출되어야 한다', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventOverlapAlertDialog
          isOpen={true}
          overlappingEvents={[event]}
          savedEvent={event}
          onConfirm={mockOnSubmit}
          close={mockClose}
        />
      </ChakraProvider>
    );
    await user.click(screen.getByText(/취소/));

    // Assert
    expect(mockClose).toHaveBeenCalled();
  });

  it('계속 진행 버튼 클릭 시 onConfirm 함수가 호출되어야 한다', async () => {
    // Arrange
    const event = createRandomEvent();

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventOverlapAlertDialog
          isOpen={true}
          overlappingEvents={[event]}
          savedEvent={event}
          onConfirm={mockOnSubmit}
          close={mockClose}
        />
      </ChakraProvider>
    );
    await user.click(await screen.findByText('계속 진행'));

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(event);
    expect(mockClose).toHaveBeenCalled();
  });
});
