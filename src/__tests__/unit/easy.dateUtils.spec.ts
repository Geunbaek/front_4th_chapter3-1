import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';
import { createRandomEvent } from '../utils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    // Arrange
    const year = 2024;
    const month = 1;

    // Act
    const days = getDaysInMonth(year, month);

    // Assert
    expect(days).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    // Arrange
    const year = 2024;
    const month = 4;

    // Act
    const days = getDaysInMonth(year, month);

    // Assert
    expect(days).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    // Arrange
    const year = 2024;
    const month = 2;

    // Act
    const days = getDaysInMonth(year, month);

    // Assert
    expect(days).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    // Arrange
    const year = 2025;
    const month = 2;

    // Act
    const days = getDaysInMonth(year, month);

    // Assert
    expect(days).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    // Arrange
    const year = 2025;
    const month = 13;

    // Act & Assert
    expect(() => getDaysInMonth(year, month)).toThrow(
      '유효하지 않은 달입니다. 달은 1과 12 사이의 값이어야 합니다.'
    );
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    // Arrange
    const wednesday = new Date('2025-02-05');

    // Act
    const weekDates = getWeekDates(wednesday);

    // Assert
    expect(weekDates).toMatchObject([
      new Date('2025-02-02'),
      new Date('2025-02-03'),
      new Date('2025-02-04'),
      new Date('2025-02-05'),
      new Date('2025-02-06'),
      new Date('2025-02-07'),
      new Date('2025-02-08'),
    ]);
  });

  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    // Arrange
    const monday = new Date('2025-02-02');

    // Act
    const weekDates = getWeekDates(monday);

    // Assert
    expect(weekDates).toMatchObject([
      new Date('2025-02-02'),
      new Date('2025-02-03'),
      new Date('2025-02-04'),
      new Date('2025-02-05'),
      new Date('2025-02-06'),
      new Date('2025-02-07'),
      new Date('2025-02-08'),
    ]);
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    // Arrange
    const sunday = new Date('2025-02-01');

    // Act
    const weekDates = getWeekDates(sunday);

    // Assert
    expect(weekDates).toMatchObject([
      new Date('2025-01-26'),
      new Date('2025-01-27'),
      new Date('2025-01-28'),
      new Date('2025-01-29'),
      new Date('2025-01-30'),
      new Date('2025-01-31'),
      new Date('2025-02-01'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    // Arrange
    const leapYear = new Date('2024-12-31');

    // Act
    const weekDates = getWeekDates(leapYear);

    // Assert
    expect(weekDates).toMatchObject([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    // Arrange
    const leapYear = new Date('2025-01-01');

    // Act
    const weekDates = getWeekDates(leapYear);

    // Assert
    expect(weekDates).toMatchObject([
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ]);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    // Arrange
    const leapYear = new Date('2024-02-29');

    // Act
    const weekDates = getWeekDates(leapYear);

    // Assert
    expect(weekDates).toMatchObject([
      new Date('2024-02-25'),
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'),
      new Date('2024-03-01'),
      new Date('2024-03-02'),
    ]);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    // Arrange
    const lastDate = new Date('2025-01-31');

    // Act
    const weekDates = getWeekDates(lastDate);

    // Assert
    expect(weekDates).toMatchObject([
      new Date('2025-01-26'),
      new Date('2025-01-27'),
      new Date('2025-01-28'),
      new Date('2025-01-29'),
      new Date('2025-01-30'),
      new Date('2025-01-31'),
      new Date('2025-02-01'),
    ]);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    // Arrange
    const date = new Date('2024-07-01');

    // Act
    const weeks = getWeeksAtMonth(date);

    // Assert
    expect(weeks).toMatchObject([
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ]);
  });
});

describe('getEventsForDay', () => {
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    // Arrange
    const testEvent1 = createRandomEvent({
      date: formatDate(new Date('2024-02-01')),
    });
    const testEvent2 = createRandomEvent({
      date: formatDate(new Date('2024-02-02')),
    });
    const testEvent3 = createRandomEvent({
      date: formatDate(new Date('2024-03-02')),
    });
    const testEvent4 = createRandomEvent({
      date: formatDate(new Date('2024-04-01')),
    });
    const testEvents = [testEvent1, testEvent2, testEvent3, testEvent4];

    // Act
    const targetEvents = getEventsForDay(testEvents, 1);

    // Assert
    expect(targetEvents).toMatchObject([testEvent1, testEvent4]);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    // Arrange
    const testEvent1 = createRandomEvent({
      date: formatDate(new Date('2024-02-01')),
    });
    const testEvent2 = createRandomEvent({
      date: formatDate(new Date('2024-02-02')),
    });
    const testEvent3 = createRandomEvent({
      date: formatDate(new Date('2024-03-02')),
    });
    const testEvent4 = createRandomEvent({
      date: formatDate(new Date('2024-04-01')),
    });
    const testEvents = [testEvent1, testEvent2, testEvent3, testEvent4];

    // Act
    const targetEvents = getEventsForDay(testEvents, 3);

    // Assert
    expect(targetEvents).toMatchObject([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    // Arrange
    const testEvent1 = createRandomEvent({
      date: formatDate(new Date('2024-02-01')),
    });
    const testEvent2 = createRandomEvent({
      date: formatDate(new Date('2024-02-02')),
    });
    const testEvent3 = createRandomEvent({
      date: formatDate(new Date('2024-03-02')),
    });
    const testEvent4 = createRandomEvent({
      date: formatDate(new Date('2024-04-01')),
    });
    const testEvents = [testEvent1, testEvent2, testEvent3, testEvent4];

    // Act
    const targetEvents = getEventsForDay(testEvents, 0);

    // Assert
    expect(targetEvents).toMatchObject([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    // Arrange
    const testEvent1 = createRandomEvent({
      date: formatDate(new Date('2024-02-01')),
    });
    const testEvent2 = createRandomEvent({
      date: formatDate(new Date('2024-02-02')),
    });
    const testEvent3 = createRandomEvent({
      date: formatDate(new Date('2024-03-02')),
    });
    const testEvent4 = createRandomEvent({
      date: formatDate(new Date('2024-04-01')),
    });
    const testEvents = [testEvent1, testEvent2, testEvent3, testEvent4];

    // Act
    const targetEvents = getEventsForDay(testEvents, 32);

    // Assert
    expect(targetEvents).toMatchObject([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    // Arrange
    const date = new Date('2025-01-15');

    // Act
    const formatedWeek = formatWeek(date);

    // Assert
    expect(formatedWeek).toBe('2025년 1월 3주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    // Arrange
    const date = new Date('2025-01-03');

    // Act
    const formatedWeek = formatWeek(date);

    // Assert
    expect(formatedWeek).toBe('2025년 1월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    // Arrange
    const date = new Date('2025-01-30');

    // Act
    const formatedWeek = formatWeek(date);

    // Assert
    expect(formatedWeek).toBe('2025년 1월 5주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    // Arrange
    const date = new Date('2024-12-31');
    console.log(date);
    // Act
    const formatedWeek = formatWeek(date);

    // Assert
    expect(formatedWeek).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    // Arrange
    const date = new Date('2024-02-29');

    // Act
    const formatedWeek = formatWeek(date);

    // Assert
    expect(formatedWeek).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    // Arrange
    const date = new Date('2024-02-29');

    // Act
    const formatedWeek = formatWeek(date);

    // Assert
    expect(formatedWeek).toBe('2024년 2월 5주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    // Arrange
    const date = new Date('2024-07-10');

    // Act
    const formatedWeek = formatMonth(date);

    // Assert
    expect(formatedWeek).toBe('2024년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    // Arrange
    const date = new Date('2024-07-10');

    // Act
    const result = isDateInRange(date, rangeStart, rangeEnd);

    // Assert
    expect(result).toBe(true);
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    // Arrange
    const date = new Date('2024-07-01');

    // Act
    const result = isDateInRange(date, rangeStart, rangeEnd);

    // Assert
    expect(result).toBe(true);
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    // Arrange
    const date = new Date('2024-07-31');

    // Act
    const result = isDateInRange(date, rangeStart, rangeEnd);

    // Assert
    expect(result).toBe(true);
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    // Arrange
    const date = new Date('2024-06-30');

    // Act
    const result = isDateInRange(date, rangeStart, rangeEnd);

    // Assert
    expect(result).toBe(false);
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    // Arrange
    const date = new Date('2024-08-01');

    // Act
    const result = isDateInRange(date, rangeStart, rangeEnd);

    // Assert
    expect(result).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    // Arrange
    const rangeStart = new Date('2024-07-01');
    const rangeEnd = new Date('2024-06-30');
    const date = new Date('2024-08-01');

    // Act
    const result = isDateInRange(date, rangeStart, rangeEnd);

    // Assert
    expect(result).toBe(false);
  });
});

describe('fillZero', () => {
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    // Arrange
    const number = 5;

    // Act
    const result = fillZero(number, 2);

    // Assert
    expect(result).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    // Arrange
    const number = 10;

    // Act
    const result = fillZero(number, 2);

    // Assert
    expect(result).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    // Arrange
    const number = 3;

    // Act
    const result = fillZero(number, 3);

    // Assert
    expect(result).toBe('003');
  });

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {
    // Arrange
    const number = 100;

    // Act
    const result = fillZero(number, 2);

    // Assert
    expect(result).toBe('100');
  });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    // Arrange
    const number = 0;

    // Act
    const result = fillZero(number, 2);

    // Assert
    expect(result).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    // Arrange
    const number = 1;

    // Act
    const result = fillZero(number, 5);

    // Assert
    expect(result).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    // Arrange
    const number = 3.14;

    // Act
    const result = fillZero(number, 5);

    // Assert
    expect(result).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    // Arrange
    const number = 5;

    // Act
    const result = fillZero(number);

    // Assert
    expect(result).toBe('05');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    // Arrange
    const number = 50000;

    // Act
    const result = fillZero(number, 2);

    // Assert
    expect(result).toBe('50000');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    // Arrange
    const date = new Date('2024-11-11');

    // Act
    const formatedDate = formatDate(date);

    // Assert
    expect(formatedDate).toBe('2024-11-11');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    // Arrange
    const date = new Date('2024-01-01');

    // Act
    const formatedDate = formatDate(date, 1);

    // Assert
    expect(formatedDate).toBe('2024-01-01');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    // Arrange
    const date = new Date('2024-02-11');

    // Act
    const formatedDate = formatDate(date, 13);

    // Assert
    expect(formatedDate).toBe('2024-02-13');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    // Arrange
    const date = new Date('2024-02-02');

    // Act
    const formatedDate = formatDate(date);

    // Assert
    expect(formatedDate).toBe('2024-02-02');
  });
});
