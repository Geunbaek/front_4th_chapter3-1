import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EventForm from '../../components/EventForm';
import { createRandomEvent } from '../utils';

const mockOnSubmit = vi.fn();

const renderWithUser = (...props: Parameters<typeof render>) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(...props),
  };
};

describe('EventForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('필수 입력값을 입력하지 않으면 오류 메시지를 표시한다', async () => {
    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventForm editingEvent={null} events={[]} onSubmit={mockOnSubmit} />
      </ChakraProvider>
    );
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    // Assert
    expect(await screen.findByText(/필수 정보를 모두 입력해주세요./)).toBeInTheDocument();
  });

  it('시작 시간과 종료 시간이 올바르지 않으면 오류 메시지를 표시힌디', async () => {
    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventForm editingEvent={null} events={[]} onSubmit={mockOnSubmit} />
      </ChakraProvider>
    );
    await user.type(screen.getByLabelText('제목'), '회의');
    await user.type(screen.getByLabelText('날짜'), '2025-02-07');
    await user.type(screen.getByLabelText('시작 시간'), '15:00');
    await user.type(screen.getByLabelText('종료 시간'), '14:00');
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    // Assert
    expect(await screen.findByText(/시간 설정을 확인해주세요./)).toBeInTheDocument();
  });

  it('중복되는 일정이 있을 경우 알림 표시한다', async () => {
    // Arrange
    const event = createRandomEvent({
      date: '2024-10-10',
      startTime: '13:00',
      endTime: '14:00',
    });

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventForm editingEvent={null} events={[event]} onSubmit={mockOnSubmit} />
      </ChakraProvider>
    );
    await user.type(screen.getByLabelText('제목'), '회의');
    await user.type(screen.getByLabelText('날짜'), '2024-10-10');
    await user.type(screen.getByLabelText('시작 시간'), '13:00');
    await user.type(screen.getByLabelText('종료 시간'), '14:00');
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    // Assert
    expect(await screen.findByText(/일정 겹침 경고/)).toBeInTheDocument();
  });

  it('정상적인 입력값으로 제출하면 onSubmit이 호출된다', async () => {
    // Arrange
    const event = createRandomEvent({
      id: undefined,
      date: '2024-10-10',
      startTime: '13:00',
      endTime: '14:00',
      notificationTime: 10,
    });

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventForm editingEvent={null} events={[]} onSubmit={mockOnSubmit} />
      </ChakraProvider>
    );
    await user.type(screen.getByLabelText('제목'), event.title);
    await user.type(screen.getByLabelText('날짜'), event.date);
    await user.type(screen.getByLabelText('시작 시간'), event.startTime);
    await user.type(screen.getByLabelText('종료 시간'), event.endTime);
    await user.type(screen.getByLabelText('설명'), event.description);
    await user.type(screen.getByLabelText('위치'), event.location);
    await user.selectOptions(screen.getByLabelText('카테고리'), event.category);
    await user.selectOptions(screen.getByLabelText('알림 설정'), '10분 전');
    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    // Assert
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('아무런 입력 없이 제출하면 onSubmit 이 호출되지 않는다', async () => {
    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <EventForm editingEvent={null} events={[]} onSubmit={mockOnSubmit} />
      </ChakraProvider>
    );

    await user.click(screen.getByRole('button', { name: /일정 추가/ }));

    // Assert
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
