import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';
import { createRandomEvent } from '../utils';

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '12:10',
      endTime: '13:00',
      notificationTime: 10,
    });
    const event2 = createRandomEvent({
      date: '2024-07-10',
      startTime: '13:00',
      endTime: '14:00',
      notificationTime: 60,
    });
    const event3 = createRandomEvent({
      date: '2024-07-10',
      startTime: '14:00',
      endTime: '15:00',
      notificationTime: 120,
    });
    const date = new Date('2024-07-10T12:00');

    // Act
    const upcomingEvents = getUpcomingEvents([event1, event2, event3], date, []);

    // Assert
    expect(upcomingEvents).toEqual([event1, event2, event3]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '12:10',
      endTime: '13:00',
      notificationTime: 10,
    });
    const event2 = createRandomEvent({
      date: '2024-07-10',
      startTime: '13:00',
      endTime: '14:00',
      notificationTime: 60,
    });
    const event3 = createRandomEvent({
      date: '2024-07-10',
      startTime: '14:00',
      endTime: '15:00',
      notificationTime: 120,
    });
    const date = new Date('2024-07-10T12:00');

    // Act
    const upcomingEvents = getUpcomingEvents([event1, event2, event3], date, [event1.id]);

    // Assert
    expect(upcomingEvents).toEqual([event2, event3]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '12:10',
      endTime: '13:00',
      notificationTime: 10,
    });
    const event2 = createRandomEvent({
      date: '2024-07-10',
      startTime: '13:00',
      endTime: '14:00',
      notificationTime: 60,
    });
    const event3 = createRandomEvent({
      date: '2024-07-10',
      startTime: '14:00',
      endTime: '15:00',
      notificationTime: 60,
    });
    const date = new Date('2024-07-10T12:00');

    // Act
    const upcomingEvents = getUpcomingEvents([event1, event2, event3], date, []);

    // Assert
    expect(upcomingEvents).toEqual([event1, event2]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '12:00',
      endTime: '13:00',
      notificationTime: 10,
    });
    const event2 = createRandomEvent({
      date: '2024-07-10',
      startTime: '13:00',
      endTime: '14:00',
      notificationTime: 60,
    });
    const event3 = createRandomEvent({
      date: '2024-07-10',
      startTime: '14:00',
      endTime: '15:00',
      notificationTime: 60,
    });
    const date = new Date('2024-07-10T12:00');

    // Act
    const upcomingEvents = getUpcomingEvents([event1, event2, event3], date, []);

    // Assert
    expect(upcomingEvents).toEqual([event2]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-10',
      startTime: '12:00',
      endTime: '13:00',
      notificationTime: 10,
    });

    // Act
    const notificationMessage = createNotificationMessage(event1);

    // Assert
    expect(notificationMessage).toBe(
      `${event1.notificationTime}분 후 ${event1.title} 일정이 시작됩니다.`
    );
  });
});
