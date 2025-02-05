import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';
import { createRandomEvent } from '../utils';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    // Arrange
    const date = '2024-07-01';
    const time = '14:30';

    // Act
    const parsedDateTime = parseDateTime(date, time);

    // Assert
    expect(parsedDateTime).toEqual(new Date('2024-07-01T14:30'));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    // Arrange
    const date = '2024::07::01';
    const time = '14:30';

    // Act
    const parsedDateTime = parseDateTime(date, time);

    //  Assert
    expect(parsedDateTime.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    // Arrange
    const date = '2024-07-01';
    const time = '14::30';

    // Act
    const parsedDateTime = parseDateTime(date, time);

    //  Assert
    expect(parsedDateTime.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    // Arrange
    const date = '';
    const time = '14:30';

    // Act
    const parsedDateTime = parseDateTime(date, time);

    //  Assert
    expect(parsedDateTime.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    // Arrange
    const event = createRandomEvent({
      date: '2024-07-19',
      startTime: '13:00',
      endTime: '14:00',
    });

    // Act
    const parsedDateTime = convertEventToDateRange(event);

    //  Assert
    expect(parsedDateTime).toEqual({
      start: new Date('2024-07-19T13:00'),
      end: new Date('2024-07-19T14:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    // Arrange
    const event = createRandomEvent({
      date: '2024-07-19-12',
      startTime: '13:00',
      endTime: '14:00',
    });

    // Act
    const parsedDateTime = convertEventToDateRange(event);

    //  Assert
    expect(parsedDateTime.start.toString()).toBe('Invalid Date');
    expect(parsedDateTime.end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    // Arrange
    const event = createRandomEvent({
      date: '2024-07-19',
      startTime: '13:4444',
      endTime: '14:4444',
    });

    // Act
    const parsedDateTime = convertEventToDateRange(event);

    //  Assert
    expect(parsedDateTime.start.toString()).toBe('Invalid Date');
    expect(parsedDateTime.end.toString()).toBe('Invalid Date');
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-19',
      startTime: '13:00',
      endTime: '14:00',
    });
    const event2 = createRandomEvent({
      date: '2024-07-19',
      startTime: '13:00',
      endTime: '14:00',
    });

    // Act
    const result = isOverlapping(event1, event2);

    //  Assert
    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-19',
      startTime: '13:00',
      endTime: '14:00',
    });
    const event2 = createRandomEvent({
      date: '2024-07-19',
      startTime: '14:00',
      endTime: '15:00',
    });

    // Act
    const result = isOverlapping(event1, event2);

    //  Assert
    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-19',
      startTime: '13:00',
      endTime: '14:00',
    });
    const event2 = createRandomEvent({
      date: '2024-07-19',
      startTime: '14:00',
      endTime: '15:00',
    });
    const event3 = createRandomEvent({
      date: '2024-07-19',
      startTime: '15:00',
      endTime: '16:00',
    });

    const newEvent = createRandomEvent({
      date: '2024-07-19',
      startTime: '14:00',
      endTime: '16:00',
    });

    // Act
    const overlappingEvents = findOverlappingEvents(newEvent, [event1, event2, event3]);

    //  Assert
    expect(overlappingEvents).toMatchObject([event2, event3]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-19',
      startTime: '13:00',
      endTime: '14:00',
    });
    const event2 = createRandomEvent({
      date: '2024-07-19',
      startTime: '14:00',
      endTime: '15:00',
    });
    const event3 = createRandomEvent({
      date: '2024-07-19',
      startTime: '15:00',
      endTime: '16:00',
    });

    const newEvent = createRandomEvent({
      date: '2024-07-19',
      startTime: '16:00',
      endTime: '17:00',
    });

    // Act
    const overlappingEvents = findOverlappingEvents(newEvent, [event1, event2, event3]);

    //  Assert
    expect(overlappingEvents).toMatchObject([]);
  });
});
