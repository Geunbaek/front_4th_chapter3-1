import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    // Arrange
    const date = new Date('2024-01');

    // Act
    const holidays = fetchHolidays(date);

    // Assert
    expect(holidays).toEqual({ '2024-01-01': '신정' });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    // Arrange
    const date = new Date('2024-04');

    // Act
    const holidays = fetchHolidays(date);

    // Assert
    expect(holidays).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    // Arrange
    const date = new Date('2024-02');

    // Act
    const holidays = fetchHolidays(date);

    // Assert
    expect(holidays).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });
  });
});
