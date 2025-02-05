import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { createNotificationMessage } from '../../utils/notificationUtils.ts';
import { createRandomEvent } from '../utils.ts';

describe('useNotifications', () => {
  beforeEach(() => {
    const now = new Date('2024-07-10T13:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기 상태에서는 알림이 없어야 한다', async () => {
    // Arrange
    const event1 = createRandomEvent();

    // Act
    const { result } = renderHook(() => useNotifications([event1]));

    // Assert
    expect(result.current.notifications).toEqual([]);
  });

  it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '13:10',
      endTime: '14:00',
      notificationTime: 10,
    });
    const event2 = createRandomEvent({
      date: '2024-07-10',
      startTime: '14:10',
      endTime: '15:00',
      notificationTime: 10,
    });

    // Act
    const { result } = renderHook(() => useNotifications([event1, event2]));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Assert
    expect(result.current.notifications).toEqual([
      { id: event1.id, message: createNotificationMessage(event1) },
    ]);
  });

  it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '13:10',
      endTime: '14:00',
      notificationTime: 10,
    });
    const event2 = createRandomEvent({
      date: '2024-07-10',
      startTime: '14:10',
      endTime: '15:00',
      notificationTime: 10,
    });

    // Act
    const { result } = renderHook(() => useNotifications([event1, event2]));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.removeNotification(0);
    });

    // Assert
    expect(result.current.notifications).toEqual([]);
  });

  it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '13:10',
      endTime: '14:00',
      notificationTime: 10,
    });
    const event2 = createRandomEvent({
      date: '2024-07-10',
      startTime: '14:10',
      endTime: '15:00',
      notificationTime: 10,
    });

    // Act
    const { result } = renderHook(() => useNotifications([event1, event2]));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Assert
    expect(result.current.notifiedEvents).toEqual([event1.id]);
  });
});
