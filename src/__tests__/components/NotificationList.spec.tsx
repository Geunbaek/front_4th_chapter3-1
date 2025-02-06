import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NotificationList from '../../components/NotificationList';

const renderWithUser = (...props: Parameters<typeof render>) => {
  const user = userEvent.setup();
  return {
    user,
    ...render(...props),
  };
};

const mockSetNotifications = vi.fn();

describe('NotificationList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('알림이 정상적으로 표시 되어야한다.', () => {
    // Arrange
    const notifications = [{ id: '1', message: '테스트 알림' }];

    // Act
    renderWithUser(
      <ChakraProvider>
        <NotificationList notifications={notifications} setNotifications={mockSetNotifications} />
      </ChakraProvider>
    );

    // Assert
    expect(screen.getByText('테스트 알림')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 알림이 삭제되어야 한다.', async () => {
    // Arrange
    const notifications = [{ id: '1', message: '테스트 알림' }];

    // Act
    const { user } = renderWithUser(
      <ChakraProvider>
        <NotificationList notifications={notifications} setNotifications={mockSetNotifications} />
      </ChakraProvider>
    );

    await user.click(screen.getByRole('button'));
    expect(mockSetNotifications).toHaveBeenCalled();
  });
});
