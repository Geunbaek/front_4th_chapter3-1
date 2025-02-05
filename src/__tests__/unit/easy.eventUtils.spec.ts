import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';
import { createRandomEvent } from '../utils';

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-02-02',
      title: '이벤트 2',
    });
    const event2 = createRandomEvent({
      date: '2024-02-05',
      description: '이벤트 2',
    });
    const event3 = createRandomEvent({
      date: '2024-02-07',
    });

    // Act
    const filteredEvents = getFilteredEvents(
      [event1, event2, event3],
      '이벤트 2',
      new Date('2024-02-11'),
      'month'
    );

    //  Assert
    expect(filteredEvents).toMatchObject([event1, event2]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-02',
    });
    const event2 = createRandomEvent({
      date: '2024-07-03',
    });
    const event3 = createRandomEvent({
      date: '2024-07-28',
    });

    // Act
    const filteredEvents = getFilteredEvents(
      [event1, event2, event3],
      '',
      new Date('2024-07-01'),
      'week'
    );

    // Assert
    expect(filteredEvents).toMatchObject([event1, event2]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-02',
    });
    const event2 = createRandomEvent({
      date: '2024-07-03',
    });
    const event3 = createRandomEvent({
      date: '2024-07-28',
    });
    const event4 = createRandomEvent({
      date: '2024-08-02',
    });

    // Act
    const filteredEvents = getFilteredEvents(
      [event1, event2, event3, event4],
      '',
      new Date('2024-07-01'),
      'month'
    );

    // Assert
    expect(filteredEvents).toMatchObject([event1, event2, event3]);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-02',
      title: '이벤트 2',
    });
    const event2 = createRandomEvent({
      date: '2024-07-03',
      description: '이벤트 2',
    });
    const event3 = createRandomEvent({
      date: '2024-07-04',
      title: '이벤트 1',
    });
    const event4 = createRandomEvent({
      date: '2024-07-28',
      title: '이벤트 2',
    });
    const event5 = createRandomEvent({
      date: '2024-08-02',
    });

    // Act
    const filteredEvents = getFilteredEvents(
      [event1, event2, event3, event4, event5],
      '이벤트 2',
      new Date('2024-07-01'),
      'week'
    );

    // Assert
    expect(filteredEvents).toMatchObject([event1, event2]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-02',
      title: '이벤트 2',
    });
    const event2 = createRandomEvent({
      date: '2024-07-03',
      description: '이벤트 2',
    });
    const event3 = createRandomEvent({
      date: '2024-07-04',
      title: '이벤트 1',
    });
    const event4 = createRandomEvent({
      date: '2024-07-28',
      title: '이벤트 2',
    });

    // Act
    const filteredEvents = getFilteredEvents(
      [event1, event2, event3, event4],
      '',
      new Date('2024-07-01'),
      'month'
    );

    // Assert
    expect(filteredEvents).toMatchObject([event1, event2, event3, event4]);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-02',
      title: 'ABC',
    });
    const event2 = createRandomEvent({
      date: '2024-07-03',
      description: 'abc',
    });

    // Act
    const filteredEvents = getFilteredEvents(
      [event1, event2],
      'abc',
      new Date('2024-07-01'),
      'month'
    );

    // Assert
    expect(filteredEvents).toMatchObject([event1, event2]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-01',
    });
    const event2 = createRandomEvent({
      date: '2024-06-30',
    });

    // Act
    const filteredEvents = getFilteredEvents([event1, event2], '', new Date('2024-06-30'), 'month');

    // Assert
    expect(filteredEvents).toMatchObject([event2]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    // Arrange
    const events = [] as Event[];

    // Act
    const filteredEvents = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');

    // Assert
    expect(filteredEvents).toMatchObject([]);
  });
});
