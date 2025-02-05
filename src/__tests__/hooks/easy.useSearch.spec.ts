import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { createRandomEvent } from '../utils.ts';

describe('useSearch', () => {
  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-01',
    });
    const event2 = createRandomEvent({
      date: '2024-07-11',
    });
    const event3 = createRandomEvent({
      date: '2024-07-12',
    });

    // Act
    const { result } = renderHook(() =>
      useSearch([event1, event2, event3], new Date('2024-07-11'), 'month')
    );

    // Assert
    expect(result.current.filteredEvents).toEqual([event1, event2, event3]);
  });

  it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-01',
      title: '이벤트 1',
    });
    const event2 = createRandomEvent({
      date: '2024-07-11',
      description: '이벤트 1',
    });
    const event3 = createRandomEvent({
      date: '2024-07-12',
    });

    // Act
    const { result } = renderHook(() =>
      useSearch([event1, event2, event3], new Date('2024-07-11'), 'month')
    );

    act(() => {
      result.current.setSearchTerm('이벤트 1');
    });

    // Assert
    expect(result.current.filteredEvents).toEqual([event1, event2]);
  });

  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-01',
      title: '이벤트 1',
    });
    const event2 = createRandomEvent({
      date: '2024-07-11',
      description: '이벤트 1',
    });
    const event3 = createRandomEvent({
      date: '2024-07-12',
      location: '이벤트 1',
    });

    // Act
    const { result } = renderHook(() =>
      useSearch([event1, event2, event3], new Date('2024-07-11'), 'month')
    );

    act(() => {
      result.current.setSearchTerm('이벤트 1');
    });

    // Assert
    expect(result.current.filteredEvents).toEqual([event1, event2, event3]);
  });

  it('월간 뷰에 해당하는 이벤트만 반환해야 한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-01',
    });
    const event2 = createRandomEvent({
      date: '2024-07-11',
    });
    const event3 = createRandomEvent({
      date: '2024-07-12',
    });

    // Act
    const { result } = renderHook(() =>
      useSearch([event1, event2, event3], new Date('2024-07-11'), 'month')
    );

    // Assert
    expect(result.current.filteredEvents).toEqual([event1, event2, event3]);
  });

  it('주간 뷰에 해당하는 이벤트만 반환해야 한다', () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-01',
    });
    const event2 = createRandomEvent({
      date: '2024-07-11',
    });
    const event3 = createRandomEvent({
      date: '2024-07-12',
    });

    // Act
    const { result } = renderHook(() =>
      useSearch([event1, event2, event3], new Date('2024-07-11'), 'week')
    );

    // Assert
    expect(result.current.filteredEvents).toEqual([event2, event3]);
  });

  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    // Arrange
    const event1 = createRandomEvent({
      date: '2024-07-01',
      title: '회의',
    });
    const event2 = createRandomEvent({
      date: '2024-07-11',
      title: '점심',
    });

    // Act
    const { result } = renderHook(() =>
      useSearch([event1, event2], new Date('2024-07-11'), 'month')
    );

    act(() => {
      result.current.setSearchTerm('회의');
      result.current.setSearchTerm('점심');
    });

    // Assert
    expect(result.current.filteredEvents).toEqual([event2]);
  });
});
